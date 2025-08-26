import { db } from "@/lib/db"
import { BriefManagement } from "@/components/admin/brief-management"

export default async function BriefsPage() {
  const briefs = await db.brief.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { email: true },
      },
      runs: {
        select: { id: true, kind: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت بریف‌ها</h1>
        <p className="text-gray-600 dark:text-gray-400">مشاهده و مدیریت تمام بریف‌های ایجاد شده</p>
      </div>

      <BriefManagement briefs={briefs} />
    </div>
  )
}
