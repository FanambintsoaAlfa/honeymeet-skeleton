import { auth } from "@/lib/auth"
import cloudinary, { isCloudinaryConfigured } from "@/lib/cloudinary"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import type { UploadApiResponse } from "cloudinary"

export const runtime = "nodejs"

const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo

/** Détecte le vrai format à partir des premiers octets (ne fait pas confiance à file.type). */
function detectImageType(buf: Buffer): "jpeg" | "png" | "webp" | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg"
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) return "png"
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) return "webp"
  return null
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    const userId = session.user.id

    if (!isCloudinaryConfigured()) {
      console.error("Cloudinary : variables d'environnement manquantes")
      return NextResponse.json(
        { error: "Le service photo n'est pas configuré. Contactez l'administrateur." },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file")
    const type = formData.get("type")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }
    if (type !== "main") {
      return NextResponse.json({ error: "Type de photo invalide" }, { status: 400 })
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Le fichier est vide" }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Taille maximale : 5 Mo" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    if (!detectImageType(buffer)) {
      return NextResponse.json(
        { error: "Format non autorisé. Utilisez une image JPG, PNG ou WebP." },
        { status: 400 }
      )
    }

    // Dossier : honeymeet/users/<id>. Une seule photo principale par utilisateur
    // (public_id fixe + overwrite) : pas d'accumulation de fichiers inutiles.
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `honeymeet/users/${userId}`,
          public_id: "main",
          overwrite: true,
          invalidate: true,
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
          // Limite la taille stockée (photo de profil) tout en gardant la qualité
          transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }],
        },
        (error, uploaded) => {
          if (error || !uploaded) reject(error ?? new Error("Réponse Cloudinary vide"))
          else resolve(uploaded)
        }
      )
      stream.end(buffer)
    })

    const imageUrl = result.secure_url

    // Profil + table Photo mis à jour ensemble (tout ou rien)
    await prisma.$transaction([
      prisma.profile.upsert({
        where: { userId },
        update: { mainPhoto: imageUrl },
        create: { userId, mainPhoto: imageUrl },
      }),
      prisma.photo.deleteMany({ where: { userId, isMain: true } }),
      prisma.photo.create({ data: { userId, url: imageUrl, isMain: true } }),
    ])

    return NextResponse.json({
      success: true,
      url: imageUrl,
      publicId: result.public_id,
    })
  } catch (error) {
    // On journalise le message d'erreur seulement (jamais les clés)
    console.error(
      "Erreur upload Cloudinary :",
      error instanceof Error ? error.message : "inconnue"
    )
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'image. Réessayez." },
      { status: 500 }
    )
  }
}
