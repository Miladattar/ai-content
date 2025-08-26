import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function initializeDatabase() {
  try {
    console.log("🔄 Initializing database...")

    // Check if database is already initialized by looking for users
    const userCount = await prisma.user.count()

    if (userCount > 0) {
      console.log("✅ Database already initialized")
      return
    }

    console.log("📝 Creating admin user...")

    // Create admin user
    const adminPassword = await hashPassword("admin123")
    const adminUser = await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: adminPassword,
        role: "ADMIN",
      },
    })

    console.log("📋 Creating templates...")

    // Create templates
    const templates = [
      {
        slug: "idea120",
        name: "ایده ۱۲۰ ثانیه",
        description: "قالب برای تولید ایده‌های کوتاه و جذاب",
        prompt: "یک ایده جذاب و کاربردی در حوزه {{domain}} برای {{goal}} ارائه دهید.",
        contractSchema: JSON.stringify({
          type: "object",
          properties: {
            title: { type: "string" },
            hook: { type: "string" },
            content: { type: "string" },
            cta: { type: "string" },
          },
        }),
        pageTypes: ["آموزشی", "خدماتی", "محصول‌محور"],
      },
      {
        slug: "story",
        name: "داستان‌سرایی",
        description: "قالب برای تولید محتوای داستانی",
        prompt: "یک داستان جذاب در حوزه {{domain}} که {{goal}} را برآورده کند بنویسید.",
        contractSchema: JSON.stringify({
          type: "object",
          properties: {
            title: { type: "string" },
            story: { type: "string" },
            lesson: { type: "string" },
            cta: { type: "string" },
          },
        }),
        pageTypes: ["آموزشی", "خدماتی"],
      },
      {
        slug: "warning",
        name: "هشدار و آگاهی",
        description: "قالب برای محتوای هشداردهنده",
        prompt: "محتوای هشداردهنده‌ای در حوزه {{domain}} برای {{goal}} تولید کنید.",
        contractSchema: JSON.stringify({
          type: "object",
          properties: {
            warning: { type: "string" },
            consequences: { type: "string" },
            solution: { type: "string" },
            cta: { type: "string" },
          },
        }),
        pageTypes: ["آموزشی", "خدماتی", "محصول‌محور"],
      },
      {
        slug: "suspense",
        name: "تعلیق و کنجکاوی",
        description: "قالب برای ایجاد تعلیق و کنجکاوی",
        prompt: "محتوایی با تعلیق در حوزه {{domain}} که {{goal}} را دنبال کند بسازید.",
        contractSchema: JSON.stringify({
          type: "object",
          properties: {
            teaser: { type: "string" },
            buildup: { type: "string" },
            reveal: { type: "string" },
            cta: { type: "string" },
          },
        }),
        pageTypes: ["آموزشی", "محصول‌محور"],
      },
    ]

    for (const template of templates) {
      await prisma.template.create({ data: template })
    }

    console.log("🎣 Creating hooks...")

    // Create hooks
    const hooks = [
      { text: "آیا می‌دانستید که...", category: "سوال" },
      { text: "این اشتباه رایج که همه می‌کنند", category: "هشدار" },
      { text: "راز موفقیت در...", category: "راز" },
      { text: "چرا اکثر مردم در... شکست می‌خورند", category: "تحلیل" },
      { text: "تنها راه حل برای...", category: "راه‌حل" },
    ]

    for (const hook of hooks) {
      await prisma.hook.create({ data: hook })
    }

    console.log("🔥 Creating viral signals...")

    // Create viral signals
    const viralSignals = [
      { text: "فقط ۵ دقیقه وقت دارید؟", type: "زمان" },
      { text: "بدون هیچ هزینه‌ای", type: "رایگان" },
      { text: "تضمین ۱۰۰٪", type: "تضمین" },
      { text: "فقط امروز", type: "فوریت" },
      { text: "راز متخصصان", type: "انحصاری" },
    ]

    for (const signal of viralSignals) {
      await prisma.viralSignal.create({ data: signal })
    }

    console.log("✅ Database initialized successfully!")
    console.log(`👤 Admin user created: admin@example.com / admin123`)
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run initialization
initializeDatabase()
  .then(() => {
    console.log("🎉 Database setup complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Setup failed:", error)
    process.exit(1)
  })
