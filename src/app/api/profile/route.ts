import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { user: true },
  })

  return NextResponse.json({ profile })
}

export async function PUT(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await req.json()

  const profile = await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      bio: body.bio,
      gender: body.gender,
      lookingFor: body.lookingFor,
      city: body.city,
      country: body.country,
    },
  })

  return NextResponse.json({ profile })
}