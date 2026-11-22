import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

/** Vérifie que l'utilisateur fait bien partie du match (sinon on refuse l'accès). */
async function findUserMatch(matchId: string, userId: string) {
  return prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
  })
}

// Récupérer les messages d'une conversation
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const matchId = new URL(req.url).searchParams.get("matchId")
    if (!matchId) {
      return NextResponse.json({ error: "matchId requis" }, { status: 400 })
    }

    const match = await findUserMatch(matchId, session.user.id)
    if (!match) {
      return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 })
    }

    const messages = await prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            profile: { select: { firstName: true, mainPhoto: true, gender: true } },
          },
        },
      },
    })

    // Messages de l'autre personne marqués comme lus
    await prisma.message.updateMany({
      where: { matchId, senderId: { not: session.user.id }, read: false },
      data: { read: true },
    })

    return NextResponse.json({ messages, currentUserId: session.user.id })
  } catch (error) {
    console.error("Erreur GET messages :", error instanceof Error ? error.message : "inconnue")
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// Envoyer un message
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    const matchId = body?.matchId
    const content = body?.content

    if (typeof matchId !== "string" || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }
    if (content.trim().length > 2000) {
      return NextResponse.json({ error: "Message trop long" }, { status: 400 })
    }

    const match = await findUserMatch(matchId, session.user.id)
    if (!match) {
      return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 })
    }

    const message = await prisma.message.create({
      data: { matchId, senderId: session.user.id, content: content.trim() },
    })

    return NextResponse.json({ success: true, message }, { status: 201 })
  } catch (error) {
    console.error("Erreur POST messages :", error instanceof Error ? error.message : "inconnue")
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
