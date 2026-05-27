"use client"

import { useEffect, useRef, useState } from "react"
import io, { Socket } from "socket.io-client"
import { useRouter } from "next/navigation"

type Message = {
  id: string
  senderId: string
  content: string
  createdAt: string
  sender: {
    id: string
    name: string | null
    image: string | null
  }
}

interface Props {
  conversationId: string
  userId: string
  initialMessages: Message[]
  otherUser: { id: string; name: string | null; image: string | null } | null
}

export default function ChatClient({ conversationId, userId, initialMessages, otherUser }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMsg, setNewMsg] = useState("")
  const [socket, setSocket] = useState<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Отримуємо токен і підключаємось до сокету
  useEffect(() => {
    fetch("/api/socket-token")
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
            auth: { token: data.token }
          })
          s.on("connect", () => {
            s.emit("join_room", conversationId)
          })
          s.on("new_message", (msg: Message) => {
            setMessages(prev => [...prev, msg])
          })
          setSocket(s)
          return () => {
            s.disconnect()
          }
        }
      })
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMsg.trim() || !socket) return

    socket.emit("send_message", {
      conversationId,
      content: newMsg.trim(),
      receiverId: otherUser?.id
    })
    setNewMsg("")
    // Оптимістично можна було б додати локальне повідомлення, але сервер поверне його через сокет
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] px-4 py-2 rounded-lg ${
              msg.senderId === userId ? 'bg-[#FF7A00] text-white' : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="border-t p-3 flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          placeholder="Повідомлення..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF7A00]"
        />
        <button
          type="submit"
          disabled={!socket}
          className="px-5 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          Надіслати
        </button>
      </form>
    </>
  )
}
