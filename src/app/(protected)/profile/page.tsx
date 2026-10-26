import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { user: true },
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mon Profil</h1>
          <p className="text-gray-500">Gérez vos informations</p>
        </div>
        <Link href="/profile/edit">
          <Button>Modifier le profil</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center text-3xl">
            {profile?.mainPhoto ? (
              <img
                src={profile.mainPhoto}
                alt="Photo de profil"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              "👤"
            )}
          </div>
          <div>
            <p className="font-medium text-lg">
              {profile?.firstName || "Non renseigné"}
            </p>
            <p className="text-sm text-gray-500">
              {profile?.user.userType === "LOCAL"
                ? "🇲🇬 Madagascar"
                : "🌍 International"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-gray-500 mb-1">Genre</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50">
              {profile?.gender || "—"}
            </div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Recherche</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50">
              {profile?.lookingFor || "—"}
            </div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Ville</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50">
              {profile?.city || "—"}
            </div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Pays</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50">
              {profile?.country || "—"}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-500 mb-1 text-sm">Bio</label>
          <div className="border rounded-md px-3 py-2 bg-gray-50 min-h-[80px]">
            {profile?.bio || "Aucune bio pour le moment."}
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm">
            Statut :{" "}
            <span className={profile?.user.isPremium ? "text-rose-600 font-medium" : "text-gray-500"}>
              {profile?.user.isPremium ? "Premium ✨" : "Gratuit"}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}