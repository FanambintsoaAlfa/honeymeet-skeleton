import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const LIKE_TYPES = ["LIKE", "DISLIKE", "SUPERLIKE"] as const
type LikeType = (typeof LIKE_TYPES)[number]

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    const userId = session.user.id

    const body = await req.json().catch(() => null)
    const toUserId = body?.toUserId
    const type: LikeType = body?.type ?? "LIKE"

    if (typeof toUserId !== "string" || !toUserId) {
      return NextResponse.json({ error: "toUserId requis" }, { status: 400 })
    }
    if (!LIKE_TYPES.includes(type)) {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 })
    }
    if (toUserId === userId) {
      return NextResponse.json({ error: "Action impossible sur votre propre profil" }, { status: 400 })
    }

    const target = await prisma.user.findUnique({ where: { id: toUserId }, select: { id: true } })
    if (!target) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    await prisma.like.upsert({
      where: { fromUserId_toUserId: { fromUserId: userId, toUserId } },
      update: { type },
      create: { fromUserId: userId, toUserId, type },
    })

    const reciprocalLike = await prisma.like.findUnique({
      where: { fromUserId_toUserId: { fromUserId: toUserId, toUserId: userId } },
    })

    const positive = (t: string) => t === "LIKE" || t === "SUPERLIKE"
    let isMatch = false

    if (reciprocalLike && positive(reciprocalLike.type) && positive(type)) {
      const [user1Id, user2Id] = [userId, toUserId].sort()
      await prisma.match.upsert({
        where: { user1Id_user2Id: { user1Id, user2Id } },
        update: {},
        create: { user1Id, user2Id },
      })
      isMatch = true
    }

    return NextResponse.json({ success: true, isMatch })
  } catch (error) {
    console.error("Erreur like :", error instanceof Error ? error.message : "inconnue")
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
