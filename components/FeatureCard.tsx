import type { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className="group hover-lift relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-slate-200 blur-3xl" />
      </div>

      <div className="relative mb-5 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-slate-950 transition group-hover:text-slate-900 sm:text-xl">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
        {description}
      </p>

      <div className="mt-6 h-[2px] w-0 bg-slate-900 transition-all duration-300 group-hover:w-12" />
    </article>
  );
}