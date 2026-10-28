"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
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

export default function ChatPage() {
  const params = useParams()
  const matchId = params.matchId as string

  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function loadMessages() {
    try {
      const res = await fetch("/api/messages?matchId=" + matchId)
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [matchId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, content }),
    })

    setContent("")
    loadMessages()
  }

  if (loading) {
    return <div className="p-8 text-center">Chargement des messages...</div>
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto">
      <div className="p-4 border-b font-semibold">Conversation</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Aucun message. Dis bonjour !
          </p>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-2">
            <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-[80%]">
              <p className="text-sm font-medium text-rose-600">
                {msg.sender?.profile?.firstName || "Utilisateur"}
              </p>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écris un message..."
          className="flex-1 rounded-full border px-4 py-2 text-sm"
        />
        <Button type="submit" className="rounded-full">
          Envoyer
        </Button>
      </form>
    </div>
  )
}