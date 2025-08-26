import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SparklesIcon, ZapIcon, TargetIcon, TrendingUpIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                ویزارد هوشمند
                <br />
                <span className="text-primary">تولید محتوا</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                با استفاده از تکنیک‌های پیشرفته سناریونویسی، محتوای جذاب و حرفه‌ای برای شبکه‌های اجتماعی تولید کنید
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/brief">شروع ویزارد</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">ورود به حساب</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold">امکانات ویژه</h2>
              <p className="text-muted-foreground text-lg">ابزارهای قدرتمند برای تولید محتوای باکیفیت و جذاب</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <SparklesIcon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">تولید ایده</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>تولید 120 ایده کوتاه و جذاب برای محتوای شما با تکنیک‌های خلاقانه</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ZapIcon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">سناریونویسی</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>استفاده از تکنیک‌های پیشرفته مانند تعلیق، تضاد و داستان‌سرایی</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TargetIcon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">هدفمندسازی</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>تنظیم محتوا بر اساس نوع کسب‌وکار، مخاطب و اهداف مشخص شما</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUpIcon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">بهینه‌سازی</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>محتوای بهینه‌شده برای ریلز، استوری، پست و پخش زنده</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">آماده شروع هستید؟</h2>
              <p className="text-muted-foreground text-lg">
                همین الان ویزارد تولید محتوا را شروع کنید و محتوای حرفه‌ای بسازید
              </p>
            </div>

            <Button size="lg" asChild>
              <Link href="/brief">شروع ویزارد</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
