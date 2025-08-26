// Contract types for different content generation templates
export type Idea120 = {
  items: { n: number; title: string; format?: string }[]
  assumptions?: string
  buckets?: { name: string; count: number }[]
}

export type Story = {
  hook: string
  story: string
  cta: string
}

export type Limit = {
  script: string
}

export type Contrast = {
  script: string
}

export type NoWords = {
  ideas: {
    shock: "mild" | "medium" | "hard"
    visual: string
    message: string
    how: string
  }[]
  hooks: string[]
}

export type Suspense = {
  beats: { id: number; text: string }[]
  script: string
}

export type Review = {
  script: string
}

export type Choice = {
  script: string
}

export type Compare = {
  script: string
  criteria?: string[]
}

export type Fortune = {
  checks: {
    sign: string
    scene: string
    meaning: string
    instant_test: string
  }[]
  summary: string
}

export type ToDo = {
  goal: string
  step1: any
  step2?: any
  step3?: any
  closing: string
}

export type VisualExample = {
  script: string
  tools?: string[]
}
