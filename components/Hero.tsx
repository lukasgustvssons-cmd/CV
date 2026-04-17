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
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-14 pt-10 sm:gap-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-24 lg:pt-24">
      <div className="fade-in">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:mb-5">
          {t.eyebrow}
        </p>

        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          {t.title}
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-relaxed">
          {t.description}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
          <a
            href="#demo"
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            {t.primaryCta}
          </a>

          <a
            href="#demo"
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900 sm:w-auto"
          >
            {t.secondaryCta}
          </a>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-soft sm:rounded-[32px] sm:p-6">
        <div className="rounded-[20px] bg-slate-50 p-4 sm:rounded-3xl sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t.profileSummary}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {t.profileText}
          </p>

          <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t.matchScore}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                92%
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium leading-6 text-slate-700">
                {t.tailoredResumeReady}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {t.coverLetterGenerated}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
            {t.atsSuggestions}
          </div>
        </div>
      </div>
    </section>
  );
}