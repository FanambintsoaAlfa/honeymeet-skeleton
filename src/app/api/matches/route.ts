import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getProfilePhoto } from "@/lib/avatar"
import { NextResponse } from "next/server"

// Liste des conversations (un match = une conversation) avec le dernier message
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    const userId = session.user.id

    const matches = await prisma.match.findMany({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      include: {
        user1: { select: { id: true, profile: true } },
        user2: { select: { id: true, profile: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    })

    const conversations = matches
      .map((match) => {
        const other = match.user1Id === userId ? match.user2 : match.user1
        const last = match.messages[0] ?? null

        return {
          id: match.id,
          user: {
            id: other.id,
            profile: {
              firstName: other.profile?.firstName ?? null,
              // Avatar par défaut selon le genre si pas de vraie photo
              mainPhoto: getProfilePhoto(other.profile),
            },
          },
          lastMessage: last
            ? { content: last.content, createdAt: last.createdAt.toISOString() }
            : null,
          sortDate: (last?.createdAt ?? match.createdAt).getTime(),
        }
      })
      .sort((a, b) => b.sortDate - a.sortDate)
      .map((conversation) => ({
        id: conversation.id,
        user: conversation.user,
        lastMessage: conversation.lastMessage,
      }))

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Erreur GET matches :", error instanceof Error ? error.message : "inconnue")
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
