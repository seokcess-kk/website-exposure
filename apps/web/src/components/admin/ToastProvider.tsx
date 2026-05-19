// @glitzy/web/components/admin/ToastProvider — ADMIN_UX_REDESIGN v1.0 § 7 + § 8
// 가벼운 toast — context + useToast hook. 5초 자동 dismiss.

"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ToastKind = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  kind: ToastKind;
  message: string;
  ttlMs?: number;
};

type ToastContextValue = {
  show: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast — ToastProvider 안 wrap 필요");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const ttl = toast.ttlMs ?? 5000;
    const timer = setTimeout(() => onDismiss(toast.id), ttl);
    return () => clearTimeout(timer);
  }, [toast.id, toast.ttlMs, onDismiss]);

  const colorClass =
    toast.kind === "success" ? "border-success bg-success-subtle text-fg-default"
    : toast.kind === "error" ? "border-error bg-error-subtle text-fg-default"
    : toast.kind === "warning" ? "border-warning bg-warning-subtle text-fg-default"
    : "border-info bg-info-subtle text-fg-default";

  const icon =
    toast.kind === "success" ? "✓"
    : toast.kind === "error" ? "❌"
    : toast.kind === "warning" ? "⚠️"
    : "ℹ";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-md ${colorClass}`}
    >
      <span aria-hidden className="text-base">{icon}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="알림 닫기"
        className="text-fg-muted hover:text-fg-default"
      >
        ✕
      </button>
    </div>
  );
}
