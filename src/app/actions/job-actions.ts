"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function applyForJob(jobId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Не авторизований")
  const userId = session.user.id

  // Перевірка, чи не подавав уже
  const existing = await prisma.application.findFirst({
    where: { jobId, freelancerId: userId }
  })
  if (existing) throw new Error("Заявка вже подана")

  await prisma.application.create({
    data: {
      jobId,
      freelancerId: userId,
      status: "PENDING"
    }
  })

  revalidatePath(`/jobs/${jobId}`)
}

export async function acceptApplication(jobId: string, applicationId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Не авторизований")

  const job = await prisma.job.findUnique({ where: { id: jobId } })
  if (!job || job.employerId !== session.user.id) throw new Error("Ви не замовник")

  // Змінюємо статус заявки на ACCEPTED та замовлення на IN_PROGRESS
  await prisma.application.update({
    where: { id: applicationId },
    data: { status: "ACCEPTED" }
  })
  await prisma.job.update({
    where: { id: jobId },
    data: { status: "IN_PROGRESS" }
  })

  revalidatePath(`/jobs/${jobId}`)
  revalidatePath(`/dashboard`)
}

export async function completeJob(jobId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Не авторизований")

  const job = await prisma.job.findUnique({ where: { id: jobId } })
  if (!job || job.employerId !== session.user.id) throw new Error("Ви не замовник")
  if (job.status !== 'IN_PROGRESS') throw new Error("Замовлення не в роботі")

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "COMPLETED" }
  })

  revalidatePath(`/jobs/${jobId}`)
  revalidatePath(`/dashboard`)
}
