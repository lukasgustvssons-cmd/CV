"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "../lib/translations";
import { StyledResume } from "./StyledResume";
import { JobMatches } from "./JobMatches";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

type DemoPanelProps = {
  lang: Lang;
  t: {
    eyebrow: string;
    title: string;
    description: string;
    formTitle: string;
    formDescription: string;
    experienceLabel: string;
    experiencePlaceholder: string;
    jobLabel: string;
    jobPlaceholder: string;
    locationLabel: string;
    locationPlaceholder: string;
    generate: string;
    generating: string;
    previewTitle: string;
    previewDescription: string;
    download: string;
    downloading: string;
    emptyTitle: string;
    emptyText: string;
    fileName: string;
    validation: string;
    error: string;
  };
};

export function DemoPanel({ lang, t }: DemoPanelProps) {
  const [experience, setExperience] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [location, setLocation] = useState("");

  const cvRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (!previewContainerRef.current) return;

      const containerWidth = previewContainerRef.current.offsetWidth;
      const availableWidth = Math.max(containerWidth - 32, 320);
      const scale = Math.min(1, availableWidth / PAGE_WIDTH);

      setPreviewScale(scale);
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }

    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  const handleGenerate = async () => {
    if (!experience.trim() || !job.trim()) {
      setResult(t.validation);
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ experience, job, lang }),
      });

     const data = await res.json();

if (data.limitReached) {
  setResult(data.output);
  return;
}

setResult(data.output || t.error);

  const handleDownloadPdf = async () => {
  if (!cvRef.current) return;

  try {
    setDownloading(true);

    const html2pdf = (await import("html2pdf.js")).default;

    const options: any = {
      margin: 0,
      filename: t.fileName,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["css", "legacy"],
      },
    };

    await html2pdf().set(options).from(cvRef.current).save();
  } catch (error) {
    console.error(error);
    alert(
      lang === "sv"
        ? "Kunde inte ladda ner PDF."
        : "Could not download PDF."
    );
  } finally {
    setDownloading(false);
  }
};

  return (
    <section id="demo" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {t.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          {t.description}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900">
              {t.formTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {t.formDescription}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t.experienceLabel}
              </label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder={t.experiencePlaceholder}
                className="min-h-[180px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t.jobLabel}
              </label>
              <textarea
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder={t.jobPlaceholder}
                className="min-h-[180px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t.locationLabel}
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.locationPlaceholder}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t.generating : t.generate}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t.previewTitle}
                </h3>
                <p className="text-sm text-slate-600">{t.previewDescription}</p>
              </div>

              {result && (
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {downloading ? t.downloading : t.download}
                </button>
              )}
            </div>

            <div
              ref={previewContainerRef}
              className="overflow-hidden rounded-[24px] border border-slate-200 bg-[#e9edf3] p-4 sm:p-6"
            >
              <div
                className="mx-auto origin-top"
                style={{
                  width: `${PAGE_WIDTH * previewScale}px`,
                  height: `${PAGE_HEIGHT * previewScale}px`,
                }}
              >
                <div
                  style={{
                    transform: `scale(${previewScale})`,
                    transformOrigin: "top left",
                    width: PAGE_WIDTH,
                    height: PAGE_HEIGHT,
                  }}
                >
                  <div
                    ref={cvRef}
                    className="h-[1123px] w-[794px] bg-white px-[72px] py-[76px] text-[15px] leading-[1.75] text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
                  >
                    {!result ? (
                      <div className="flex min-h-full flex-col items-center justify-center text-center">
                        <div className="w-full max-w-[420px] rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 py-12">
                          <p className="text-lg font-medium text-slate-700">
                            {t.emptyTitle}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-slate-500">
                            {t.emptyText}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <StyledResume text={result} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {result && (
            <JobMatches
              cvText={result}
              lang={lang}
              targetJob={job}
              location={location}
              onCvImproved={setResult}
            />
          )}
        </div>
      </div>
    </section>
  );
}