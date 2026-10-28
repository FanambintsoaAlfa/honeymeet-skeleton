import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const matchId = searchParams.get("matchId")

  if (!matchId) return NextResponse.json({ error: "matchId requis" }, { status: 400 })

  const messages = await prisma.message.findMany({
    where: { matchId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, profile: { select: { firstName: true, mainPhoto: true } } } },
    },
  })

  return NextResponse.json({ messages })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { matchId, content } = await req.json()

  if (!matchId || !content) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: {
      matchId,
      senderId: session.user.id,
      content,
    },
  })

  return NextResponse.json({ message })
}
