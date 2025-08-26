"use client"

import { StepCard } from "@/components/ui/step-card"
import { Button } from "@/components/ui/button"
import { wizardConfig } from "@/lib/wizard-config"
import type { BriefData } from "../brief-wizard"
import { cn } from "@/lib/utils"

interface Step7Props {
  data: BriefData
  onUpdate: (updates: Partial<BriefData>) => void
}

export function Step7Technique({ data, onUpdate }: Step7Props) {
  const techniques = data.pageType
    ? wizardConfig.techniquesByType[data.pageType as keyof typeof wizardConfig.techniquesByType] || []
    : []

  return (
    <StepCard title="انتخاب تکنیک سناریونویسی" description="تکنیک مورد نظر خود را برای تولید محتوا انتخاب کنید">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techniques.map((technique) => (
            <Button
              key={technique.key}
              variant={data.technique === technique.key ? "default" : "outline"}
              className={cn("h-auto p-4 text-right", {
                "ring-2 ring-primary ring-offset-2": data.technique === technique.key,
              })}
              onClick={() => onUpdate({ technique: technique.key })}
            >
              <div className="space-y-2 w-full">
                <div className="font-semibold">{technique.title}</div>
                <div className="text-sm text-muted-foreground">{technique.example}</div>
              </div>
            </Button>
          ))}
        </div>

        {techniques.length === 0 && (
          <div className="text-center text-muted-foreground py-8">لطفاً ابتدا نوع پیج را انتخاب کنید</div>
        )}
      </div>
    </StepCard>
  )
}
