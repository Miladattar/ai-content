export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-semibold">ویزارد تولید محتوا</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              سیستم هوشمند تولید محتوای فارسی برای شبکه‌های اجتماعی با استفاده از تکنیک‌های پیشرفته سناریونویسی
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">امکانات</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>تولید ایده‌های کوتاه</li>
              <li>سناریونویسی حرفه‌ای</li>
              <li>تکنیک‌های تعلیق و جذب</li>
              <li>محتوای چندرسانه‌ای</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">پشتیبانی</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>راهنمای کاربری</li>
              <li>نمونه‌های عملی</li>
              <li>بهینه‌سازی محتوا</li>
              <li>آموزش تکنیک‌ها</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© 1403 ویزارد تولید محتوا. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  )
}
