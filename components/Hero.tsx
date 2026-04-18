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

export function Hero({ t }: HeroProps) {
  return (
    <section className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-8 lg:pb-28 lg:pt-20">
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
        <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blue-200/35 via-white to-purple-200/35 blur-2xl" />

        <div className="float-soft relative rounded-[2rem] border border-slate-200/80 bg-white/85 p-3 shadow-[0_30px_120px_rgba(15,23,42,0.12)] backdrop-blur sm:rounded-[2.5rem] sm:p-4">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(241,245,249,0.98))] p-4 sm:rounded-[2rem] sm:p-6">
            <div className="absolute left-6 top-6 h-28 w-28 rounded-full bg-blue-200/25 blur-2xl" />
            <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-purple-200/25 blur-2xl" />

            <div className="relative z-10 flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>

              <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm">
                Hireon Preview
              </div>
            </div>

            <div className="relative z-10 mt-5 grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
              <div className="rounded-[1.6rem] border border-slate-200/30 bg-slate-950 p-5 text-white shadow-[0_20px_60px_rgba(2,6,23,0.30)] sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {t.profileSummary}
                </p>

                <p className="mt-4 max-w-sm text-sm leading-7 text-slate-200 sm:text-[15px]">
                  {t.profileText}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
                  <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {t.matchScore}
                    </p>
                    <p className="mt-4 text-4xl font-semibold text-white">92%</p>
                  </div>

                  <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="text-base font-semibold leading-7 text-white">
                      {t.tailoredResumeReady}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {t.coverLetterGenerated}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300 backdrop-blur">
                  {t.atsSuggestions}
                </div>

                <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/95 px-4 py-3 text-slate-900 shadow-lg">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Dashboard
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    Ansökningar, CV och brev samlade
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        CV-status
                      </p>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                        Redo att skickas
                      </h3>
                    </div>

                    <div className="self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Klar
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      "Professionell sammanfattning förbättrad",
                      "Nyckelord anpassade till rollen",
                      "Tydligare kompetenser och struktur",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-[1.15rem] bg-slate-50 px-4 py-3 text-sm text-slate-700"
                      >
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-900" />
                        <span className="leading-6">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Interview prep
                      </p>
                      <p className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
                        12 frågor genererade
                      </p>
                    </div>

                    <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                      Aktiv
                    </div>
                  </div>

                  <div className="mt-5">
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
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-6 text-slate-700">{item}</p>
                        </div>
                      ))}
                    </div>
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