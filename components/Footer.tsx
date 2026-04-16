const links = [
  { name: "Produkt", href: "#features" },
  { name: "Priser", href: "#pricing" },
  { name: "Integritet", href: "/privacy" },
  { name: "Villkor", href: "/terms" },
];

export function Footer() {
  return (
    <footer id="footer" className="border-t border-slate-200 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p className="font-semibold text-slate-900">Hireon</p>

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