interface User {
  id: string
  email: string
  password: string
  name: string
  role: "USER" | "ADMIN"
  createdAt: Date
  updatedAt: Date
}

interface Brief {
  id: string
  userId: string
  pageType: string
  domain: string
  goal: string
  persona?: string
  tone?: string
  outputPath: string
  technique: string
  outputType: string
  status: string
  createdAt: Date
  updatedAt: Date
}

interface Template {
  id: string
  slug: string
  name: string
  description: string
  pageType: string
  prompt: string
  systemPrompt: string
  userTemplate: string
  contract: any
  createdAt: Date
  updatedAt: Date
}

interface Hook {
  id: string
  name: string
  description: string
  pageType: string
  createdAt: Date
  updatedAt: Date
}

interface ViralSignal {
  id: string
  name: string
  description: string
  pageType: string
  createdAt: Date
  updatedAt: Date
  active?: boolean
}

interface Run {
  id: string
  briefId: string
  templateSlug: string
  kind: "GENERATE" | "REVISE"
  parentId?: string
  input: any
  output: any
  createdAt: Date
  updatedAt: Date
}

class MockDatabase {
  private getStorageKey(table: string): string {
    return `persian_brief_wizard_${table}`
  }

  private getData<T>(table: string): T[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.getStorageKey(table))
    return data ? JSON.parse(data) : []
  }

  private setData<T>(table: string, data: T[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.getStorageKey(table), JSON.stringify(data))
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  user = {
    findUnique: async ({ where }: { where: { id?: string; email?: string } }): Promise<User | null> => {
      const users = this.getData<User>("users")
      return users.find((u) => u.id === where.id || u.email === where.email) || null
    },

    create: async ({ data }: { data: Omit<User, "id" | "createdAt" | "updatedAt"> }): Promise<User> => {
      const users = this.getData<User>("users")
      const newUser: User = {
        ...data,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      users.push(newUser)
      this.setData("users", users)
      return newUser
    },

    findMany: async (): Promise<User[]> => {
      return this.getData<User>("users")
    },

    count: async (): Promise<number> => {
      return this.getData<User>("users").length
    },

    update: async ({ where, data }: { where: { id: string }; data: Partial<User> }): Promise<User> => {
      const users = this.getData<User>("users")
      const index = users.findIndex((u) => u.id === where.id)
      if (index === -1) throw new Error("User not found")

      users[index] = { ...users[index], ...data, updatedAt: new Date() }
      this.setData("users", users)
      return users[index]
    },

    delete: async ({ where }: { where: { id: string } }): Promise<User> => {
      const users = this.getData<User>("users")
      const index = users.findIndex((u) => u.id === where.id)
      if (index === -1) throw new Error("User not found")

      const deletedUser = users[index]
      users.splice(index, 1)
      this.setData("users", users)
      return deletedUser
    },
  }

  brief = {
    create: async ({ data }: { data: Omit<Brief, "id" | "createdAt" | "updatedAt"> }): Promise<Brief> => {
      const briefs = this.getData<Brief>("briefs")
      const newBrief: Brief = {
        ...data,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      briefs.push(newBrief)
      this.setData("briefs", briefs)
      return newBrief
    },

    findMany: async ({ where, orderBy }: { where?: any; orderBy?: any } = {}): Promise<Brief[]> => {
      let briefs = this.getData<Brief>("briefs")

      if (where?.userId) {
        briefs = briefs.filter((b) => b.userId === where.userId)
      }

      if (orderBy?.createdAt === "desc") {
        briefs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      return briefs
    },

    findUnique: async ({ where }: { where: { id: string } }): Promise<Brief | null> => {
      const briefs = this.getData<Brief>("briefs")
      return briefs.find((b) => b.id === where.id) || null
    },

    count: async (): Promise<number> => {
      return this.getData<Brief>("briefs").length
    },

    delete: async ({ where }: { where: { id: string } }): Promise<Brief> => {
      const briefs = this.getData<Brief>("briefs")
      const index = briefs.findIndex((b) => b.id === where.id)
      if (index === -1) throw new Error("Brief not found")

      const deletedBrief = briefs[index]
      briefs.splice(index, 1)
      this.setData("briefs", briefs)
      return deletedBrief
    },
  }

  template = {
    findMany: async ({ where }: { where?: any } = {}): Promise<Template[]> => {
      let templates = this.getData<Template>("templates")

      if (where?.pageType) {
        templates = templates.filter((t) => t.pageType === where.pageType)
      }

      return templates
    },

    create: async ({ data }: { data: Omit<Template, "id" | "createdAt" | "updatedAt"> }): Promise<Template> => {
      const templates = this.getData<Template>("templates")
      const newTemplate: Template = {
        ...data,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      templates.push(newTemplate)
      this.setData("templates", templates)
      return newTemplate
    },

    findUnique: async ({ where }: { where: { slug: string } }): Promise<Template | null> => {
      const templates = this.getData<Template>("templates")
      return templates.find((t) => t.slug === where.slug) || null
    },
  }

  hook = {
    findMany: async ({ where }: { where?: any } = {}): Promise<Hook[]> => {
      let hooks = this.getData<Hook>("hooks")

      if (where?.pageType) {
        hooks = hooks.filter((h) => h.pageType === where.pageType)
      }

      return hooks
    },

    create: async ({ data }: { data: Omit<Hook, "id" | "createdAt" | "updatedAt"> }): Promise<Hook> => {
      const hooks = this.getData<Hook>("hooks")
      const newHook: Hook = {
        ...data,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      hooks.push(newHook)
      this.setData("hooks", hooks)
      return newHook
    },
  }

  viralSignal = {
    findMany: async ({ where }: { where?: any } = {}): Promise<ViralSignal[]> => {
      let signals = this.getData<ViralSignal>("viralSignals")

      if (where?.pageType) {
        signals = signals.filter((s) => s.pageType === where.pageType)
      }

      return signals
    },

    findFirst: async ({ where, orderBy }: { where?: any; orderBy?: any } = {}): Promise<ViralSignal | null> => {
      let signals = this.getData<ViralSignal>("viralSignals")

      if (where?.active !== undefined) {
        // For mock purposes, treat all signals as active
        signals = signals.filter(() => true)
      }

      if (where?.pageType) {
        signals = signals.filter((s) => s.pageType === where.pageType)
      }

      if (orderBy?.createdAt === "desc") {
        signals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      return signals.length > 0 ? signals[0] : null
    },

    create: async ({ data }: { data: Omit<ViralSignal, "id" | "createdAt" | "updatedAt"> }): Promise<ViralSignal> => {
      const signals = this.getData<ViralSignal>("viralSignals")
      const newSignal: ViralSignal = {
        ...data,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      signals.push(newSignal)
      this.setData("viralSignals", signals)
      return newSignal
    },
  }

  run = {
    create: async ({ data }: { data: Omit<Run, "id" | "createdAt" | "updatedAt"> }): Promise<Run> => {
      const runs = this.getData<Run>("runs")
      const newRun: Run = {
        ...data,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      runs.push(newRun)
      this.setData("runs", runs)
      return newRun
    },

    findMany: async ({ where, orderBy }: { where?: any; orderBy?: any } = {}): Promise<Run[]> => {
      let runs = this.getData<Run>("runs")

      if (where?.briefId) {
        runs = runs.filter((r) => r.briefId === where.briefId)
      }

      if (orderBy?.createdAt === "desc") {
        runs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      return runs
    },
  }
}

const prisma = new MockDatabase()

let initPromise: Promise<boolean> | null = null

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = initializeDatabase()
  }
  return initPromise
}

const originalPrisma = prisma

const wrappedPrisma = {
  user: {
    findUnique: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.user.findUnique(args)
    },
    create: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.user.create(args)
    },
    findMany: async (args?: any) => {
      await ensureInitialized()
      return originalPrisma.user.findMany(args)
    },
    count: async () => {
      await ensureInitialized()
      return originalPrisma.user.count()
    },
    update: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.user.update(args)
    },
    delete: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.user.delete(args)
    },
  },
  template: {
    findUnique: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.template.findUnique(args)
    },
    findMany: async (args?: any) => {
      await ensureInitialized()
      return originalPrisma.template.findMany(args)
    },
    create: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.template.create(args)
    },
  },
  brief: {
    create: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.brief.create(args)
    },
    findMany: async (args?: any) => {
      await ensureInitialized()
      return originalPrisma.brief.findMany(args)
    },
    findUnique: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.brief.findUnique(args)
    },
    count: async () => {
      await ensureInitialized()
      return originalPrisma.brief.count()
    },
    delete: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.brief.delete(args)
    },
  },
  hook: {
    findMany: async (args?: any) => {
      await ensureInitialized()
      return originalPrisma.hook.findMany(args)
    },
    create: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.hook.create(args)
    },
  },
  viralSignal: {
    findMany: async (args?: any) => {
      await ensureInitialized()
      return originalPrisma.viralSignal.findMany(args)
    },
    findFirst: async (args?: any) => {
      await ensureInitialized()
      return originalPrisma.viralSignal.findFirst(args)
    },
    create: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.viralSignal.create(args)
    },
  },
  run: {
    create: async (args: any) => {
      await ensureInitialized()
      return originalPrisma.run.create(args)
    },
    findMany: async (args?: any) => {
      await ensureInitialized()
      return originalPrisma.run.findMany(args)
    },
  },
}

export { wrappedPrisma as prisma }
export const db = wrappedPrisma

async function initializeDatabase() {
  try {
    console.log("🔄 Initializing mock database...")

    // Check if we already have data
    const userCount = await prisma.user.count()
    if (userCount > 0) {
      console.log("✅ Database already initialized")
      return true
    }

    // Create admin user
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        name: "مدیر سیستم",
        role: "ADMIN",
      },
    })

    // Create sample templates
    const templates = [
      {
        slug: "story",
        name: "داستان محتوا",
        description: "قالب برای ایجاد محتوای داستانی جذاب",
        pageType: "عمومی",
        prompt: "یک محتوای داستانی در مورد {{domain}} بنویس که {{goal}} را برآورده کند.",
        systemPrompt: "شما یک نویسنده محتوای حرفه‌ای هستید که محتوای داستانی جذاب تولید می‌کنید.",
        userTemplate: "یک داستان جذاب در مورد {{domain}} بنویس که هدف {{goal}} را برآورده کند. لحن: {{tone}}",
        contract: {
          type: "story",
          fields: ["hook", "story", "cta", "reels", "story", "post", "live"],
        },
      },
      {
        slug: "idea120",
        name: "120 ایده کوتاه",
        description: "قالب برای تولید 120 ایده کوتاه و جذاب",
        pageType: "عمومی",
        prompt: "120 ایده کوتاه و جذاب در مورد {{domain}} تولید کن که {{goal}} را برآورده کند.",
        systemPrompt: "شما یک متخصص تولید ایده هستید که ایده‌های خلاقانه و کاربردی ارائه می‌دهید.",
        userTemplate: "120 ایده کوتاه و جذاب در مورد {{domain}} تولید کن که {{goal}} را برآورده کند.",
        contract: {
          type: "idea120",
          fields: ["items"],
        },
      },
      {
        slug: "educational-story",
        name: "داستان آموزشی",
        description: "قالب برای ایجاد محتوای آموزشی با استفاده از داستان",
        pageType: "آموزشی",
        prompt: "یک داستان آموزشی در مورد {{domain}} بنویس که {{goal}} را برآورده کند.",
        systemPrompt: "شما یک مربی آموزشی هستید که از داستان برای آموزش استفاده می‌کنید.",
        userTemplate: "یک داستان آموزشی در مورد {{domain}} بنویس که {{goal}} را برآورده کند.",
        contract: { type: "story", fields: ["title", "content", "lesson"] },
      },
      {
        slug: "service-showcase",
        name: "معرفی خدمات",
        description: "قالب برای معرفی خدمات به صورت جذاب",
        pageType: "خدماتی",
        prompt: "خدمات {{domain}} را معرفی کن تا {{goal}} محقق شود.",
        systemPrompt: "شما یک متخصص بازاریابی هستید که خدمات را به بهترین شکل معرفی می‌کنید.",
        userTemplate: "خدمات {{domain}} را معرفی کن تا {{goal}} محقق شود.",
        contract: { type: "service", fields: ["title", "description", "benefits", "cta"] },
      },
    ]

    for (const template of templates) {
      await prisma.template.create({ data: template })
    }

    // Create sample hooks
    const hooks = [
      {
        name: "سوال تحریک‌آمیز",
        description: "شروع با سوالی که مخاطب را درگیر کند",
        pageType: "آموزشی",
      },
      {
        name: "آمار شگفت‌انگیز",
        description: "ارائه آماری که توجه را جلب کند",
        pageType: "خدماتی",
      },
    ]

    for (const hook of hooks) {
      await prisma.hook.create({ data: hook })
    }

    // Create sample viral signals
    const viralSignals = [
      {
        name: "ترس از از دست دادن",
        description: "ایجاد احساس فوریت و ترس از از دست دادن فرصت",
        pageType: "محصول‌محور",
        active: true,
      },
      {
        name: "تایید اجتماعی",
        description: "استفاده از نظرات و تجربیات دیگران",
        pageType: "خدماتی",
        active: true,
      },
    ]

    for (const signal of viralSignals) {
      await prisma.viralSignal.create({ data: signal })
    }

    console.log("✅ Mock database initialized successfully")
    return true
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return false
  }
}
