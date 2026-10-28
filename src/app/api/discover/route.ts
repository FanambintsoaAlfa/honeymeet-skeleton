import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  // Récupérer les IDs déjà likés
  const alreadyLiked = await prisma.like.findMany({
    where: { fromUserId: session.user.id },
    select: { toUserId: true },
  })
  const excludedIds = alreadyLiked.map((l) => l.toUserId)
  excludedIds.push(session.user.id)

  const profiles = await prisma.profile.findMany({
    where: {
      userId: { notIn: excludedIds },
    },
    include: {
      user: {
        select: { id: true, userType: true, isPremium: true },
      },
    },
    take: 20,
  })

  return NextResponse.json({ profiles })
}
