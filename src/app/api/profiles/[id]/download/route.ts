import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"

export const runtime = "nodejs"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { id } = await params
    const [user, activeSubscription] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isPremium: true },
      }),
      prisma.premiumSubscription.findFirst({
        where: {
          userId: session.user.id,
          status: "ACTIVE",
          expiresAt: { gt: new Date() },
        },
        select: { id: true },
      }),
    ])

    if (!user?.isPremium && !activeSubscription) {
      return NextResponse.json(
        { error: "Téléchargement réservé aux membres Premium ou VIP" },
        { status: 403 }
      )
    }

    const since = new Date()
    since.setUTCHours(0, 0, 0, 0)
    const downloadsToday = await prisma.profileDownload.count({
      where: { userId: session.user.id, createdAt: { gte: since } },
    })
    if (downloadsToday >= 10) {
      return NextResponse.json(
        { error: "Limite quotidienne atteinte : 10 téléchargements par jour." },
        { status: 429 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            privacy: true,
          },
        },
      },
    })
    if (!profile || profile.userId === session.user.id) {
      return NextResponse.json({ error: "Profil introuvable" }, { status: 404 })
    }

    const chunks: Buffer[] = []
    const document = new PDFDocument({ size: "A4", margin: 48, info: { Title: "Fiche HoneyMeet" } })
    document.on("data", (chunk: Buffer) => chunks.push(chunk))
    const pdfFinished = new Promise<Buffer>((resolve, reject) => {
      document.on("end", () => resolve(Buffer.concat(chunks)))
      document.on("error", reject)
    })

    document.fontSize(28).fillColor("#e11d48").text("HoneyMeet", { align: "left" })
    document.moveDown(0.25)
    document.fontSize(18).fillColor("#111827").text(profile.firstName || "Membre HoneyMeet")
    document.moveDown()
    document.fontSize(11).fillColor("#4b5563")

    if (profile.user.privacy?.showLocation !== false) {
      document.text(`Localisation : ${profile.city || "Non renseignée"}${profile.country ? `, ${profile.country}` : ""}`)
    }
    if (profile.user.privacy?.showBirthDate && profile.birthDate) {
      const now = new Date()
      const birthDate = profile.birthDate
      const age =
        now.getFullYear() -
        birthDate.getFullYear() -
        (now.getMonth() < birthDate.getMonth() ||
        (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())
          ? 1
          : 0)
      if (age >= 0 && age <= 120) document.text(`Âge : ${age} ans`)
    }
    if (profile.bio) document.moveDown().text(`À propos : ${profile.bio}`)
    if (profile.user.privacy?.showInterests !== false && profile.interests.length) {
      document.moveDown().text(`Centres d'intérêt : ${profile.interests.join(", ")}`)
    }
    document.moveDown(2)
    document.fontSize(9).fillColor("#9ca3af").text(`Fiche générée le ${new Date().toLocaleString("fr-FR")}`)
    document.end()

    const pdf = await pdfFinished
    const pdfBody = Uint8Array.from(pdf).buffer
    await prisma.profileDownload.create({
      data: { userId: session.user.id, profileId: profile.id },
    })
    const filename = encodeURIComponent(`honeymeet-${profile.firstName || "profil"}.pdf`)
    return new NextResponse(pdfBody, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${filename}`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error(
      "Erreur téléchargement profil :",
      error instanceof Error ? error.message : "inconnue"
    )
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
