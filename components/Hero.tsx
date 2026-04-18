import { FadeInOnScroll } from "@/components/FadeInOnScroll";

type HeroProps = {
  t: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    profileSummary: string;
    profileText: string;
    matchScore: string;
    tailoredResumeReady: string;
    coverLetterGenerated: string;
    atsSuggestions: string;
  };
};

function ScoreRing() {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.92;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(15,23,42,0.08)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#heroScoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="heroScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold text-slate-950">92%</span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Match
        </span>
      </div>
    </div>
  );
}

function GlowPill({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={[
        "inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm",
        dark
          ? "border border-white/10 bg-white/10 text-white/70"
          : "border border-slate-200 bg-white/90 text-slate-500",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function Hero({ t }: HeroProps) {
  return (
    <section className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="relative z-10">
        <div className="fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {t.eyebrow}
          </div>
        </div>

        <div className="fade-in fade-delay-1">
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
            {t.title}
          </h1>
        </div>

        <div className="fade-in fade-delay-2">
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="fade-in fade-delay-3">
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#demo"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(15,23,42,0.22)] transition hover:bg-slate-800 sm:w-auto"
            >
              {t.primaryCta}
            </a>

            <a
              href="#pricing"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 sm:w-auto"
            >
              {t.secondaryCta}
            </a>
          </div>
        </div>

        <div className="fade-in fade-delay-4">
          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["CV med AI", "Jobbmatchning", "Intervjuförberedelse"].map(
              (item, index) => (
                <FadeInOnScroll key={item} delay={index * 120} fast>
                  <div className="hover-lift rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
                    {item}
                  </div>
                </FadeInOnScroll>
              )
            )}
          </div>
        </div>
      </div>

      <FadeInOnScroll slow className="relative">
        <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-br from-slate-200/45 via-white to-slate-100/70 blur-2xl" />

        <div className="float-soft relative overflow-hidden rounded-[2.4rem] border border-slate-200/80 bg-white/80 p-3 shadow-[0_30px_120px_rgba(15,23,42,0.12)] backdrop-blur sm:p-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(241,245,249,0.98))] p-4 sm:p-5">
            <div className="absolute left-10 top-8 h-36 w-36 rounded-full bg-slate-200/40 blur-3xl" />
            <div className="absolute right-8 top-12 h-28 w-28 rounded-full bg-blue-100/50 blur-3xl" />
            <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-slate-200/30 blur-3xl" />

            <div className="relative z-10 flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-slate-500 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                AI aktiv
              </div>
            </div>

            <div className="relative z-10 mt-5 space-y-4">
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative overflow-hidden rounded-[1.7rem] bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.30)] sm:p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_32%)]" />
                  <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {t.profileSummary}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
                        Starkare CV för rätt jobb
                      </h3>
                    </div>

                    <GlowPill dark>Live</GlowPill>
                  </div>

                  <p className="relative z-10 mt-4 max-w-md text-sm leading-7 text-slate-200 sm:text-[15px]">
                    {t.profileText}
                  </p>

                  <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {t.tailoredResumeReady}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/90">
                        CV klart att använda
                      </p>
                    </div>

                    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Brev
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/90">
                        {t.coverLetterGenerated}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-5 flex flex-wrap gap-2">
                    {["ATS-optimerat", "Tydligare struktur", "Mer relevant ton"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.6rem] border border-slate-200 bg-white/88 p-5 shadow-sm backdrop-blur">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {t.matchScore}
                        </p>
                        <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                          Stark matchning mot rollen
                        </p>
                      </div>

                      <GlowPill>AI score</GlowPill>
                    </div>

                    <div className="mt-5 flex items-center justify-center">
                      <ScoreRing />
                    </div>
                  </div>

                  <div className="rounded-[1.6rem] border border-slate-200 bg-white/88 p-5 shadow-sm backdrop-blur">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          AI-output
                        </p>
                        <p className="mt-2 text-base font-semibold tracking-tight text-slate-950">
                          Det här förbättras direkt
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {[
                        "Professionell sammanfattning förbättrad",
                        "Nyckelord anpassade till rollen",
                        "Tydligare kompetenser och struktur",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 rounded-[1rem] bg-slate-50/90 px-4 py-3 text-sm text-slate-700"
                        >
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-900" />
                          <span className="leading-6">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white/88 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Hireons rekommendation
                      </p>
                      <p className="mt-2 text-base font-semibold tracking-tight text-slate-950">
                        Så gör du ansökan starkare
                      </p>
                    </div>

                    <GlowPill>Förslag</GlowPill>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {t.atsSuggestions}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200 bg-white/88 p-5 shadow-sm backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Nästa steg
                  </p>

                  <div className="mt-4 space-y-3">
                    {[
                      "Matcha mot relevanta jobb",
                      "Spara roller i dashboarden",
                      "Förbered vanliga intervjufrågor",
                    ].map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-6 text-slate-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.45rem] border border-slate-200 bg-white/92 px-4 py-4 shadow-sm backdrop-blur">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Dashboard
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      Ansökningar, CV och brev samlade på ett ställe
                    </p>
                  </div>

                  <div className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white">
                    Redo att användas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}