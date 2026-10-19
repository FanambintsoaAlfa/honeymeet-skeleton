import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍯</span>
          <span className="text-xl font-bold text-rose-600">HoneyMeet</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/search" className="hover:text-rose-600 transition">
            Découvrir
          </Link>
          <Link href="/matches" className="hover:text-rose-600 transition">
            Matchs
          </Link>
          <Link href="/messages" className="hover:text-rose-600 transition">
            Messages
          </Link>
          <Link href="/subscription" className="hover:text-rose-600 transition">
            Premium
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Inscription</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
