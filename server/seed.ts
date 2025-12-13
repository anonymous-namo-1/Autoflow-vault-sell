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

    // Seed products
    const productData = [
      {
        name: "Email Automation Template",
        slug: "email-automation-template",
        description: "Transform your email marketing strategy with our powerful Email Automation Template. This comprehensive solution provides everything you need to create sophisticated, automated email campaigns.",
        shortDescription: "Streamline your email marketing with this comprehensive automation template.",
        price: "29.99",
        originalPrice: "49.99",
        categoryId: categoryMap.get("email"),
        images: [],
        features: ["Drag-and-drop workflow builder", "Pre-built trigger conditions", "Personalization tokens", "Multi-step sequences", "Conditional branching logic", "Performance analytics", "Mobile-responsive templates", "A/B testing support"],
        tags: ["automation", "email", "marketing"],
        rating: "4.8",
        reviewCount: 124,
        downloadCount: 1543,
        isFeatured: true,
        isActive: true,
      },
      {
        name: "CRM Integration Workflow",
        slug: "crm-integration-workflow",
        description: "Seamlessly connect your CRM with other business tools. Automate data sync, lead updates, and customer journey tracking.",
        shortDescription: "Connect your CRM with all your business tools seamlessly.",
        price: "49.99",
        categoryId: categoryMap.get("crm"),
        images: [],
        features: ["Multi-platform sync", "Real-time data updates", "Lead scoring automation", "Custom field mapping", "Activity tracking", "Webhook support"],
        tags: ["integration", "crm", "sales"],
        rating: "4.5",
        reviewCount: 89,
        downloadCount: 987,
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Social Media Scheduler",
        slug: "social-media-scheduler",
        description: "Schedule and automate your social media posts across multiple platforms. Save time and maintain consistent presence.",
        shortDescription: "Automate your social media posting across all platforms.",
        price: "19.99",
        originalPrice: "29.99",
        categoryId: categoryMap.get("social"),
        images: [],
        features: ["Multi-platform support", "Visual calendar", "Content recycling", "Best time optimization", "Analytics dashboard", "Team collaboration"],
        tags: ["social", "scheduling", "marketing"],
        rating: "4.9",
        reviewCount: 256,
        downloadCount: 2341,
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Invoice Generator Pro",
        slug: "invoice-generator-pro",
        description: "Professional invoice generation and management. Create, send, and track invoices automatically.",
        shortDescription: "Generate professional invoices automatically.",
        price: "39.99",
        categoryId: categoryMap.get("finance"),
        images: [],
        features: ["Custom templates", "Recurring invoices", "Payment tracking", "Multi-currency support", "Tax calculation", "Export to PDF/Excel"],
        tags: ["invoice", "finance", "automation"],
        rating: "4.7",
        reviewCount: 178,
        downloadCount: 1234,
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Lead Capture Automation",
        slug: "lead-capture-automation",
        description: "Capture and nurture leads automatically. From landing pages to email sequences, convert visitors into customers.",
        shortDescription: "Automate your lead capture and nurturing process.",
        price: "59.99",
        originalPrice: "79.99",
        categoryId: categoryMap.get("marketing"),
        images: [],
        features: ["Landing page templates", "Form builders", "Lead scoring", "Email sequences", "CRM integration", "A/B testing"],
        tags: ["leads", "marketing", "automation"],
        rating: "4.6",
        reviewCount: 145,
        downloadCount: 876,
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Customer Support Bot",
        slug: "customer-support-bot",
        description: "AI-powered customer support automation. Handle common queries and route complex issues to the right team.",
        shortDescription: "Automate customer support with AI-powered responses.",
        price: "44.99",
        categoryId: categoryMap.get("support"),
        images: [],
        features: ["AI response templates", "Ticket routing", "Knowledge base integration", "Multi-channel support", "Analytics & reporting", "Custom training"],
        tags: ["support", "ai", "automation"],
        rating: "4.4",
        reviewCount: 92,
        downloadCount: 654,
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Data Sync Pipeline",
        slug: "data-sync-pipeline",
        description: "Keep your data synchronized across all platforms. Real-time sync with error handling and logging.",
        shortDescription: "Sync data across all your business tools in real-time.",
        price: "34.99",
        categoryId: categoryMap.get("crm"),
        images: [],
        features: ["Real-time sync", "Error handling", "Data validation", "Audit logging", "Custom mappings", "API connectors"],
        tags: ["data", "sync", "integration"],
        rating: "4.3",
        reviewCount: 67,
        downloadCount: 543,
        isActive: true,
      },
      {
        name: "Webinar Automation Kit",
        slug: "webinar-automation-kit",
        description: "Automate your entire webinar workflow from registration to follow-up. Increase attendance and conversions.",
        shortDescription: "Complete webinar automation from registration to follow-up.",
        price: "54.99",
        categoryId: categoryMap.get("marketing"),
        images: [],
        features: ["Registration automation", "Reminder sequences", "Live chat integration", "Recording distribution", "Follow-up campaigns", "Analytics tracking"],
        tags: ["webinar", "marketing", "automation"],
        rating: "4.6",
        reviewCount: 83,
        downloadCount: 412,
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
