import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { participantId } = await req.json()
  if (!participantId || participantId === session.user.id) {
    return NextResponse.json({ error: "Невірний співрозмовник" }, { status: 400 })
  }

  // Шукаємо існуючу бесіду, де є обидва учасники
  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: session.user.id } } },
        { participants: { some: { userId: participantId } } },
      ],
    },
    select: { id: true },
  })

  if (existing) {
    return NextResponse.json({ conversationId: existing.id })
  }

  // Створюємо нову бесіду з обома учасниками
  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId: session.user.id },
          { userId: participantId },
        ],
      },
    },
  })

  return NextResponse.json({ conversationId: conversation.id })
}
