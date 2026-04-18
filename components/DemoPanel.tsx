"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, SignUpButton } from "@clerk/nextjs";
import type { Lang } from "../lib/translations";
import { StyledResume } from "./StyledResume";
import { JobMatches } from "./JobMatches";
import { LoadingSpinner } from "./LoadingSpinner";
import { AppToast } from "./AppToast";

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
    eyebrow: isSwedish ? "SÅ SER DET UT" : "SEE HOW IT WORKS",
    title: isSwedish
      ? "Skapa ett starkare CV på några minuter"
      : "Create a stronger resume in a few minutes",
    socialProof: isSwedish
      ? "Byggt för att hjälpa dig få fler intervjuer"
      : "Built to help you land more interviews",
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
    photoLabel: isSwedish ? "Profilbild" : "Profile photo",
    photoButton: isSwedish ? "Ladda upp bild" : "Upload photo",
    photoChangeButton: isSwedish ? "Byt bild" : "Change photo",
    photoRemoveButton: isSwedish ? "Ta bort bild" : "Remove photo",
    photoUploading: isSwedish ? "Laddar upp..." : "Uploading...",
    photoHint: isSwedish
      ? "Valfritt. Lägg till en bild för ett mer visuellt CV."
      : "Optional. Add a photo for a more visual resume.",
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
      setToastMessage(
        isSwedish ? "Bild uppladdad." : "Photo uploaded."
      );
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
      className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mb-10 text-center sm:mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
          {panelCopy.eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          {panelCopy.title}
        </h2>
        <p className="mt-3 text-sm font-medium text-slate-500 sm:text-base">
          {panelCopy.socialProof}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-relaxed">
          {panelCopy.description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start lg:gap-6 xl:grid-cols-[430px_minmax(0,1fr)] xl:gap-8">
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
                {panelCopy.nameLabel}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={panelCopy.namePlaceholder}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {panelCopy.emailLabel}
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={panelCopy.emailPlaceholder}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {panelCopy.phoneLabel}
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={panelCopy.phonePlaceholder}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              />
            </div>

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
                className="min-h-[140px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 sm:min-h-[160px] sm:py-4"
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {panelCopy.photoLabel}
              </label>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700">
                      {photoName || panelCopy.photoHint}
                    </p>
                  </div>

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
                <span className="inline-flex items-center justify-center gap-2">
                  {loading && <LoadingSpinner size={16} />}
                  <span>{loading ? t.generating : t.generate}</span>
                </span>
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
                    <span className="inline-flex items-center justify-center gap-2">
                      {downloading && <LoadingSpinner size={16} />}
                      <span>{downloading ? t.downloading : t.download}</span>
                    </span>
                  </button>
                </div>
              )}
            </div>

            {toastMessage && (
              <div className="mb-4">
                <AppToast
                  message={toastMessage}
                  type={toastType}
                  onClose={() => setToastMessage("")}
                />
              </div>
            )}

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
            ) : (
              <div className="rounded-[20px] border border-slate-200 bg-white p-2 sm:rounded-[24px] sm:p-4">
                <div className="rounded-[18px] border border-slate-200 bg-[#eef2f6] p-2 sm:rounded-[20px] sm:p-4">
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {isSwedish ? "CV-förhandsvisning" : "Resume preview"}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {isSwedish
                        ? "Scrolla för att se hela CV:t."
                        : "Scroll to view the full resume."}
                    </p>
                  </div>

                  <div className="max-h-[85vh] overflow-auto rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <div
                      ref={cvRef}
                      className="mx-auto w-full max-w-[794px] bg-white"
                    >
                      <StyledResume text={result} photoUrl={photoUrl} />
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