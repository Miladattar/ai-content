export const wizardConfig = {
  pageTypes: ["آموزشی", "خدماتی", "محصول‌محور"] as const,

  hintsByType: {
    آموزشی: ["آموزش زبان", "آموزش ترید", "آموزش هوش مصنوعی", "آموزش موسیقی"],
    خدماتی: ["کلینیک پوست", "کاشت ناخن", "کلینیک کاشت مو", "نظافت منزل"],
    محصول‌محور: ["پوشاک زنانه", "کیف و کفش", "کوسن دست‌دوز", "کالای دیجیتال"],
  },

  goalExample(type: string) {
    if (type === "محصول‌محور") return "فروش ست تاپ‌وشلوارک"
    if (type === "خدماتی") return "رزرو نوبت کلینیک پوست"
    return "فروش دوره آیلتس"
  },

  personaSample: {
    آموزشی: "دانشجو 20–30 ساله، دنبال مهاجرت",
    خدماتی: "خانم 25–40 ساله، دغدغه زیبایی",
    محصول‌محور: "دختر 18–30 ساله، استایل ترند",
  },

  tones: ["رسمی", "خودمونی", "فان", "الهام‌بخش"] as const,

  outputPaths: ["ایده کوتاه (تیترسازی 120تایی)", "دغدغه‌سازی (120 سؤال/اعتراض)"] as const,

  techniquesByType: {
    محصول‌محور: [
      { key: "limit", title: "لیمیت", example: "فقط تا جمعه؛ موجودی محدوده" },
      { key: "suspense", title: "تعلیق", example: "چرا بعضی ست‌ها بعد شستشو گشاد می‌شن؟" },
      { key: "warning", title: "هشدار", example: "این جنس بعد دو شستشو پرز می‌ده" },
      { key: "contrast", title: "تضاد", example: "نخی همیشه خنک نیست!" },
      { key: "review", title: "ری‌ویو", example: "دو بار شستشو؛ رنگ ثابت موند" },
      { key: "story", title: "داستان", example: "گرمای مرداد و ستِ نجات‌بخش" },
      { key: "choice", title: "دو راهی", example: "ساده یا طرحدار؟" },
      { key: "compare", title: "مقایسه", example: "این ست vs اون ست" },
      { key: "todo", title: "To-Do", example: "۳ کار قبل از خرید" },
      { key: "fortune", title: "فال‌گونه", example: "اگر لباس روشن می‌پوشی..." },
      { key: "metaphor", title: "استعاره", example: "خنک مثل نسیم عصر تابستون" },
      { key: "visual", title: "مثال تصویری", example: "لیوان آب خنک = حس پارچه" },
      { key: "weird", title: "تصویر عجیب", example: "شلوارکی که ۱/۳ میشه بعد شستشو!" },
      { key: "humor", title: "طنز", example: "ست ارزون خریدی؟ یک هفته بعد: دستمال!" },
    ],
    خدماتی: [
      { key: "limit", title: "لیمیت", example: "۱۰ نوبت مشاوره رایگان تا جمعه" },
      { key: "suspense", title: "تعلیق", example: "بزرگ‌ترین اشتباه مراقبت پوستی…" },
      { key: "warning", title: "هشدار", example: "کرم اشتباه → خطر لک دائمی" },
      { key: "contrast", title: "تضاد", example: "لایه‌برداری همیشه خوب نیست" },
      { key: "review", title: "ری‌ویو", example: "نتیجه مراجع بعد ۳ جلسه" },
      { key: "story", title: "داستان", example: "خانم ۲۸ ساله و لک صورت…" },
      { key: "choice", title: "دو راهی", example: "لیزر یا درمان دارویی؟" },
      { key: "compare", title: "مقایسه", example: "مزوتراپی vs میکرونیدلینگ" },
      { key: "todo", title: "To-Do", example: "۳ کار قبل از رزرو" },
      { key: "fortune", title: "فال‌گونه", example: "اگر ضدآفتاب یادت میره…" },
      { key: "metaphor", title: "استعاره", example: "این روش مثل فیلتر نازک روی پوستته" },
      { key: "visual", title: "مثال تصویری", example: "سیب پوست‌کنده زیر آفتاب = آسیب UV" },
      { key: "weird", title: "تصویر عجیب", example: "نمای میکروسکوپی پوست بعد ۱ ماه" },
      { key: "humor", title: "طنز", example: "ضدآفتاب نمی‌زنم ولی دنبال کرم ضدلکم!" },
    ],
    آموزشی: [
      { key: "limit", title: "لیمیت", example: "تا امشب فرصت ثبت‌نام آیلتس" },
      { key: "suspense", title: "تعلیق", example: "چرا همه تو Speaking گیر می‌کنن؟" },
      { key: "warning", title: "هشدار", example: "این خطای Writing نمره‌تو نصف می‌کنه" },
      { key: "contrast", title: "تضاد", example: "حفظ لغت ≠ یادگیری زبان" },
      { key: "review", title: "ری‌ویو", example: "پیشرفت هنرجو بعد ۶ جلسه" },
      { key: "story", title: "داستان", example: "اولین بار که آیلتس دادم…" },
      { key: "choice", title: "دو راهی", example: "خودخوان یا کلاس؟" },
      { key: "compare", title: "مقایسه", example: "آنلاین vs حضوری" },
      { key: "todo", title: "To-Do", example: "۳ کار قبل از شروع" },
      { key: "fortune", title: "فال‌گونه", example: "اگه وسط فیلم Pause می‌کنی…" },
      { key: "metaphor", title: "استعاره", example: "زبان مثل عضله‌ست" },
      { key: "visual", title: "مثال تصویری", example: "لیوان آب = تجمع لغت‌ها" },
      { key: "weird", title: "تصویر عجیب", example: "دفتر پُر لغتِ بی‌استفاده" },
      { key: "humor", title: "طنز", example: "لغتای سخت بلدی، قهوه سفارش نمی‌دی!" },
    ],
  },
} as const

export type PageType = (typeof wizardConfig.pageTypes)[number]
export type Tone = (typeof wizardConfig.tones)[number]
export type OutputPath = (typeof wizardConfig.outputPaths)[number]
