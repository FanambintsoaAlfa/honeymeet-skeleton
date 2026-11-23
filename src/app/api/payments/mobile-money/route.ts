import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { MOBILE_MONEY_METHODS, PREMIUM_PRICE_MGA, type MobileMoneyMethod } from "@/lib/premium"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    const paymentMethod = body?.paymentMethod as MobileMoneyMethod | undefined

    if (!paymentMethod || !MOBILE_MONEY_METHODS.includes(paymentMethod)) {
      return NextResponse.json({ error: "Moyen de paiement invalide" }, { status: 400 })
    }

    // Le montant vient du serveur, jamais du navigateur
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount: PREMIUM_PRICE_MGA,
        currency: "MGA",
        paymentMethod,
        status: "PENDING",
      },
    })

    // Validation ensuite par webhook opérateur ou manuellement par un administrateur
    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      message: "Paiement en attente de validation",
    })
  } catch (error) {
    console.error("Erreur paiement Mobile Money :", error instanceof Error ? error.message : "inconnue")
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
