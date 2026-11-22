"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type Conversation = {
  id: string
  user: {
    id: string
    profile: {
      firstName: string | null
      mainPhoto: string | null
    } | null
  }
  lastMessage: {
    content: string
    createdAt: string
  } | null
}

type Message = {
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

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Conversation | null>(null)
  const [userId, setUserId] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showEmojis, setShowEmojis] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const loadMessages = useCallback(async (matchId: string) => {
    try {
      const res = await fetch(
        `/api/messages?matchId=${encodeURIComponent(matchId)}`
      )
      const data = await res.json()

      if (res.ok) {
        setMessages(data.messages)
      } else {
        setError(data.error || "Impossible de charger les messages")
      }
    } catch {
      setError("Erreur de connexion")
    }
  }, [])

  useEffect(() => {
    async function loadConversations() {
      try {
        const [matchRes, sessionRes] = await Promise.all([
          fetch("/api/matches"),
          fetch("/api/auth/session")
        ])

        const matchData = await matchRes.json()
        const sessionData = await sessionRes.json()

        if (!matchRes.ok) {
          throw new Error(matchData.error || "Erreur de chargement")
        }

        setConversations(matchData.conversations || [])
        setUserId(sessionData?.user?.id || "")
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur de chargement"
        )
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [])

  useEffect(() => {
    if (!selected) return

    loadMessages(selected.id)

    const interval = setInterval(() => {
      loadMessages(selected.id)
    }, 4000)

    return () => clearInterval(interval)
  }, [selected, loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, selected])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()

    if (!selected || !content.trim()) return

    const text = content.trim()
    setContent("")
    setError("")

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          matchId: selected.id,
          content: text
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Envoi impossible")
      }

      await loadMessages(selected.id)
    } catch (err) {
      setContent(text)
      setError(
        err instanceof Error ? err.message : "Erreur d'envoi"
      )
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="mb-6 inline-block rounded-lg bg-white/80 px-3 py-2 text-3xl font-bold text-gray-800 backdrop-blur-sm">
        💬 Messages
      </h1>

      {error && (
        <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </p>
      )}

      <div className="grid min-h-[650px] overflow-hidden rounded-3xl border border-pink-100 bg-white/95 shadow-xl md:grid-cols-[300px_1fr]">

        {/* Liste des conversations */}
        <aside className="border-b border-pink-100 md:border-b-0 md:border-r">
          <div className="border-b border-pink-100 p-4 font-bold text-gray-800">
            Mes conversations
          </div>

          {conversations.length === 0 ? (
            <p className="p-5 text-sm text-gray-500">
              Aucun Match pour le moment.
              Trouvez des personnes et créez un Match pour discuter !
            </p>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => {
                  setSelected(conversation)
                  setMessages([])
                  setError("")
                  setShowEmojis(false)
                }}
                className={`flex w-full items-center gap-3 border-b border-pink-50 p-4 text-left transition-colors hover:bg-pink-50 ${
                  selected?.id === conversation.id
                    ? "bg-pink-50 ring-1 ring-inset ring-pink-100"
                    : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    conversation.user.profile?.mainPhoto ||
                    "/images/avatar-homme.jpg"
                  }
                  alt="Profil"
                  className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                />

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800">
                    {conversation.user.profile?.firstName || "Utilisateur"}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {conversation.lastMessage?.content ||
                      "Commencez à discuter"}
                  </p>
                </div>
              </button>
            ))
          )}
        </aside>

        {/* Zone de discussion */}
        <section className="flex min-h-[500px] flex-col">
          {!selected ? (
            <div className="flex flex-1 items-center justify-center p-6 text-center text-gray-400">
              Sélectionnez une conversation pour commencer.
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-pink-100 bg-white/95 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    selected.user.profile?.mainPhoto ||
                    "/images/avatar-homme.jpg"
                  }
                  alt="Profil"
                  className="h-11 w-11 rounded-full border-2 border-pink-100 object-cover"
                />
                <div>
                  <h2 className="font-bold text-gray-800">
                    {selected.user.profile?.firstName || "Utilisateur"}
                  </h2>
                  <p className="text-xs text-gray-500">Conversation</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-gradient-to-b from-pink-50/50 to-white p-4">
                {messages.map((message) => {
                  const mine = message.senderId === userId

                  return (
                    <div
                      key={message.id}
                      className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                        mine
                          ? "self-end rounded-br-md bg-pink-600 text-white"
                          : "self-start rounded-bl-md bg-white text-gray-800 ring-1 ring-gray-100"
                      }`}
                    >
                      <p className="break-words">
                        {message.content}
                      </p>
                      <p className="mt-1 text-right text-xs opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString(
                          "fr-FR",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </p>
                    </div>
                  )
                })}
                {messages.length === 0 && (
                  <div className="m-auto max-w-sm text-center">
                    <div className="mb-3 text-4xl">👋</div>
                    <p className="font-semibold text-gray-700">Commencez la conversation</p>
                    <p className="mt-1 text-sm text-gray-500">Envoyez un premier message ou ajoutez un emoji.</p>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <form
                onSubmit={sendMessage}
                className="relative flex items-center gap-2 border-t border-pink-100 bg-white p-3 md:p-4"
              >
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
                  placeholder="Écrire un message..."
                  className="min-w-0 flex-1 rounded-full border px-4 py-3 outline-none focus:border-pink-500"
                />

                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="rounded-full bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700 disabled:opacity-50"
                >
                  Envoyer
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  )
}