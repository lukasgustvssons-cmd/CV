"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, SignUpButton } from "@clerk/nextjs";
import type { Lang } from "../lib/translations";
import { StyledResume } from "./StyledResume";
import { JobMatches } from "./JobMatches";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const GUEST_CV_KEY = "hireon_guest_cv_created";

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
  const { isSignedIn } = useUser();

  const [experience, setExperience] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [location, setLocation] = useState("");
  const [guestLimitReached, setGuestLimitReached] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cvRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const isSwedish = lang === "sv";

  const panelCopy = {
    eyebrow: isSwedish ? "SÅ SER DET UT" : "SEE HOW IT WORKS",
    title: isSwedish
      ? "Skapa ett starkare CV på några minuter"
      : "Create a stronger resume in a few minutes",
    description: isSwedish
      ? "Fyll i din erfarenhet och vilken roll du söker. Hireon hjälper dig formulera ett tydligt och professionellt CV direkt."
      : "Add your experience and the role you want. Hireon helps you turn it into a clear and professional resume right away.",
    formTitle: isSwedish ? "Skapa ditt CV" : "Create your resume",
    formDescription: isSwedish
      ? "Lägg till din bakgrund och målroll nedan."
      : "Add your background and target role below.",
    previewTitle: isSwedish ? "Förhandsvisning" : "Preview",
    previewDescription: isSwedish
      ? "Så här kan ditt CV se ut."
      : "This is how your resume can look.",
    emptyTitle: isSwedish
      ? "Din CV-förhandsvisning visas här"
      : "Your resume preview appears here",
    emptyText: isSwedish
      ? "Fyll i din erfarenhet och målroll, och klicka sedan på Generera CV."
      : "Fill in your experience and target role, then click Generate resume.",
    save: isSwedish ? "Spara CV" : "Save resume",
    signupGateTitle: isSwedish
      ? "Skapa konto för att fortsätta"
      : "Create an account to continue",
    signupGateText: isSwedish
      ? "Du har använt ditt gratis-CV. Skapa ett konto för att fortsätta skapa och spara CV."
      : "You’ve used your free resume. Create an account to continue creating and saving resumes.",
    signupGateButton: isSwedish ? "Skapa konto" : "Create account",
  };

  useEffect(() => {
    const updateScale = () => {
      if (!previewContainerRef.current) return;

      const containerWidth = previewContainerRef.current.offsetWidth;
      const isDesktop = window.innerWidth >= 1024;
      const availableWidth = isDesktop
        ? containerWidth - 120
        : containerWidth - 32;

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      setGuestLimitReached(false);
      return;
    }

    const hasCreatedGuestCv = localStorage.getItem(GUEST_CV_KEY) === "true";
    setGuestLimitReached(hasCreatedGuestCv);
  }, [isSignedIn]);

  const handleGenerate = async () => {
    if (!experience.trim() || !job.trim()) {
      setResult(t.validation);
      return;
    }

    if (!isSignedIn && guestLimitReached) {
      setResult(
        isSwedish
          ? "Du har redan skapat ett gratis CV. Skapa konto för att fortsätta."
          : "You already created one free resume. Create an account to continue."
      );
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
        setGuestLimitReached(true);
        return;
      }

      if (!res.ok) {
        setResult(data.output || t.error);
        return;
      }

      setResult(data.output || t.error);

      if (!isSignedIn && data.output) {
        localStorage.setItem(GUEST_CV_KEY, "true");
      }
    } catch {
      setResult(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCv = async () => {
    if (!result.trim()) return;

    try {
      const res = await fetch("/api/save-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "cv",
          title:
            lang === "sv"
              ? `CV för ${job || "vald roll"}`
              : `Resume for ${job || "selected role"}`,
          content: result,
          meta: {
            targetJob: job,
            location,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            (lang === "sv" ? "Kunde inte spara CV." : "Could not save resume.")
        );
      }

      alert(lang === "sv" ? "CV sparat." : "Resume saved.");
    } catch (error: any) {
      alert(
        error?.message ||
          (lang === "sv" ? "Kunde inte spara CV." : "Could not save resume.")
      );
    }
  };

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
    <section
      id="demo"
      className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mb-10 text-center sm:mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
          {panelCopy.eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          {panelCopy.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-relaxed">
          {panelCopy.description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft sm:rounded-[28px] sm:p-8">
          <div className="mb-5 sm:mb-6">
            <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
              {panelCopy.formTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {panelCopy.formDescription}
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
                className="min-h-[160px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 sm:min-h-[180px] sm:py-4"
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
                className="min-h-[160px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 sm:min-h-[180px] sm:py-4"
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

            {!isSignedIn && guestLimitReached ? (
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="w-full rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:py-4"
                >
                  {lang === "sv"
                    ? "Skapa konto för att fortsätta"
                    : "Create account to continue"}
                </button>
              </SignUpButton>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
              >
                {loading ? t.generating : t.generate}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-3 sm:rounded-[28px] sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {panelCopy.previewTitle}
                </h3>
                <p className="text-sm text-slate-600">
                  {panelCopy.previewDescription}
                </p>
              </div>

              {result && (
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={handleSaveCv}
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900 sm:w-auto"
                  >
                    {panelCopy.save}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={downloading}
                    className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {downloading ? t.downloading : t.download}
                  </button>
                </div>
              )}
            </div>

            {!result ? (
              <div className="rounded-[20px] border border-slate-200 bg-white p-4 sm:rounded-[24px] sm:p-6">
                <div className="mx-auto flex min-h-[220px] w-full max-w-2xl items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center sm:min-h-[320px]">
                  <div className="max-w-md">
                    <p className="text-base font-semibold text-slate-800 sm:text-lg">
                      {panelCopy.emptyTitle}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {panelCopy.emptyText}
                    </p>
                  </div>
                </div>
              </div>
            ) : isMobile ? (
              <div className="rounded-[20px] border border-slate-200 bg-white p-4 sm:rounded-[24px] sm:p-6">
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 sm:p-6">
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {isSwedish ? "Mobilförhandsvisning" : "Mobile preview"}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {isSwedish
                        ? "En läsbar version av ditt CV för mobil."
                        : "A readable version of your resume for mobile."}
                    </p>
                  </div>

                  <div className="max-h-[560px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4">
                    <div ref={cvRef} className="text-sm leading-7 text-slate-800">
                      <StyledResume text={result} />
                    </div>
                  </div>

                  {!isSignedIn && guestLimitReached && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                      <h4 className="text-lg font-semibold text-slate-900 sm:text-xl">
                        {panelCopy.signupGateTitle}
                      </h4>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {panelCopy.signupGateText}
                      </p>

                      <div className="mt-5">
                        <SignUpButton mode="modal">
                          <button
                            type="button"
                            className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                          >
                            {panelCopy.signupGateButton}
                          </button>
                        </SignUpButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                ref={previewContainerRef}
                className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-[#e9edf3] p-2 sm:rounded-[24px] sm:p-4 lg:p-5"
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
                    <div className="relative">
                      <div
                        ref={cvRef}
                        className="h-[1123px] w-[794px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
                      >
                        <div className="px-[72px] py-[76px] text-[15px] leading-[1.75] text-slate-900">
                          <StyledResume text={result} />
                        </div>
                      </div>

                      {!isSignedIn && guestLimitReached && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/75 p-3 backdrop-blur-sm sm:p-6">
                          <div className="mx-auto w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-5 text-center shadow-xl sm:rounded-3xl sm:p-8">
                            <h4 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                              {panelCopy.signupGateTitle}
                            </h4>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                              {panelCopy.signupGateText}
                            </p>

                            <div className="mt-6">
                              <SignUpButton mode="modal">
                                <button
                                  type="button"
                                  className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                                >
                                  {panelCopy.signupGateButton}
                                </button>
                              </SignUpButton>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {result && !guestLimitReached && (
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