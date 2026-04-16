"use client";

import { DemoPanel } from "@/components/DemoPanel";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { PricingCard } from "@/components/PricingCard";
import { SectionTitle } from "@/components/SectionTitle";
import { StepCard } from "@/components/StepCard";
import { copy, Lang } from "../lib/translations";

export default function Home() {
  const lang: Lang = "sv";
  const t = copy[lang];

  const steps = [
    {
      step: "Steg 01",
      title: "Lägg till din bakgrund",
      description:
        "Skriv in erfarenhet, utbildning och det du vill lyfta i ditt CV.",
    },
    {
      step: "Steg 02",
      title: "Välj jobb eller målroll",
      description:
        "Utgå från ett jobb du vill söka eller en roll du vill rikta dig mot.",
    },
    {
      step: "Steg 03",
      title: "Få dokument som är redo att använda",
      description:
        "Skapa CV, personligt brev och jobbanpassade versioner snabbare.",
    },
  ];

  const features = [
    {
      title: "CV som känns professionellt",
      description:
        "Skapa ett tydligt grund-CV som är lätt att anpassa för olika jobb.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 6h10M7 12h10M7 18h6" />
        </svg>
      ),
    },
    {
      title: "Hitta jobb som passar din bakgrund",
      description:
        "Se vilka roller som ligger närmast din profil och var du har bäst chans.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3v18M3 12h18" />
        </svg>
      ),
    },
    {
      title: "Anpassa varje ansökan snabbare",
      description:
        "Slipp börja om från början varje gång du söker ett nytt jobb.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m4 12 5 5 11-11" />
        </svg>
      ),
    },
    {
      title: "Skriv personligt brev snabbare",
      description:
        "Få ett starkt första utkast som du kan använda och förbättra direkt.",
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
    name: "Gratis",
    price: "0 kr",
    description: "För dig som vill komma igång",
    features: [
      "1 CV-version",
      "Grundläggande jobbmatchning",
      "Begränsad tillgång till brevfunktion",
    ],
  },
  {
    name: "Career+",
    price: "99 kr",
    description: "För dig som vill öka chansen till intervju",
    highlighted: true,
    features: [
      "Allt i Pro",
      "Obegränsad jobbmatchning",
      "Förbättra CV för specifika jobb",
      "Intervjuförberedelse och djupare insikter",
    ],
  },
  {
    name: "Pro",
    price: "49 kr",
    description: "För dig som söker aktivt",
    features: [
      "3 jobbmatchningar",
      "Spara CV, jobb och brev",
      "Job tracker i dashboard",
    ],
  },
];

  const trustItems = [
    "Skapat för att göra jobbsökandet enklare",
    "Hjälper dig spara tid i varje ansökan",
    "Ger bättre struktur i hela jobbsökandet",
  ];

  return (
    <main>
      <Navbar />
      <Hero t={t.hero} />

      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Så fungerar det"
          title="Tre steg till en starkare jobbansökan"
          description="Från bakgrund till färdiga dokument på ett enkelt sätt."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Funktioner"
          title="Allt du behöver för att söka jobb snabbare och smartare"
          description="Skapa bättre dokument, hitta relevanta jobb och håll ihop hela processen på ett ställe."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <DemoPanel lang={lang} t={t.demo} />

      <section className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Fördelar"
          title="Byggt för att hjälpa dig ta dig in på arbetsmarknaden snabbare"
          description="Mindre tid på att börja om. Mer tid på att söka rätt jobb med bättre material."
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
          eyebrow="Priser"
          title="Välj planen som passar ditt jobbsökande"
          description="Börja gratis och uppgradera när du vill ha fler verktyg och snabbare väg framåt."
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
            Sök jobb snabbare utan att tumma på kvaliteten
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Skapa bättre dokument, håll koll på dina ansökningar och lägg tiden på rätt jobb istället för att börja om varje gång.
          </p>
          <a
            href="#"
            className="mt-8 inline-flex rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Kom igång gratis
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}