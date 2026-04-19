"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const problems = [
  "Du skickar ansökningar utan att veta vad som faktiskt saknas.",
  "Det är svårt att förstå hur ett bra CV ska se ut för just rollen du söker.",
  "Många chansar sig fram utan tydlig feedback eller riktning.",
];

const solutions = [
  {
    title: "Tydligare CV",
    text: "Hireon hjälper dig att formulera ett starkare CV snabbare, med bättre struktur och tydligare relevans.",
  },
  {
    title: "Smart jobbmatchning",
    text: "Vi jämför din profil med riktiga jobb så att du ser vad som passar bäst och varför.",
  },
  {
    title: "Bättre nästa steg",
    text: "Du får hjälp vidare med förbättringar, personligt brev och intervjuförberedelse.",
  },
];

const values = [
  {
    eyebrow: "Tydlighet",
    title: "Jobbsökande ska inte kännas som ett gissningsspel",
    text: "Vi vill göra det enklare att förstå vad som fungerar, vad som behöver förbättras och hur du faktiskt kommer vidare.",
  },
  {
    eyebrow: "Fokus",
    title: "Mindre brus. Mer riktning.",
    text: "Istället för att hoppa mellan verktyg, dokument och magkänsla samlar Hireon allt i ett tydligare flöde.",
  },
  {
    eyebrow: "Trygghet",
    title: "Feedback som hjälper på riktigt",
    text: "Vi bygger för att ge användaren bättre beslutsunderlag, inte bara generisk AI-text.",
  },
];

const stats = [
  {
    value: "AI + struktur",
    label: "för att göra jobbsökandet mindre rörigt",
  },
  {
    value: "CV → jobb",
    label: "i ett tydligare sammanhängande flöde",
  },
  {
    value: "Byggt för Sverige",
    label: "med riktiga jobb och verkliga behov i fokus",
  },
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
      {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl" />
        <div className="absolute left-[12%] top-[24%] h-56 w-56 rounded-full bg-slate-100 blur-3xl" />
        <div className="absolute right-[10%] top-[45%] h-72 w-72 rounded-full bg-slate-100/80 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionEyebrow>Vilka är vi</SectionEyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05 }}
            className="mt-6 text-4xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl"
          >
            Vi bygger Hireon för att jobbsökande ska kännas smartare, tydligare och mindre ensamt
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg"
          >
            Att söka jobb idag är ofta fullt av osäkerhet. Vad ska man skriva? Vad saknas? Varför får vissa svar och andra inte? Vi byggde Hireon för att göra den processen mer begriplig — med AI som faktiskt hjälper dig framåt.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/#demo"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(15,23,42,0.20)] transition hover:bg-slate-800"
            >
              Testa Hireon
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
            >
              Se planer
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-16 grid gap-4 md:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.value}
              className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur"
            >
              <p className="text-2xl font-semibold tracking-tight text-slate-950">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-[32px] border border-slate-200/80 bg-slate-950 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]"
          >
            <SectionEyebrow>Problemet</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Jobbsökande är ofta fullt av brus
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
              Många vet att de borde förbättra sitt CV eller anpassa sin ansökan, men få vet exakt hur. Resultatet blir att man skickar iväg dokument utan att veta om de faktiskt håller.
            </p>

            <div className="mt-8 space-y-3">
              {problems.map((problem) => (
                <div
                  key={problem}
                  className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-white/85"
                >
                  {problem}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-[32px] border border-slate-200/80 bg-white/85 p-7 shadow-[0_24px_70px_rgba(15,23,42,0.06)] backdrop-blur"
              >
                <SectionEyebrow>{value.eyebrow}</SectionEyebrow>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {value.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 text-center">
          <SectionEyebrow>Lösningen</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Hireon är byggt för att hjälpa dig hela vägen
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-8 text-slate-600 sm:text-base">
            Inte bara för att skapa ett CV, utan för att hjälpa dig förstå vad som faktiskt ökar dina chanser att få en intervju och komma vidare.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {solutions.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-7 shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-slate-100 blur-2xl transition duration-300 group-hover:scale-110" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="overflow-hidden rounded-[36px] border border-slate-200/80 bg-slate-950 px-6 py-10 text-white shadow-[0_30px_100px_rgba(15,23,42,0.18)] sm:px-10 sm:py-14"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <SectionEyebrow>Vår vision</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Vi vill att fler ska förstå hur man faktiskt blir bättre
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
                Hireon ska göra jobbsökande smartare, enklare och mindre ensamt. Alla ska kunna förstå hur man förbättrar sin ansökan utan att behöva gissa, känna sig osäker eller börja om från noll varje gång.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                "Tydligare väg från CV till intervju",
                "Feedback som känns konkret och användbar",
                "Ett smartare system för varje steg i processen",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 text-sm leading-7 text-white/90"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="rounded-[36px] border border-slate-200/80 bg-white/85 px-6 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.06)] backdrop-blur sm:px-10 sm:py-14"
        >
          <SectionEyebrow>Detta är bara början</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Vi fortsätter bygga för att hjälpa dig hela vägen till jobb
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-600 sm:text-base">
            Hireon kommer fortsätta utvecklas med bättre vägledning, tydligare matchning och en ännu starkare produktupplevelse för jobbsökande.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/#demo"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
            >
              Testa Hireon
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
            >
              Se priser
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}