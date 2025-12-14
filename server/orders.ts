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

// Create order - allows guest checkout
router.post("/create", async (req, res) => {
  try {
    const userId = req.session?.userId;
    const { items, couponCode, guestEmail } = req.body;

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

// Get order by ID - allows guest access only for guest orders (no userId)
router.get("/:orderId", async (req, res) => {
  try {
    const userId = req.session?.userId;
    const { orderId } = req.params;

    const order = await storage.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security: Only allow access if user owns the order OR it's a guest order (no userId)
    const isOwner = userId && order.userId === userId;
    const isGuestOrder = !order.userId;
    
    if (!isOwner && !isGuestOrder) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const items = await storage.getOrderItems(orderId);
    
    // Only include download URLs for paid orders
    const isPaid = order.status === "paid";
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await storage.getProductById(item.productId);
        return {
          ...item,
          driveDownloadUrl: isPaid ? (product?.driveDownloadUrl || null) : null,
          youtubeVideoUrl: isPaid ? (product?.youtubeVideoUrl || null) : null,
        };
      })
    );

    res.json({ ...order, items: itemsWithProducts });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Failed to get order" });
  }
});

// Get user orders
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session!.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
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

// Razorpay Webhook
router.post("/webhook", async (req: any, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("Webhook error: RAZORPAY_WEBHOOK_SECRET not configured");
      return res.status(500).json({ message: "Webhook secret not configured" });
    }

    const signature = req.headers["x-razorpay-signature"] as string;
    
    if (!signature) {
      console.error("Webhook error: Missing x-razorpay-signature header");
      return res.status(400).json({ message: "Missing signature header" });
    }

    const rawBody = req.rawBody;
    
    if (!rawBody) {
      console.error("Webhook error: Raw body not available");
      return res.status(400).json({ message: "Raw body not available" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Webhook error: Invalid signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.body;
    console.log(`Webhook received: ${event.event}`);

    if (event.event === "payment.captured") {
      const payment = event.payload?.payment?.entity;
      
      if (!payment) {
        console.error("Webhook error: Payment entity not found in payload");
        return res.status(400).json({ message: "Invalid payload structure" });
      }

      const razorpayOrderId = payment.order_id;
      
      if (!razorpayOrderId) {
        console.error("Webhook error: order_id not found in payment");
        return res.status(400).json({ message: "Order ID not found in payment" });
      }

      const order = await storage.getOrderByRazorpayOrderId(razorpayOrderId);
      
      if (!order) {
        console.error(`Webhook error: Order not found for razorpayOrderId: ${razorpayOrderId}`);
        return res.status(404).json({ message: "Order not found" });
      }

      // Idempotency check: skip if already paid
      if (order.status === "paid") {
        console.log(`Webhook: Order ${order.id} already paid, skipping`);
        return res.status(200).json({ message: "Order already processed" });
      }

      // Update order status to paid
      await storage.updateOrder(order.id, {
        status: "paid",
        razorpayPaymentId: payment.id,
        paidAt: new Date(),
      });

      // Create download links for each item
      const orderItems = await storage.getOrderItems(order.id);
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      for (const item of orderItems) {
        if (order.userId) {
          await storage.createDownload({
            userId: order.userId,
            orderId: order.id,
            productId: item.productId,
            token: generateDownloadToken(),
            maxDownloads: 5,
            expiresAt,
          });
        }
      }

      // Clear user's cart if logged in
      if (order.userId) {
        await storage.clearCart(order.userId);
      }

      console.log(`Webhook: Order ${order.id} marked as paid via webhook`);
      return res.status(200).json({ message: "Payment processed successfully" });
    }

    // For other events, just acknowledge receipt
    console.log(`Webhook: Unhandled event type: ${event.event}`);
    return res.status(200).json({ message: "Event received" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
});

export default router;
