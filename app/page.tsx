"use client";

import { DemoPanel } from "@/components/DemoPanel";
import { FeatureCard } from "@/components/FeatureCard";
import { FadeInOnScroll } from "@/components/FadeInOnScroll";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import Navbar from "@/components/Navbar";
import OrbitMap from "@/components/OrbitMap";
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
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M7 6h10M7 12h10M7 18h6" />
        </svg>
      ),
    },
    {
      title: "Hitta jobb som passar din bakgrund",
      description:
        "Se vilka roller som ligger närmast din profil och var du har bäst chans.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 3v18M3 12h18" />
        </svg>
      ),
    },
    {
      title: "Anpassa varje ansökan snabbare",
      description:
        "Slipp börja om från början varje gång du söker ett nytt jobb.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m4 12 5 5 11-11" />
        </svg>
      ),
    },
    {
      title: "Skriv personligt brev snabbare",
      description:
        "Få ett starkt första utkast som du kan använda och förbättra direkt.",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
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
      cta: "Börja gratis",
      features: [
        "1 CV-version",
        "Grundläggande jobbmatchning",
        "Begränsad tillgång till brevfunktion",
      ],
    },
    {
      name: "Pro",
      price: "49 kr",
      description: "För dig som söker aktivt",
      cta: "Skaffa Pro",
      checkoutPriceId: "price_1TNFxfGmbR5zSuzsEuScmuQr",
      features: [
        "3 jobbmatchningar",
        "Spara CV, jobb och brev",
        "Job tracker i dashboard",
      ],
    },
    {
      name: "Career+",
      price: "99 kr",
      description: "För dig som vill öka chansen till intervju",
      cta: "Skaffa Career+",
      checkoutPriceId: "price_1TNFykGmbR5zSuzsSlHDpJHA",
      highlighted: true,
      features: [
        "Allt i Pro",
        "Obegränsad jobbmatchning",
        "Förbättra CV för specifika jobb",
        "Intervjuförberedelse och djupare insikter",
      ],
    },
  ];

  const trustItems = [
    "Skapat för att göra jobbsökandet enklare",
    "Hjälper dig spara tid i varje ansökan",
    "Ger bättre struktur i hela jobbsökandet",
  ];

  const premiumStats = [
    { label: "AI-stöd i hela flödet", value: "CV → jobb → intervju" },
    { label: "Byggt för riktiga ansökningar", value: "Snabbare och tydligare" },
    { label: "Dashboard för hela processen", value: "Allt på ett ställe" },
  ];

  return (
    <main className="relative overflow-x-hidden bg-[#f8fafc] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="float-soft absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="float-soft-delay absolute right-[-120px] top-[280px] h-[320px] w-[320px] rounded-full bg-purple-200/30 blur-3xl" />
        <div className="float-soft absolute left-[-100px] top-[900px] h-[280px] w-[280px] rounded-full bg-slate-300/30 blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <section className="relative">
          <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
            <FadeInOnScroll fast>
              <div className="mb-6 flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/70 bg-white/70 px-4 py-3 text-xs text-slate-600 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur xl:mb-8">
                {premiumStats.map((item, index) => (
                  <FadeInOnScroll key={item.label} delay={index * 90} fast>
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-center shadow-sm">
                      <span className="font-semibold text-slate-900">
                        {item.value}
                      </span>
                      <span className="hidden text-slate-500 sm:inline">
                        • {item.label}
                      </span>
                    </div>
                  </FadeInOnScroll>
                ))}
              </div>
            </FadeInOnScroll>
          </div>

          <Hero t={t.hero} />
        </section>

        <FadeInOnScroll>
          <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_80px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Hireon i ett nötskal
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    Från första CV till intervju — i ett sammanhängande flöde
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                    Skapa ett starkare CV, matcha mot riktiga jobb och förbättra
                    varje ansökan utan att hoppa mellan flera verktyg.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:w-[480px]">
                  {[
                    "Skapa CV med AI",
                    "Matcha mot jobb",
                    "Spara och följ upp",
                  ].map((item, index) => (
                    <FadeInOnScroll key={item} delay={index * 100} fast>
                      <div className="hover-lift rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 shadow-sm">
                        {item}
                      </div>
                    </FadeInOnScroll>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll>
          <section
            id="how-it-works"
            className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
          >
            <SectionTitle
              eyebrow="Så fungerar det"
              title="Tre steg till en starkare jobbansökan"
              description="Från bakgrund till färdiga dokument på ett enkelt och snabbare sätt."
            />
            <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <FadeInOnScroll key={step.title} delay={index * 120}>
                  <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 shadow-[0_16px_50px_rgba(15,23,42,0.05)] backdrop-blur">
                    <StepCard {...step} />
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll>
          <section
            id="features"
            className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
          >
            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-10 shadow-[0_24px_100px_rgba(15,23,42,0.06)] sm:px-8 sm:py-14 lg:px-10">
              <SectionTitle
                eyebrow="Funktioner"
                title="Allt du behöver för att söka jobb snabbare och smartare"
                description="Skapa bättre dokument, hitta relevanta jobb och håll ihop hela processen på ett ställe."
              />
              <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <FadeInOnScroll key={feature.title} delay={index * 110}>
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
                      <FeatureCard {...feature} />
                    </div>
                  </FadeInOnScroll>
                ))}
              </div>
            </div>
          </section>
        </FadeInOnScroll>

        <OrbitMap />

        <FadeInOnScroll slow>
          <section className="relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_120px_rgba(2,6,23,0.45)] sm:px-8 sm:py-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Produktupplevelse
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                      En levande produktvisning — inte bara en statisk landningssida
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                      Hireon ska kännas som ett riktigt verktyg från första sekunden.
                      Därför lyfter vi fram själva produkten tydligt, inte bara texten
                      runt den.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      "Tydlig CV-preview",
                      "Jobbmatchning i samma flöde",
                      "Dashboard för uppföljning",
                    ].map((item, index) => (
                      <FadeInOnScroll key={item} delay={index * 120}>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200 backdrop-blur">
                          {item}
                        </div>
                      </FadeInOnScroll>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <DemoPanel lang={lang} t={t.demo} />
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll>
          <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <SectionTitle
              eyebrow="Fördelar"
              title="Byggt för att hjälpa dig ta dig in på arbetsmarknaden snabbare"
              description="Mindre tid på att börja om. Mer tid på att söka rätt jobb med bättre material."
            />
            <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
              {trustItems.map((item, index) => (
                <FadeInOnScroll key={item} delay={index * 120}>
                  <div className="hover-lift rounded-[1.5rem] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-6">
                    {item}
                  </div>
                </FadeInOnScroll>
              ))}
            </div>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll>
          <section
            id="pricing"
            className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
          >
            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-10 shadow-[0_24px_100px_rgba(15,23,42,0.05)] sm:px-8 sm:py-14 lg:px-10">
              <SectionTitle
                eyebrow="Priser"
                title="Välj planen som passar ditt jobbsökande"
                description="Börja gratis och uppgradera när du vill ha fler verktyg och snabbare väg framåt."
              />
              <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-3">
                {pricing.map((tier, index) => (
                  <FadeInOnScroll key={tier.name} delay={index * 120}>
                    <PricingCard {...tier} />
                  </FadeInOnScroll>
                ))}
              </div>
            </div>
          </section>
        </FadeInOnScroll>

        <FadeInOnScroll slow>
          <section
            id="final-cta"
            className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-5 py-10 text-center text-white shadow-[0_30px_120px_rgba(2,6,23,0.45)] sm:p-12 lg:p-16">
              <div className="pointer-events-none absolute inset-0">
                <div className="float-soft absolute left-1/2 top-0 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="float-soft-delay absolute bottom-[-80px] right-[-40px] h-[220px] w-[220px] rounded-full bg-purple-500/20 blur-3xl" />
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                  Sök jobb snabbare utan att tumma på kvaliteten
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Skapa bättre dokument, håll koll på dina ansökningar och lägg tiden
                  på rätt jobb istället för att börja om varje gång.
                </p>
                <a
                  href="#demo"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:w-auto sm:px-7"
                >
                  Kom igång gratis
                </a>
              </div>
            </div>
          </section>
        </FadeInOnScroll>

        <Footer />
      </div>
    </main>
  );
}