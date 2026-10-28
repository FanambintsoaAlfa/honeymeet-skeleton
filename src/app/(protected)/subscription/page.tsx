"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleStripe(plan: string) {
    setLoading(true)
    setMessage("")

    const res = await fetch("/api/payments/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      setMessage("Erreur lors de la création du paiement Stripe")
      setLoading(false)
    }
  }

  async function handleMobileMoney(method: string) {
    setLoading(true)
    setMessage("")

    const res = await fetch("/api/payments/mobile-money", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 15000,
        paymentMethod: method,
      }),
    })

    const data = await res.json()

    if (data.success) {
      setMessage("Paiement Mobile Money enregistré. En attente de validation.")
    } else {
      setMessage(data.error || "Erreur")
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Passer en Premium</h1>
      <p className="text-gray-500 mb-8">
        Débloquez toutes les fonctionnalités de HoneyMeet
      </p>

      {message && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-lg">
          {message}
        </div>
      )}

      <div className="grid gap-6">
        {/* Plan */}
        <div className="border rounded-2xl p-6 bg-white">
          <h2 className="text-xl font-semibold mb-2">Premium Mensuel</h2>
          <p className="text-3xl font-bold text-rose-600 mb-4">
            15 000 Ar <span className="text-sm font-normal text-gray-500">/ mois</span>
          </p>
          <ul className="text-sm text-gray-600 space-y-2 mb-6">
            <li>✓ Likes illimités</li>
            <li>✓ Voir qui vous a liké</li>
            <li>✓ Messagerie prioritaire</li>
            <li>✓ Badge Premium</li>
          </ul>

          <div className="space-y-3">
            <Button
              className="w-full"
              disabled={loading}
              onClick={() => handleStripe("monthly")}
            >
              Payer par Carte (Stripe)
            </Button>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                disabled={loading}
                onClick={() => handleMobileMoney("MVOLA")}
              >
                MVola
              </Button>
              <Button
                variant="outline"
                disabled={loading}
                onClick={() => handleMobileMoney("ORANGE_MONEY")}
              >
                Orange
              </Button>
              <Button
                variant="outline"
                disabled={loading}
                onClick={() => handleMobileMoney("AIRTEL_MONEY")}
              >
                Airtel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}