export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
      <p className="text-gray-500 mb-8">
        Conversations avec vos matchs (Chat + Notifications)
      </p>

      <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
        <p className="text-lg mb-2">💬 Messagerie</p>
        <p className="text-sm">
          Intégration prévue avec Jitsi / système de chat temps réel.
        </p>
        <p className="text-xs mt-4 text-gray-300">
          (Skeleton – module Communications)
        </p>
      </div>
    </div>
  );
}
