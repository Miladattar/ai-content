import { db } from "@/lib/db"
import { UserManagement } from "@/components/admin/user-management"

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { briefs: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت کاربران</h1>
        <p className="text-gray-600 dark:text-gray-400">مشاهده و مدیریت کاربران سیستم</p>
      </div>

      <UserManagement users={users} />
    </div>
  )
}
