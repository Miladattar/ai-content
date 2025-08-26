import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"
import { AdminStats } from "@/components/admin/admin-stats"
import { RecentActivity } from "@/components/admin/recent-activity"

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  // Get dashboard statistics
  const [userCount, briefCount, templateCount, recentBriefs] = await Promise.all([
    db.user.count(),
    db.brief.count(),
    db.template.count(),
    db.brief.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { email: true },
        },
      },
    }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">داشبورد مدیریت</h1>
        <p className="text-gray-600 dark:text-gray-400">خوش آمدید، {user?.email}</p>
      </div>

      <AdminStats userCount={userCount} briefCount={briefCount} templateCount={templateCount} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity briefs={recentBriefs} />
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">آمار سیستم</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>بریف‌های امروز</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span>کاربران فعال</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span>میانگین زمان تولید</span>
              <span className="font-medium">2.3 ثانیه</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
