"use client";

type AppToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
};

export function AppToast({
  message,
  type = "info",
  onClose,
}: AppToastProps) {
  if (!message) return null;

  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : type === "error"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : "border-slate-200 bg-white text-slate-800";

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${styles}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="leading-6">{message}</p>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-xs font-semibold opacity-70 transition hover:opacity-100"
          >
            Stäng
          </button>
        )}
      </div>
    </div>
  );
}
