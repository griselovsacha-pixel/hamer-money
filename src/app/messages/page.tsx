import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function MessagesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/signin")

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId: session.user.id }
      }
    },
    include: {
      participants: {
        include: { user: { select: { id: true, name: true, image: true } } }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { content: true, createdAt: true, senderId: true }
      }
    },
    orderBy: { updatedAt: 'desc' } // поле updatedAt треба додати до моделі Conversation (пропустив, додай в schema: updatedAt DateTime @updatedAt)
  })

  // Формуємо список з іменем співрозмовника та останнім повідомленням
  const chatList = conversations.map(conv => {
    const otherParticipant = conv.participants.find(p => p.userId !== session.user.id)?.user
    const lastMsg = conv.messages[0]
    return {
      id: conv.id,
      otherUser: otherParticipant,
      lastMessage: lastMsg ? (lastMsg.senderId === session.user.id ? 'Ви: ' : '') + lastMsg.content : 'Немає повідомлень',
      lastTime: lastMsg?.createdAt
    }
  })

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Повідомлення</h1>
      {chatList.length === 0 ? (
        <p className="text-gray-500">У вас немає активних чатів.</p>
      ) : (
        <div className="space-y-2">
          {chatList.map(chat => (
            <Link
              key={chat.id}
              href={`/messages/${chat.id}`}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:shadow-sm"
            >
              <img
                src={chat.otherUser?.image || "/default-avatar.png"}
                className="h-10 w-10 rounded-full"
                alt=""
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{chat.otherUser?.name || "Невідомий"}</p>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              {chat.lastTime && (
                <span className="text-xs text-gray-400">
                  {new Date(chat.lastTime).toLocaleDateString()}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
