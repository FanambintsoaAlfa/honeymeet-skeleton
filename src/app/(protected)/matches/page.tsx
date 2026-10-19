export default function MatchesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Matchs</h1>
      <p className="text-gray-500 mb-8">
        Les personnes avec qui vous avez mutuellement liké
      </p>

      <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
        <p className="text-lg mb-2">❤️ Aucun match pour le moment</p>
        <p className="text-sm">
          Continuez à découvrir des profils pour trouver des matchs.
        </p>
      </div>
    </div>
  );
}
