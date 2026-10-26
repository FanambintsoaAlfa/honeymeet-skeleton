"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    gender: "",
    lookingFor: "",
    city: "",
    country: "Madagascar",
  })

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setForm({
            firstName: data.profile.firstName || "",
            lastName: data.profile.lastName || "",
            bio: data.profile.bio || "",
            gender: data.profile.gender || "",
            lookingFor: data.profile.lookingFor || "",
            city: data.profile.city || "",
            country: data.profile.country || "Madagascar",
          })
        }
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push("/profile")
      router.refresh()
    } else {
      alert("Erreur lors de la mise à jour")
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Modifier mon profil</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Je recherche</label>
            <select
              value={form.lookingFor}
              onChange={(e) => setForm({ ...form, lookingFor: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Sélectionner</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Les deux">Les deux</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ville</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Antananarivo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pays</label>
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Parlez un peu de vous..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}