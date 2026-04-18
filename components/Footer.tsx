const links = [
  { name: "Produkt", href: "#features" },
  { name: "Priser", href: "#pricing" },
  { name: "Vilka är vi", href: "/vilka-ar-vi" },
  { name: "Integritet", href: "/privacy" },
  { name: "Villkor", href: "/terms" },
];

export function Footer() {
  return (
    <footer id="footer" className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        
        {/* Left */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-slate-900">Hireon</p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Hireon. Alla rättigheter förbehållna.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-wrap gap-5">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="transition hover:text-slate-900"
            >
              {link.name}
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}