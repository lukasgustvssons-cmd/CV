"use client";

import { motion } from "framer-motion";

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export default function OrbitMap() {
  // Center
  const center: Node = { id: "hireon", label: "Hireon", x: 50, y: 50 };

  // First layer
  const firstLayer: Node[] = [
    { id: "apply", label: "Ansök", x: 25, y: 65 },
    { id: "interview", label: "Intervju", x: 75, y: 65 },
    { id: "jobs", label: "Jobb", x: 50, y: 25 },
  ];

  // Second layer (from Jobb)
  const jobChildren: Node[] = [
    { id: "larare", label: "Lärare", x: 20, y: 10 },
    { id: "saljare", label: "Säljare", x: 35, y: 5 },
    { id: "bygg", label: "Byggare", x: 50, y: 3 },
    { id: "pedagog", label: "Pedagog", x: 65, y: 5 },
    { id: "psykolog", label: "Psykolog", x: 80, y: 10 },
    { id: "lakare", label: "Läkare", x: 10, y: 25 },
    { id: "polis", label: "Polis", x: 25, y: 20 },
    { id: "jurist", label: "Jurist", x: 75, y: 20 },
    { id: "ekonom", label: "Ekonom", x: 90, y: 25 },
    { id: "ingenjor", label: "Ingenjör", x: 50, y: 15 },
  ];

  const renderNode = (node: Node, isCenter = false) => (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`absolute -translate-x-1/2 -translate-y-1/2`}
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
      }}
    >
      <div
        className={`px-4 py-2 rounded-xl text-sm backdrop-blur-md border transition-all duration-300
        ${
          isCenter
            ? "bg-white/10 border-white/20 text-white shadow-[0_0_40px_rgba(255,255,255,0.2)] scale-110"
            : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/30 hover:scale-105"
        }`}
      >
        {node.label}
      </div>
    </motion.div>
  );

  const line = (from: Node, to: Node) => (
    <line
      key={`${from.id}-${to.id}`}
      x1={`${from.x}%`}
      y1={`${from.y}%`}
      x2={`${to.x}%`}
      y2={`${to.y}%`}
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="1.5"
    />
  );

  return (
    <section className="relative w-full h-[600px] my-32">
      <div className="absolute inset-0">
        <svg className="w-full h-full">
          {/* Center → First layer */}
          {firstLayer.map((node) => line(center, node))}

          {/* Jobb → children */}
          {jobChildren.map((child) =>
            line(firstLayer.find((n) => n.id === "jobs")!, child)
          )}
        </svg>
      </div>

      {/* Nodes */}
      {renderNode(center, true)}
      {firstLayer.map((node) => renderNode(node))}
      {jobChildren.map((node) => renderNode(node))}
    </section>
  );
}