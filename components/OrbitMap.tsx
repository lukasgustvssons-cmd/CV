"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Sparkles,
  FileText,
  Target,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

type RoleData = {
  name: string;
  score: number;
  cvFocus: string;
  applicationFocus: string;
  interviewFocus: string;
  strengths: string[];
};

const roles: RoleData[] = [
  {
    name: "Säljare",
    score: 92,
    cvFocus: "Lyft resultat, kundkontakt och tydliga säljsiffror.",
    applicationFocus: "Visa energi, affärsdriv och varför du kan skapa förtroende snabbt.",
    interviewFocus: "Förbered exempel på hur du stängt affärer och hanterat invändningar.",
    strengths: ["Resultatfokus", "Kommunikation", "Driv"],
  },
  {
    name: "Lärare",
    score: 89,
    cvFocus: "Betona pedagogik, struktur och hur du skapar trygg lärmiljö.",
    applicationFocus: "Knyt din erfarenhet till elevutveckling och samarbete med kollegor.",
    interviewFocus: "Var redo att prata om ledarskap i klassrummet och anpassad undervisning.",
    strengths: ["Pedagogik", "Ledarskap", "Trygghet"],
  },
  {
    name: "Ingenjör",
    score: 94,
    cvFocus: "Framhäv tekniska projekt, problemlösning och mätbara resultat.",
    applicationFocus: "Visa hur du bidrar med struktur, analys och förbättringar.",
    interviewFocus: "Förbered konkreta case där du löst komplexa tekniska problem.",
    strengths: ["Problemlösning", "Analys", "Teknisk höjd"],
  },
  {
    name: "Ekonom",
    score: 88,
    cvFocus: "Lyft analys, noggrannhet och erfarenhet av rapportering eller budget.",
    applicationFocus: "Visa att du skapar kontroll, insikt och affärsvärde.",
    interviewFocus: "Förbered exempel kring avvikelser, uppföljning och förbättringsarbete.",
    strengths: ["Noggrannhet", "Affärsförståelse", "Analys"],
  },
  {
    name: "Jurist",
    score: 84,
    cvFocus: "Visa specialisering, utredning, rådgivning och skriftlig precision.",
    applicationFocus: "Betona förtroende, struktur och juridisk säkerhet.",
    interviewFocus: "Förbered resonemang kring bedömningar, ansvar och klientdialog.",
    strengths: ["Precision", "Ansvar", "Resonemang"],
  },
  {
    name: "Polis",
    score: 81,
    cvFocus: "Framhäv lugn under press, omdöme och samarbete i skarpa lägen.",
    applicationFocus: "Visa samhällsansvar, beslutsförmåga och integritet.",
    interviewFocus: "Förbered exempel på konflikthantering och prioritering under stress.",
    strengths: ["Omdöme", "Integritet", "Lugn"],
  },
  {
    name: "Läkare",
    score: 86,
    cvFocus: "Betona klinisk erfarenhet, patientfokus och medicinskt ansvar.",
    applicationFocus: "Visa trygghet, beslutsförmåga och god samverkan i team.",
    interviewFocus: "Förbered exempel kring patientsäkerhet och prioritering.",
    strengths: ["Patientsäkerhet", "Ansvar", "Samverkan"],
  },
  {
    name: "Psykolog",
    score: 85,
    cvFocus: "Lyft samtalsmetodik, bedömning och professionellt bemötande.",
    applicationFocus: "Visa hur du kombinerar empati med struktur och kvalitet.",
    interviewFocus: "Förbered resonemang kring behandling, bedömning och samarbete.",
    strengths: ["Empati", "Bedömning", "Trygghet"],
  },
  {
    name: "Pedagog",
    score: 87,
    cvFocus: "Betona utveckling, bemötande och förmågan att skapa struktur.",
    applicationFocus: "Visa hur du hjälper människor växa genom tydlighet och närvaro.",
    interviewFocus: "Förbered exempel där du anpassat stöd efter individens behov.",
    strengths: ["Utveckling", "Struktur", "Bemötande"],
  },
  {
    name: "Byggare",
    score: 83,
    cvFocus: "Lyft ansvar, kvalitet, säkerhet och erfarenhet från konkreta projekt.",
    applicationFocus: "Visa att du levererar praktiskt, pålitligt och effektivt.",
    interviewFocus: "Förbered exempel kring teamwork, problemlösning och arbetsmiljö.",
    strengths: ["Pålitlighet", "Kvalitet", "Tempo"],
  },
];

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-28 w-28">
      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="44"
          fill="none"
          stroke="rgba(148,163,184,0.18)"
          strokeWidth="10"
        />
        <motion.circle
          cx="60"
          cy="60"
          r="44"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold tracking-tight text-slate-950">
          {score}
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Match
        </div>
      </div>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      layout
      className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl"
    >
      <div className="mb-4 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </motion.div>
  );
}

export default function OrbitMap() {
  const [activeRole, setActiveRole] = useState<RoleData>(roles[2]);

  const scoreLabel = useMemo(() => {
    if (activeRole.score >= 90) return "Stark match";
    if (activeRole.score >= 85) return "Bra match";
    return "Relevant match";
  }, [activeRole.score]);

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500"
        >
          NEXOR-kompassen
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.04 }}
          className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl"
        >
          Se hur NEXOR anpassar sig efter rollen du vill ha
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base"
        >
          Välj en roll och se hur CV, ansökan och intervjuförberedelse skiftar
          för att passa jobbet bättre.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-16 overflow-hidden rounded-[36px] border border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.10)] sm:p-8 lg:p-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.96),rgba(255,255,255,0.65)_38%,transparent_72%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

        <div className="relative z-10">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            {roles.map((role) => {
              const isActive = activeRole.name === role.name;

              return (
                <button
                  key={role.name}
                  type="button"
                  onClick={() => setActiveRole(role)}
                  className={[
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                    "backdrop-blur-xl",
                    isActive
                      ? "border-slate-900 bg-slate-950 text-white shadow-[0_14px_40px_rgba(15,23,42,0.18)]"
                      : "border-white/80 bg-white/78 text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:bg-white",
                  ].join(" ")}
                >
                  {role.name}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole.name}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
              transition={{ duration: 0.35 }}
              className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
            >
              <div className="rounded-[30px] border border-white/75 bg-white/82 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Vald roll
                    </p>
                    <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                      {activeRole.name}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                      NEXOR vrider fokus mot det som är viktigast för just den här
                      rollen — så att ditt CV och din ansökan känns mer träffsäkra.
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <ScoreRing score={activeRole.score} />
                    <span className="mt-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                      {scoreLabel}
                    </span>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <InsightCard
                    icon={FileText}
                    title="CV-fokus"
                    text={activeRole.cvFocus}
                  />
                  <InsightCard
                    icon={Sparkles}
                    title="Ansökan"
                    text={activeRole.applicationFocus}
                  />
                  <InsightCard
                    icon={Target}
                    title="Intervju"
                    text={activeRole.interviewFocus}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-[30px] border border-slate-900 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                        NEXOR ser detta
                      </p>
                      <h4 className="text-xl font-semibold tracking-tight">
                        Det här bör du lyfta mest
                      </h4>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {activeRole.strengths.map((strength, index) => (
                      <motion.div
                        key={strength}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.06 }}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <CheckCircle2 className="h-4 w-4 text-white/90" />
                        <span className="text-sm text-white/90">{strength}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/75 bg-white/82 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Så fungerar flödet
                  </p>

                  <div className="mt-4 flex items-center gap-3 text-sm text-slate-700">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                      CV
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                      Matchning
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                      Intervju
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    NEXOR hjälper dig först bygga ett starkare underlag, sedan
                    förstå vilka jobb som passar bäst, och därefter vässa nästa steg.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
