import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import "./types";
import authRoutes from "./auth";
import productRoutes from "./products";
import orderRoutes from "./orders";
import userRoutes from "./user";
import { seedProducts } from "./seed";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "automation-templates-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // 24 hours
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/user", userRoutes);

  // Seed initial data
  await seedProducts();

  return httpServer;
}
