"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, SignUpButton } from "@clerk/nextjs";
import type { Lang } from "../lib/translations";
import { StyledResume } from "./StyledResume";
import { JobMatches } from "./JobMatches";
import { LoadingSpinner } from "./LoadingSpinner";
import { AppToast } from "./AppToast";

const GUEST_CV_KEY = "NEXOR_guest_cv_created";

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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-sm font-medium tracking-tight text-slate-700">
      {children}
    </label>
  );
}

function InputShell({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
      {children}
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function FeaturePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
      {children}
    </div>
  );
}

export function DemoPanel({ lang, t }: DemoPanelProps) {
  const { isSignedIn } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [location, setLocation] = useState("");
  const [guestLimitReached, setGuestLimitReached] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoName, setPhotoName] = useState("");

  const cvRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const isSwedish = lang === "sv";

  const panelCopy = {
    eyebrow: isSwedish ? "LIVE DEMO" : "LIVE DEMO",
    title: isSwedish
      ? "Bygg ett starkare CV och gå vidare direkt"
      : "Build a stronger resume and move forward instantly",
    socialProof: isSwedish
      ? "Utformat för att göra jobbsökandet snabbare och tydligare"
      : "Designed to make job searching faster and clearer",
    description: isSwedish
      ? "Beskriv din erfarenhet, vilken roll du söker och var du vill jobba. NEXOR genererar ett mer strukturerat och professionellt CV som du sedan kan spara, ladda ner och matcha mot relevanta jobb."
      : "Describe your experience, your target role, and where you want to work. NEXOR generates a stronger, more structured resume that you can save, download, and match to relevant jobs.",
    formTitle: isSwedish ? "Fyll i din bakgrund" : "Add your background",
    formDescription: isSwedish
      ? "Det här är underlaget NEXOR använder för att skapa ett bättre CV."
      : "This is the information NEXOR uses to create a stronger resume.",
    previewTitle: isSwedish ? "Live-förhandsvisning" : "Live preview",
    previewDescription: isSwedish
      ? "Resultatet uppdateras här när ditt CV är klart."
      : "Your result appears here once the resume is ready.",
    emptyTitle: isSwedish
      ? "Ditt nya CV visas här"
      : "Your new resume appears here",
    emptyText: isSwedish
      ? "Fyll i formuläret till vänster och generera ett CV för att se hur NEXOR omvandlar din erfarenhet till en tydligare och mer professionell ansökan."
      : "Fill in the form on the left and generate a resume to see how NEXOR turns your experience into a clearer, more professional application.",
    emptySteps: isSwedish
      ? [
          "Lägg till erfarenhet och målroll",
          "Generera CV med AI",
          "Spara, ladda ner och matcha mot jobb",
        ]
      : [
          "Add your experience and target role",
          "Generate a resume with AI",
          "Save, download, and match to jobs",
        ],
    save: isSwedish ? "Spara CV" : "Save resume",
    signupGateTitle: isSwedish
      ? "Skapa konto för att fortsätta"
      : "Create an account to continue",
    signupGateText: isSwedish
      ? "Du har använt ditt gratis-CV. Skapa ett konto för att fortsätta skapa, spara och förbättra dina dokument."
      : "You’ve used your free resume. Create an account to keep generating, saving, and improving your documents.",
    signupGateButton: isSwedish ? "Skapa konto" : "Create account",
    photoLabel: isSwedish ? "Profilbild" : "Profile photo",
    photoButton: isSwedish ? "Ladda upp bild" : "Upload photo",
    photoChangeButton: isSwedish ? "Byt bild" : "Change photo",
    photoRemoveButton: isSwedish ? "Ta bort bild" : "Remove photo",
    photoUploading: isSwedish ? "Laddar upp..." : "Uploading...",
    photoHint: isSwedish
      ? "Valfritt. Lägg till en bild om du vill ha ett mer visuellt CV."
      : "Optional. Add a photo if you want a more visual resume.",
    photoInvalid: isSwedish
      ? "Välj en giltig bildfil."
      : "Choose a valid image file.",
    photoUploadError: isSwedish
      ? "Kunde inte ladda upp bilden."
      : "Could not upload the image.",
    nameLabel: isSwedish ? "Namn" : "Name",
    namePlaceholder: isSwedish ? "För- och efternamn" : "First and last name",
    emailLabel: isSwedish ? "E-post" : "Email",
    emailPlaceholder: isSwedish ? "namn@email.com" : "name@email.com",
    phoneLabel: isSwedish ? "Telefonnummer" : "Phone number",
    phonePlaceholder: isSwedish ? "070-123 45 67" : "+46 70 123 45 67",
    helperOne: isSwedish ? "1 gratis CV utan konto" : "1 free resume without an account",
    helperTwo: isSwedish ? "PDF-export ingår" : "PDF export included",
    helperThree: isSwedish ? "Fortsätt till jobbmatchning direkt" : "Continue to job matching instantly",
  };

  useEffect(() => {
    if (isSignedIn) {
      setGuestLimitReached(false);
      return;
    }

    const hasCreatedGuestCv = localStorage.getItem(GUEST_CV_KEY) === "true";
    setGuestLimitReached(hasCreatedGuestCv);
  }, [isSignedIn]);

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = setTimeout(() => {
      setToastMessage("");
    }, 2500);

    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToastType("error");
      setToastMessage(panelCopy.photoInvalid);
      return;
    }

    try {
      setUploadingPhoto(true);
      setToastMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || panelCopy.photoUploadError);
      }

      setPhotoUrl(data.url);
      setPhotoName(file.name);
      setToastType("success");
      setToastMessage(isSwedish ? "Bild uppladdad." : "Photo uploaded.");
    } catch (error: any) {
      setToastType("error");
      setToastMessage(error?.message || panelCopy.photoUploadError);
      setPhotoUrl("");
      setPhotoName("");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl("");
    setPhotoName("");

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!experience.trim() || !job.trim()) {
      setToastType("error");
      setToastMessage(t.validation);
      return;
    }

    if (!isSignedIn && guestLimitReached) {
      setToastType("error");
      setToastMessage(
        isSwedish
          ? "Du har redan skapat ett gratis CV. Skapa konto för att fortsätta."
          : "You already created one free resume. Create an account to continue."
      );
      return;
    }

    try {
      setLoading(true);
      setResult("");
      setToastMessage("");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          experience,
          job,
          lang,
          location,
        }),
      });

      const data = await res.json();

      if (data.limitReached) {
        setToastType("error");
        setToastMessage(data.output);
        setGuestLimitReached(true);
        return;
      }

      if (!res.ok) {
        setToastType("error");
        setToastMessage(data.output || t.error);
        return;
      }

      setResult(data.output || t.error);

      if (!isSignedIn && data.output) {
        localStorage.setItem(GUEST_CV_KEY, "true");
      }
    } catch {
      setToastType("error");
      setToastMessage(t.error);
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
            photoName,
            photoUrl,
            name,
            email,
            phone,
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

      setToastType("success");
      setToastMessage(lang === "sv" ? "CV sparat." : "Resume saved.");
    } catch (error: any) {
      setToastType("error");
      setToastMessage(
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
      setToastType("error");
      setToastMessage(
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
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {panelCopy.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          {panelCopy.title}
        </h2>
        <p className="mt-3 text-sm font-medium text-slate-500 sm:text-base">
          {panelCopy.socialProof}
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
          {panelCopy.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <FeaturePill>{panelCopy.helperOne}</FeaturePill>
          <FeaturePill>{panelCopy.helperTwo}</FeaturePill>
          <FeaturePill>{panelCopy.helperThree}</FeaturePill>
        </div>
      </div>

      <div className="relative mt-12 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-white p-4 shadow-[0_30px_120px_rgba(15,23,42,0.10)] sm:mt-14 sm:rounded-[2.5rem] sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute left-12 top-10 h-36 w-36 rounded-full bg-slate-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-44 w-44 rounded-full bg-slate-200/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_38%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)] xl:gap-8">
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/88 p-5 shadow-sm backdrop-blur sm:p-6">
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {panelCopy.formTitle}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {isSwedish ? "Berätta om dig själv" : "Tell NEXOR about yourself"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {panelCopy.formDescription}
              </p>
            </div>

            <div className="space-y-4">
              <InputShell>
                <FieldLabel>{panelCopy.nameLabel}</FieldLabel>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={panelCopy.namePlaceholder}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </InputShell>

              <InputShell>
                <FieldLabel>{panelCopy.emailLabel}</FieldLabel>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={panelCopy.emailPlaceholder}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </InputShell>

              <InputShell>
                <FieldLabel>{panelCopy.phoneLabel}</FieldLabel>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={panelCopy.phonePlaceholder}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </InputShell>

              <InputShell>
                <FieldLabel>{t.experienceLabel}</FieldLabel>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder={t.experiencePlaceholder}
                  className="min-h-[150px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white sm:min-h-[170px]"
                />
              </InputShell>

              <InputShell>
                <FieldLabel>{t.jobLabel}</FieldLabel>
                <textarea
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  placeholder={t.jobPlaceholder}
                  className="min-h-[130px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white sm:min-h-[150px]"
                />
              </InputShell>

              <InputShell>
                <FieldLabel>{t.locationLabel}</FieldLabel>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t.locationPlaceholder}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </InputShell>

              <InputShell hint={panelCopy.photoHint}>
                <FieldLabel>{panelCopy.photoLabel}</FieldLabel>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="min-w-0 truncate text-sm text-slate-700">
                      {photoName || (isSwedish ? "Ingen bild vald ännu" : "No photo selected yet")}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {uploadingPhoto
                          ? panelCopy.photoUploading
                          : photoUrl
                          ? panelCopy.photoChangeButton
                          : panelCopy.photoButton}
                      </button>

                      {photoUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          {panelCopy.photoRemoveButton}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </InputShell>

              {!isSignedIn && guestLimitReached ? (
                <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-sm font-medium text-slate-900">
                    {panelCopy.signupGateTitle}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {panelCopy.signupGateText}
                  </p>

                  <div className="mt-4">
                    <SignUpButton mode="modal">
                      <button
                        type="button"
                        className="w-full rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        {panelCopy.signupGateButton}
                      </button>
                    </SignUpButton>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {loading && <LoadingSpinner size={16} />}
                    <span>{loading ? t.generating : t.generate}</span>
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/88 p-4 shadow-sm backdrop-blur sm:p-6">
              <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {panelCopy.previewTitle}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    {isSwedish ? "Ditt nya CV" : "Your new resume"}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {panelCopy.previewDescription}
                  </p>
                </div>

                {result ? (
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <button
                      type="button"
                      onClick={handleSaveCv}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
                    >
                      {panelCopy.save}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={downloading}
                      className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        {downloading && <LoadingSpinner size={16} />}
                        <span>{downloading ? t.downloading : t.download}</span>
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                    {isSwedish ? "Väntar på input" : "Waiting for input"}
                  </div>
                )}
              </div>

              {toastMessage && (
                <div className="mt-4">
                  <AppToast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage("")}
                  />
                </div>
              )}

              {!result ? (
                <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 sm:p-7">
                  <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm sm:px-8 sm:py-14">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
                        ✦
                      </div>
                      <p className="mt-5 text-lg font-semibold tracking-tight text-slate-900">
                        {panelCopy.emptyTitle}
                      </p>
                      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
                        {panelCopy.emptyText}
                      </p>
                    </div>

                    <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {isSwedish ? "Så fungerar det" : "How it works"}
                      </p>

                      <div className="mt-4 space-y-3">
                        {panelCopy.emptySteps.map((item, index) => (
                          <div key={item} className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                              {index + 1}
                            </div>
                            <p className="pt-1 text-sm leading-6 text-slate-700">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-[#eef2f6] p-3 sm:p-4">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {isSwedish ? "CV-förhandsvisning" : "Resume preview"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {isSwedish
                          ? "Scrolla för att se hela CV:t."
                          : "Scroll to view the full resume."}
                      </p>
                    </div>

                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
                      {isSwedish ? "Genererat av NEXOR" : "Generated by NEXOR"}
                    </div>
                  </div>

                  <div className="max-h-[85vh] overflow-auto rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <div
                      ref={cvRef}
                      className="mx-auto w-full max-w-[794px] bg-white"
                    >
                      <StyledResume text={result} photoUrl={photoUrl} />
                    </div>
                  </div>

                  {!isSignedIn && guestLimitReached && (
                    <div className="mt-4 rounded-[1.35rem] border border-slate-200 bg-white p-5 text-center shadow-sm">
                      <h4 className="text-lg font-semibold text-slate-900 sm:text-xl">
                        {panelCopy.signupGateTitle}
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {panelCopy.signupGateText}
                      </p>

                      <div className="mt-5">
                        <SignUpButton mode="modal">
                          <button
                            type="button"
                            className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                          >
                            {panelCopy.signupGateButton}
                          </button>
                        </SignUpButton>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {result && !guestLimitReached && (
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/88 p-4 shadow-sm backdrop-blur sm:p-6">
                <div className="mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {isSwedish ? "Nästa steg" : "Next step"}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    {isSwedish
                      ? "Matcha ditt CV mot riktiga jobb"
                      : "Match your resume against real jobs"}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {isSwedish
                      ? "När CV:t är klart kan du gå vidare direkt och se vilka roller som passar bäst."
                      : "Once your resume is ready, continue directly and see which roles fit best."}
                  </p>
                </div>

                <JobMatches
                  cvText={result}
                  lang={lang}
                  targetJob={job}
                  location={location}
                  onCvImproved={setResult}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
