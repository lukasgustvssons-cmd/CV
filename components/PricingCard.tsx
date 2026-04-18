"use client";

import { useEffect, useMemo, useState } from "react";

type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  checkoutPriceId?: string;
};

type UserPlan = "free" | "pro" | "career+" | "";

export function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  highlighted = false,
  checkoutPriceId,
}: PricingCardProps) {
  const [currentPlan, setCurrentPlan] = useState<UserPlan>("");

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const res = await fetch("/api/user-plan", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          setCurrentPlan("free");
          return;
        }

        setCurrentPlan(data?.plan || "free");
      } catch {
        setCurrentPlan("free");
      }
    };

    loadPlan();
  }, []);

  const isFreeCard = name === "Gratis";
  const isProCard = name === "Pro";
  const isCareerPlusCard = name === "Career+";

  const { buttonText, buttonDisabled } = useMemo(() => {
    if (!currentPlan) {
      return {
        buttonText: cta,
        buttonDisabled: false,
      };
    }

    if (currentPlan === "career+") {
      if (isCareerPlusCard) {
        return {
          buttonText: "Din nuvarande plan",
          buttonDisabled: true,
        };
      }

      if (isProCard) {
        return {
          buttonText: "Ingår i Career+",
          buttonDisabled: true,
        };
      }

      return {
        buttonText: "Börja gratis",
        buttonDisabled: false,
      };
    }

    if (currentPlan === "pro") {
      if (isProCard) {
        return {
          buttonText: "Din nuvarande plan",
          buttonDisabled: true,
        };
      }

      if (isCareerPlusCard) {
        return {
          buttonText: "Uppgradera till Career+",
          buttonDisabled: false,
        };
      }

      return {
        buttonText: "Börja gratis",
        buttonDisabled: false,
      };
    }

    return {
      buttonText: cta,
      buttonDisabled: false,
    };
  }, [currentPlan, cta, isCareerPlusCard, isProCard]);

  const handleClick = async () => {
    if (buttonDisabled) return;

    if (isFreeCard) {
      window.location.href = "/#demo";
      return;
    }

    if (!checkoutPriceId) {
      alert("Pris-ID saknas för denna plan.");
      return;
    }

    const plan = isCareerPlusCard ? "career+" : "pro";

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: checkoutPriceId,
          plan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Kunde inte starta checkout.");
      }

      if (!data?.url) {
        throw new Error("Ingen checkout-url returnerades.");
      }

      window.location.href = data.url;
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

      <p className={`mt-2 text-sm ${highlighted ? "text-slate-300" : "text-slate-600"}`}>
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
        disabled={buttonDisabled}
        className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
          buttonDisabled
            ? highlighted
              ? "cursor-not-allowed bg-white/80 text-slate-500"
              : "cursor-not-allowed bg-slate-200 text-slate-500"
            : highlighted
            ? "bg-white text-slate-900 hover:bg-slate-100"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {buttonText}
      </button>

      {!isFreeCard && (
        <p
          className={`mt-3 text-center text-xs ${
            highlighted ? "text-slate-300" : "text-slate-500"
          }`}
        >
          ✓ Säker betalning via Stripe • Avsluta när du vill • Ingen bindningstid
        </p>
      )}
    </article>
  );
}