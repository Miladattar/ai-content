"use client"

import { StepCard } from "@/components/ui/step-card"
import { Button } from "@/components/ui/button"
import { wizardConfig } from "@/lib/wizard-config"
import type { BriefData } from "../brief-wizard"
import { cn } from "@/lib/utils"

interface Step6Props {
  data: BriefData
  onUpdate: (updates: Partial<BriefData>) => void
}

export function Step6OutputPath({ data, onUpdate }: Step6Props) {
  return (
    <StepCard title="انتخاب مسیر خروجی" description="نوع محتوای مورد نظر خود را انتخاب کنید">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wizardConfig.outputPaths.map((path) => (
          <Button
            key={path}
            variant={data.outputPath === path ? "default" : "outline"}
            className={cn("h-auto p-6 text-center", {
              "ring-2 ring-primary ring-offset-2": data.outputPath === path,
            })}
            onClick={() => onUpdate({ outputPath: path })}
          >
            <div className="space-y-2">
              <div className="text-lg font-semibold">{path}</div>
              <div className="text-sm text-muted-foreground">
                {path.includes("ایده کوتاه") && "تولید 120 ایده کوتاه و جذاب"}
                {path.includes("دغدغه‌سازی") && "تولید 120 سوال و اعتراض برای جلب توجه"}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </StepCard>
  )
}
