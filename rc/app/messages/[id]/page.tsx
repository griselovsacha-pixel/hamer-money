import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import ChatClient from "./ChatClient"

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/signin")

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
    include: {
      participants: {
        include: { user: { select: { id: true, name: true, image: true } } }
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true, image: true } } }
      }
    }
  })

  if (!conversation) notFound()

  // Перевіряємо, чи поточний користувач є учасником
  const isParticipant = conversation.participants.some(p => p.userId === session.user.id)
  if (!isParticipant) redirect("/messages")

  const otherParticipant = conversation.participants.find(p => p.userId !== session.user.id)?.user

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border rounded-lg shadow-sm flex flex-col h-[75vh]">
        <div className="px-4 py-3 border-b font-medium">
          {otherParticipant?.name || "Чат"}
        </div>
        <ChatClient
          conversationId={conversation.id}
          userId={session.user.id}
          initialMessages={conversation.messages}
          otherUser={otherParticipant}
        />
      </div>
    </div>
  )
}
