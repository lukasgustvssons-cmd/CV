"use client";

import { motion } from "framer-motion";
import { Briefcase, FileText, Sparkles, Target, ArrowRight } from "lucide-react";

const roleChips = [
  { label: "Säljare", x: "10%", y: "18%" },
  { label: "Lärare", x: "18%", y: "10%" },
  { label: "Ingenjör", x: "50%", y: "8%" },
  { label: "Ekonom", x: "76%", y: "12%" },
  { label: "Jurist", x: "86%", y: "20%" },
  { label: "Polis", x: "9%", y: "62%" },
  { label: "Läkare", x: "84%", y: "62%" },
  { label: "Psykolog", x: "74%", y: "48%" },
  { label: "Pedagog", x: "22%", y: "48%" },
  { label: "Byggare", x: "48%", y: "72%" },
];

const steps = [
  {
    icon: FileText,
    title: "Skapa",
    text: "Bygg ett skarpare CV och ett bättre första intryck på minuter.",
  },
  {
    icon: Sparkles,
    title: "Matcha",
    text: "Hitta jobb som passar din profil och förstå varför de är rätt för dig.",
  },
  {
    icon: Target,
    title: "Landa jobbet",
    text: "Förbered ansökan och intervju med ett tydligare, smartare flöde.",
  },
];

function FloatingChip({
  label,
  x,
  y,
  delay = 0,
}: {
  label: string;
  x: string;
  y: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="absolute hidden md:block"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      animate={{ y: [0, -5, 0] }}
      whileHover={{ y: -6, scale: 1.04 }}
    >
      <div className="rounded-full border border-white/70 bg-white/72 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.07)] backdrop-blur-xl">
        {label}
      </div>
    </motion.div>
  );
}

function JourneyCard({
  icon: Icon,
  title,
  text,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <div className="absolute inset-0 rounded-[28px] bg-white/40 blur-2xl transition duration-300 group-hover:bg-white/60" />
      <div className="relative h-full rounded-[28px] border border-white/70 bg-white/78 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="mb-5 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>

        <div className="text-left">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-[15px]">
            {text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function OrbitMap() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500"
        >
          Hireon-flödet
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.04 }}
          className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl"
        >
          Ett smartare sätt att gå från CV till jobb
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base"
        >
          Hireon samlar allt i ett tydligt flöde — från första CV-versionen
          till bättre matchning, starkare ansökan och större chans att landa rätt roll.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-16 overflow-hidden rounded-[36px] border border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.10)] sm:p-8 lg:p-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.95),rgba(255,255,255,0.6)_38%,transparent_72%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200/35 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40" />

        {roleChips.map((chip, i) => (
          <FloatingChip
            key={chip.label}
            label={chip.label}
            x={chip.x}
            y={chip.y}
            delay={0.18 + i * 0.03}
          />
        ))}

        <div className="relative z-10">
          <div className="mx-auto mb-10 flex max-w-max items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <Briefcase className="h-4 w-4 text-slate-900" />
            <span>CV, jobbmatchning, ansökan och intervjuförberedelse i ett flöde</span>
          </div>

          <div className="relative mx-auto mb-12 max-w-max">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              animate={{ y: [0, -4, 0] }}
            >
              <div className="relative rounded-[28px] border border-slate-900 bg-slate-950 px-8 py-4 text-white shadow-[0_22px_70px_rgba(15,23,42,0.28)]">
                <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/15 to-transparent" />
                <div className="relative flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                      Din motor
                    </p>
                    <h3 className="text-2xl font-semibold tracking-tight">Hireon</h3>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-[44px] hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent lg:block" />

            <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
              {steps.map((step, index) => (
                <div key={step.title} className="relative">
                  <JourneyCard
                    icon={step.icon}
                    title={step.title}
                    text={step.text}
                    index={index}
                  />

                  {index < steps.length - 1 && (
                    <div className="pointer-events-none absolute right-[-18px] top-1/2 z-20 hidden -translate-y-1/2 lg:block">
                      <div className="rounded-full border border-white/80 bg-white/80 p-2 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mx-auto mt-10 max-w-3xl rounded-[28px] border border-white/75 bg-white/78 p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
          >
            <p className="text-base font-medium text-slate-900 sm:text-lg">
              Mindre friktion. Bättre ansökningar. Fler relevanta möjligheter.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Istället för att hoppa mellan olika verktyg får du ett tydligt system
              som hjälper dig bygga, förbättra och följa upp varje steg i jobbsökandet.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}