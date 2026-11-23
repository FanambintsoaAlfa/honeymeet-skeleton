import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { logout } from "@/app/actions/auth"

export async function Navbar() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 shadow-sm backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍯</span>
          <span className="text-xl font-bold text-rose-600">
            HoneyMeet
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/search" className="hover:text-rose-600">
            Découvrir
          </Link>

          <Link href="/matches" className="hover:text-rose-600">
            Matchs
          </Link>

          <Link href="/messages" className="hover:text-rose-600">
            Messages
          </Link>

          <Link href="/subscription" className="hover:text-rose-600">
            Premium
          </Link>
        </nav>

        <div className="flex items-center gap-3">

          {session?.user ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Mon profil
                </Button>
              </Link>

              <form action={logout}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                >
                  Déconnexion
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>

              <Link href="/register">
                <Button size="sm">
                  Inscription
                </Button>
              </Link>
            </>
          )}

        </div>
      </div>

      {/* Navigation mobile (la barre principale est masquée sous 768px) */}
      {session?.user && (
        <nav className="flex items-center justify-around border-t px-2 py-2 text-xs font-medium text-gray-600 md:hidden">
          <Link href="/search" className="px-2 py-1 hover:text-rose-600">Découvrir</Link>
          <Link href="/matches" className="px-2 py-1 hover:text-rose-600">Matchs</Link>
          <Link href="/messages" className="px-2 py-1 hover:text-rose-600">Messages</Link>
          <Link href="/subscription" className="px-2 py-1 hover:text-rose-600">Premium</Link>
        </nav>
      )}
    </header>
  )
}