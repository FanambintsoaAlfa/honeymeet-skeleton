import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

const registerSchema = z.object({
  emailOrPhone: z.string().trim().min(3, "Email ou téléphone requis").max(120),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(100),
  userType: z.enum(["LOCAL", "INTERNATIONAL"]).default("LOCAL"),
  firstName: z.string().trim().max(50).optional(),
  gender: z.enum(["Homme", "Femme", "Autre"]).optional(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null)
    const parsed = registerSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      )
    }

    const { password, userType, firstName, gender } = parsed.data
    const identifier = parsed.data.emailOrPhone
    const isEmail = identifier.includes("@")
    // Les emails sont stockés en minuscules pour éviter les doublons "A@x.com" / "a@x.com"
    const normalized = isEmail ? identifier.toLowerCase() : identifier

    if (!isEmail && !/^(\+?[0-9][0-9 .-]{5,19})$/.test(normalized)) {
      return NextResponse.json(
        { error: "Numéro de téléphone invalide" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findFirst({
      where: isEmail ? { email: normalized } : { phone: normalized },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Cet utilisateur existe déjà" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email: isEmail ? normalized : null,
        phone: !isEmail ? normalized : null,
        password: hashedPassword,
        userType,
        profile: {
          create: {
            firstName: firstName || null,
            gender: gender ?? null,
            country: userType === "LOCAL" ? "Madagascar" : null,
          },
        },
      },
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error(
      "Erreur inscription :",
      error instanceof Error ? error.message : "Erreur inconnue"
    )

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Cet utilisateur existe déjà" },
        { status: 409 }
      )
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error.code === "P1001" || error.code === "P2024")
    ) {
      return NextResponse.json(
        { error: "La base de données est temporairement indisponible. Réessayez dans quelques instants." },
        { status: 503 }
      )
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
