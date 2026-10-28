import { auth } from "@/lib/auth"
import { s3Client, BUCKET_NAME } from "@/lib/s3"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Max 5MB" }, { status: 400 })

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format non autorisé" }, { status: 400 })
    }

    const extension = file.name.split(".").pop()
    const fileName = `users/${session.user.id}/${uuidv4()}.${extension}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }))

    const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`

    if (type === "main") {
      await prisma.profile.update({
        where: { userId: session.user.id },
        data: { mainPhoto: imageUrl },
      })
    }

    return NextResponse.json({ success: true, url: imageUrl })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 })
  }
}
