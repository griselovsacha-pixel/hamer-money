import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SettingsForm from "./SettingsForm"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/signin")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, bio: true, image: true, portfolioUrls: true }
  })

  if (!user) redirect("/auth/signin")

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Налаштування профілю</h1>
      <SettingsForm
        initialData={{
          name: user.name || "",
          bio: user.bio || "",
          image: user.image || "",
          portfolioUrls: user.portfolioUrls,
        }}
      />
    </div>
  )
}
