"use client"

import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)
    const form = e.currentTarget

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 20000)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          emailOrPhone: formData.get("emailOrPhone"),
          password: formData.get("password"),
          userType: formData.get("userType"),
          firstName: formData.get("firstName"),
          gender: formData.get("gender") || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription")
        return
      }

      setSuccess("Compte créé avec succès. Vous pouvez maintenant vous connecter.")
      form.reset()
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") {
        setError("La création du compte prend trop de temps. Vérifiez votre connexion puis réessayez.")
      } else {
        setError("Impossible de contacter le serveur. Réessayez.")
      }
    } finally {
      window.clearTimeout(timeout)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Partie gauche - Message de bienvenue */}
        <div className="md:w-1/2 bg-gradient-to-br from-rose-500 to-pink-600 p-10 text-white flex flex-col justify-center relative">
          <div className="absolute top-6 left-6 text-4xl">🐝💘</div>
          
          <h1 className="text-3xl font-bold mb-4">Bienvenue sur HoneyMeet !</h1>
          <p className="text-rose-100 text-sm leading-relaxed">
            Trouvez l’amour à Madagascar et ailleurs.  
            Rejoignez notre communauté et commencez à matcher dès aujourd’hui.
          </p>

          <div className="mt-10 text-6xl opacity-20 absolute bottom-6 right-6">
            🐝
          </div>
        </div>

        {/* Partie droite - Formulaire */}
        <div className="md:w-1/2 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Créer un compte</h2>
          <p className="text-sm text-gray-500 mb-6">Rejoignez HoneyMeet</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                name="firstName"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Je suis</label>
              <select
                name="gender"
                required
                defaultValue=""
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="" disabled>Sélectionner</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type d&apos;utilisateur</label>
              <select
                name="userType"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="LOCAL">🇲🇬 Madagascar (Local)</option>
                <option value="INTERNATIONAL">🌍 International</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ou Téléphone</label>
              <input
                name="emailOrPhone"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="email@exemple.com ou +261..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && (
              <p role="status" className="text-sm text-green-700">
                {success}{" "}
                <Link href="/login" className="font-medium underline">
                  Se connecter
                </Link>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-rose-600 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}