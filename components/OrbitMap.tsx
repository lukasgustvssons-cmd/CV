"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useCallback } from "react";

type RoleNode = {
  label: string;
  x: string;
  y: string;
};

const roles: RoleNode[] = [
  { label: "Säljare", x: "28%", y: "22%" },
  { label: "Lärare", x: "37%", y: "16%" },
  { label: "Ingenjör", x: "50%", y: "14%" },
  { label: "Ekonom", x: "63%", y: "18%" },
  { label: "Jurist", x: "74%", y: "26%" },
  { label: "Polis", x: "30%", y: "34%" },
  { label: "Läkare", x: "70%", y: "34%" },
  { label: "Psykolog", x: "61%", y: "22%" },
  { label: "Pedagog", x: "44%", y: "20%" },
  { label: "Byggare", x: "50%", y: "27%" },
];

function MapNode({
  label,
  size = "default",
  delay = 0,
}: {
  label: string;
  size?: "default" | "large" | "center";
  delay?: number;
}) {
  const sizeClasses =
    size === "center"
      ? "px-7 py-3.5 text-base sm:text-lg rounded-2xl"
      : size === "large"
      ? "px-5 py-2.5 text-sm sm:text-[15px] rounded-full"
      : "px-4 py-2 text-sm rounded-full";

  const colorClasses =
    size === "center"
      ? "border-slate-900 bg-slate-950 text-white shadow-[0_18px_50px_rgba(15,23,42,0.28)]"
      : "border-slate-200/90 bg-white/88 text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.08)]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 10, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      animate={{ y: [0, -3, 0] }}
      whileHover={{
        y: -5,
        scale: 1.04,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className="group relative"
    >
      <div
        className={[
          "relative border backdrop-blur-xl transition-all duration-300",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]",
          "before:bg-gradient-to-b before:from-white/40 before:to-transparent before:opacity-80",
          "group-hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)]",
          sizeClasses,
          colorClasses,
        ].join(" ")}
      >
        <div className="relative z-10 font-medium tracking-tight">{label}</div>

        <div className="pointer-events-none absolute inset-[-8px] -z-10 rounded-[inherit] bg-slate-300/0 blur-xl transition duration-300 group-hover:bg-slate-300/40" />
      </div>
    </motion.div>
  );
}

export default function OrbitMap() {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const glowBg = useMotionTemplate`radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.9), rgba(255,255,255,0.35) 16%, rgba(226,232,240,0.18) 30%, transparent 52%)`;

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-28 text-center sm:px-6 lg:px-8">
      <p className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-500">
        Hireon-kartan
      </p>

      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        Från CV till riktiga möjligheter
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-slate-600">
        Ett levande nätverk där ansökningar, intervjuer och jobb hänger ihop
        runt Hireon.
      </p>

      <motion.div
        onMouseMove={handleMouseMove}
        className="relative mt-20 h-[620px] overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white shadow-[0_30px_120px_rgba(15,23,42,0.10)]"
      >
        <motion.div
          style={{ background: glowBg }}
          className="pointer-events-none absolute inset-0 opacity-80"
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.12),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(255,255,255,0.88)_82%)]" />

        <motion.div
          animate={{ x: [0, 10, 0], y: [0, -6, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[18%] top-[18%] h-40 w-40 rounded-full bg-white/35 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -12, 0], y: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[14%] top-[16%] h-44 w-44 rounded-full bg-slate-200/35 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 8, 0], y: [0, 10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200/35 blur-3xl"
        />

        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="coreLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(148,163,184,0.18)" />
              <stop offset="50%" stopColor="rgba(148,163,184,0.42)" />
              <stop offset="100%" stopColor="rgba(148,163,184,0.18)" />
            </linearGradient>

            <linearGradient id="roleLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(203,213,225,0.18)" />
              <stop offset="50%" stopColor="rgba(148,163,184,0.42)" />
              <stop offset="100%" stopColor="rgba(226,232,240,0.18)" />
            </linearGradient>
          </defs>

          {roles.map((role, i) => (
            <motion.line
              key={role.label}
              x1="50%"
              y1="55%"
              x2={role.x}
              y2={role.y}
              stroke="url(#roleLine)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.05 * i,
                ease: "easeOut",
              }}
            />
          ))}

          <motion.line
            x1="50%"
            y1="55%"
            x2="50%"
            y2="30%"
            stroke="url(#coreLine)"
            strokeWidth="1.7"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
          <motion.line
            x1="50%"
            y1="55%"
            x2="30%"
            y2="76%"
            stroke="url(#coreLine)"
            strokeWidth="1.7"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.08, ease: "easeOut" }}
          />
          <motion.line
            x1="50%"
            y1="55%"
            x2="70%"
            y2="76%"
            stroke="url(#coreLine)"
            strokeWidth="1.7"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.16, ease: "easeOut" }}
          />
        </svg>

        <motion.div
          animate={{ x: [0, 6, 0], y: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-[55%] z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="pointer-events-none absolute inset-[-28px] rounded-[36px] bg-slate-300/30 blur-2xl" />
            <MapNode label="Hireon" size="center" />
          </div>
        </motion.div>

        <motion.div
          animate={{ x: [0, 2, 0], y: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-[30%] z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ transform: "translate(-50%, -50%) translateZ(24px)" }}
        >
          <MapNode label="Jobb" size="large" delay={0.15} />
        </motion.div>

        <motion.div
          animate={{ x: [0, -3, 0], y: [0, -2, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[30%] top-[76%] z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ transform: "translate(-50%, -50%) translateZ(16px)" }}
        >
          <MapNode label="Ansök" size="large" delay={0.22} />
        </motion.div>

        <motion.div
          animate={{ x: [0, 3, 0], y: [0, -2, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[70%] top-[76%] z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ transform: "translate(-50%, -50%) translateZ(16px)" }}
        >
          <MapNode label="Intervju" size="large" delay={0.28} />
        </motion.div>

        {roles.map((role, i) => (
          <motion.div
            key={role.label}
            className="absolute z-0 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: role.x,
              top: role.y,
              transform: `translate(-50%, -50%) translateZ(${6 + (i % 4) * 4}px)`,
            }}
            animate={{
              y: [0, -4 - (i % 2), 0],
              x: [0, i % 2 === 0 ? 2 : -2, 0],
            }}
            transition={{
              duration: 5.2 + (i % 4) * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <MapNode label={role.label} delay={0.35 + i * 0.04} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}