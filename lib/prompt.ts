export interface TemplateContext {
  brief: {
    pageType: string
    domain: string
    goal: string
    audience?: string
    tone?: string
  }
  inputs: Record<string, any>
  hooks?: string[]
  viralSignal?: string
}

export function compileTemplate(template: string, context: TemplateContext): string {
  let compiled = template

  // Replace brief variables
  compiled = compiled.replace(/\{\{brief\.pageType\}\}/g, context.brief.pageType || "")
  compiled = compiled.replace(/\{\{brief\.domain\}\}/g, context.brief.domain || "")
  compiled = compiled.replace(/\{\{brief\.goal\}\}/g, context.brief.goal || "")
  compiled = compiled.replace(/\{\{brief\.audience\}\}/g, context.brief.audience || "")
  compiled = compiled.replace(/\{\{brief\.tone\}\}/g, context.brief.tone || "")

  // Replace input variables
  Object.entries(context.inputs).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
    compiled = compiled.replace(regex, String(value || ""))
  })

  // Add hooks if available
  if (context.hooks && context.hooks.length > 0) {
    compiled += `\n\nهوک‌های پیشنهادی: ${context.hooks.join("، ")}`
  }

  // Add viral signal if available
  if (context.viralSignal) {
    compiled += `\n\nسیگنال ویرال: ${context.viralSignal}`
  }

  return compiled
}

export function sanitizeFencedJSON(text: string): string {
  // Remove ```json and ``` fences
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (jsonMatch) {
    return jsonMatch[1].trim()
  }
  return text.trim()
}

export function getGlobalWritingRules(tone?: string): string {
  const selectedTone = tone || "خودمونی-حرفه‌ای"

  return `قوانین کلی نوشتار:
- لحن: ${selectedTone}
- ممنوع: ایموجی، نقل‌قول مصنوعی، ادعای بی‌منبع
- ممنوع: وعده قطعی درمان یا درآمد
- خروجی دقیقاً طبق contract مشخص شده (بدون تیتر اضافه)
- متن فارسی روان و طبیعی
- جذاب اما قابل اعتماد`
}

export async function validateContent(
  content: any,
  templateSlug: string,
): Promise<{ valid: boolean; issues: string[] }> {
  const issues: string[] = []

  // Check for emojis
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu
  const contentStr = JSON.stringify(content)
  if (emojiRegex.test(contentStr)) {
    issues.push("محتوا شامل ایموجی است")
  }

  // Check for artificial quotes
  if (contentStr.includes('""') || contentStr.includes("''")) {
    issues.push("محتوا شامل نقل‌قول مصنوعی است")
  }

  // Check for forbidden claims
  const forbiddenClaims = ["تضمینی", "معجزه", "درمان قطعی", "درآمد قطعی", "100% موثر"]
  const hasForbiddenClaim = forbiddenClaims.some((claim) => contentStr.includes(claim))
  if (hasForbiddenClaim) {
    issues.push("محتوا شامل ادعای غیرمجاز است")
  }

  // Template-specific validations
  if (templateSlug === "idea120") {
    if (!content.items || !Array.isArray(content.items)) {
      issues.push("فرمت Idea120 نامعتبر است")
    } else if (content.items.length !== 120) {
      issues.push(`تعداد ایده‌ها باید 120 باشد، ${content.items.length} ایده تولید شده`)
    } else {
      // Check word count for each idea
      content.items.forEach((item: any, index: number) => {
        if (item.title && item.title.split(" ").length > 12) {
          issues.push(`ایده ${index + 1} بیش از 12 کلمه دارد`)
        }
      })
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}
