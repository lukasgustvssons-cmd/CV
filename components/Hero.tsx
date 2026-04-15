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
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-24 pt-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:pt-24">
      <div className="fade-in">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {t.eyebrow}
        </p>

        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          {t.title}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
          {t.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#pricing"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {t.primaryCta}
          </a>

          <a
            href="#demo"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
          >
            {t.secondaryCta}
          </a>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="rounded-3xl bg-slate-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t.profileSummary}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {t.profileText}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t.matchScore}
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">92%</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-700">
                {t.tailoredResumeReady}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {t.coverLetterGenerated}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600">
            {t.atsSuggestions}
          </div>
        </div>
      </div>
    </section>
  );
}