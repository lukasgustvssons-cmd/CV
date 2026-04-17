type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  checkoutPriceId?: string;
};

export function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  highlighted = false,
  checkoutPriceId,
}: PricingCardProps) {
  const handleClick = async () => {
    if (name === "Gratis") {
      window.location.href = "/#demo";
      return;
    }

    if (!checkoutPriceId) {
      alert("Pris-ID saknas för denna plan.");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: checkoutPriceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Kunde inte starta checkout.");
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      alert(error?.message || "Något gick fel vid betalning.");
    }
  };

  return (
    <article
      className={`rounded-3xl border p-8 transition hover:-translate-y-1 ${
        highlighted
          ? "border-accent-500 bg-slate-900 text-white shadow-soft"
          : "border-slate-200 bg-white text-slate-900 shadow-sm"
      }`}
    >
      <h3 className="text-xl font-semibold">{name}</h3>

      <p
        className={`mt-2 text-sm ${
          highlighted ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {description}
      </p>

      <p className="mt-6 text-4xl font-semibold tracking-tight">{price}</p>

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

      <button
        onClick={handleClick}
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