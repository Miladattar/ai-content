"use client"

import { StepCard } from "@/components/ui/step-card"
import { Input } from "@/components/ui/input"
import { wizardConfig } from "@/lib/wizard-config"
import type { BriefData } from "../brief-wizard"

interface Step3Props {
  data: BriefData
  onUpdate: (updates: Partial<BriefData>) => void
}

export function Step3Goal({ data, onUpdate }: Step3Props) {
  const exampleGoal = wizardConfig.goalExample(data.pageType)

  return (
    <StepCard title="تعریف هدف" description="هدف اصلی خود را در یک جمله کوتاه بیان کنید">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="goal" className="text-sm font-medium">
            هدف شما (یک جمله)
          </label>
          <Input
            id="goal"
            value={data.goal}
            onChange={(e) => onUpdate({ goal: e.target.value })}
            placeholder={`مثال: ${exampleGoal}`}
            className="text-base"
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>نکته:</strong> هدف خود را واضح و مشخص بنویسید. این هدف پایه تمام محتوای تولیدی خواهد بود.
          </p>
        </div>
      </div>
    </StepCard>
  )
}
