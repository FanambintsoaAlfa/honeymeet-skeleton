"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo (même limite que le serveur)
const ALLOWED_EXT = [".jpg", ".jpeg", ".jfif", ".png", ".webp"]

export default function PhotoUpload() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  function fail(text: string) {
    setMessage(text)
    setIsError(true)
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    setMessage("")
    setIsError(false)

    if (!selected) {
      setFile(null)
      return
    }

    const name = selected.name.toLowerCase()
    if (!ALLOWED_EXT.some((ext) => name.endsWith(ext))) {
      fail("Format non autorisé. Utilisez une image JPG, PNG ou WebP.")
      setFile(null)
      e.target.value = ""
      return
    }
    if (selected.size > MAX_SIZE) {
      fail("Photo trop lourde (maximum 5 Mo).")
      setFile(null)
      e.target.value = ""
      return
    }
    setFile(selected)
  }

  async function handleUpload() {
    if (!file) {
      fail("Choisis d'abord une photo.")
      return
    }

    setLoading(true)
    setMessage("")
    setIsError(false)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "main")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      // La réponse peut ne pas être du JSON (ex. page d'erreur) : on reste prudent
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || "Échec de l'envoi")
      }

      setMessage("Photo ajoutée avec succès !")
      setIsError(false)
      setFile(null)
      router.refresh()
    } catch (error) {
      fail(error instanceof Error ? error.message : "Une erreur est survenue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        Ajouter ou modifier ma photo
      </label>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.jfif,.png,.webp"
        onChange={handleSelect}
        className="block w-full text-sm"
      />

      {file && (
        <p className="text-sm text-gray-500">Photo sélectionnée : {file.name}</p>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || loading}
        className="rounded-lg bg-rose-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Envoi en cours..." : "Envoyer ma photo"}
      </button>

      {message && (
        <p className={`text-sm ${isError ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  )
}
