import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Abonnements Premium</h1>
      <p className="text-gray-500 mb-8">
        Débloquez toutes les fonctionnalités de HoneyMeet
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Plan Mensuel */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="font-bold text-lg">Mensuel</h3>
          <p className="text-3xl font-bold text-rose-600 mt-2">
            15 000 <span className="text-sm font-normal text-gray-500">Ar</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>✓ Voir qui vous a liké</li>
            <li>✓ Likes illimités</li>
            <li>✓ Boost de profil</li>
          </ul>
          <Button className="w-full mt-6">Choisir</Button>
        </div>

        {/* Plan Trimestriel */}
        <div className="bg-white rounded-xl border-2 border-rose-500 p-6 shadow-sm relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs px-3 py-1 rounded-full">
            Populaire
          </span>
          <h3 className="font-bold text-lg">Trimestriel</h3>
          <p className="text-3xl font-bold text-rose-600 mt-2">
            35 000 <span className="text-sm font-normal text-gray-500">Ar</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>✓ Tout du plan Mensuel</li>
            <li>✓ Messages prioritaires</li>
            <li>✓ Super Likes</li>
          </ul>
          <Button className="w-full mt-6">Choisir</Button>
        </div>

        {/* Pass Premium */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="font-bold text-lg">Pass Premium</h3>
          <p className="text-3xl font-bold text-rose-600 mt-2">
            50 000 <span className="text-sm font-normal text-gray-500">Ar</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>✓ Accès 6 mois</li>
            <li>✓ Toutes les fonctionnalités</li>
            <li>✓ Support prioritaire</li>
          </ul>
          <Button className="w-full mt-6">Choisir</Button>
        </div>
      </div>

      {/* Section Paiements */}
      <div className="bg-gray-50 rounded-xl p-6 border">
        <h2 className="font-semibold text-lg mb-4">Moyens de paiement</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-rose-600 mb-2">🇲🇬 Madagascar (Mobile Money)</h3>
            <p className="text-sm text-gray-600 mb-3">
              Transférez directement vers les comptes Honey Group :
            </p>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• <strong>MVola</strong></li>
              <li>• <strong>Orange Money</strong></li>
              <li>• <strong>Airtel Money</strong></li>
            </ul>
            <p className="text-xs text-gray-400 mt-2">
              Statut : Pending → Success après validation
            </p>
          </div>

          <div>
            <h3 className="font-medium text-rose-600 mb-2">🌍 International</h3>
            <p className="text-sm text-gray-600 mb-3">
              Paiement sécurisé par carte bancaire :
            </p>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• <strong>Stripe</strong> (Visa, Mastercard...)</li>
              <li>• PayPal (à venir)</li>
            </ul>
            <p className="text-xs text-gray-400 mt-2">
              Activation automatique du statut Premium
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
