export function Footer() {
  return (
    <footer className="border-t bg-white py-8 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p className="mb-2">
          © {new Date().getFullYear()} HoneyMeet – Honey Group
        </p>
        <p className="text-xs">
          Plateforme de rencontre internationale • Support Mobile Money Madagascar
        </p>
        <p className="text-xs mt-1 text-gray-400">
          MVola • Orange Money • Airtel Money • Stripe
        </p>
      </div>
    </footer>
  );
}
