import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { toUserId, type = "LIKE" } = await req.json()

  if (!toUserId) {
    return NextResponse.json({ error: "toUserId requis" }, { status: 400 })
  }

  await prisma.like.upsert({
    where: {
      fromUserId_toUserId: {
        fromUserId: session.user.id,
        toUserId,
      },
    },
    update: { type },
    create: {
      fromUserId: session.user.id,
      toUserId,
      type,
    },
  })

  const reciprocalLike = await prisma.like.findUnique({
    where: {
      fromUserId_toUserId: {
        fromUserId: toUserId,
        toUserId: session.user.id,
      },
    },
  })

  let isMatch = false

  if (reciprocalLike && reciprocalLike.type === "LIKE" && type === "LIKE") {
    const [user1Id, user2Id] = [session.user.id, toUserId].sort()

    await prisma.match.upsert({
      where: {
        user1Id_user2Id: { user1Id, user2Id },
      },
      update: {},
      create: { user1Id, user2Id },
    })
    isMatch = true
  }

  return NextResponse.json({ success: true, isMatch })
}