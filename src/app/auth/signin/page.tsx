import { auth, signIn } from "@/lib/auth"
import { redirect } from "next/navigation"
import SignInForm from "./SignInForm"

export default async function SignInPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Увійти</h1>
      <SignInForm />
      <div className="mt-4 text-center text-sm">
        Немає акаунта?{" "}
        <a href="/auth/signup" className="text-[#FF7A00] hover:underline">
          Зареєструватися
        </a>
      </div>
    </div>
  )
}
