"use client";

import { useEffect, useMemo, useState } from "react";
import { SignUpButton, useUser } from "@clerk/nextjs";

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
  const { isSignedIn } = useUser();
  const [currentPlan, setCurrentPlan] = useState<UserPlan>("");

  useEffect(() => {
    const loadPlan = async () => {
      if (!isSignedIn) {
        setCurrentPlan("free");
        return;
      }

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
  }, [isSignedIn]);

  const isFreeCard = name === "Gratis";
  const isProCard = name === "Pro";
  const isCareerPlusCard = name === "Career+";

  const { buttonText, buttonDisabled } = useMemo(() => {
    if (isFreeCard) {
      return {
        buttonText: cta,
        buttonDisabled: false,
      };
    }

    if (!isSignedIn) {
      return {
        buttonText: "Skapa konto för att fortsätta",
        buttonDisabled: false,
      };
    }

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
  }, [
    isSignedIn,
    currentPlan,
    cta,
    isFreeCard,
    isCareerPlusCard,
    isProCard,
  ]);

  const handleCheckout = async () => {
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

  const buttonClassName = `mt-8 w-full rounded-full px-5 py-3.5 text-sm font-semibold transition ${
    buttonDisabled
      ? highlighted
        ? "cursor-not-allowed bg-white/80 text-slate-500"
        : "cursor-not-allowed bg-slate-200 text-slate-500"
      : highlighted
      ? "bg-white text-slate-900 hover:bg-slate-100"
      : "bg-slate-950 text-white hover:bg-slate-800"
  }`;

  return (
    <article
      className={`group hover-lift relative overflow-hidden rounded-[2rem] border p-8 transition-all duration-300 hover:shadow-2xl ${
        highlighted
          ? "border-slate-900 bg-slate-950 text-white shadow-[0_30px_100px_rgba(2,6,23,0.35)]"
          : "border-slate-200 bg-white text-slate-900 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-100">
        {highlighted ? (
          <>
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
          </>
        ) : (
          <div className="absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-slate-200/60 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
        )}
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{name}</h3>
            <p
              className={`mt-2 text-sm ${
                highlighted ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {description}
            </p>
          </div>

          {highlighted && (
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
              Mest värde
            </span>
          )}
        </div>

        <div className="mt-8 flex items-end gap-2">
          <p className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {price}
          </p>
          {!isFreeCard && (
            <span
              className={`pb-1 text-sm ${
                highlighted ? "text-slate-400" : "text-slate-500"
              }`}
            >
              / månad
            </span>
          )}
        </div>

        <div
          className={`mt-6 h-px w-full ${
            highlighted ? "bg-white/10" : "bg-slate-200"
          }`}
        />

        <ul className="mt-6 space-y-3 text-sm">
          {features.map((feature) => (
            <li
              key={feature}
              className={`flex items-start gap-3 ${
                highlighted ? "text-slate-200" : "text-slate-700"
              }`}
            >
              <span
                className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${
                  highlighted ? "bg-white" : "bg-slate-900"
                }`}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {isFreeCard ? (
          <button onClick={handleCheckout} disabled={buttonDisabled} className={buttonClassName}>
            {buttonText}
          </button>
        ) : !isSignedIn ? (
          <SignUpButton mode="modal">
            <button className={buttonClassName}>{buttonText}</button>
          </SignUpButton>
        ) : (
          <button onClick={handleCheckout} disabled={buttonDisabled} className={buttonClassName}>
            {buttonText}
          </button>
        )}

        {!isFreeCard && (
          <p
            className={`mt-3 text-center text-xs ${
              highlighted ? "text-slate-400" : "text-slate-500"
            }`}
          >
            ✓ Säker betalning via Stripe • Avsluta när du vill • Ingen bindningstid
          </p>
        )}
      </div>
    </article>
  );
}