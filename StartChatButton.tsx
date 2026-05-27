"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function StartChatButton({ participantId }: { participantId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId }),
    })
    if (res.ok) {
      const { conversationId } = await res.json()
      router.push(`/messages/${conversationId}`)
    } else {
      console.error("Не вдалося створити бесіду")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 text-sm"
    >
      {loading ? "Зачекайте..." : "Написати"}
    </button>
  )
}
