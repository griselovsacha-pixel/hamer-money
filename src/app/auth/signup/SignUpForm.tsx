"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUpForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
      headers: { "Content-Type": "application/json" },
    })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.message || "Помилка реєстрації")
    } else {
      router.push("/auth/signin?registered=true")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Ім'я" required className="w-full px-4 py-2 border rounded-lg" />
      <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded-lg" />
      <input name="password" type="password" placeholder="Пароль (мін. 8 символів)" required className="w-full px-4 py-2 border rounded-lg" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">
        {loading ? "Реєстрація..." : "Зареєструватися"}
      </button>
    </form>
  )
}
