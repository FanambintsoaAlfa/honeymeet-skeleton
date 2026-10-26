import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { emailOrPhone, password, userType, firstName } = body

    if (!emailOrPhone || !password) {
      return NextResponse.json({ error: "Email/Téléphone et mot de passe requis" }, { status: 400 })
    }

    const isEmail = emailOrPhone.includes("@")

    const existingUser = await prisma.user.findFirst({
      where: isEmail ? { email: emailOrPhone } : { phone: emailOrPhone },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Cet utilisateur existe déjà" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email: isEmail ? emailOrPhone : null,
        phone: !isEmail ? emailOrPhone : null,
        password: hashedPassword,
        userType: userType || "LOCAL",
        profile: {
          create: {
            firstName: firstName || null,
            country: userType === "LOCAL" ? "Madagascar" : null,
          },
        },
      },
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
