import { Router, Request, Response, NextFunction } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { storage } from "./storage";
import "./types";

const router = Router();

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

function generateDownloadToken(): string {
  return uuidv4() + "-" + crypto.randomBytes(16).toString("hex");
}

// Middleware to check authentication
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Create order
router.post("/create", requireAuth, async (req, res) => {
  try {
    const userId = req.session!.userId;
    const { items, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      productName: string;
      price: string;
      quantity: number;
    }> = [];

    for (const item of items) {
      const product = await storage.getProductById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }

      const quantity = item.quantity || 1;
      const price = parseFloat(product.price);
      subtotal += price * quantity;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
      });
    }

    let discount = 0;
    let couponId: string | undefined;

    if (couponCode) {
      const couponValidation = await storage.validateCoupon(couponCode, subtotal);
      if (couponValidation.valid) {
        discount = couponValidation.discount;
        const coupon = await storage.getCouponByCode(couponCode);
        couponId = coupon?.id;
      } else {
        return res.status(400).json({ message: couponValidation.message });
      }
    }

    const total = subtotal - discount;

    // Create Razorpay order
    let razorpayOrderId = "";
    const razorpay = getRazorpay();
    if (razorpay) {
      try {
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(total * 100),
          currency: "INR",
          receipt: generateOrderNumber(),
        });
        razorpayOrderId = razorpayOrder.id;
      } catch (razorpayError) {
        console.error("Razorpay error:", razorpayError);
      }
    }

    const order = await storage.createOrder({
      userId,
      orderNumber: generateOrderNumber(),
      status: "pending",
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
      couponId,
      razorpayOrderId,
    });

    await storage.createOrderItems(
      orderItems.map((item) => ({
        orderId: order.id,
        ...item,
      }))
    );

    if (couponId) {
      await storage.incrementCouponUsage(couponId);
    }

    res.status(201).json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      razorpayOrderId: order.razorpayOrderId,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// Verify payment
router.post("/verify-payment", requireAuth, async (req, res) => {
  try {
    const userId = req.session!.userId;
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const order = await storage.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.status === "paid") {
      return res.json({ success: true, orderId: order.id });
    }

    // Verify Razorpay signature if keys are configured
    if (process.env.RAZORPAY_KEY_SECRET && razorpaySignature) {
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        await storage.updateOrder(orderId, { status: "failed" });
        return res.status(400).json({ message: "Invalid payment signature" });
      }
    }

    // Update order status
    await storage.updateOrder(orderId, {
      status: "paid",
      razorpayPaymentId,
      razorpaySignature,
      paidAt: new Date(),
    });

    // Create download links for each item
    const orderItems = await storage.getOrderItems(orderId);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    for (const item of orderItems) {
      await storage.createDownload({
        userId,
        orderId,
        productId: item.productId,
        token: generateDownloadToken(),
        maxDownloads: 5,
        expiresAt,
      });
    }

    // Clear user's cart
    await storage.clearCart(userId);

    res.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
});

// Get order by ID
router.get("/:orderId", requireAuth, async (req, res) => {
  try {
    const userId = req.session!.userId;
    const { orderId } = req.params;

    const order = await storage.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const items = await storage.getOrderItems(orderId);

    res.json({ ...order, items });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Failed to get order" });
  }
});

// Get user orders
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session!.userId;
    const orders = await storage.getUserOrders(userId);

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await storage.getOrderItems(order.id);
        return { ...order, items };
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Failed to get orders" });
  }
});

// Validate coupon
router.post("/validate-coupon", async (req, res) => {
  try {
    const { code, total } = req.body;

    if (!code || total === undefined) {
      return res.status(400).json({ message: "Coupon code and total are required" });
    }

    const result = await storage.validateCoupon(code, parseFloat(total));
    res.json(result);
  } catch (error) {
    console.error("Validate coupon error:", error);
    res.status(500).json({ message: "Failed to validate coupon" });
  }
});

export default router;
