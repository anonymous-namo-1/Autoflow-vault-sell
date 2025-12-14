import { db } from "./db";
import { categories, products, coupons } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedProducts() {
  try {
    // Check if products already exist
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length > 0) {
      console.log("Products already seeded");
      return;
    }

    console.log("Seeding initial data...");

    // Seed categories
    const categoryData = [
      { name: "Email", slug: "email", description: "Email automation templates", icon: "Mail" },
      { name: "CRM", slug: "crm", description: "CRM integration workflows", icon: "Users" },
      { name: "Social", slug: "social", description: "Social media automation", icon: "Share2" },
      { name: "Finance", slug: "finance", description: "Financial automation tools", icon: "DollarSign" },
      { name: "Marketing", slug: "marketing", description: "Marketing automation", icon: "TrendingUp" },
      { name: "Support", slug: "support", description: "Customer support automation", icon: "Headphones" },
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    const categoryMap = new Map(insertedCategories.map((c) => [c.slug, c.id]));

    // Seed products with INR prices
    const productData = [
      {
        name: "100+ Social media content workflows",
        slug: "social-media-content-workflows",
        description: "Access 100+ pre-built social media content workflows to automate posting across multiple platforms. Save time and maintain consistent presence.",
        shortDescription: "100+ pre-built workflows for social media automation.",
        price: "199",
        originalPrice: "299",
        categoryId: categoryMap.get("social"),
        images: ["/assets/workflow-diagram.png"],
        features: ["Multi-platform support", "Visual calendar", "Content recycling", "Best time optimization", "Analytics dashboard", "Team collaboration"],
        tags: ["social", "scheduling", "marketing"],
        rating: "4.9",
        reviewCount: 256,
        downloadCount: 2341,
        driveDownloadUrl: "https://drive.google.com/file/d/placeholder-social-scheduler/view",
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Customer Support Bot",
        slug: "customer-support-bot",
        description: "AI-powered customer support automation. Handle common queries and route complex issues to the right team.",
        shortDescription: "Automate customer support with AI-powered responses.",
        price: "449",
        categoryId: categoryMap.get("support"),
        images: [],
        features: ["AI response templates", "Ticket routing", "Knowledge base integration", "Multi-channel support", "Analytics & reporting", "Custom training"],
        tags: ["support", "ai", "automation"],
        rating: "4.4",
        reviewCount: 92,
        downloadCount: 654,
        driveDownloadUrl: "https://drive.google.com/file/d/placeholder-support-bot/view",
        isFeatured: true,
        isActive: true,
      },
    ];

    await db.insert(products).values(productData);

    // Seed coupons
    const couponData = [
      {
        code: "WELCOME10",
        discountType: "percentage",
        discountValue: "10",
        isActive: true,
      },
      {
        code: "SAVE20",
        discountType: "percentage",
        discountValue: "20",
        minOrderAmount: "50",
        maxUses: 100,
        isActive: true,
      },
      {
        code: "FLAT5",
        discountType: "fixed",
        discountValue: "5",
        isActive: true,
      },
    ];

    await db.insert(coupons).values(couponData);

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}
