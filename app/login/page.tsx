import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6">
        <LoginForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">حساب کاربری ندارید؟ </span>
          <Link href="/register" className="text-primary hover:underline font-medium">
            ثبت‌نام کنید
          </Link>
        </div>
      </div>
    </div>
  )
}
