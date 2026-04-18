"use client";

import { motion } from "framer-motion";

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: "center" | "primary" | "job";
};

const centerNode: Node = {
  id: "hireon",
  label: "Hireon",
  x: 50,
  y: 56,
  kind: "center",
};

const primaryNodes: Node[] = [
  { id: "jobs", label: "Jobb", x: 50, y: 29, kind: "primary" },
  { id: "apply", label: "Ansök", x: 28, y: 69, kind: "primary" },
  { id: "interview", label: "Intervju", x: 72, y: 69, kind: "primary" },
];

const jobNodes: Node[] = [
  { id: "larare", label: "Lärare", x: 18, y: 18, kind: "job" },
  { id: "saljare", label: "Säljare", x: 30, y: 12, kind: "job" },
  { id: "byggare", label: "Byggare", x: 42, y: 9, kind: "job" },
  { id: "ingenjor", label: "Ingenjör", x: 51, y: 16, kind: "job" },
  { id: "pedagog", label: "Pedagog", x: 59, y: 9, kind: "job" },
  { id: "psykolog", label: "Psykolog", x: 70, y: 12, kind: "job" },
  { id: "lakare", label: "Läkare", x: 82, y: 18, kind: "job" },
  { id: "polis", label: "Polis", x: 25, y: 30, kind: "job" },
  { id: "jurist", label: "Jurist", x: 73, y: 30, kind: "job" },
  { id: "ekonom", label: "Ekonom", x: 84, y: 30, kind: "job" },
];

const allNodes = [centerNode, ...primaryNodes, ...jobNodes];
const jobsNode = primaryNodes.find((node) => node.id === "jobs")!;

function getNodeClasses(kind: Node["kind"]) {
  if (kind === "center") {
    return "bg-slate-950 text-white border-slate-900 shadow-[0_16px_60px_rgba(15,23,42,0.28)]";
  }

  if (kind === "primary") {
    return "bg-white/92 text-slate-900 border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.10)]";
  }

  return "bg-white/78 text-slate-700 border-slate-200/80 shadow-[0_8px_24px_rgba(15,23,42,0.07)]";
}

function getNodeSize(kind: Node["kind"]) {
  if (kind === "center") return "px-7 py-3.5 text-base sm:text-lg";
  if (kind === "primary") return "px-5 py-3 text-sm sm:text-[15px]";
  return "px-4 py-2 text-xs sm:text-sm";
}

function NetworkLine({
  from,
  to,
  delay = 0,
}: {
  from: Node;
  to: Node;
  delay?: number;
}) {
  return (
    <>
      <motion.line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        stroke="rgba(148,163,184,0.34)"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, delay, ease: "easeOut" }}
      />
      <motion.line
        x1={`${from.x}%`}
        y1={`${from.y}%`}
        x2={`${to.x}%`}
        y2={`${to.y}%`}
        stroke="url(#lineGlow)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="10 14"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.9 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.3, delay: delay + 0.1, ease: "easeOut" }}
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-48" dur="4s" repeatCount="indefinite" />
      </motion.line>
    </>
  );
}

function OrbitNode({ node, index }: { node: Node; index: number }) {
  const floatY = node.kind === "center" ? [0, -4, 0] : [0, -6, 0];
  const duration = node.kind === "center" ? 5.5 : 6.5 + (index % 4) * 0.6;

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: 0.7,
        delay: 0.08 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      animate={{ y: floatY }}
    >
      <motion.div
        whileHover={{
          y: -4,
          scale: 1.03,
          transition: { duration: 0.22, ease: "easeOut" },
        }}
        animate={{
          boxShadow:
            node.kind === "center"
              ? [
                  "0 16px 60px rgba(15,23,42,0.22)",
                  "0 18px 75px rgba(15,23,42,0.32)",
                  "0 16px 60px rgba(15,23,42,0.22)",
                ]
              : [
                  "0 10px 30px rgba(15,23,42,0.08)",
                  "0 14px 34px rgba(15,23,42,0.12)",
                  "0 10px 30px rgba(15,23,42,0.08)",
                ],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={[
          "group relative rounded-2xl border backdrop-blur-xl",
          "transition-all duration-300",
          getNodeClasses(node.kind),
          getNodeSize(node.kind),
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-70" />
        <div className="relative z-10 font-medium tracking-tight">{node.label}</div>

        {node.kind === "center" && (
          <>
            <div className="pointer-events-none absolute inset-[-20px] -z-10 rounded-[28px] bg-slate-900/10 blur-2xl" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function OrbitMap() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12 text-center sm:mb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500"
        >
          Hireon-kartan
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl"
        >
          Från Hireon till ansökan, intervju och jobb
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base"
        >
          Ett levande nätverk där CV, ansökningar och jobbmöjligheter binds ihop
          till ett tydligt och smartare jobbsök.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[36px] border border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-white p-4 shadow-[0_30px_120px_rgba(15,23,42,0.10)] sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.95),rgba(255,255,255,0.45)_35%,transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(148,163,184,0.12),transparent_38%)]" />
        <div className="pointer-events-none absolute left-1/2 top-[56%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200/30 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-[56%] h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/60" />

        <div className="relative h-[640px] w-full overflow-hidden">
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(191,219,254,0.35)" />
                <stop offset="50%" stopColor="rgba(148,163,184,0.7)" />
                <stop offset="100%" stopColor="rgba(226,232,240,0.25)" />
              </linearGradient>
            </defs>

            {primaryNodes.map((node, i) => (
              <NetworkLine
                key={`center-${node.id}`}
                from={centerNode}
                to={node}
                delay={0.1 + i * 0.08}
              />
            ))}

            {jobNodes.map((node, i) => (
              <NetworkLine
                key={`jobs-${node.id}`}
                from={jobsNode}
                to={node}
                delay={0.35 + i * 0.05}
              />
            ))}
          </svg>

          {allNodes.map((node, index) => (
            <OrbitNode key={node.id} node={node} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}