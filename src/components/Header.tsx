import Link from "next/link"
import Logo from "./Logo"
import { auth } from "@/lib/auth"

export default async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold text-gray-900">Hamer Money</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-[#FF7A00]">Замовлення</Link>
          <Link href="/create-job" className="hover:text-[#FF7A00]">Створити замовлення</Link>
          <Link href="/support" className="hover:text-[#FF7A00]">Підтримка</Link>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-sm hover:text-[#FF7A00]">
                Дашборд
              </Link>
              <Link href="/messages" className="text-sm hover:text-[#FF7A00]">
                Чати
              </Link>
              <Link
                href={`/profile/${session.user.id}`}
                className="flex items-center gap-2"
              >
                <img
                  src={session.user.image || "/default-avatar.png"}
                  alt="avatar"
                  className="h-8 w-8 rounded-full border"
                />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Увійти
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm px-4 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-orange-600"
              >
                Реєстрація
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
