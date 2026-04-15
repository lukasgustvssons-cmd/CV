"use client";

import { useState } from "react";
import { DemoPanel } from "@/components/DemoPanel";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import Navbar from "@/components/Navbar";import { SectionTitle } from "@/components/SectionTitle";
import { StepCard } from "@/components/StepCard";
import { copy, Lang } from "../lib/translations";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const t = copy[lang];

  const steps = [
    {
      step: lang === "sv" ? "Steg 01" : "Step 01",
      title: lang === "sv" ? "Lägg till din bakgrund" : "Add your background",
      description:
        lang === "sv"
          ? "Fyll i din erfarenhet, utbildning och kompetens."
          : "Enter your experience, education, and skills.",
    },
    {
      step: lang === "sv" ? "Steg 02" : "Step 02",
      title: lang === "sv" ? "Klistra in en jobbannons" : "Paste a job description",
      description:
        lang === "sv"
          ? "Låt AI:n förstå rollen och vad som är viktigt."
          : "Let the AI understand the role and what matters.",
    },
    {
      step: lang === "sv" ? "Steg 03" : "Step 03",
      title:
        lang === "sv"
          ? "Få skräddarsydda dokument direkt"
          : "Get tailored documents instantly",
      description:
        lang === "sv"
          ? "Få ett anpassat CV, personligt brev och matchningsinsikter."
          : "Receive a custom resume, cover letter, and match insights.",
    },
  ];

  const features = [
    {
      title: lang === "sv" ? "AI CV-byggare" : "AI Resume Builder",
      description:
        lang === "sv"
          ? "Skapa ett tydligt och professionellt grund-CV anpassat efter din bakgrund."
          : "Generate a clear, professional base resume tailored to your background.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 6h10M7 12h10M7 18h6" />
        </svg>
      ),
    },
    {
      title: lang === "sv" ? "Jobbmatchning" : "Job Match Scoring",
      description:
        lang === "sv"
          ? "Se hur väl din profil matchar varje möjlighet."
          : "Understand how aligned your profile is with every opportunity.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3v18M3 12h18" />
        </svg>
      ),
    },
    {
      title: lang === "sv" ? "Anpassade ansökningar" : "Tailored Applications",
      description:
        lang === "sv"
          ? "Skapa rollspecifika CV-versioner på sekunder, inte timmar."
          : "Create role-specific resume versions in seconds, not hours.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m4 12 5 5 11-11" />
        </svg>
      ),
    },
    {
      title: lang === "sv" ? "Generator för personligt brev" : "Cover Letter Generator",
      description:
        lang === "sv"
          ? "Skapa övertygande och koncisa brev med en enhetlig ton."
          : "Produce compelling, concise letters with a consistent tone.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 5h16v14H4z" />
          <path d="m4 8 8 6 8-6" />
        </svg>
      ),
    },
  ];

  const pricing = [
    {
      name: lang === "sv" ? "Gratis" : "Free",
      price: "$0",
      description: lang === "sv" ? "För nya användare" : "For first-time users",
      features:
        lang === "sv"
          ? [
              "1 anpassat CV",
              "Grundläggande matchningsinsikter",
              "Begränsad generering av personligt brev",
            ]
          : [
              "1 tailored resume",
              "Basic match insights",
              "Limited cover letter generation",
            ],
    },
    {
      name: "Pro",
      price: "$19",
      description: lang === "sv" ? "För aktiva jobbsökare" : "For active job seekers",
      highlighted: true,
      features:
        lang === "sv"
          ? [
              "Obegränsat med anpassade CV:n",
              "Obegränsat med personliga brev",
              "Fulla matchningsinsikter",
              "Sparade ansökningsversioner",
            ]
          : [
              "Unlimited tailored resumes",
              "Unlimited cover letters",
              "Full match insights",
              "Saved application versions",
            ],
    },
    {
      name: "Career+",
      price: "$39",
      description: lang === "sv" ? "För snabbare utveckling" : "For accelerated growth",
      features:
        lang === "sv"
          ? ["Allt i Pro", "Avancerade optimeringstips", "Prioriterad support"]
          : ["Everything in Pro", "Advanced optimization tips", "Priority support"],
    },
  ];

  const trustItems =
    lang === "sv"
      ? [
          "Byggd för moderna jobbsökare",
          "Designad för att spara tid",
          "Skräddarsydd för bättre ansökningar",
        ]
      : [
          "Built for modern job seekers",
          "Designed to save time",
          "Tailored for better applications",
        ];

  return (
    <main>
      <Navbar lang={lang} setLang={setLang} nav={t.nav} />
      <Hero t={t.hero} />

      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow={lang === "sv" ? "Så fungerar det" : "How it works"}
          title={
            lang === "sv"
              ? "Ett enkelt flöde som minskar friktionen i jobbsökandet"
              : "A simple workflow that removes application friction"
          }
          description={
            lang === "sv"
              ? "Från profil till rollspecifika dokument i tre tydliga steg."
              : "From profile to role-specific documents in three clear steps."
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow={lang === "sv" ? "Funktioner" : "Features"}
          title={
            lang === "sv"
              ? "Byggd för att hjälpa dig gå snabbare fram och söka smartare"
              : "Built to help you move faster and apply smarter"
          }
          description={
            lang === "sv"
              ? "Allt du behöver för att skapa professionella ansökningar med mindre arbete."
              : "Everything you need to create premium applications with less effort."
          }
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section id="demo" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow={lang === "sv" ? "Demo" : "Demo Preview"}
          title={
            lang === "sv"
              ? "Se hur TailorCV anpassar din bakgrund till rollen"
              : "See how TailorCV aligns your story with the role"
          }
          description={
            lang === "sv"
              ? "En produktlik förhandsvisning av profilinnehåll, rollinput och liveförslag."
              : "A product-style preview of profile context, role input, and live suggestions."
          }
        />
        <div className="mt-10">
          <DemoPanel lang={lang} t={t.demo} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow={lang === "sv" ? "Trygghet" : "Trust"}
          title={lang === "sv" ? "Byggd för moderna jobbsökare" : "Built for modern job seekers"}
          description={
            lang === "sv"
              ? "Designad för att spara tid. Anpassad för bättre ansökningar."
              : "Designed to save time. Tailored for better applications."
          }
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {trustItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow={lang === "sv" ? "Priser" : "Pricing"}
          title={
            lang === "sv"
              ? "Välj planen som passar ditt jobbsökande"
              : "Choose the plan that fits your job search pace"
          }
          description={
            lang === "sv"
              ? "Börja gratis och uppgradera när du vill ha full kraft i dina ansökningar."
              : "Start free, upgrade when you want full application power."
          }
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricing.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
      </section>

      <section id="final-cta" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft sm:p-16">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {lang === "sv"
              ? "Sluta skriva om varje ansökan från grunden."
              : "Stop rewriting every application from scratch."}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            {lang === "sv"
              ? "Låt AI hjälpa dig att söka snabbare och bättre."
              : "Let AI help you apply faster and better."}
          </p>
          <a
            href="#"
            className="mt-8 inline-flex rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {lang === "sv" ? "Kom igång" : "Get Started"}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}