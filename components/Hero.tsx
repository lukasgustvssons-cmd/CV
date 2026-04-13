export function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-24 pt-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:pt-24">
      <div className="fade-in">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">AI-Driven Job Search Platform</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Your next job application, tailored in seconds.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
          Create a polished CV, tailor it to any job post, and generate a compelling cover letter with AI.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#pricing"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Get Started
          </a>
          <a
            href="#demo"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
          >
            Try Demo
          </a>
        </div>
      </div>

      <div className="fade-in fade-delay-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-slate-700">Profile Summary</p>
        <p className="mt-2 text-sm text-slate-600">Product-minded marketer with B2B SaaS growth experience.</p>

        <div className="mt-6 rounded-2xl border border-accent-100 bg-accent-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">Match Score</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">92%</p>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">✓ Tailored CV ready</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">✓ Cover letter generated</div>
        </div>
      </div>
    </section>
  );
}
