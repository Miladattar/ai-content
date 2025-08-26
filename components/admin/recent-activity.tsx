import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { faIR } from "date-fns/locale"

interface RecentActivityProps {
  briefs: Array<{
    id: string
    title: string
    createdAt: Date
    user: {
      email: string
    }
  }>
}

export function RecentActivity({ briefs }: RecentActivityProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">فعالیت‌های اخیر</h3>
      <div className="space-y-4">
        {briefs.map((brief) => (
          <div
            key={brief.id}
            className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{brief.title || "بریف بدون عنوان"}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">توسط {brief.user.email}</p>
            </div>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(brief.createdAt, {
                addSuffix: true,
                locale: faIR,
              })}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
