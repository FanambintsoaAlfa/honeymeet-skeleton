"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailOrPhone: formData.get("emailOrPhone"),
        password: formData.get("password"),
        userType: formData.get("userType"),
        firstName: formData.get("firstName"),
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Erreur lors de l'inscription")
      setLoading(false)
      return
    }

    router.push("/login")
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-sm border">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="text-sm text-gray-500 mt-1">Rejoignez HoneyMeet</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <input
              name="firstName"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Votre prénom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type d'utilisateur</label>
            <select name="userType" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="LOCAL">🇲🇬 Madagascar (Local)</option>
              <option value="INTERNATIONAL">🌍 International</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email ou Téléphone</label>
            <input
              name="emailOrPhone"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="email@exemple.com ou +261..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-rose-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}