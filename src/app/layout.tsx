import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hamer Money – IT фріланс біржа",
  description: "Знаходьте виконавців або роботу в IT",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="border-t py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Hamer Money. Усі права захищені.
        </footer>
      </body>
    </html>
  )
}
