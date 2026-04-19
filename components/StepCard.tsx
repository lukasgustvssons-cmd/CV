type StepCardProps = {
  step: string;
  title: string;
  description: string;
};

export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <article className="group hover-lift relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-slate-200/60 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition-transform duration-300 group-hover:scale-105">
            {step.replace("Steg ", "")}
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {step}
          </p>
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-950 sm:text-xl">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          {description}
        </p>

        <div className="mt-6 h-[2px] w-10 bg-slate-900 transition-all duration-300 group-hover:w-16" />
      </div>
    </article>
  );
}
