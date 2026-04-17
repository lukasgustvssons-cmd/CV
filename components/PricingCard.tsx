type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  highlighted = false,
}: PricingCardProps) {
  return (
    <article
      className={`rounded-3xl border p-8 transition hover:-translate-y-1 ${
        highlighted
          ? "border-accent-500 bg-slate-900 text-white shadow-soft"
          : "border-slate-200 bg-white text-slate-900 shadow-sm"
      }`}
    >
      {/* Titel */}
      <h3 className="text-xl font-semibold">{name}</h3>

      {/* Beskrivning */}
      <p
        className={`mt-2 text-sm ${
          highlighted ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {description}
      </p>

      {/* Pris */}
      <p className="mt-6 text-4xl font-semibold tracking-tight">{price}</p>

      {/* Features */}
      <ul className="mt-6 space-y-3 text-sm">
        {features.map((feature) => (
          <li
            key={feature}
            className={highlighted ? "text-slate-200" : "text-slate-700"}
          >
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA-knapp */}
      <button
        className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
          highlighted
            ? "bg-white text-slate-900 hover:bg-slate-100"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {cta}
      </button>
    </article>
  );
}