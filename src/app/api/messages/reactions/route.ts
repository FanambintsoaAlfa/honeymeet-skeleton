import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const allowedEmojis = new Set(["❤️", "😂", "😍", "😘", "🔥", "👍", "😢"])

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const messageId = typeof body?.messageId === "string" ? body.messageId : ""
  const emoji = typeof body?.emoji === "string" ? body.emoji : ""

  if (!messageId || !allowedEmojis.has(emoji)) {
    return NextResponse.json({ error: "Réaction invalide" }, { status: 400 })
  }

  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { matchId: true },
    })
    if (!message) {
      return NextResponse.json({ error: "Message introuvable" }, { status: 404 })
    }

    const match = await prisma.match.findFirst({
      where: {
        id: message.matchId,
        OR: [{ user1Id: session.user.id }, { user2Id: session.user.id }],
      },
      select: { id: true },
    })
    if (!match) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const existing = await prisma.messageReaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId: session.user.id,
          emoji,
        },
      },
    })

    if (existing) {
      await prisma.messageReaction.delete({ where: { id: existing.id } })
      return NextResponse.json({ active: false })
    }

    await prisma.messageReaction.create({
      data: { messageId, userId: session.user.id, emoji },
    })
    return NextResponse.json({ active: true })
  } catch (error) {
    console.error(
      "Erreur réaction message :",
      error instanceof Error ? error.message : "inconnue"
    )
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
