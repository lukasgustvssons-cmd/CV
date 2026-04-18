"use client";

import { FadeInOnScroll } from "@/components/FadeInOnScroll";

const roleNodes = [
  { label: "Lärare", x: 14, y: 26 },
  { label: "Säljare", x: 23, y: 14 },
  { label: "Byggare", x: 36, y: 8 },
  { label: "Pedagog", x: 53, y: 10 },
  { label: "Psykolog", x: 68, y: 14 },
  { label: "Läkare", x: 80, y: 25 },
  { label: "Polis", x: 84, y: 42 },
  { label: "Jurist", x: 78, y: 59 },
  { label: "Ekonom", x: 63, y: 71 },
  { label: "Ingenjör", x: 43, y: 75 },
];

function Node({
  label,
  className = "",
  strong = false,
}: {
  label: string;
  className?: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-full border px-4 py-2 text-sm font-medium shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] ${
        strong
          ? "border-slate-900 bg-slate-950 text-white"
          : "border-slate-200 bg-white/95 text-slate-700 backdrop-blur"
      } ${className}`}
    >
      {!strong && (
        <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.16),rgba(255,255,255,0))]" />
      )}
      <span className="relative z-10">{label}</span>
    </div>
  );
}

export function OrbitMap() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-10 shadow-[0_24px_100px_rgba(15,23,42,0.06)] sm:px-8 sm:py-14 lg:px-10">
        <FadeInOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex justify-center">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
                Hireon-kartan
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Från Hireon till ansökan, intervju och många olika jobb
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Hireon hjälper dig genom hela processen — från CV och ansökningar
              till intervju, och vidare mot många olika typer av roller.
            </p>

            <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </div>
        </FadeInOnScroll>

        {/* Desktop */}
        <FadeInOnScroll slow>
          <div className="relative mx-auto mt-14 hidden h-[760px] w-full max-w-[1100px] lg:block">
            {/* soft background */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/10 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/50" />
              <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/60" />
            </div>

            {/* lines */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 1100 760"
              fill="none"
            >
              {/* center to core flow */}
              <line x1="550" y1="410" x2="360" y2="410" stroke="rgba(148,163,184,0.45)" strokeWidth="1.4" />
              <line x1="550" y1="410" x2="550" y2="240" stroke="rgba(148,163,184,0.45)" strokeWidth="1.4" />
              <line x1="550" y1="410" x2="760" y2="410" stroke="rgba(148,163,184,0.45)" strokeWidth="1.4" />

              {/* jobs hub to roles */}
              <line x1="760" y1="410" x2="154" y2="198" stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" />
              <line x1="760" y1="410" x2="253" y2="107" stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" />
              <line x1="760" y1="410" x2="396" y2="61" stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" />
              <line x1="760" y1="410" x2="583" y2="76" stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" />
              <line x1="760" y1="410" x2="748" y2="107" stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" />
              <line x1="760" y1="410" x2="880" y2="190" stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" />
              <line x1="760" y1="410" x2="924" y2="319" stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" />
              <line x1="760" y1="410" x2="858" y2="448" stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" />
              <line x1="760" y1="410" x2="693" y2="540" stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" />
              <line x1="760" y1="410" x2="473" y2="571" stroke="rgba(148,163,184,0.22)" strokeWidth="1.2" />
            </svg>

            {/* center */}
            <div className="absolute left-[50%] top-[54%] -translate-x-1/2 -translate-y-1/2">
              <div className="float-soft rounded-full border border-slate-900 bg-slate-950 px-10 py-8 text-center text-white shadow-[0_30px_80px_rgba(2,6,23,0.32)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Centrum
                </p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight">
                  Hireon
                </h3>
                <p className="mt-2 max-w-[190px] text-sm leading-6 text-slate-300">
                  Här börjar allt
                </p>
              </div>
            </div>

            {/* first layer */}
            <FadeInOnScroll delay={80}>
              <div className="absolute left-[20%] top-[54%] -translate-x-1/2 -translate-y-1/2">
                <Node label="Ansök" strong />
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={160}>
              <div className="absolute left-[50%] top-[22%] -translate-x-1/2 -translate-y-1/2">
                <Node label="Intervju" strong />
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={240}>
              <div className="absolute left-[76%] top-[54%] -translate-x-1/2 -translate-y-1/2">
                <Node label="Jobb" strong />
              </div>
            </FadeInOnScroll>

            {/* role nodes */}
            {roleNodes.map((role, index) => (
              <FadeInOnScroll key={role.label} delay={300 + index * 70}>
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${role.x}%`, top: `${role.y}%` }}
                >
                  <Node label={role.label} />
                </div>
              </FadeInOnScroll>
            ))}

            {/* helper cards */}
            <FadeInOnScroll delay={180}>
              <div className="absolute left-[11%] top-[42%] rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
                Skapa bättre ansökningar snabbare
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={260}>
              <div className="absolute left-[44%] top-[7%] rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
                Förbered vanliga intervjufrågor
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={340}>
              <div className="absolute right-[8%] top-[42%] rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
                Flera olika yrken och roller
              </div>
            </FadeInOnScroll>
          </div>
        </FadeInOnScroll>

        {/* Mobile */}
        <div className="mt-12 lg:hidden">
          <FadeInOnScroll>
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 px-6 py-8 text-center text-white shadow-[0_20px_60px_rgba(2,6,23,0.28)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Centrum
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                Hireon
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Från CV till ansökan, intervju och olika typer av jobb.
              </p>
            </div>
          </FadeInOnScroll>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Ansök", "Intervju", "Jobb"].map((item, index) => (
              <FadeInOnScroll key={item} delay={index * 90}>
                <div className="hover-lift rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 shadow-sm">
                  {item}
                </div>
              </FadeInOnScroll>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {roleNodes.map((item, index) => (
              <FadeInOnScroll key={item.label} delay={index * 60}>
                <div className="hover-lift rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
                  {item.label}
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}