export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon Profil</h1>
      <p className="text-gray-500 mb-8">
        Gérez vos informations et photos
      </p>

      <div className="bg-white rounded-xl border p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <p className="font-medium">Photo principale</p>
            <p className="text-sm text-gray-400">AWS S3 • photos_videos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-gray-500 mb-1">Nom / Pseudo</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50">—</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Genre / Recherche</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50">—</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Date de naissance</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50">—</div>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Localisation</label>
            <div className="border rounded-md px-3 py-2 bg-gray-50">—</div>
          </div>
        </div>

        <div>
          <label className="block text-gray-500 mb-1 text-sm">Bio</label>
          <div className="border rounded-md px-3 py-2 bg-gray-50 min-h-[80px] text-sm text-gray-400">
            À compléter...
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-gray-400">
            Table : profiles • is_premium = false (par défaut)
          </p>
        </div>
      </div>
    </div>
  );
}
