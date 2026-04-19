"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";

type UserPlan = "free" | "pro" | "career+" | "";

function getPlanLabel(plan: UserPlan) {
  if (plan === "career+") return "Career+";
  if (plan === "pro") return "Pro";
  return "Gratis";
}

function getPlanBadgeClasses(plan: UserPlan) {
  if (plan === "career+") {
    return "border-purple-200 bg-purple-50 text-purple-700";
  }

  if (plan === "pro") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const [plan, setPlan] = useState<UserPlan>("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setPlan("");
      return;
    }

    const loadPlan = async () => {
      try {
        const res = await fetch("/api/user-plan", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) return;
        setPlan(data?.plan || "free");
      } catch {
        setPlan("free");
      }
    };

    loadPlan();
  }, [isLoaded, isSignedIn]);

  const planLabel = useMemo(() => getPlanLabel(plan), [plan]);
  const planClasses = useMemo(() => getPlanBadgeClasses(plan), [plan]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="shrink-0 text-lg font-semibold tracking-tight text-slate-950 sm:text-xl"
          >
            NEXOR
          </a>

          <div className="hidden items-center gap-6 lg:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Så funkar det
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Funktioner
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Priser
            </a>
            <a
              href="/vilka-ar-vi"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              Vilka är vi
            </a>
          </div>
        </div>

        {!isLoaded ? null : isSignedIn ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/dashboard"
              className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 sm:inline-flex"
            >
              Dashboard
            </a>

            <span
              className={`hidden rounded-full border px-3 py-1 text-xs font-semibold sm:inline-flex ${planClasses}`}
            >
              {planLabel}
            </span>

            <div className="rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <UserButton />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden max-w-[260px] text-right text-[11px] leading-4 text-slate-500 xl:block">
              Genom att fortsätta godkänner du våra{" "}
              <a href="/terms" className="underline hover:text-slate-900">
                användarvillkor
              </a>{" "}
              och vår{" "}
              <a href="/privacy" className="underline hover:text-slate-900">
                integritetspolicy
              </a>
              .
            </div>

            <a
              href="#pricing"
              className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 sm:inline-flex"
            >
              Se priser
            </a>

            <SignInButton mode="modal">
              <button className="whitespace-nowrap rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)] transition hover:bg-slate-800">
                Logga in
              </button>
            </SignInButton>
          </div>
        )}
      </nav>

      {!isLoaded || isSignedIn ? null : (
        <div className="border-t border-slate-100 px-4 py-2 sm:hidden">
          <p className="text-[11px] leading-4 text-slate-500">
            Genom att fortsätta godkänner du våra{" "}
            <a href="/terms" className="underline hover:text-slate-900">
              användarvillkor
            </a>{" "}
            och vår{" "}
            <a href="/privacy" className="underline hover:text-slate-900">
              integritetspolicy
            </a>
            .
          </p>
        </div>
      )}
    </header>
  );
}
