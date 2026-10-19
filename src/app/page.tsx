import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="mb-6">
        <span className="text-5xl">🍯</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-rose-600 mb-4">
        HoneyMeet
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-2">
        La plateforme de rencontre internationale
      </p>
      <p className="text-base text-gray-500 max-w-xl mb-8">
        Spécialement conçue pour Madagascar avec paiements Mobile Money
        (MVola • Orange Money • Airtel Money)
      </p>

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
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="font-semibold text-rose-600 mb-1">🌍 International</div>
          <p>Profils du monde entier</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="font-semibold text-rose-600 mb-1">🇲🇬 Mobile Money</div>
          <p>Paiements locaux sécurisés</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="font-semibold text-rose-600 mb-1">💎 Premium</div>
          <p>Abonnements flexibles</p>
        </div>
      </div>
    </div>
  );
}
