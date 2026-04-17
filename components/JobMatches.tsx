"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type JobMatch = {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: "Arbetsförmedlingen";
  score: number;
  color: "green" | "orange" | "red";
  summary: string;
  description?: string;
  missing?: string[];
};

type Props = {
  cvText: string;
  lang: "sv" | "en";
  targetJob: string;
  location: string;
  onCvImproved: (newCv: string) => void;
};

function MatchCircle({
  score,
  color,
}: {
  score: number;
  color: "green" | "orange" | "red";
}) {
  const styles =
    color === "green"
      ? "border-green-300 bg-green-50 text-green-700"
      : color === "orange"
      ? "border-orange-300 bg-orange-50 text-orange-700"
      : "border-red-300 bg-red-50 text-red-700";

  return (
    <div className="flex shrink-0 flex-col items-center self-start">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-sm font-bold sm:h-16 sm:w-16 ${styles}`}
      >
        {score}%
      </motion.div>
      <span className="mt-1 text-xs text-slate-500">Match</span>
    </div>
  );
}

function normalizeText(text: string) {
  return text.toLowerCase().trim();
}

function extractProfileSignals(cvText: string) {
  const text = normalizeText(cvText);

  return {
    sales:
      text.includes("försälj") ||
      text.includes("säljare") ||
      text.includes("sales") ||
      text.includes("kundservice"),
    property:
      text.includes("fastighet") ||
      text.includes("fastighetssköt") ||
      text.includes("property"),
    machine:
      text.includes("maskin") ||
      text.includes("grävmaskin") ||
      text.includes("hjullastare") ||
      text.includes("truck"),
    technical:
      text.includes("tekn") ||
      text.includes("underhåll") ||
      text.includes("drift") ||
      text.includes("repair") ||
      text.includes("maintenance"),
    communication:
      text.includes("kund") ||
      text.includes("kommunikation") ||
      text.includes("service"),
    leadership:
      text.includes("ansvar") ||
      text.includes("led") ||
      text.includes("team"),
  };
}

function getCareerStrengths(cvText: string, lang: "sv" | "en") {
  const isSwedish = lang === "sv";
  const s = extractProfileSignals(cvText);
  const strengths: string[] = [];

  if (s.machine) {
    strengths.push(
      isSwedish
        ? "Praktisk vana kring maskiner eller teknisk utrustning"
        : "Practical exposure to machines or technical equipment"
    );
  }

  if (s.technical) {
    strengths.push(
      isSwedish
        ? "Teknisk förståelse och erfarenhet av underhåll eller drift"
        : "Technical understanding and maintenance or operations experience"
    );
  }

  if (s.property) {
    strengths.push(
      isSwedish
        ? "Erfarenhet från fastighet, drift eller praktiska miljöer"
        : "Background in property, operations, or hands-on environments"
    );
  }

  if (s.sales || s.communication) {
    strengths.push(
      isSwedish
        ? "Starka kund- och kommunikationsfärdigheter"
        : "Strong customer-facing and communication skills"
    );
  }

  if (s.leadership) {
    strengths.push(
      isSwedish
        ? "Vana att ta ansvar och arbeta självständigt"
        : "Ability to take ownership and work independently"
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      isSwedish
        ? "Överförbara styrkor som kan positioneras bättre mot rätt roll"
        : "Transferable strengths that can be positioned better for the right role"
    );
  }

  return strengths.slice(0, 4);
}

function getCareerRecommendation(
  jobs: JobMatch[],
  cvText: string,
  lang: "sv" | "en"
) {
  const isSwedish = lang === "sv";
  const best = jobs[0];
  const strengths = getCareerStrengths(cvText, lang);

  if (!best) {
    return {
      title: isSwedish
        ? "Ingen tydlig rekommendation än"
        : "No clear recommendation yet",
      description: isSwedish
        ? "Vi behöver fler relevanta jobb för att kunna ge en rekommendation."
        : "We need more relevant jobs before giving a recommendation.",
      strengths,
    };
  }

  if (best.score >= 75) {
    return {
      title: isSwedish
        ? `Det här passar dig bäst just nu: ${best.title}`
        : `This looks like your best fit right now: ${best.title}`,
      description: isSwedish
        ? "Din profil ligger redan nära den här typen av roll. Nästa steg är att anpassa CV och ansökan ännu tydligare mot just detta jobb."
        : "Your profile is already close to this kind of role. The next step is to tailor your CV and application even more clearly to this specific job.",
      strengths,
    };
  }

  if (best.score >= 50) {
    return {
      title: isSwedish
        ? `Närmast just nu: ${best.title}`
        : `Closest fit right now: ${best.title}`,
      description: isSwedish
        ? "Du har delar av rätt profil, men du behöver tydligare visa relevant erfarenhet, tekniska moment eller resultat."
        : "You have parts of the right profile, but you need to present relevant experience, technical tasks, or results more clearly.",
      strengths,
    };
  }

  return {
    title: isSwedish
      ? "Du bör rikta dig mot närliggande roller först"
      : "You should target adjacent roles first",
    description: isSwedish
      ? "Din profil matchar ännu inte målet tillräckligt starkt. En bättre väg kan vara att börja i en närliggande roll och bygga mer relevant erfarenhet därifrån."
      : "Your profile does not yet strongly match the target. A better path may be to start with a nearby role and build more relevant experience from there.",
    strengths,
  };
}

function getNextSteps(bestJob: JobMatch | undefined, lang: "sv" | "en") {
  const isSwedish = lang === "sv";

  if (!bestJob) {
    return isSwedish
      ? [
          "Förtydliga vilken typ av roll du siktar på.",
          "Lägg till fler konkreta arbetsuppgifter i din erfarenhet.",
          "Testa en närliggande målroll för bättre matchning.",
        ]
      : [
          "Clarify the exact type of role you are targeting.",
          "Add more concrete work tasks to your experience.",
          "Try a nearby target role for better matching.",
        ];
  }

  if (bestJob.score >= 70) {
    return isSwedish
      ? [
          "Anpassa ditt CV direkt mot det här jobbet.",
          "Skriv ett personligt brev som speglar annonsens viktigaste krav.",
          "Lyft konkreta resultat och relevanta arbetsuppgifter tydligare.",
        ]
      : [
          "Tailor your CV directly for this job.",
          "Write a cover letter that mirrors the ad’s key requirements.",
          "Highlight concrete results and relevant tasks more clearly.",
        ];
  }

  if (bestJob.score >= 45) {
    return isSwedish
      ? [
          "Förstärk ditt CV med mer relevant erfarenhet och nyckelord.",
          "Visa tydligare överförbara styrkor från tidigare roller.",
          "Sök liknande roller där din nuvarande profil står starkare.",
        ]
      : [
          "Strengthen your CV with more relevant experience and keywords.",
          "Show transferable strengths from previous roles more clearly.",
          "Apply to similar roles where your current profile is stronger.",
        ];
  }

  return isSwedish
    ? [
        "Börja med närliggande roller som ligger närmare din nuvarande profil.",
        "Bygg upp mer relevant erfarenhet, utbildning eller certifiering.",
        "Använd ditt CV för att visa motivation och överförbara styrkor tydligare.",
      ]
    : [
        "Start with adjacent roles that are closer to your current profile.",
        "Build more relevant experience, training, or certification.",
        "Use your CV to present motivation and transferable strengths more clearly.",
      ];
}

function getReasonText(job: JobMatch, lang: "sv" | "en") {
  const isSwedish = lang === "sv";

  if (job.score >= 75) {
    return isSwedish
      ? "Du ligger redan starkt mot den här rollen. Det som återstår är främst att paketera erfarenheten bättre och tydligare matcha annonsens språk."
      : "You already align strongly with this role. The main opportunity now is to package your experience better and mirror the language of the ad more clearly.";
  }

  if (job.score >= 50) {
    return isSwedish
      ? "Du har flera relevanta delar i din profil, men arbetsgivaren kommer troligen vilja se ännu tydligare koppling mellan din erfarenhet och rollens krav."
      : "You have several relevant elements in your profile, but the employer will likely want a clearer connection between your experience and the role’s requirements.";
  }

  return isSwedish
    ? "Det här jobbet ligger en bit från din nuvarande profil. För att höja matchningen behöver du antingen mer direkt erfarenhet eller bättre positionering av dina överförbara styrkor."
    : "This role sits some distance from your current profile. To raise the match, you need either more direct experience or better positioning of your transferable strengths.";
}

function ExpandableCard({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -6 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -6 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function JobMatches({
  cvText,
  lang,
  targetJob,
  location,
  onCvImproved,
}: Props) {
  const isSwedish = lang === "sv";

  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [improvingCv, setImprovingCv] = useState(false);
  const [improveMessage, setImproveMessage] = useState("");

  const [coverLetter, setCoverLetter] = useState("");
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [coverLetterError, setCoverLetterError] = useState("");

  const [expandedMissingJobId, setExpandedMissingJobId] =
    useState<string | null>(null);
  const [expandedReasonJobId, setExpandedReasonJobId] =
    useState<string | null>(null);
  const [expandedFitPanel, setExpandedFitPanel] = useState(false);
  const [expandedNextSteps, setExpandedNextSteps] = useState(false);
  const [expandedStrengths, setExpandedStrengths] = useState(false);

  useEffect(() => {
    const runAutoMatch = async () => {
      if (!cvText.trim() || !targetJob.trim()) return;

      try {
        setLoading(true);
        setError("");
        setJobs([]);
        setPlan("");
        setSelectedJobId(null);
        setExpandedMissingJobId(null);
        setExpandedReasonJobId(null);
        setExpandedFitPanel(false);
        setExpandedNextSteps(false);
        setExpandedStrengths(false);
        setCoverLetter("");
        setCoverLetterError("");
        setImproveMessage("");

        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cvText,
            searchQuery: targetJob,
            location,
            lang,
          }),
        });

        const text = await res.text();

        let data: any = {};

        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(
            isSwedish
              ? `API:n returnerade HTML i stället för JSON (status ${res.status}). Kontrollera inloggning eller serverfel.`
              : `The API returned HTML instead of JSON (status ${res.status}). Check authentication or server errors.`
          );
        }

        if (!res.ok) {
          throw new Error(
            data?.error ||
              (isSwedish
                ? `Kunde inte hämta jobb (status ${res.status}).`
                : `Could not fetch jobs (status ${res.status}).`)
          );
        }

        const incomingJobs = Array.isArray(data?.jobs) ? data.jobs : [];
        setJobs(incomingJobs);
        setPlan(String(data?.plan || ""));

        if (incomingJobs.length > 0) {
          setSelectedJobId(incomingJobs[0].id);
        }
      } catch (err: any) {
        setError(
          err?.message ||
            (isSwedish ? "Kunde inte hämta jobb." : "Could not fetch jobs.")
        );
      } finally {
        setLoading(false);
      }
    };

    runAutoMatch();
  }, [cvText, targetJob, location, lang, isSwedish]);

  const isCareerPlus = plan === "career+";
  const canUseSelectedJobTools = isCareerPlus;

  const bestJob = jobs[0];
  const selectedJob =
    jobs.find((job) => job.id === selectedJobId) ?? bestJob ?? null;

  const shortTargetRole = useMemo(() => {
    const cleaned = targetJob.replace(/\s+/g, " ").trim();
    return cleaned.length > 70 ? `${cleaned.slice(0, 70)}...` : cleaned;
  }, [targetJob]);

  const recommendation = useMemo(
    () => getCareerRecommendation(jobs, cvText, lang),
    [jobs, cvText, lang]
  );

  const nextSteps = useMemo(() => getNextSteps(bestJob, lang), [bestJob, lang]);
  const strengths = useMemo(
    () => getCareerStrengths(cvText, lang),
    [cvText, lang]
  );

  const toggleMissing = (jobId: string) => {
    setExpandedMissingJobId((prev) => (prev === jobId ? null : jobId));
  };

  const toggleReason = (jobId: string) => {
    setExpandedReasonJobId((prev) => (prev === jobId ? null : jobId));
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setCoverLetter("");
    setCoverLetterError("");
    setImproveMessage("");
  };

  const handleSaveJob = async (job: JobMatch) => {
    try {
      const res = await fetch("/api/save-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "job",
          title: job.title,
          content: job.description || job.summary || "",
          meta: {
            company: job.company,
            location: job.location,
            url: job.url,
            score: job.score,
            summary: job.summary,
            source: job.source,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            (isSwedish ? "Kunde inte spara jobb." : "Could not save job.")
        );
      }

      alert(isSwedish ? "Jobb sparat." : "Job saved.");
    } catch (error: any) {
      alert(
        error?.message ||
          (isSwedish ? "Kunde inte spara jobb." : "Could not save job.")
      );
    }
  };

  const handleImproveCv = async () => {
    if (!selectedJob) return;

    try {
      setImprovingCv(true);
      setImproveMessage("");

      const res = await fetch("/api/improve-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentCv: cvText,
          jobTitle: selectedJob.title,
          company: selectedJob.company,
          location: selectedJob.location,
          jobDescription:
            selectedJob.description ||
            `${selectedJob.title}\n${selectedJob.summary}\n${
              selectedJob.missing?.join(", ") || ""
            }`,
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            (isSwedish
              ? "Kunde inte förbättra CV:t."
              : "Could not improve the resume.")
        );
      }

      if (data?.output) {
        onCvImproved(data.output);
      }
    } catch (error: any) {
      alert(
        error?.message ||
          (isSwedish
            ? "Något gick fel när CV:t skulle förbättras."
            : "Something went wrong while improving the resume.")
      );
    } finally {
      setImprovingCv(false);
    }
  };

  const handleImproveClick = () => {
    if (!selectedJob) return;

    if (!isCareerPlus) {
      setImproveMessage(
        isSwedish
          ? "Den här funktionen ingår i Career+. Uppgradera för att förbättra ditt CV för det valda jobbet med AI."
          : "This feature is included in Career+. Upgrade to improve your CV for the selected job with AI."
      );
      return;
    }

    handleImproveCv();
  };

  const handleGenerateCoverLetter = async () => {
    if (!selectedJob) return;

    try {
      setGeneratingCoverLetter(true);
      setCoverLetterError("");
      setCoverLetter("");
      setImproveMessage("");

      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvText,
          jobTitle: selectedJob.title,
          company: selectedJob.company,
          jobDescription:
            selectedJob.description ||
            `${selectedJob.title}\n${selectedJob.summary}\n${
              selectedJob.missing?.join(", ") || ""
            }`,
          lang,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            (isSwedish
              ? "Kunde inte skapa personligt brev."
              : "Could not generate cover letter.")
        );
      }

      if (data?.output) {
        setCoverLetter(data.output);
      }
    } catch (error: any) {
      setCoverLetterError(
        error?.message ||
          (isSwedish
            ? "Något gick fel när personligt brev skulle skapas."
            : "Something went wrong while generating the cover letter.")
      );
    } finally {
      setGeneratingCoverLetter(false);
    }
  };

  const handleSaveCoverLetter = async () => {
    if (!coverLetter.trim() || !selectedJob) return;

    try {
      const res = await fetch("/api/save-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "cover_letter",
          title: isSwedish
            ? `Personligt brev för ${selectedJob.title}`
            : `Cover letter for ${selectedJob.title}`,
          content: coverLetter,
          meta: {
            jobTitle: selectedJob.title,
            company: selectedJob.company,
            location: selectedJob.location,
            url: selectedJob.url,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            (isSwedish
              ? "Kunde inte spara personligt brev."
              : "Could not save cover letter.")
        );
      }

      alert(isSwedish ? "Personligt brev sparat." : "Cover letter saved.");
    } catch (error: any) {
      alert(
        error?.message ||
          (isSwedish
            ? "Kunde inte spara personligt brev."
            : "Could not save cover letter.")
      );
    }
  };

  const handleCopyCoverLetter = async () => {
    if (!coverLetter) return;

    try {
      await navigator.clipboard.writeText(coverLetter);
    } catch {
      alert(
        isSwedish
          ? "Kunde inte kopiera personligt brev."
          : "Could not copy cover letter."
      );
    }
  };

  if (error.toLowerCase().includes("upgrade to pro")) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-6 rounded-[24px] border border-yellow-300 bg-yellow-50 p-4 sm:mt-8 sm:rounded-[28px] sm:p-6"
      >
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
          {isSwedish ? "Uppgradera till Pro" : "Upgrade to Pro"}
        </h3>
        <p className="mt-2 text-sm text-slate-700">
          {isSwedish
            ? "AI-jobbmatchning är tillgänglig för Pro och Career+."
            : "AI job matching is available for Pro and Career+."}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:mt-8 sm:rounded-[28px] sm:p-6"
    >
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
            {isSwedish ? "Matchande jobb" : "Matching jobs"}
          </h3>

          {plan && (
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white sm:text-xs">
              {plan}
            </span>
          )}

          {isCareerPlus && (
            <motion.span
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.08 }}
              className="rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-purple-700 sm:text-xs"
            >
              Career+ Insights
            </motion.span>
          )}
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {isSwedish
            ? `Visar jobb baserat på: ${shortTargetRole}${
                location ? ` i eller nära ${location}` : ""
              }`
            : `Showing jobs based on: ${shortTargetRole}${
                location ? ` in or near ${location}` : ""
              }`}
        </p>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600"
        >
          {isSwedish ? "Letar matchande jobb..." : "Finding matching jobs..."}
        </motion.div>
      )}

      {error && !error.toLowerCase().includes("upgrade to pro") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </motion.div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <>
          <div className="relative mb-6">
            <div
              className={
                !isCareerPlus ? "pointer-events-none select-none blur-[3px]" : ""
              }
            >
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="mb-5 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 sm:mb-6 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-700 sm:text-xs">
                      Career+ Dashboard
                    </p>
                    <h4 className="mt-2 text-sm font-semibold text-slate-900 sm:text-base">
                      {isSwedish
                        ? "Premiuminsikter baserat på ditt CV"
                        : "Premium insights based on your CV"}
                    </h4>
                  </div>

                  {bestJob && (
                    <div className="self-start sm:self-auto">
                      <MatchCircle score={bestJob.score} color={bestJob.color} />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                  <button
                    onClick={() => setExpandedFitPanel((prev) => !prev)}
                    className="w-full rounded-full border border-purple-300 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:border-purple-500 hover:bg-purple-50 sm:w-auto"
                  >
                    {expandedFitPanel
                      ? isSwedish
                        ? "Dölj vad som passar bäst"
                        : "Hide best fit"
                      : isSwedish
                      ? "Vad passar mig bäst?"
                      : "What fits me best?"}
                  </button>

                  <button
                    onClick={() => setExpandedNextSteps((prev) => !prev)}
                    className="w-full rounded-full border border-purple-300 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:border-purple-500 hover:bg-purple-50 sm:w-auto"
                  >
                    {expandedNextSteps
                      ? isSwedish
                        ? "Dölj nästa steg"
                        : "Hide next steps"
                      : isSwedish
                      ? "Hur går jag vidare nu?"
                      : "How do I move forward now?"}
                  </button>

                  <button
                    onClick={() => setExpandedStrengths((prev) => !prev)}
                    className="w-full rounded-full border border-purple-300 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:border-purple-500 hover:bg-purple-50 sm:w-auto"
                  >
                    {expandedStrengths
                      ? isSwedish
                        ? "Dölj styrkor"
                        : "Hide strengths"
                      : isSwedish
                      ? "Vilka styrkor ser ni i mitt CV?"
                      : "What strengths do you see in my CV?"}
                  </button>
                </div>

                <ExpandableCard open={expandedFitPanel}>
                  <div className="mt-4 rounded-2xl border border-white bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">
                      {recommendation.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {recommendation.description}
                    </p>
                  </div>
                </ExpandableCard>

                <ExpandableCard open={expandedNextSteps}>
                  <div className="mt-4 rounded-2xl border border-white bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">
                      {isSwedish
                        ? "Så här går du vidare nu"
                        : "How to move forward now"}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-purple-600" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ExpandableCard>

                <ExpandableCard open={expandedStrengths}>
                  <div className="mt-4 rounded-2xl border border-white bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">
                      {isSwedish
                        ? "Styrkor vi ser i din profil"
                        : "Strengths we see in your profile"}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {strengths.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-purple-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ExpandableCard>
              </motion.div>

              {selectedJob && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-slate-900 bg-slate-900 p-4 text-white sm:p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 sm:text-xs">
                    {isSwedish ? "Valt jobb" : "Selected job"}
                  </p>

                  <div className="mt-2 flex flex-col gap-4 sm:mt-3 sm:gap-4">
                    <div>
                      <h4 className="text-base font-semibold break-words">
                        {selectedJob.title}
                      </h4>
                      <p className="mt-1 text-sm text-slate-300 break-words">
                        {selectedJob.company} • {selectedJob.location}
                      </p>

                      {selectedJob.url && selectedJob.url !== "#" && (
                        <a
                          href={selectedJob.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-block text-sm font-semibold text-white underline underline-offset-4"
                        >
                          {isSwedish ? "Öppna annons" : "Open job ad"}
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                      <button
                        onClick={handleImproveClick}
                        disabled={improvingCv}
                        className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {improvingCv
                          ? isSwedish
                            ? "Förbättrar CV..."
                            : "Improving CV..."
                          : isSwedish
                          ? "Förbättra CV för valt jobb"
                          : "Improve CV for selected job"}
                      </button>

                      <button
                        onClick={handleGenerateCoverLetter}
                        disabled={generatingCoverLetter}
                        className="w-full rounded-full border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {generatingCoverLetter
                          ? isSwedish
                            ? "Skapar brev..."
                            : "Generating letter..."
                          : isSwedish
                          ? "Skapa personligt brev"
                          : "Generate cover letter"}
                      </button>
                    </div>
                  </div>

                  {improveMessage && (
                    <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      {improveMessage}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {!isCareerPlus && (
              <div className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center px-3 sm:px-4">
                <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white/95 p-4 text-center shadow-xl backdrop-blur-sm sm:max-w-xs sm:p-5">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                    ✦
                  </div>
                  <h4 className="text-base font-semibold text-slate-900 sm:text-lg">
                    {isSwedish ? "Lås upp med Career+" : "Unlock with Career+"}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {isSwedish
                      ? "Få premiuminsikter, förbättra ditt CV och skapa personligt brev för valt jobb."
                      : "Get premium insights, improve your resume, and generate a cover letter for the selected job."}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                      Career+
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {canUseSelectedJobTools && coverLetterError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {coverLetterError}
            </motion.div>
          )}

          {canUseSelectedJobTools && coverLetter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
                    {isSwedish ? "Personligt brev" : "Cover letter"}
                  </p>
                  <h4 className="mt-2 text-base font-semibold text-slate-900 break-words">
                    {isSwedish
                      ? `Anpassat för ${selectedJob?.title ?? "valt jobb"}`
                      : `Tailored for ${selectedJob?.title ?? "selected job"}`}
                  </h4>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3">
                  <button
                    onClick={handleCopyCoverLetter}
                    className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-slate-50 sm:w-auto"
                  >
                    {isSwedish ? "Kopiera" : "Copy"}
                  </button>

                  <button
                    onClick={handleGenerateCoverLetter}
                    disabled={generatingCoverLetter}
                    className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {generatingCoverLetter
                      ? isSwedish
                        ? "Skapar..."
                        : "Generating..."
                      : isSwedish
                      ? "Skapa ny version"
                      : "Generate again"}
                  </button>

                  <button
                    onClick={handleSaveCoverLetter}
                    className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-slate-50 sm:w-auto"
                  >
                    {isSwedish ? "Spara" : "Save"}
                  </button>
                </div>
              </div>

              <div className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                {coverLetter}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className={`mb-6 rounded-2xl border p-4 ${
              selectedJobId === bestJob?.id
                ? "border-slate-900 bg-white shadow-sm"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
                  {isSwedish ? "Bästa match" : "Best match"}
                </p>

                <h4 className="mt-2 break-words text-base font-semibold text-slate-900">
                  {bestJob?.title}
                </h4>
                <p className="mt-1 break-words text-sm text-slate-600">
                  {bestJob?.company} • {bestJob?.location}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {bestJob?.summary}
                </p>

                {bestJob?.url && bestJob.url !== "#" && (
                  <a
                    href={bestJob.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm font-semibold text-slate-900 underline"
                  >
                    {isSwedish ? "Öppna annons" : "Open job ad"}
                  </a>
                )}

                {isCareerPlus && bestJob?.missing && bestJob.missing.length > 0 && (
                  <div className="mt-3 rounded-xl border border-purple-200 bg-purple-50 px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                      {isSwedish ? "Det som saknas mest" : "Main missing areas"}
                    </p>
                    <p className="mt-2 break-words text-sm text-slate-700">
                      {bestJob.missing.join(", ")}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                  {bestJob && (
                    <button
                      onClick={() => handleSaveJob(bestJob)}
                      className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-white sm:w-auto"
                    >
                      {isSwedish ? "Spara jobb" : "Save job"}
                    </button>
                  )}

                  {canUseSelectedJobTools && bestJob && (
                    <button
                      onClick={() => handleSelectJob(bestJob.id)}
                      className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold transition sm:w-auto ${
                        selectedJobId === bestJob.id
                          ? "bg-slate-900 text-white"
                          : "border border-slate-300 text-slate-900 hover:border-slate-900"
                      }`}
                    >
                      {selectedJobId === bestJob.id
                        ? isSwedish
                          ? "Valt jobb"
                          : "Selected"
                        : isSwedish
                        ? "Välj detta jobb"
                        : "Select this job"}
                    </button>
                  )}

                  {isCareerPlus && bestJob && (
                    <>
                      <button
                        onClick={() => toggleMissing(bestJob.id)}
                        className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-white sm:w-auto"
                      >
                        {expandedMissingJobId === bestJob.id
                          ? isSwedish
                            ? "Dölj vad som saknas"
                            : "Hide missing items"
                          : isSwedish
                          ? "Visa vad som saknas"
                          : "Show missing items"}
                      </button>

                      <button
                        onClick={() => toggleReason(bestJob.id)}
                        className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-white sm:w-auto"
                      >
                        {expandedReasonJobId === bestJob.id
                          ? isSwedish
                            ? "Dölj analys"
                            : "Hide analysis"
                          : isSwedish
                          ? "Varför är matchen inte högre?"
                          : "Why isn’t the match higher?"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {bestJob && (
                <div className="self-start">
                  <MatchCircle score={bestJob.score} color={bestJob.color} />
                </div>
              )}
            </div>

            <ExpandableCard
              open={
                isCareerPlus &&
                !!bestJob &&
                expandedMissingJobId === bestJob.id
              }
            >
              <div className="mt-4 rounded-2xl border border-purple-200 bg-purple-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  {isSwedish ? "Det här saknas mest" : "Main missing areas"}
                </p>

                {bestJob?.missing && bestJob.missing.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {bestJob.missing.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-purple-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-700">
                    {isSwedish
                      ? "Ingen extra information tillgänglig ännu."
                      : "No extra information available yet."}
                  </p>
                )}
              </div>
            </ExpandableCard>

            <ExpandableCard
              open={
                isCareerPlus &&
                !!bestJob &&
                expandedReasonJobId === bestJob.id
              }
            >
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">
                  {isSwedish ? "Career+ analys" : "Career+ analysis"}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {bestJob ? getReasonText(bestJob, lang) : ""}
                </p>
              </div>
            </ExpandableCard>
          </motion.div>

          <div className="space-y-4">
            {jobs.slice(1).map((job, index) => {
              const isSelected = selectedJobId === job.id;

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.04 * index }}
                  className={`rounded-2xl border p-4 ${
                    isSelected
                      ? "border-slate-900 bg-white shadow-sm"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="break-words text-base font-semibold text-slate-900">
                        {job.title}
                      </h4>
                      <p className="mt-1 break-words text-sm text-slate-600">
                        {job.company} • {job.location}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">
                        {job.summary}
                      </p>

                      {isCareerPlus && job.missing && job.missing.length > 0 && (
                        <p className="mt-2 text-sm font-medium text-purple-700 break-words">
                          {isSwedish ? "Saknas:" : "Missing:"} {job.missing.join(", ")}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                          {job.source}
                        </span>

                        {job.url !== "#" && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-slate-900 underline"
                          >
                            {isSwedish ? "Öppna annons" : "Open job ad"}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="self-start">
                      <MatchCircle score={job.score} color={job.color} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                    <button
                      onClick={() => handleSaveJob(job)}
                      className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-white sm:w-auto"
                    >
                      {isSwedish ? "Spara jobb" : "Save job"}
                    </button>

                    {canUseSelectedJobTools && (
                      <button
                        onClick={() => handleSelectJob(job.id)}
                        className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold transition sm:w-auto ${
                          isSelected
                            ? "bg-slate-900 text-white"
                            : "border border-slate-300 text-slate-900 hover:border-slate-900 hover:bg-white"
                        }`}
                      >
                        {isSelected
                          ? isSwedish
                            ? "Valt jobb"
                            : "Selected"
                          : isSwedish
                          ? "Välj detta jobb"
                          : "Select this job"}
                      </button>
                    )}

                    {!isCareerPlus && (
                      <span className="inline-flex w-full items-center justify-center rounded-full border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 sm:w-auto">
                        {isSwedish ? "Career+ analys" : "Career+ analysis"}
                      </span>
                    )}

                    {isCareerPlus && (
                      <>
                        <button
                          onClick={() => toggleMissing(job.id)}
                          className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-white sm:w-auto"
                        >
                          {expandedMissingJobId === job.id
                            ? isSwedish
                              ? "Dölj vad som saknas"
                              : "Hide missing items"
                            : isSwedish
                            ? "Visa vad som saknas"
                            : "Show missing items"}
                        </button>

                        <button
                          onClick={() => toggleReason(job.id)}
                          className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-white sm:w-auto"
                        >
                          {expandedReasonJobId === job.id
                            ? isSwedish
                              ? "Dölj analys"
                              : "Hide analysis"
                            : isSwedish
                            ? "Varför är matchen inte högre?"
                            : "Why isn’t the match higher?"}
                        </button>
                      </>
                    )}
                  </div>

                  <ExpandableCard
                    open={isCareerPlus && expandedMissingJobId === job.id}
                  >
                    <div className="mt-4 rounded-2xl border border-purple-200 bg-purple-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {isSwedish ? "Det här saknas mest" : "Main missing areas"}
                      </p>

                      {job.missing && job.missing.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-sm text-slate-700">
                          {job.missing.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-purple-600" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-sm text-slate-700">
                          {isSwedish
                            ? "Ingen extra information tillgänglig ännu."
                            : "No extra information available yet."}
                        </p>
                      )}
                    </div>
                  </ExpandableCard>

                  <ExpandableCard
                    open={isCareerPlus && expandedReasonJobId === job.id}
                  >
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {isSwedish ? "Career+ analys" : "Career+ analysis"}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">
                        {getReasonText(job, lang)}
                      </p>
                    </div>
                  </ExpandableCard>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {!loading && !error && jobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600"
        >
          {isSwedish
            ? "Inga matchande jobb hittades."
            : "No matching jobs were found."}
        </motion.div>
      )}
    </motion.div>
  );
}