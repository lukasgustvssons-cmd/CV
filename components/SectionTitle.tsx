type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  centered = true,
}: SectionTitleProps) {
  return (
    <div
      className={
        centered
          ? "mx-auto max-w-3xl text-center"
          : "max-w-2xl"
      }
    >
      {eyebrow && (
        <div className="mb-4 flex justify-center">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
            {eyebrow}
          </span>
        </div>
      )}

      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {description}
        </p>
      )}

      {/* subtil glow line */}
      <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
    </div>
  );
}