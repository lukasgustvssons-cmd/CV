"use client";

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export default function OrbitMap() {
  const center: Node = { id: "hireon", label: "Hireon", x: 50, y: 54 };

  const firstLayer: Node[] = [
    { id: "apply", label: "Ansök", x: 28, y: 68 },
    { id: "interview", label: "Intervju", x: 72, y: 68 },
    { id: "jobs", label: "Jobb", x: 50, y: 28 },
  ];

  const jobChildren: Node[] = [
    { id: "larare", label: "Lärare", x: 16, y: 16 },
    { id: "saljare", label: "Säljare", x: 29, y: 10 },
    { id: "byggare", label: "Byggare", x: 41, y: 7 },
    { id: "pedagog", label: "Pedagog", x: 59, y: 7 },
    { id: "psykolog", label: "Psykolog", x: 71, y: 10 },
    { id: "lakare", label: "Läkare", x: 84, y: 16 },
    { id: "polis", label: "Polis", x: 24, y: 24 },
    { id: "ingenjor", label: "Ingenjör", x: 50, y: 14 },
    { id: "jurist", label: "Jurist", x: 76, y: 24 },
    { id: "ekonom", label: "Ekonom", x: 88, y: 24 },
  ];

  const jobsNode = firstLayer.find((n) => n.id === "jobs")!;

  const renderNode = (node: Node, variant: "center" | "primary" | "job" = "job") => {
    const styles =
      variant === "center"
        ? "bg-slate-950 text-white border-slate-950 shadow-2xl px-6 py-3 text-base"
        : variant === "primary"
        ? "bg-white text-slate-900 border-slate-300 shadow-lg px-4 py-2.5 text-sm"
        : "bg-white/95 text-slate-700 border-slate-200 shadow-md px-3.5 py-2 text-xs sm:text-sm";

    return (
      <div
        key={node.id}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${node.x}%`, top: `${node.y}%` }}
      >
        <div
          className={[
            "rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
            styles,
          ].join(" ")}
        >
          {node.label}
        </div>
      </div>
    );
  };

  const line = (from: Node, to: Node, key: string) => (
    <line
      key={key}
      x1={`${from.x}%`}
      y1={`${from.y}%`}
      x2={`${to.x}%`}
      y2={`${to.y}%`}
      stroke="rgba(148, 163, 184, 0.45)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  );

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
          Hireon-kartan
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Från Hireon till ansökan, intervju och jobb
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Ett tydligt flöde där ditt CV, dina ansökningar och rätt jobb hänger ihop.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.10),transparent_45%)]" />
        <div className="relative h-[620px] w-full">
          <svg className="absolute inset-0 h-full w-full">
            {firstLayer.map((node) => line(center, node, `center-${node.id}`))}
            {jobChildren.map((child) => line(jobsNode, child, `jobs-${child.id}`))}
          </svg>

          {renderNode(center, "center")}
          {firstLayer.map((node) => renderNode(node, "primary"))}
          {jobChildren.map((node) => renderNode(node, "job"))}
        </div>
      </div>
    </section>
  );
}