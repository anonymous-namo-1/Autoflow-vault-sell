import { eq, and, ilike, gte, lte, desc, asc, sql, or } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  otpTokens,
  categories,
  products,
  cartItems,
  wishlistItems,
  coupons,
  orders,
  orderItems,
  downloads,
  type User,
  type InsertUser,
  type OtpToken,
  type InsertOtpToken,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type WishlistItem,
  type InsertWishlistItem,
  type Coupon,
  type InsertCoupon,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Download,
  type InsertDownload,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // OTP Tokens
  createOtpToken(token: InsertOtpToken): Promise<OtpToken>;
  getValidOtpToken(email: string, code: string, type: string): Promise<OtpToken | undefined>;
  markOtpTokenUsed(id: string): Promise<void>;
  deleteExpiredOtpTokens(): Promise<void>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: ProductFilters): Promise<{ products: Product[]; total: number }>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductById(id: string): Promise<Product | undefined>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  incrementDownloadCount(id: string): Promise<void>;

  // Cart
  getCartItems(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Wishlist
  getWishlistItems(userId: string): Promise<(WishlistItem & { product: Product })[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: string, productId: string): Promise<void>;
  isInWishlist(userId: string, productId: string): Promise<boolean>;

  // Coupons
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  validateCoupon(code: string, orderTotal: number): Promise<{ valid: boolean; discount: number; message?: string }>;
  incrementCouponUsage(id: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined>;
  getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;

  // Order Items
  createOrderItems(items: InsertOrderItem[]): Promise<OrderItem[]>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;

  // Downloads
  createDownload(download: InsertDownload): Promise<Download>;
  getDownloadByToken(token: string): Promise<Download | undefined>;
  getUserDownloads(userId: string): Promise<(Download & { product: Product })[]>;
  incrementDownloadCount(downloadId: string): Promise<void>;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular" | "rating";
  page?: number;
  limit?: number;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values({
      ...user,
      email: user.email.toLowerCase(),
    }).returning();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updated;
  }

  // OTP Tokens
  async createOtpToken(token: InsertOtpToken): Promise<OtpToken> {
    const [newToken] = await db.insert(otpTokens).values(token).returning();
    return newToken;
  }

  async getValidOtpToken(email: string, code: string, type: string): Promise<OtpToken | undefined> {
    const [token] = await db
      .select()
      .from(otpTokens)
      .where(
        and(
          eq(otpTokens.email, email.toLowerCase()),
          eq(otpTokens.code, code),
          eq(otpTokens.type, type),
          eq(otpTokens.used, false),
          gte(otpTokens.expiresAt, new Date())
        )
      )
      .limit(1);
    return token;
  }

  async markOtpTokenUsed(id: string): Promise<void> {
    await db.update(otpTokens).set({ used: true }).where(eq(otpTokens.id, id));
  }

  async deleteExpiredOtpTokens(): Promise<void> {
    await db.delete(otpTokens).where(lte(otpTokens.expiresAt, new Date()));
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Products
  async getProducts(filters?: ProductFilters): Promise<{ products: Product[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const offset = (page - 1) * limit;

    let conditions: any[] = [eq(products.isActive, true)];

    if (filters?.search) {
      conditions.push(
        or(
          ilike(products.name, `%${filters.search}%`),
          ilike(products.description, `%${filters.search}%`)
        )
      );
    }

    if (filters?.category) {
      const category = await this.getCategoryBySlug(filters.category);
      if (category) {
        conditions.push(eq(products.categoryId, category.id));
      }
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice.toString()));
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice.toString()));
    }

    const whereCondition = conditions.length > 1 ? and(...conditions) : conditions[0];

    let orderByClause;
    switch (filters?.sortBy) {
      case "price_asc":
        orderByClause = asc(products.price);
        break;
      case "price_desc":
        orderByClause = desc(products.price);
        break;
      case "popular":
        orderByClause = desc(products.downloadCount);
        break;
      case "rating":
        orderByClause = desc(products.rating);
        break;
      case "newest":
      default:
        orderByClause = desc(products.createdAt);
    }

    const [productList, countResult] = await Promise.all([
      db
        .select()
        .from(products)
        .where(whereCondition)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(whereCondition),
    ]);

    return {
      products: productList,
      total: Number(countResult[0]?.count || 0),
    };
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.isActive, true)))
      .limit(1);
    return product;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return product;
  }

  async getFeaturedProducts(limit = 6): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(and(eq(products.isFeatured, true), eq(products.isActive, true)))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async incrementProductDownloadCount(id: string): Promise<void> {
    await db
      .update(products)
      .set({ downloadCount: sql`${products.downloadCount} + 1` })
      .where(eq(products.id, id));
  }

  // Cart
  async getCartItems(userId: string): Promise<(CartItem & { product: Product })[]> {
    const items = await db
      .select()
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    return items.map((item) => ({
      ...item.cart_items,
      product: item.products,
    }));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, item.userId), eq(cartItems.productId, item.productId)))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: (existing.quantity || 1) + (item.quantity || 1) })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    const [newItem] = await db.insert(cartItems).values(item).returning();
    return newItem;
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated;
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Wishlist
  async getWishlistItems(userId: string): Promise<(WishlistItem & { product: Product })[]> {
    const items = await db
      .select()
      .from(wishlistItems)
      .innerJoin(products, eq(wishlistItems.productId, products.id))
      .where(eq(wishlistItems.userId, userId));

    return items.map((item) => ({
      ...item.wishlist_items,
      product: item.products,
    }));
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const existing = await this.isInWishlist(item.userId, item.productId);
    if (existing) {
      const [wishlistItem] = await db
        .select()
        .from(wishlistItems)
        .where(and(eq(wishlistItems.userId, item.userId), eq(wishlistItems.productId, item.productId)))
        .limit(1);
      return wishlistItem;
    }

    const [newItem] = await db.insert(wishlistItems).values(item).returning();
    return newItem;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await db
      .delete(wishlistItems)
      .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const [item] = await db
      .select()
      .from(wishlistItems)
      .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)))
      .limit(1);
    return !!item;
  }

  // Coupons
  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code.toUpperCase()))
      .limit(1);
    return coupon;
  }

  async validateCoupon(
    code: string,
    orderTotal: number
  ): Promise<{ valid: boolean; discount: number; message?: string }> {
    const coupon = await this.getCouponByCode(code);

    if (!coupon) {
      return { valid: false, discount: 0, message: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: "This coupon is no longer active" };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, discount: 0, message: "This coupon has expired" };
    }

    if (coupon.maxUses && coupon.usedCount && coupon.usedCount >= coupon.maxUses) {
      return { valid: false, discount: 0, message: "This coupon has reached its usage limit" };
    }

    if (coupon.minOrderAmount && orderTotal < parseFloat(coupon.minOrderAmount)) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount is $${coupon.minOrderAmount}`,
      };
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (orderTotal * parseFloat(coupon.discountValue)) / 100;
    } else {
      discount = parseFloat(coupon.discountValue);
    }

    return { valid: true, discount: Math.min(discount, orderTotal) };
  }

  async incrementCouponUsage(id: string): Promise<void> {
    await db
      .update(coupons)
      .set({ usedCount: sql`${coupons.usedCount} + 1` })
      .where(eq(coupons.id, id));
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return order;
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);
    return order;
  }

  async getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.razorpayOrderId, razorpayOrderId))
      .limit(1);
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
    return updated;
  }

  // Order Items
  async createOrderItems(items: InsertOrderItem[]): Promise<OrderItem[]> {
    return db.insert(orderItems).values(items).returning();
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // Downloads
  async createDownload(download: InsertDownload): Promise<Download> {
    const [newDownload] = await db.insert(downloads).values(download).returning();
    return newDownload;
  }

  async getDownloadByToken(token: string): Promise<Download | undefined> {
    const [download] = await db.select().from(downloads).where(eq(downloads.token, token)).limit(1);
    return download;
  }

  async getUserDownloads(userId: string): Promise<(Download & { product: Product })[]> {
    const items = await db
      .select()
      .from(downloads)
      .innerJoin(products, eq(downloads.productId, products.id))
      .where(eq(downloads.userId, userId))
      .orderBy(desc(downloads.createdAt));

    return items.map((item) => ({
      ...item.downloads,
      product: item.products,
    }));
  }

  async incrementDownloadCount(downloadId: string): Promise<void> {
    await db
      .update(downloads)
      .set({ downloadCount: sql`${downloads.downloadCount} + 1` })
      .where(eq(downloads.id, downloadId));
  }
}

export const storage = new DatabaseStorage();
