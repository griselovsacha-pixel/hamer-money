import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import SignUpForm from "./SignUpForm"

export default async function SignUpPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Реєстрація</h1>
      <SignUpForm />
      <div className="mt-4 text-center text-sm">
        Вже є акаунт?{" "}
        <a href="/auth/signin" className="text-[#FF7A00] hover:underline">
          Увійти
        </a>
      </div>
    </div>
  )
}
