"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateProfile(data: { name: string; bio: string; image: string; portfolioUrls: string[] }) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Не авторизований" }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      bio: data.bio,
      image: data.image,
      portfolioUrls: data.portfolioUrls,
    },
  })

  revalidatePath(`/profile/${session.user.id}`)
  return { userId: session.user.id }
}
