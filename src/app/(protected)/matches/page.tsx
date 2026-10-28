import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function MatchesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { user1Id: session.user.id },
        { user2Id: session.user.id },
      ],
    },
    include: {
      user1: {
        include: { profile: true },
      },
      user2: {
        include: { profile: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Mes Matchs</h1>

      {matches.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">Aucun match pour le moment</p>
          <p className="text-sm mt-2">Continue de liker des profils !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => {
            const otherUser =
              match.user1Id === session.user.id ? match.user2 : match.user1
            const profile = otherUser.profile

            return (
              <Link
                key={match.id}
                href={`/messages/${match.id}`}
                className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:bg-gray-50 transition"
              >
                <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center overflow-hidden">
                  {profile?.mainPhoto ? (
                    <img
                      src={profile.mainPhoto}
                      alt={profile.firstName || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">👤</span>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium">
                    {profile?.firstName || "Utilisateur"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {profile?.city || "Madagascar"}
                  </p>
                </div>

                <span className="text-rose-500 text-sm">Message →</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}