import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10)

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  // Create templates
  const templates = [
    {
      slug: "idea120",
      title: "ایده کوتاه (120 تایی)",
      description: "تولید 120 ایده کوتاه برای محتوا",
      inputsSchema: {
        type: "object",
        properties: {
          topic: { type: "string", title: "موضوع" },
          style: { type: "string", title: "سبک", enum: ["سریع", "عمیق", "خلاقانه"] },
        },
        required: ["topic"],
      },
      systemPrompt: `شما یک متخصص تولید محتوای فارسی هستید. باید دقیقاً 120 ایده کوتاه و جذاب تولید کنید.
قوانین:
- هر ایده حداکثر 12 کلمه
- بدون ایموجی
- بدون نقل‌قول مصنوعی
- لحن خودمونی-حرفه‌ای
- خروجی JSON با فرمت مشخص شده`,
      userTemplate: `موضوع: {{topic}}
سبک: {{style}}
حوزه: {{brief.domain}}
هدف: {{brief.goal}}
پرسونا: {{brief.audience}}

120 ایده کوتاه و جذاب تولید کن.`,
      constraints: {
        maxWords: 12,
        exactCount: 120,
        noEmojis: true,
        noQuotes: true,
      },
    },
    {
      slug: "story",
      title: "داستان",
      description: "تولید داستان جذاب برای محتوا",
      inputsSchema: {
        type: "object",
        properties: {
          emotion: { type: "string", title: "احساس", enum: ["امید", "ترس", "هیجان", "آرامش"] },
          length: { type: "string", title: "طول", enum: ["کوتاه", "متوسط", "بلند"] },
        },
        required: ["emotion"],
      },
      systemPrompt: `شما یک نویسنده داستان فارسی هستید. باید داستان جذاب و قابل اعتماد بنویسید.
قوانین:
- داستان واقعی یا شبه واقعی
- بدون ایموجی
- لحن خودمونی
- ساختار: هوک + داستان + CTA`,
      userTemplate: `احساس: {{emotion}}
طول: {{length}}
حوزه: {{brief.domain}}
هدف: {{brief.goal}}

یک داستان جذاب بنویس.`,
      constraints: {
        structure: ["hook", "story", "cta"],
        noEmojis: true,
      },
    },
    {
      slug: "warning",
      title: "هشدار",
      description: "تولید محتوای هشداردهنده",
      inputsSchema: {
        type: "object",
        properties: {
          severity: { type: "string", title: "شدت", enum: ["ملایم", "متوسط", "شدید"] },
        },
        required: ["severity"],
      },
      systemPrompt: `شما یک متخصص تولید محتوای هشداردهنده فارسی هستید.
قوانین:
- هشدار واقعی و مفید
- بدون ترساندن بیش از حد
- بدون ادعای پزشکی بدون مدرک
- لحن جدی اما دوستانه`,
      userTemplate: `شدت: {{severity}}
حوزه: {{brief.domain}}
هدف: {{brief.goal}}

یک هشدار مفید و واقعی بنویس.`,
      constraints: {
        noMedicalClaims: true,
        factBased: true,
      },
    },
    {
      slug: "suspense",
      title: "تعلیق",
      description: "تولید محتوای تعلیق‌آمیز",
      inputsSchema: {
        type: "object",
        properties: {
          reveal: { type: "string", title: "نحوه فاش کردن", enum: ["تدریجی", "ناگهانی", "معمایی"] },
        },
        required: ["reveal"],
      },
      systemPrompt: `شما یک متخصص تولید محتوای تعلیق‌آمیز فارسی هستید.
قوانین:
- ایجاد کنجکاوی بدون کلیک‌بیت
- پاسخ واقعی و مفید
- ساختار: سوال + نکات + پاسخ
- لحن جذاب`,
      userTemplate: `نحوه فاش کردن: {{reveal}}
حوزه: {{brief.domain}}
هدف: {{brief.goal}}

محتوای تعلیق‌آمیز بنویس.`,
      constraints: {
        noClickbait: true,
        structure: ["question", "buildup", "reveal"],
      },
    },
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    })
  }

  // Create hooks
  const hooks = [
    { text: "آیا می‌دانستید که...", tag: "سوال" },
    { text: "بزرگ‌ترین اشتباه این است که...", tag: "هشدار" },
    { text: "راز موفقیت در این است که...", tag: "راز" },
    { text: "چیزی که هیچ‌کس نمی‌گوید...", tag: "افشاگری" },
    { text: "تنها راه برای...", tag: "راه‌حل" },
  ]

  for (const hook of hooks) {
    await prisma.hook.upsert({
      where: { id: hook.text },
      update: {},
      create: hook,
    })
  }

  // Create viral signals
  await prisma.viralSignal.upsert({
    where: { id: "trend-2024" },
    update: {},
    create: {
      label: "ترند 2024",
      content: "محتوای ترندی و به‌روز برای سال 2024",
      active: true,
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
