"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      const res = await signIn("credentials", {
        emailOrPhone: formData.get("emailOrPhone"),
        password: formData.get("password"),
        redirect: false,
      })

      if (!res || res.error) {
        setError("Email/Téléphone ou mot de passe incorrect")
        setLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Erreur de connexion. Réessayez.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Partie gauche - Message */}
        <div className="md:w-1/2 bg-gradient-to-br from-rose-500 to-pink-600 p-10 text-white flex flex-col justify-center relative order-2 md:order-1">
          <div className="absolute top-6 left-6 text-4xl">🐝💘</div>
          
          <h1 className="text-3xl font-bold mb-4">Content de vous revoir !</h1>
          <p className="text-rose-100 text-sm leading-relaxed">
            Connectez-vous pour retrouver vos matchs,  
            continuer vos conversations et découvrir de nouvelles personnes.
          </p>

          <div className="mt-10 text-6xl opacity-20 absolute bottom-6 right-6">
            🐝
          </div>
        </div>

        {/* Partie droite - Formulaire */}
        <div className="md:w-1/2 p-8 md:p-10 order-1 md:order-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Connexion</h2>
          <p className="text-sm text-gray-500 mb-6">Accédez à votre compte HoneyMeet</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email ou Téléphone
              </label>
              <input
                name="emailOrPhone"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="email@exemple.com ou +261..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-rose-600 font-medium hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}