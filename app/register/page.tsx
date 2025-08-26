import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6">
        <RegisterForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">قبلاً ثبت‌نام کرده‌اید؟ </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            وارد شوید
          </Link>
        </div>
      </div>
    </div>
  )
}
