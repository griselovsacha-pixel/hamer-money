import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    if (!email || !password || password.length < 8) {
      return NextResponse.json({ message: "Некоректні дані" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: "Користувач з таким email вже існує" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    })

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Внутрішня помилка сервера" }, { status: 500 })
  }
}
