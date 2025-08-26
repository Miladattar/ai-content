"use client"

import { StepCard } from "@/components/ui/step-card"
import { Button } from "@/components/ui/button"
import { wizardConfig } from "@/lib/wizard-config"
import type { BriefData } from "../brief-wizard"
import { cn } from "@/lib/utils"

interface Step1Props {
  data: BriefData
  onUpdate: (updates: Partial<BriefData>) => void
}

export function Step1PageType({ data, onUpdate }: Step1Props) {
  return (
    <StepCard title="انتخاب نوع پیج" description="نوع کسب‌وکار یا صفحه‌ای که برایش محتوا می‌سازید را انتخاب کنید">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wizardConfig.pageTypes.map((type) => (
          <Button
            key={type}
            variant={data.pageType === type ? "default" : "outline"}
            className={cn("h-auto p-6 text-center", {
              "ring-2 ring-primary ring-offset-2": data.pageType === type,
            })}
            onClick={() => onUpdate({ pageType: type })}
          >
            <div className="space-y-2">
              <div className="text-lg font-semibold">{type}</div>
              <div className="text-sm text-muted-foreground">
                {type === "آموزشی" && "دوره‌ها، آموزش‌ها، مهارت‌آموزی"}
                {type === "خدماتی" && "کلینیک، سالن، خدمات تخصصی"}
                {type === "محصول‌محور" && "فروش کالا، برند، محصولات"}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </StepCard>
  )
}
