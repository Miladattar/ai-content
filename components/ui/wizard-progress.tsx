"use client"

import { Progress } from "@/components/ui/progress"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
  className?: string
}

export function WizardProgress({ currentStep, totalSteps, stepTitles, className }: WizardProgressProps) {
  const progressValue = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            مرحله {currentStep} از {totalSteps}
          </span>
          <span className="text-muted-foreground">{Math.round(progressValue)}%</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={stepNumber} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  {
                    "bg-primary text-primary-foreground": isCompleted,
                    "bg-primary/20 text-primary border-2 border-primary": isCurrent,
                    "bg-muted text-muted-foreground": isUpcoming,
                  },
                )}
              >
                {isCompleted ? <CheckIcon className="w-4 h-4" /> : stepNumber}
              </div>
              <span
                className={cn("text-xs text-center leading-tight max-w-16", {
                  "text-foreground font-medium": isCurrent,
                  "text-muted-foreground": !isCurrent,
                })}
              >
                {title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
