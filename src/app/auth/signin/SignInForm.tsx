"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError("Невірний email або пароль")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        name="password"
        type="password"
        placeholder="Пароль"
        required
        className="w-full px-4 py-2 border rounded-lg"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Завантаження..." : "Увійти"}
      </button>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
        <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">або</span></div>
      </div>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full py-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
      >
        Google
      </button>
      <button
        type="button"
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="w-full py-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
      >
        GitHub
      </button>
    </form>
  )
}
