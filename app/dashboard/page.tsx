"use client";

import { useEffect, useMemo, useState } from "react";
import { StyledResume } from "@/components/StyledResume";

type JobStatus = "saved" | "applied" | "interview" | "rejected";
type DashboardTab = "jobs" | "cv" | "letters";
type UserPlan = "free" | "pro" | "career+" | "";

type InterviewPrep = {
  disclaimer?: string;
  intro?: string;
  questions?: {
    question: string;
    whyThisMatters: string;
    answerTip: string;
  }[];
  thingsToHighlight?: string[];
  thingsToPrepare?: string[];
};

type SavedItem = {
  id: string;
  type: "cv" | "job" | "cover_letter";
  title: string;
  content: string | null;
  meta?: {
    status?: JobStatus;
    company?: string;
    location?: string;
    url?: string;
    name?: string;
    email?: string;
    phone?: string;
    photoName?: string;
    [key: string]: any;
  };
  created_at: string;
};

const statusLabel: Record<JobStatus, string> = {
  saved: "Sparad",
  applied: "Ansökt",
  interview: "Intervju",
  rejected: "Avslag",
};

const statusClasses: Record<JobStatus, string> = {
  saved: "bg-slate-100 text-slate-700 border-slate-200",
  applied: "bg-blue-50 text-blue-700 border-blue-200",
  interview: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

function getPreview(text: string | null | undefined, maxLength = 220) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function getPlanLabel(plan: UserPlan) {
  if (plan === "career+") return "Career+";
  if (plan === "pro") return "Pro";
  return "Gratis";
}

function getPlanBadgeClasses(plan: UserPlan) {
  if (plan === "career+") {
    return "border-purple-200 bg-purple-50 text-purple-700";
  }

  if (plan === "pro") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

export default function DashboardPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [prepData, setPrepData] = useState<Record<string, InterviewPrep>>({});
  const [loadingPrepId, setLoadingPrepId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<DashboardTab>("jobs");
  const [search, setSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState<JobStatus | "all">("all");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const [plan, setPlan] = useState<UserPlan>("");
  const [showCareerModal, setShowCareerModal] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const res = await fetch("/api/user-plan", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) return;

        const currentPlan = (data?.plan || "free") as UserPlan;
        setPlan(currentPlan);

        if (currentPlan === "career+") {
          const seen = localStorage.getItem("NEXOR_career_plus_welcome_seen");
          if (seen !== "true") {
            setShowCareerModal(true);
          }
        }
      } catch {
        setPlan("free");
      }
    };

    loadPlan();
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/saved-items", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Kunde inte hämta sparade objekt.");
        }

        const loadedItems = Array.isArray(data?.items) ? data.items : [];

        loadedItems.sort(
          (a: SavedItem, b: SavedItem) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setItems(loadedItems);
      } catch (err: any) {
        setError(err?.message || "Något gick fel.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  useEffect(() => {
    if (!successMessage) return;

    const timeout = setTimeout(() => {
      setSuccessMessage("");
    }, 2500);

    return () => clearTimeout(timeout);
  }, [successMessage]);

  const jobs = useMemo(
    () => items.filter((item) => item.type === "job"),
    [items]
  );
  const cvs = useMemo(
    () => items.filter((item) => item.type === "cv"),
    [items]
  );
  const letters = useMemo(
    () => items.filter((item) => item.type === "cover_letter"),
    [items]
  );

  const latestCvText = cvs[0]?.content || "";

  const stats = useMemo(() => {
    const savedJobs = jobs.length;
    const appliedJobs = jobs.filter((job) => job.meta?.status === "applied").length;
    const interviewJobs = jobs.filter((job) => job.meta?.status === "interview").length;
    const rejectedJobs = jobs.filter((job) => job.meta?.status === "rejected").length;

    return {
      savedJobs,
      appliedJobs,
      interviewJobs,
      rejectedJobs,
      cvs: cvs.length,
      letters: letters.length,
    };
  }, [jobs, cvs.length, letters.length]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredJobs = useMemo(() => {
    return jobs.filter((item) => {
      const matchesStatus =
        jobStatusFilter === "all"
          ? true
          : (item.meta?.status || "saved") === jobStatusFilter;

      const haystack = [
        item.title,
        item.content || "",
        item.meta?.company || "",
        item.meta?.location || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = normalizedSearch ? haystack.includes(normalizedSearch) : true;

      return matchesStatus && matchesSearch;
    });
  }, [jobs, jobStatusFilter, normalizedSearch]);

  const filteredCvs = useMemo(() => {
    return cvs.filter((item) => {
      const haystack = [
        item.title,
        item.content || "",
        item.meta?.targetJob || "",
        item.meta?.name || "",
        item.meta?.email || "",
        item.meta?.phone || "",
      ]
        .join(" ")
        .toLowerCase();

      return normalizedSearch ? haystack.includes(normalizedSearch) : true;
    });
  }, [cvs, normalizedSearch]);

  const filteredLetters = useMemo(() => {
    return letters.filter((item) => {
      const haystack = [
        item.title,
        item.content || "",
        item.meta?.company || "",
        item.meta?.location || "",
      ]
        .join(" ")
        .toLowerCase();

      return normalizedSearch ? haystack.includes(normalizedSearch) : true;
    });
  }, [letters, normalizedSearch]);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCloseCareerModal = () => {
    localStorage.setItem("NEXOR_career_plus_welcome_seen", "true");
    setShowCareerModal(false);
  };

  const handleStatusUpdate = async (id: string, newStatus: JobStatus) => {
    try {
      setError("");

      const res = await fetch("/api/update-saved-item", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Kunde inte uppdatera status.");
        return;
      }

      setItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                meta: {
                  ...it.meta,
                  status: newStatus,
                },
              }
            : it
        )
      );
    } catch (err: any) {
      setError(err?.message || "Kunde inte uppdatera status.");
    }
  };

  const handleInterviewPrep = async (item: SavedItem) => {
    try {
      setError("");
      setLoadingPrepId(item.id);

      const res = await fetch("/api/interview-prep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: item.title,
          jobDescription: item.content || "",
          cvText: latestCvText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Kunde inte skapa intervjuförberedelse.");
      }

      setPrepData((prev) => ({
        ...prev,
        [item.id]: data.prep,
      }));
    } catch (err: any) {
      setError(err?.message || "Något gick fel.");
    } finally {
      setLoadingPrepId(null);
    }
  };

  const openDeleteModal = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deletingId) return;
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      setError("");
      setDeletingId(id);

      const res = await fetch("/api/delete-saved-item", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Kunde inte ta bort objektet.");
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      setSuccessMessage("Objekt borttaget.");
    } catch (err: any) {
      setError(err?.message || "Kunde inte ta bort objektet.");
    } finally {
      setDeletingId(null);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCopyText = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessMessage(message);
    } catch {
      setError("Kunde inte kopiera texten.");
    }
  };

  const handleDownloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();

    URL.revokeObjectURL(url);
    setSuccessMessage("Fil nedladdad.");
  };

  const tabButtonClass = (tab: DashboardTab) =>
    activeTab === tab
      ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      : "rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50";

  const planLabel = getPlanLabel(plan);
  const planBadgeClasses = getPlanBadgeClasses(plan);

  return (
    <main className="min-h-screen bg-slate-50/60">
      {showCareerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-4 inline-flex rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
              Career+
            </div>

            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Tack för att du uppgraderade till Career+
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Du har nu tillgång till våra mest kraftfulla verktyg för att förbättra dina jobbansökningar och öka chansen till intervju.
            </p>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">
                Detta ingår nu i din plan:
              </p>

              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>• Obegränsad jobbmatchning</li>
                <li>• Förbättra CV för specifika jobb</li>
                <li>• Skapa personligt brev för valt jobb</li>
                <li>• Djupare insikter och intervjuförberedelse</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleCloseCareerModal}
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Fortsätt
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Ta bort objekt
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Är du säker på att du vill ta bort detta? Det går inte att ångra.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={!!deletingId}
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Avbryt
              </button>

              <button
                type="button"
                onClick={() => itemToDelete && handleDeleteItem(itemToDelete)}
                disabled={!itemToDelete || !!deletingId}
                className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {deletingId ? "Tar bort..." : "Ta bort"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              NEXOR
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Min dashboard
              </h1>

              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${planBadgeClasses}`}
              >
                Nuvarande plan: {planLabel}
              </span>
            </div>

            <p className="mt-3 max-w-2xl text-slate-600">
              Håll koll på dina sparade jobb, CV-versioner och personliga brev på ett ställe.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/#demo"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Skapa nytt CV
            </a>
            <a
              href="/#demo"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
            >
              Hitta jobb
            </a>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Sparade jobb</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.savedJobs}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Ansökta</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.appliedJobs}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Intervjuer</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.interviewJobs}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Avslag</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.rejectedJobs}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">CV</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.cvs}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Brev</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.letters}</p>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <button className={tabButtonClass("jobs")} onClick={() => setActiveTab("jobs")}>
                Jobb
              </button>
              <button className={tabButtonClass("cv")} onClick={() => setActiveTab("cv")}>
                CV
              </button>
              <button
                className={tabButtonClass("letters")}
                onClick={() => setActiveTab("letters")}
              >
                Personliga brev
              </button>
            </div>

            <div className="w-full lg:max-w-sm">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Sök titel, företag, plats eller innehåll..."
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              />
            </div>
          </div>

          {activeTab === "jobs" && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(["all", "saved", "applied", "interview", "rejected"] as const).map((status) => {
                const isActive = jobStatusFilter === status;
                const label =
                  status === "all" ? "Alla statusar" : statusLabel[status as JobStatus];

                return (
                  <button
                    key={status}
                    onClick={() => setJobStatusFilter(status)}
                    className={
                      isActive
                        ? "rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                        : "rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            Hämtar sparat innehåll...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {activeTab === "jobs" && (
              <section>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-slate-900">Jobb</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Håll koll på sparade jobb, status och intervjuförberedelser.
                  </p>
                </div>

                {filteredJobs.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-900">
                      Kom igång med NEXOR
                    </h3>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                      Börja med att skapa ett CV, matcha sedan mot jobb och spara intressanta roller här i dashboarden.
                    </p>

                    <div className="mx-auto mt-6 max-w-md rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left">
                      <p className="text-sm font-semibold text-slate-900">Steg för steg</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        <li>1. Skapa ett CV</li>
                        <li>2. Matcha mot jobb</li>
                        <li>3. Spara jobb här</li>
                      </ul>
                    </div>

                    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                      <a
                        href="/#demo"
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Skapa CV
                      </a>

                      <a
                        href="/#demo"
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
                      >
                        Hitta jobb
                      </a>
                    </div>

                    <p className="mt-6 text-xs text-slate-400">
                      Tips: Börja med att skapa ett CV för att få jobbmatchningar
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredJobs.map((item) => {
                      const currentStatus = item.meta?.status || "saved";

                      return (
                        <div
                          key={item.id}
                          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {item.title}
                                </h3>
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[currentStatus]}`}
                                >
                                  {statusLabel[currentStatus]}
                                </span>
                              </div>

                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                                {item.meta?.company && <span>{item.meta.company}</span>}
                                {item.meta?.location && <span>{item.meta.location}</span>}
                                <span>Sparad {formatDate(item.created_at)}</span>
                              </div>

                              {item.content && (
                                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                                  {getPreview(item.content, 240)}
                                </p>
                              )}
                            </div>

                            <div className="flex w-full flex-col gap-3 lg:w-[260px]">
                              <select
                                value={currentStatus}
                                onChange={(e) =>
                                  handleStatusUpdate(item.id, e.target.value as JobStatus)
                                }
                                className="rounded-2xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                              >
                                <option value="saved">Sparad</option>
                                <option value="applied">Ansökt</option>
                                <option value="interview">Intervju</option>
                                <option value="rejected">Avslag</option>
                              </select>

                              <button
                                onClick={() => handleInterviewPrep(item)}
                                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                              >
                                {loadingPrepId === item.id
                                  ? "Skapar intervjuförberedelse..."
                                  : "Intervjuförberedelse"}
                              </button>

                              {item.meta?.url && (
                                <a
                                  href={item.meta.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
                                >
                                  Öppna annons
                                </a>
                              )}

                              <button
                                onClick={() => openDeleteModal(item.id)}
                                disabled={deletingId === item.id}
                                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                              >
                                {deletingId === item.id ? "Tar bort..." : "Ta bort"}
                              </button>
                            </div>
                          </div>

                          {prepData[item.id] && (
                            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                              <h4 className="text-base font-semibold text-slate-900">
                                Intervjuförberedelse
                              </h4>

                              {prepData[item.id].disclaimer && (
                                <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                  {prepData[item.id].disclaimer}
                                </p>
                              )}

                              {prepData[item.id].intro && (
                                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                                  {prepData[item.id].intro}
                                </p>
                              )}

                              {prepData[item.id].questions &&
                                prepData[item.id].questions!.length > 0 && (
                                  <div className="mt-5">
                                    <h5 className="font-medium text-slate-900">
                                      Sannolika intervjufrågor
                                    </h5>
                                    <div className="mt-3 space-y-3">
                                      {prepData[item.id].questions!.map((q, index) => (
                                        <div
                                          key={index}
                                          className="rounded-2xl border border-slate-200 bg-white p-4"
                                        >
                                          <p className="font-medium text-slate-900">
                                            {index + 1}. {q.question}
                                          </p>
                                          <p className="mt-2 text-sm text-slate-600">
                                            <span className="font-medium text-slate-800">
                                              Varför den kan komma:
                                            </span>{" "}
                                            {q.whyThisMatters}
                                          </p>
                                          <p className="mt-2 text-sm text-slate-600">
                                            <span className="font-medium text-slate-800">
                                              Svarstips:
                                            </span>{" "}
                                            {q.answerTip}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              {prepData[item.id].thingsToHighlight &&
                                prepData[item.id].thingsToHighlight!.length > 0 && (
                                  <div className="mt-5">
                                    <h5 className="font-medium text-slate-900">
                                      Det du bör lyfta i intervjun
                                    </h5>
                                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                      {prepData[item.id].thingsToHighlight!.map((point, index) => (
                                        <li key={index}>{point}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                              {prepData[item.id].thingsToPrepare &&
                                prepData[item.id].thingsToPrepare!.length > 0 && (
                                  <div className="mt-5">
                                    <h5 className="font-medium text-slate-900">
                                      Förbered detta innan intervjun
                                    </h5>
                                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                      {prepData[item.id].thingsToPrepare!.map((point, index) => (
                                        <li key={index}>{point}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {activeTab === "cv" && (
              <section>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-slate-900">CV</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Se dina sparade versioner i samma layout som förhandsvisningen.
                  </p>
                </div>

                {filteredCvs.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-lg font-medium text-slate-900">Inga CV ännu</p>
                    <p className="mt-2 text-sm text-slate-600">
                      När du sparar ett CV dyker det upp här så du kan gå tillbaka till rätt version.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredCvs.map((item) => {
                      const isExpanded = !!expandedItems[item.id];

                      return (
                        <div
                          key={item.id}
                          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-semibold text-slate-900">
                                {item.title}
                              </h3>

                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                                <span>Skapad {formatDate(item.created_at)}</span>
                                {item.meta?.targetJob && (
                                  <span>Målroll: {String(item.meta.targetJob)}</span>
                                )}
                                {item.meta?.location && (
                                  <span>Plats: {String(item.meta.location)}</span>
                                )}
                                {item.meta?.name && (
                                  <span>Namn: {String(item.meta.name)}</span>
                                )}
                              </div>

                              {isExpanded ? (
                                <div className="mt-5 rounded-[20px] border border-slate-200 bg-[#eef2f6] p-2 sm:p-4">
                                  <div className="max-h-[85vh] overflow-auto rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                                    <div className="mx-auto w-full max-w-[794px] bg-white">
                                      <div className="mx-auto w-full max-w-[794px] bg-white">
  <StyledResume
    text={item.content || ""}
    photoUrl={String(item.meta?.photoUrl || "")}
  />
</div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                                  {getPreview(item.content, 320)}
                                </p>
                              )}
                            </div>

                            <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:flex-col">
                              <button
                                onClick={() => toggleExpanded(item.id)}
                                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
                              >
                                {isExpanded ? "Visa mindre" : "Visa CV"}
                              </button>

                              <button
                                onClick={() =>
                                  handleDownloadTextFile(
                                    `${item.title.replace(/\s+/g, "-").toLowerCase()}.txt`,
                                    item.content || ""
                                  )
                                }
                                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                              >
                                Ladda ner text
                              </button>

                              <button
                                onClick={() => openDeleteModal(item.id)}
                                disabled={deletingId === item.id}
                                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                              >
                                {deletingId === item.id ? "Tar bort..." : "Ta bort"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {activeTab === "letters" && (
              <section>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-slate-900">Personliga brev</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Hitta snabbt rätt brev med sök, preview och företag/plats.
                  </p>
                </div>

                {filteredLetters.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-lg font-medium text-slate-900">Inga personliga brev ännu</p>
                    <p className="mt-2 text-sm text-slate-600">
                      När du sparar ett personligt brev dyker det upp här.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredLetters.map((item) => {
                      const isExpanded = !!expandedItems[item.id];

                      return (
                        <div
                          key={item.id}
                          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-semibold text-slate-900">
                                {item.title}
                              </h3>

                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                                <span>Skapad {formatDate(item.created_at)}</span>
                                {item.meta?.company && <span>{String(item.meta.company)}</span>}
                                {item.meta?.location && <span>{String(item.meta.location)}</span>}
                              </div>

                              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                                {isExpanded ? item.content : getPreview(item.content, 320)}
                              </p>
                            </div>

                            <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:flex-col">
                              <button
                                onClick={() => toggleExpanded(item.id)}
                                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
                              >
                                {isExpanded ? "Visa mindre" : "Visa mer"}
                              </button>

                              <button
                                onClick={() =>
                                  handleCopyText(
                                    item.content || "",
                                    "Personligt brev kopierat."
                                  )
                                }
                                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                              >
                                Kopiera
                              </button>

                              <button
                                onClick={() => openDeleteModal(item.id)}
                                disabled={deletingId === item.id}
                                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                              >
                                {deletingId === item.id ? "Tar bort..." : "Ta bort"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
