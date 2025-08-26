"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FileText, BookTemplate as Template, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { name: "کاربران", href: "/admin/users", icon: Users },
  { name: "بریف‌ها", href: "/admin/briefs", icon: FileText },
  { name: "قالب‌ها", href: "/admin/templates", icon: Template },
  { name: "تنظیمات", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-l border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">پنل مدیریت</h2>
      </div>

      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-3 bg-transparent">
          <LogOut className="w-4 h-4" />
          خروج
        </Button>
      </div>
    </div>
  )
}
