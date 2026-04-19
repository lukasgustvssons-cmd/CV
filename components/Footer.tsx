const links = [
  { name: "Produkt", href: "#features" },
  { name: "Priser", href: "#pricing" },
  { name: "Vilka är vi", href: "/vilka-ar-vi" },
  { name: "Integritet", href: "/privacy" },
  { name: "Villkor", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-slate-200 bg-white">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-slate-200/60 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          
          {/* LEFT */}
          <div className="max-w-sm">
            <p className="text-lg font-semibold tracking-tight text-slate-950">
              NEXOR
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Ett enklare sätt att skapa starka CV:n, hitta rätt jobb och hålla koll
              på hela din jobbsökning – utan att börja om varje gång.
            </p>

            <p className="mt-6 text-xs text-slate-500">
              © {new Date().getFullYear()} NEXOR. Alla rättigheter förbehållna.
            </p>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Produkt
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                <a href="#features" className="transition hover:text-slate-950">
                  Funktioner
                </a>
                <a href="#pricing" className="transition hover:text-slate-950">
                  Priser
                </a>
                <a href="/dashboard" className="transition hover:text-slate-950">
                  Dashboard
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Företag
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                <a href="/vilka-ar-vi" className="transition hover:text-slate-950">
                  Vilka är vi
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Juridiskt
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                <a href="/privacy" className="transition hover:text-slate-950">
                  Integritetspolicy
                </a>
                <a href="/terms" className="transition hover:text-slate-950">
                  Användarvillkor
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          Byggt för att hjälpa dig få fler intervjuer.
        </div>
      </div>
    </footer>
  );
}
