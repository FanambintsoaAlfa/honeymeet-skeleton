import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 inline-block rounded-xl bg-white/85 px-4 py-3 backdrop-blur-sm">
        <h1 className="mb-1 text-2xl font-bold">Bonjour 👋</h1>
        <p className="text-gray-600">Bienvenue sur HoneyMeet</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/search"
          className="p-6 bg-white/90 border rounded-2xl hover:shadow-md transition"
        >
          <div className="text-3xl mb-2">🔍</div>
          <h2 className="font-semibold">Découvrir</h2>
          <p className="text-sm text-gray-500">Trouver des profils</p>
        </Link>

        <Link
          href="/matches"
          className="p-6 bg-white/90 border rounded-2xl hover:shadow-md transition"
        >
          <div className="text-3xl mb-2">💕</div>
          <h2 className="font-semibold">Mes Matchs</h2>
          <p className="text-sm text-gray-500">Voir vos matchs</p>
        </Link>

        <Link
          href="/messages"
          className="p-6 bg-white/90 border rounded-2xl hover:shadow-md transition"
        >
          <div className="text-3xl mb-2">💬</div>
          <h2 className="font-semibold">Messages</h2>
          <p className="text-sm text-gray-500">Vos conversations</p>
        </Link>

        <Link
          href="/profile"
          className="p-6 bg-white/90 border rounded-2xl hover:shadow-md transition"
        >
          <div className="text-3xl mb-2">👤</div>
          <h2 className="font-semibold">Mon Profil</h2>
          <p className="text-sm text-gray-500">Gérer mon profil</p>
        </Link>
      </div>
    </div>
  )
}