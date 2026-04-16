"use client";

import { useEffect, useState } from "react";

type JobStatus = "saved" | "applied" | "interview" | "rejected";

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
                        const res = await fetch("/api/interview-prep", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            jobTitle: item.title,
                            jobDescription: item.content || "",
                            cvText: "TEMP CV TEXT",
                          }),
                        });

                        const data = await res.json();

                        if (!res.ok) {
                          setError(data?.error || "Kunde inte skapa interview prep.");
                          return;
                        }

                        console.log("INTERVIEW PREP:", data);
                      }}
                     className="mt-3 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
>
  Intervjuförberedelse
</button>

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