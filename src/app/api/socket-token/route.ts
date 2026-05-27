import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const token = jwt.sign({ id: session.user.id }, process.env.NEXTAUTH_SECRET!, { expiresIn: '1h' })
  return NextResponse.json({ token })
}
