"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  sender: {
    id: string
    profile: {
      firstName: string | null
      mainPhoto: string | null
    } | null
  }
}

const emojis = ["😀", "😂", "🥰", "😍", "😘", "😊", "😉", "😎", "🥹", "😢", "😮", "👍", "👏", "🙌", "🎉", "❤️", "💕", "🔥", "✨", "🍯"]

export default function ChatPage() {
  const params = useParams()
  const matchId = params.matchId as string

  const [messages, setMessages] = useState<Message[]>([])
  const [currentUserId, setCurrentUserId] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showEmojis, setShowEmojis] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/messages?matchId=" + encodeURIComponent(matchId))
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data.error || "Impossible de charger les messages")
        return
      }

      setError("")
      setMessages(data.messages || [])
      setCurrentUserId(data.currentUserId || "")
    } catch {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }, [matchId])

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const text = content.trim()
    if (!text) return

    setContent("")
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, content: text }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setContent(text) // on rend le texte pour ne rien perdre
        setError(data.error || "Envoi impossible")
        return
      }
      await loadMessages()
    } catch {
      setContent(text)
      setError("Erreur de connexion")
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <span className="rounded-lg bg-white/90 px-4 py-2">Chargement des messages...</span>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-10rem)] min-h-[400px] max-w-2xl flex-col overflow-hidden rounded-3xl border border-pink-100 bg-white/95 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-pink-100 p-4 font-semibold">
        <span>Conversation</span>
        <Link href="/matches" className="text-sm font-normal text-rose-600 hover:underline">
          ← Mes matchs
        </Link>
      </div>

      {error && <p className="bg-red-100 px-4 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-pink-50/50 to-white p-4">
        {messages.length === 0 && (
          <div className="mt-10 text-center">
            <div className="mb-3 text-4xl">👋</div>
            <p className="font-semibold text-gray-700">Aucun message</p>
            <p className="mt-1 text-sm text-gray-500">Dis bonjour pour commencer la conversation.</p>
          </div>
        )}

        {messages.map((msg) => {
          const mine = msg.senderId === currentUserId
          return (
            <div key={msg.id} className={`flex gap-2 ${mine ? "justify-end" : ""}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                  mine ? "rounded-br-md bg-rose-600 text-white" : "rounded-bl-md bg-white text-gray-800 ring-1 ring-gray-100"
                }`}
              >
                {!mine && (
                  <p className="text-sm font-medium text-rose-600">
                    {msg.sender?.profile?.firstName || "Utilisateur"}
                  </p>
                )}
                <p className="break-words">{msg.content}</p>
                <p className={`mt-1 text-right text-xs ${mine ? "text-white/70" : "text-gray-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="relative flex items-center gap-2 border-t border-pink-100 p-3 md:p-4">
        <button
          type="button"
          onClick={() => setShowEmojis((current) => !current)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl hover:bg-pink-50"
          aria-label="Ajouter un emoji"
          aria-expanded={showEmojis}
        >
          😊
        </button>
        {showEmojis && (
          <div className="absolute bottom-[calc(100%-4px)] left-3 z-20 grid grid-cols-10 gap-1 rounded-2xl border border-pink-100 bg-white p-3 shadow-xl max-[520px]:grid-cols-5">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setContent((current) => `${current}${emoji}`)
                  setShowEmojis(false)
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl transition-transform hover:bg-pink-50 hover:scale-110"
                aria-label={`Ajouter ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écris un message..."
          maxLength={2000}
          className="flex-1 rounded-full border px-4 py-2 text-sm"
        />
        <Button type="submit" className="rounded-full">
          Envoyer
        </Button>
      </form>
    </div>
  )
}
