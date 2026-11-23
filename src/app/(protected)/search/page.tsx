"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getProfilePhoto } from "@/lib/avatar"

interface Profile {
  id: string
  firstName: string | null
  bio: string | null
  gender: string | null
  city: string | null
  country: string | null
  mainPhoto: string | null
  user: {
    id: string
    userType: string
    isPremium: boolean
  }
}

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/discover")
      .then((res) => {
        if (!res.ok) throw new Error("load")
        return res.json()
      })
      .then((data) => {
        setProfiles(data.profiles || [])
        setLoading(false)
      })
      .catch(() => {
        setError("Impossible de charger les profils.")
        setLoading(false)
      })
  }, [])

  async function handleLike(type: "LIKE" | "DISLIKE") {
    const current = profiles[currentIndex]
    if (!current) return

    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toUserId: current.user.id,
          type,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || "Action impossible, réessayez.")
        return
      }

      if (data.isMatch) {
        setMessage("C'est un Match 🎉")
      }

      // Passer au profil suivant
      setCurrentIndex((prev) => prev + 1)
    } catch {
      setError("Erreur de connexion. Réessayez.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="rounded-lg bg-white/90 px-4 py-2">Chargement des profils...</p>
      </div>
    )
  }

  const current = profiles[currentIndex]

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="rounded-lg bg-white/90 px-4 py-2 text-xl">
          {error || "Plus de profils pour le moment"}
        </p>
        <Button onClick={() => window.location.reload()}>Actualiser</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="mb-6 rounded-lg bg-white/80 px-3 py-2 text-center text-2xl font-bold backdrop-blur-sm">Découvrir</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-rose-100 text-rose-700 rounded-lg text-center">
          {message}
        </div>
      )}

      <div className="bg-white/95 rounded-2xl border shadow-sm overflow-hidden">
        {/* Photo */}
        <div className="h-80 bg-rose-50 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getProfilePhoto(current)}
            alt={current.firstName || "Photo"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Infos */}
        <div className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {current.firstName || "Anonyme"}
            </h2>
            {current.user.isPremium && (
              <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">
                Premium
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500">
            {current.city || "Ville non renseignée"} • {current.country || "Madagascar"}
          </p>

          <p className="text-sm text-gray-700 mt-2">
            {current.bio || "Pas encore de bio."}
          </p>
        </div>

        {/* Boutons */}
        <div className="flex gap-4 p-5 pt-0">
          <Button
            variant="outline"
            className="flex-1 h-12 text-lg"
            onClick={() => handleLike("DISLIKE")}
          >
            ✕
          </Button>
          <Button
            className="flex-1 h-12 text-lg bg-rose-500 hover:bg-rose-600"
            onClick={() => handleLike("LIKE")}
          >
            ♥
          </Button>
        </div>
        <div className="px-5 pb-5">
          <a
            href={`/api/profiles/${current.id}/download`}
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-amber-300 bg-amber-50 px-4 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
          >
            Télécharger la fiche
          </a>
        </div>
      </div>
    </div>
  )
}