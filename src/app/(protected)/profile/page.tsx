import PhotoUpload from "@/components/profile/PhotoUpload"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getProfilePhoto } from "@/lib/avatar"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <span className="mb-1 block text-gray-500">{label}</span>
      <div className="rounded-md border bg-gray-50 px-3 py-2">{value || "—"}</div>
    </div>
  )
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const [user, profile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { userType: true, isPremium: true },
    }),
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
  ])

  // Photo réelle si elle existe, sinon avatar par défaut selon le genre
  const profilePhoto = getProfilePhoto(profile)
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Non renseigné"

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-lg bg-white/80 px-3 py-2 backdrop-blur-sm">
          <h1 className="text-2xl font-bold">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations</p>
        </div>

        <div className="flex gap-2">
          <Link href="/profile/edit">
            <Button>Modifier le profil</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6 rounded-xl border bg-white/90 p-6 backdrop-blur-sm">
        {/* Photo de profil */}
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-rose-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profilePhoto}
              alt="Photo de profil"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-lg font-medium">{fullName}</p>
            <p className="text-sm text-gray-500">
              {user?.userType === "LOCAL" ? "🇲🇬 Madagascar" : "🌍 International"}
            </p>
          </div>
        </div>

        {/* Envoi de photo (Cloudinary) */}
        <PhotoUpload />

        {/* Informations personnelles */}
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <Field label="Prénom" value={profile?.firstName} />
          <Field label="Nom" value={profile?.lastName} />
          <Field label="Genre" value={profile?.gender} />
          <Field label="Recherche" value={profile?.lookingFor} />
          <Field label="Ville" value={profile?.city} />
          <Field label="Pays" value={profile?.country} />
        </div>

        {/* Biographie */}
        <div>
          <span className="mb-1 block text-sm text-gray-500">Bio</span>
          <div className="min-h-[80px] whitespace-pre-wrap rounded-md border bg-gray-50 px-3 py-2 text-sm">
            {profile?.bio || "Aucune bio pour le moment."}
          </div>
        </div>

        {/* Statut */}
        <div className="border-t pt-4">
          <p className="text-sm">
            Statut :{" "}
            <span
              className={
                user?.isPremium ? "font-medium text-rose-600" : "text-gray-500"
              }
            >
              {user?.isPremium ? "Premium ✨" : "Gratuit"}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
