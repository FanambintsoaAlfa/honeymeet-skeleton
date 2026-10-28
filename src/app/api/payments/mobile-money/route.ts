import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { amount, paymentMethod, phoneNumber } = await req.json()

  if (!amount || !paymentMethod) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: session.user.id,
      amount,
      paymentMethod, // MVOLA, ORANGE_MONEY, AIRTEL_MONEY
      status: "PENDING",
    },
  })

  // Ici tu peux ajouter l'appel à l'API Mobile Money réelle plus tard
  // Pour l'instant on crée juste la transaction en PENDING

  return NextResponse.json({
    success: true,
    transactionId: transaction.id,
    message: "Paiement en attente de validation",
  })
}
