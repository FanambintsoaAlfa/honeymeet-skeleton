export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Découvrir</h1>
      <p className="text-gray-500 mb-8">
        Trouvez des personnes qui correspondent à vos critères (Matching Engine)
      </p>

      <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
        <p className="text-lg mb-2">🔍 Module Matching</p>
        <p className="text-sm">
          Ici s’afficheront les profils recommandés selon les algorithmes,
          la géolocalisation et les filtres.
        </p>
        <p className="text-xs mt-4 text-gray-300">
          (Skeleton – à implémenter après validation)
        </p>
      </div>
    </div>
  );
}
