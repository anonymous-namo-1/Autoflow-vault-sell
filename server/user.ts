import { Router, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import "./types";

const router = Router();

// Middleware to check authentication
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Get user profile
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = await storage.getUser(req.session!.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to get profile" });
  }
});

// Update user profile
router.patch("/profile", requireAuth, async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const updates: Record<string, any> = {};
    if (name) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await storage.updateUser(req.session!.userId, updates);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// Get cart items
router.get("/cart", requireAuth, async (req, res) => {
  try {
    const items = await storage.getCartItems(req.session!.userId);
    res.json(items);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Failed to get cart" });
  }
});

// Add to cart
router.post("/cart", requireAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await storage.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const item = await storage.addToCart({
      userId: req.session!.userId,
      productId,
      quantity,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

// Update cart item quantity
router.patch("/cart/:itemId", requireAuth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      await storage.removeFromCart(itemId);
      return res.json({ message: "Item removed from cart" });
    }

    const item = await storage.updateCartItemQuantity(itemId, quantity);
    res.json(item);
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

// Remove from cart
router.delete("/cart/:itemId", requireAuth, async (req, res) => {
  try {
    await storage.removeFromCart(req.params.itemId);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Failed to remove from cart" });
  }
});

// Clear cart
router.delete("/cart", requireAuth, async (req, res) => {
  try {
    await storage.clearCart(req.session!.userId);
    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

// Get wishlist items
router.get("/wishlist", requireAuth, async (req, res) => {
  try {
    const items = await storage.getWishlistItems(req.session!.userId);
    res.json(items);
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Failed to get wishlist" });
  }
});

// Add to wishlist
router.post("/wishlist", requireAuth, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await storage.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const item = await storage.addToWishlist({
      userId: req.session!.userId,
      productId,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
});

// Remove from wishlist
router.delete("/wishlist/:productId", requireAuth, async (req, res) => {
  try {
    await storage.removeFromWishlist(req.session!.userId, req.params.productId);
    res.json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
});

// Check if product is in wishlist
router.get("/wishlist/:productId", requireAuth, async (req, res) => {
  try {
    const isInWishlist = await storage.isInWishlist(req.session!.userId, req.params.productId);
    res.json({ isInWishlist });
  } catch (error) {
    console.error("Check wishlist error:", error);
    res.status(500).json({ message: "Failed to check wishlist" });
  }
});

// Get user downloads
router.get("/downloads", requireAuth, async (req, res) => {
  try {
    const downloads = await storage.getUserDownloads(req.session!.userId);
    res.json(downloads);
  } catch (error) {
    console.error("Get downloads error:", error);
    res.status(500).json({ message: "Failed to get downloads" });
  }
});

// Get user orders
router.get("/orders", requireAuth, async (req, res) => {
  try {
    const orders = await storage.getUserOrders(req.session!.userId);

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

// Download file
router.get("/download/:token", async (req, res) => {
  try {
    const download = await storage.getDownloadByToken(req.params.token);

    if (!download) {
      return res.status(404).json({ message: "Download not found" });
    }

    if (new Date(download.expiresAt) < new Date()) {
      return res.status(410).json({ message: "Download link has expired" });
    }

    if (download.downloadCount && download.maxDownloads && download.downloadCount >= download.maxDownloads) {
      return res.status(410).json({ message: "Download limit reached" });
    }

    await storage.incrementDownloadCount(download.id);

    const product = await storage.getProductById(download.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // In a real app, you would return the file from object storage
    // For now, return a sample JSON file
    const sampleTemplate = {
      name: product.name,
      version: "1.0.0",
      description: product.description,
      automation: {
        triggers: [],
        actions: [],
        conditions: [],
      },
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${product.slug}.json"`);
    res.json(sampleTemplate);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Failed to download file" });
  }
});

// Subscribe to newsletter
router.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await storage.subscribeToNewsletter(email);
    res.json({ message: "Successfully subscribed to newsletter" });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ message: "Failed to subscribe" });
  }
});

export default router;
