"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { Category } from "@/lib/job-templates"

const jobSchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(50).max(5000),
  category: z.enum([
    "WEBSITE_DEVELOPMENT", "LANDING_PAGE", "WEBSITE_REFINEMENT", "MARKUP",
    "QA", "ONE_C", "IT_SERVICES", "MOBILE_APP", "GAME_DEV", "TECH_SPEC",
    "CYBERSECURITY", "OTHER"
  ]),
  budgetMin: z.number().positive().optional().nullable(),
  budgetMax: z.number().positive().optional().nullable(),
  deadline: z.string().optional().nullable(),
  templateData: z.string().optional(), // JSON
})

export async function createJob(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Авторизуйтесь" }

  const raw = Object.fromEntries(formData.entries())
  // Перетворюємо числові поля
  const data = {
    ...raw,
    budgetMin: raw.budgetMin ? Number(raw.budgetMin) : null,
    budgetMax: raw.budgetMax ? Number(raw.budgetMax) : null,
    deadline: raw.deadline || null,
  }

  const validation = jobSchema.safeParse(data)
  if (!validation.success) {
    return { error: "Перевірте правильність заповнення полів" }
  }

  const { templateData, ...jobData } = validation.data

  // Можна зберегти templateData у опис або окреме поле. Поки що в опис додамо секцію.
  let fullDescription = jobData.description
  if (templateData) {
    try {
      const extra = JSON.parse(templateData)
      const extraStr = Object.entries(extra).map(([key, value]) => `**${key}:** ${value}`).join('\n')
      fullDescription += `\n\n### Додаткові деталі:\n${extraStr}`
    } catch {}
  }

  await prisma.job.create({
    data: {
      title: jobData.title,
      description: fullDescription,
      category: jobData.category,
      budgetMin: jobData.budgetMin,
      budgetMax: jobData.budgetMax,
      deadline: jobData.deadline ? new Date(jobData.deadline) : null,
      employerId: session.user.id,
    },
  })

  revalidatePath("/")
  return { success: true }
}
