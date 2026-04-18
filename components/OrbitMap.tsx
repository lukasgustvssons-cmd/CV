"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const roles = [
  { label: "Säljare", x: "18%", y: "22%" },
  { label: "Lärare", x: "28%", y: "14%" },
  { label: "Ingenjör", x: "50%", y: "10%" },
  { label: "Ekonom", x: "72%", y: "16%" },
  { label: "Jurist", x: "82%", y: "26%" },
  { label: "Polis", x: "16%", y: "34%" },
  { label: "Läkare", x: "78%", y: "34%" },
  { label: "Psykolog", x: "64%", y: "20%" },
  { label: "Pedagog", x: "36%", y: "18%" },
  { label: "Byggare", x: "50%", y: "26%" },
];

function Pill({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-full border border-slate-200/80 bg-white/88 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}
    >
      {label}
    </div>
  );
}

export default function OrbitMap() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const hireonScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.78]);
  const hireonY = useTransform(scrollYProgress, [0, 0.28], [0, 120]);
  const hireonOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.95]);

  const coreOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const coreY = useTransform(scrollYProgress, [0.1, 0.25], [40, 0]);

  const rolesOpacity = useTransform(scrollYProgress, [0.28, 0.48], [0, 1]);
  const rolesScale = useTransform(scrollYProgress, [0.28, 0.55], [0.92, 1]);
  const rolesY = useTransform(scrollYProgress, [0.28, 0.48], [40, 0]);

  const backgroundGlow = useTransform(
    scrollYProgress,
    [0, 0.4, 0.7, 1],
    [0.18, 0.28, 0.4, 0.5]
  );

  const gridOpacity = useTransform(scrollYProgress, [0, 0.35], [0.04, 0.1]);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mb-12 text-center sm:mb-16">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Hireon-kartan
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
          Scrolla ut från Hireon till fler möjligheter
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          En levande produktsektion där världen öppnas upp runt dig — från CV
          och ansökan till intervjuer, jobb och roller som passar bättre.
        </p>
      </div>

      <div className="relative h-[220vh]">
        <div className="sticky top-20 overflow-hidden rounded-[36px] border border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-white shadow-[0_30px_120px_rgba(15,23,42,0.10)]">
          <div className="relative h-[78vh] min-h-[680px] w-full">
            <motion.div
              style={{ opacity: gridOpacity }}
              className="pointer-events-none absolute inset-0"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)",
                  backgroundSize: "56px 56px",
                }}
              />
            </motion.div>

            <motion.div
              style={{ opacity: backgroundGlow }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200 blur-3xl"
            />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.92),rgba(255,255,255,0.65)_35%,transparent_70%)]" />

            <div className="absolute inset-0">
              <motion.div
                style={{
                  scale: hireonScale,
                  y: hireonY,
                  opacity: hireonOpacity,
                }}
                className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative rounded-[28px] border border-slate-900 bg-slate-950 px-8 py-4 text-lg font-semibold text-white shadow-[0_20px_70px_rgba(15,23,42,0.30)]">
                  <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/15 to-transparent" />
                  <span className="relative z-10">Hireon</span>
                </div>
              </motion.div>

              <motion.div
                style={{ opacity: coreOpacity, y: coreY }}
                className="absolute inset-0 z-20"
              >
                <div className="absolute left-1/2 top-[34%] -translate-x-1/2">
                  <Pill label="Jobb" className="px-5 py-2.5 text-[15px]" />
                </div>

                <div className="absolute left-[24%] top-[66%] -translate-x-1/2">
                  <Pill label="Ansök" className="px-5 py-2.5 text-[15px]" />
                </div>

                <div className="absolute left-[76%] top-[66%] -translate-x-1/2">
                  <Pill label="Intervju" className="px-5 py-2.5 text-[15px]" />
                </div>

                <svg className="pointer-events-none absolute inset-0 h-full w-full">
                  <motion.line
                    x1="50%"
                    y1="50%"
                    x2="50%"
                    y2="35%"
                    stroke="rgba(148,163,184,0.45)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                  <motion.line
                    x1="50%"
                    y1="50%"
                    x2="25%"
                    y2="66%"
                    stroke="rgba(148,163,184,0.45)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.1, ease: "easeOut" }}
                  />
                  <motion.line
                    x1="50%"
                    y1="50%"
                    x2="75%"
                    y2="66%"
                    stroke="rgba(148,163,184,0.45)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>

              <motion.div
                style={{
                  opacity: rolesOpacity,
                  scale: rolesScale,
                  y: rolesY,
                }}
                className="absolute inset-0 z-10"
              >
                <svg className="pointer-events-none absolute inset-0 h-full w-full">
                  {roles.map((role, i) => (
                    <motion.line
                      key={role.label}
                      x1="50%"
                      y1="35%"
                      x2={role.x}
                      y2={role.y}
                      stroke="rgba(148,163,184,0.34)"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.9,
                        delay: 0.04 * i,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </svg>

                {roles.map((role, i) => (
                  <motion.div
                    key={role.label}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: role.x,
                      top: role.y,
                    }}
                    initial={{ opacity: 0, scale: 0.88, y: 18 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.04 * i,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 4.8 + (i % 4) * 0.45,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Pill label={role.label} />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                style={{
                  opacity: useTransform(scrollYProgress, [0.55, 0.8], [0, 1]),
                  y: useTransform(scrollYProgress, [0.55, 0.8], [30, 0]),
                }}
                className="absolute inset-x-0 bottom-10 z-40 px-6"
              >
                <div className="mx-auto max-w-3xl rounded-[24px] border border-white/70 bg-white/80 p-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
                  <p className="text-sm font-medium text-slate-900 sm:text-base">
                    Hireon hjälper dig att gå från ett CV till riktiga
                    möjligheter — snabbare, smartare och mer träffsäkert.
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Ju längre du går, desto fler roller, jobbspår och nästa steg
                    öppnar sig runt dig.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}