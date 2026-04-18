"use client";

import { FadeInOnScroll } from "@/components/FadeInOnScroll";

const innerOrbit = [
  { label: "CV", x: "50%", y: "12%" },
  { label: "Ansökningar", x: "82%", y: "34%" },
  { label: "Intervju", x: "70%", y: "78%" },
  { label: "Jobbmatchning", x: "18%", y: "66%" },
];

const outerOrbit = [
  { label: "Säljare", x: "50%", y: "0%" },
  { label: "Lärare", x: "88%", y: "18%" },
  { label: "Kundservice", x: "94%", y: "58%" },
  { label: "IT-support", x: "72%", y: "92%" },
  { label: "Ekonomi", x: "28%", y: "92%" },
  { label: "Butik", x: "6%", y: "56%" },
  { label: "Vård", x: "12%", y: "18%" },
];

function OrbitNode({
  label,
  strong = false,
}: {
  label: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`orbit-node relative rounded-full border px-4 py-2 text-sm font-medium backdrop-blur ${
        strong
          ? "border-slate-300 bg-white text-slate-900 shadow-[0_14px_35px_rgba(15,23,42,0.12)]"
          : "border-slate-200 bg-white/90 text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
      }`}
    >
      <span className="relative z-10">{label}</span>
      <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition duration-300 orbit-node-glow" />
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
              Ett system för hela vägen till jobb
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Hireon hjälper dig genom hela processen — från CV och ansökningar
              till jobbmatchning, intervjuförberedelse och flera olika typer av roller.
            </p>

            <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll slow>
          <div className="relative mx-auto mt-14 hidden aspect-square w-full max-w-[900px] lg:block">
            {/* Space background */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_55%)]" />
              <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/60" />
              <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/70" />
              <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/80" />

              <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-slate-300/40 orbit-rotate-slow" />
              <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-slate-300/50 orbit-rotate-reverse" />

              <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/10 blur-3xl" />
            </div>

            {/* Connectors */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 900 900"
              fill="none"
            >
              <defs>
                <radialGradient id="orbitGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(15,23,42,0.20)" />
                  <stop offset="100%" stopColor="rgba(15,23,42,0.02)" />
                </radialGradient>
              </defs>

              {/* Center to inner nodes */}
              <line x1="450" y1="450" x2="450" y2="108" stroke="url(#orbitGlow)" strokeWidth="1.2" />
              <line x1="450" y1="450" x2="738" y2="306" stroke="url(#orbitGlow)" strokeWidth="1.2" />
              <line x1="450" y1="450" x2="630" y2="702" stroke="url(#orbitGlow)" strokeWidth="1.2" />
              <line x1="450" y1="450" x2="162" y2="594" stroke="url(#orbitGlow)" strokeWidth="1.2" />

              {/* Inner to outer hints */}
              <line x1="450" y1="108" x2="450" y2="40" stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
              <line x1="738" y1="306" x2="792" y2="162" stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
              <line x1="162" y1="594" x2="54" y2="504" stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
              <line x1="630" y1="702" x2="648" y2="828" stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
            </svg>

            {/* Center */}
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <div className="float-soft rounded-full border border-slate-900 bg-slate-950 px-10 py-8 text-center text-white shadow-[0_30px_80px_rgba(2,6,23,0.32)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Centrum
                </p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight">
                  Hireon
                </h3>
                <p className="mt-2 max-w-[190px] text-sm leading-6 text-slate-300">
                  CV, jobbmatchning, ansökningar och intervju i samma flöde
                </p>
              </div>
            </div>

            {/* Inner orbit */}
            <div className="absolute inset-0 orbit-rotate-slow">
              {innerOrbit.map((item, index) => (
                <FadeInOnScroll key={item.label} delay={index * 120}>
                  <div
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 orbit-counter-rotate"
                    style={{ left: item.x, top: item.y }}
                  >
                    <OrbitNode label={item.label} strong />
                  </div>
                </FadeInOnScroll>
              ))}
            </div>

            {/* Outer orbit */}
            <div className="absolute inset-0 orbit-rotate-reverse">
              {outerOrbit.map((item, index) => (
                <FadeInOnScroll key={item.label} delay={index * 80}>
                  <div
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 orbit-counter-rotate"
                    style={{ left: item.x, top: item.y }}
                  >
                    <OrbitNode label={item.label} />
                  </div>
                </FadeInOnScroll>
              ))}
            </div>

            {/* Data cards */}
            <FadeInOnScroll delay={180}>
              <div className="absolute left-[7%] top-[11%] rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
                Anpassa material efter roll
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={260}>
              <div className="absolute right-[4%] top-[10%] rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
                Stöd för flera jobbkategorier
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={340}>
              <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
                Från första CV till intervju
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
                CV, jobbmatchning, ansökningar och intervju i ett sammanhängande flöde.
              </p>
            </div>
          </FadeInOnScroll>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {innerOrbit.map((item, index) => (
              <FadeInOnScroll key={item.label} delay={index * 100}>
                <div className="hover-lift rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 shadow-sm">
                  {item.label}
                </div>
              </FadeInOnScroll>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {outerOrbit.map((item, index) => (
              <FadeInOnScroll key={item.label} delay={index * 70}>
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