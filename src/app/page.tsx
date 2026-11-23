import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="mb-6">
        <span className="text-5xl">🍯</span>
      </div>
      <div className="mb-8 rounded-2xl bg-white/85 px-6 py-5 backdrop-blur-sm">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-rose-600 md:text-5xl">
          HoneyMeet
        </h1>
        <p className="mb-2 max-w-2xl text-lg text-gray-700 md:text-xl">
          La plateforme de rencontre internationale
        </p>
        <p className="max-w-xl text-base text-gray-600">
          Spécialement conçue pour Madagascar avec paiements Mobile Money
          (MVola • Orange Money • Airtel Money)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/register">
          <Button size="lg" className="w-full sm:w-auto">
            Créer un compte
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Se connecter
          </Button>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl text-sm text-gray-500">
        <div className="p-4 bg-white/90 rounded-lg shadow-sm">
          <div className="font-semibold text-rose-600 mb-1">🌍 International</div>
          <p>Profils du monde entier</p>
        </div>
        <div className="p-4 bg-white/90 rounded-lg shadow-sm">
          <div className="font-semibold text-rose-600 mb-1">🇲🇬 Mobile Money</div>
          <p>Paiements locaux sécurisés</p>
        </div>
        <div className="p-4 bg-white/90 rounded-lg shadow-sm">
          <div className="font-semibold text-rose-600 mb-1">💎 Premium</div>
          <p>Abonnements flexibles</p>
        </div>
      </div>
    </div>
  );
}
