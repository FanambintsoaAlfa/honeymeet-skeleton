import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const secretKey = process.env.STRIPE_SECRET_KEY?.trim()
    const priceId = process.env.STRIPE_PRICE_ID
    if (!secretKey || !priceId) {
      console.error("Stripe : STRIPE_SECRET_KEY ou STRIPE_PRICE_ID manquant")
      return NextResponse.json(
        { error: "Le paiement par carte n'est pas encore configuré." },
        { status: 503 }
      )
    }
    if (process.env.NODE_ENV === "production" && !/^(sk|rk)_live_/.test(secretKey)) {
      console.error("Stripe : clé API non LIVE en production")
      return NextResponse.json(
        { error: "Le paiement par carte n'est pas configuré en mode réel." },
        { status: 503 }
      )
    }

    const stripe = new Stripe(secretKey)
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/subscription?paiement=ok`,
      cancel_url: `${origin}/subscription?paiement=annule`,
      client_reference_id: session.user.id,
      metadata: { userId: session.user.id },
    })

    if (!checkout.url) {
      return NextResponse.json({ error: "Session de paiement invalide" }, { status: 502 })
    }

    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount: checkout.amount_total ?? 0,
        currency: (checkout.currency ?? "usd").toUpperCase(),
        paymentMethod: "STRIPE",
        status: "PENDING",
        stripeSessionId: checkout.id,
      },
    })

    return NextResponse.json({ url: checkout.url })
  } catch (error) {
    console.error("Erreur Stripe :", error instanceof Error ? error.message : "inconnue")
    return NextResponse.json({ error: "Erreur lors de la création du paiement" }, { status: 500 })
  }
}
