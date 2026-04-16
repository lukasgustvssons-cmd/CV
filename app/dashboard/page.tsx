"use client";

import { useEffect, useState } from "react";

type JobStatus = "saved" | "applied" | "interview" | "rejected";

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
    [key: string]: any;
  };
  created_at: string;
};

export default function DashboardPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prepData, setPrepData] = useState<Record<string, InterviewPrep>>({});
  const [loadingPrepId, setLoadingPrepId] = useState<string | null>(null);

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

        setItems(Array.isArray(data?.items) ? data.items : []);
      } catch (err: any) {
        setError(err?.message || "Något gick fel.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const jobs = items.filter((item) => item.type === "job");
  const cvs = items.filter((item) => item.type === "cv");
  const letters = items.filter((item) => item.type === "cover_letter");

  const latestCvText = cvs[0]?.content || "";

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-slate-900">Min dashboard</h1>
        <p className="mt-2 text-slate-600">
          Här ser du sparade jobb, CV-versioner och personliga brev.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Hämtar sparat innehåll...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Sparade jobb</h2>
            <div className="grid gap-4">
              {jobs.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                  Inga jobb sparade ännu.
                </div>
              ) : (
                jobs.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>

                    <button
                      onClick={async () => {
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
                            throw new Error(
                              data?.error || "Kunde inte skapa intervjuförberedelse."
                            );
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
                      }}
                      className="mt-3 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Intervjuförberedelse
                    </button>

                    {loadingPrepId === item.id && (
                      <p className="mt-3 text-sm text-slate-500">
                        Skapar intervjuförberedelse...
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <span>Status:</span>
                      <select
                        value={item.meta?.status || "saved"}
                        onChange={async (e) => {
                          const newStatus = e.target.value as JobStatus;

                          const res = await fetch("/api/update-saved-item", {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              id: item.id,
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
                              it.id === item.id
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
                        }}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
                      >
                        <option value="saved">Sparad</option>
                        <option value="applied">Ansökt</option>
                        <option value="interview">Intervju</option>
                        <option value="rejected">Avslag</option>
                      </select>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {item.meta?.company ? `${item.meta.company} • ` : ""}
                      {item.meta?.location || ""}
                    </p>

                    {item.meta?.url && (
                      <a
                        href={item.meta.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm font-semibold text-slate-900 underline"
                      >
                        Öppna annons
                      </a>
                    )}

                    {prepData[item.id] && (
                      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <h4 className="text-base font-semibold text-slate-900">
                          Intervjuförberedelse
                        </h4>

                        {prepData[item.id].disclaimer && (
                          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            {prepData[item.id].disclaimer}
                          </p>
                        )}

                        {prepData[item.id].intro && (
                          <p className="mt-3 text-sm text-slate-700">
                            {prepData[item.id].intro}
                          </p>
                        )}

                        {prepData[item.id].questions &&
                          prepData[item.id].questions!.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium text-slate-900">
                                Sannolika intervjufrågor
                              </h5>
                              <div className="mt-3 space-y-4">
                                {prepData[item.id].questions!.map((q, index) => (
                                  <div
                                    key={index}
                                    className="rounded-xl bg-white p-4 border border-slate-200"
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
                            <div className="mt-4">
                              <h5 className="font-medium text-slate-900">
                                Det du bör lyfta i intervjun
                              </h5>
                              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                {prepData[item.id].thingsToHighlight!.map((point, index) => (
                                  <li key={index}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {prepData[item.id].thingsToPrepare &&
                          prepData[item.id].thingsToPrepare!.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium text-slate-900">
                                Förbered detta innan intervjun
                              </h5>
                              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                {prepData[item.id].thingsToPrepare!.map((point, index) => (
                                  <li key={index}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Sparade CV</h2>
            <div className="grid gap-4">
              {cvs.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                  Inga CV sparade ännu.
                </div>
              ) : (
                cvs.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                      {item.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Sparade personliga brev
            </h2>
            <div className="grid gap-4">
              {letters.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                  Inga personliga brev sparade ännu.
                </div>
              ) : (
                letters.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                      {item.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}