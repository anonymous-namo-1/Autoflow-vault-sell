import { Router } from "express";
import { storage } from "./storage";

const router = Router();

// Get all products with filters
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      tags,
      sortBy,
      page,
      limit,
    } = req.query;

    const filters = {
      search: search as string,
      category: category as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      tags: tags ? (tags as string).split(",") : undefined,
      sortBy: sortBy as "price_asc" | "price_desc" | "newest" | "popular" | "rating",
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 12,
    };

    const result = await storage.getProducts(filters);
    res.json(result);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Failed to get products" });
  }
});

// Get featured products
router.get("/featured", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
    const products = await storage.getFeaturedProducts(limit);
    res.json(products);
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({ message: "Failed to get featured products" });
  }
});

// Get product by ID
router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await storage.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ message: "Failed to get product" });
  }
});

// Get product by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await storage.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Failed to get product" });
  }
});

// Get all categories
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await storage.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Failed to get categories" });
  }
});

export default router;
