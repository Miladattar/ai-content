import { db } from "@/lib/db"
import { TemplateManagement } from "@/components/admin/template-management"

export default async function TemplatesPage() {
  const templates = await db.template.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { runs: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت قالب‌ها</h1>
        <p className="text-gray-600 dark:text-gray-400">مشاهده و مدیریت قالب‌های تولید محتوا</p>
      </div>

      <TemplateManagement templates={templates} />
    </div>
  )
}
