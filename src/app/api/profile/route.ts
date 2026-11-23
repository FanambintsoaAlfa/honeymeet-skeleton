import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const profileSchema = z.object({
  firstName: z.string().trim().max(50).optional(),
  lastName: z.string().trim().max(50).optional(),
  bio: z.string().trim().max(1000).optional(),
  gender: z.enum(["Homme", "Femme", "Autre", ""]).optional(),
  lookingFor: z.enum(["Homme", "Femme", "Les deux", ""]).optional(),
  city: z.string().trim().max(80).optional(),
  country: z.string().trim().max(80).optional(),
})

// Une chaîne vide enregistrée = champ non renseigné (null en base)
const emptyToNull = (v: string | undefined) => (v === undefined ? undefined : v || null)

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json({ profile })
}

export async function PUT(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }
  const userId = session.user.id

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 })
  }

  const parsed = profileSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides. Vérifiez les champs du formulaire." },
      { status: 400 }
    )
  }

  const d = parsed.data
  // Seuls les champs autorisés sont écrits (mainPhoto n'est modifiable que par /api/upload)
  const data = {
    firstName: emptyToNull(d.firstName),
    lastName: emptyToNull(d.lastName),
    bio: emptyToNull(d.bio),
    gender: emptyToNull(d.gender),
    lookingFor: emptyToNull(d.lookingFor),
    city: emptyToNull(d.city),
    country: emptyToNull(d.country),
  }

  try {
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    })
    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Erreur PUT profil :", error instanceof Error ? error.message : "inconnue")
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
