"use client";

type ToastProps = {
  message?: string;
  tone?: "success" | "error" | "info";
};

const toneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-orange-200 bg-orange-50 text-orange-800",
};

export function Toast({ message, tone = "info" }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium ${toneClasses[tone]}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}
