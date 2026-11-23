import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "nodejs"

// Stripe appelle cette URL après un paiement. La signature est vérifiée avec
// STRIPE_WEBHOOK_SECRET : sans elle, n'importe qui pourrait s'offrir le Premium.
export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = req.headers.get("stripe-signature")

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 503 })
  }
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 })
  }

  const stripe = new Stripe(secretKey)
  const rawBody = await req.text() // corps brut obligatoire pour la vérification

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const checkout = event.data.object

      if (checkout.payment_status === "paid") {
        const transaction = await prisma.transaction.findFirst({
          where: { stripeSessionId: checkout.id },
        })

        if (transaction) {
          await prisma.$transaction([
            prisma.transaction.update({
              where: { id: transaction.id },
              data: { status: "SUCCESS" },
            }),
            prisma.user.update({
              where: { id: transaction.userId },
              data: { isPremium: true },
            }),
          ])
        }
      }
    }
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erreur webhook Stripe :", error instanceof Error ? error.message : "inconnue")
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
