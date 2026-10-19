export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
      <p className="text-gray-500 mb-8">
        Bienvenue sur HoneyMeet. Gérez votre profil et vos interactions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-sm text-gray-500">Profil</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">À compléter</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-sm text-gray-500">Matchs</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">0</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-sm text-gray-500">Messages</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">0</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-sm text-gray-500">Statut</div>
          <div className="text-2xl font-bold text-gray-400 mt-1">Gratuit</div>
        </div>
      </div>
    </div>
  );
}
