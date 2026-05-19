// @glitzy/web/components/admin/useFormDraft — localStorage 기반 form 임시 저장 hook
// debounce 1s 자동 저장 + 페이지 진입 시 복원 prompt + 저장 성공 시 clear.
// instance 별 / form 별 key 격리. SSR 안전 (client side useEffect 만 접근).

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DRAFT_VERSION = "v1";  // schema 변경 시 bump → 기존 draft invalidate

export type DraftState =
  | { kind: "none" }
  | { kind: "available"; savedAt: string; data: unknown }
  | { kind: "applied" }
  | { kind: "discarded" };

type Options<T> = {
  /** localStorage key — instance·form 별 격리. 예: `clinic-profile-demo` */
  storageKey: string;
  /** 현 form value. 변경 시 자동 저장 trigger */
  values: T;
  /** 초기값 (server provided). draft 와 비교 후 다를 때만 복원 prompt */
  initial: T;
  /** debounce 간격 (ms). default 1000ms */
  debounceMs?: number;
};

/**
 * useFormDraft — values 변경 시 debounce 후 localStorage 저장.
 *   반환: { lastSavedAt, draftAvailable, applyDraft, discardDraft, clearDraft }
 */
export function useFormDraft<T>({ storageKey, values, initial, debounceMs = 1000 }: Options<T>) {
  const fullKey = `glitzy-draft-${DRAFT_VERSION}-${storageKey}`;
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [draftAvailable, setDraftAvailable] = useState<{ savedAt: string; data: T } | null>(null);
  const hasMountedRef = useRef(false);
  const initialJsonRef = useRef<string>("");

  // 페이지 진입 시 1회 — draft 존재하면 prompt 표시 (실제 apply 는 사용자 클릭 후)
  useEffect(() => {
    if (typeof window === "undefined") return;
    initialJsonRef.current = JSON.stringify(initial);
    try {
      const raw = window.localStorage.getItem(fullKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { savedAt: string; data: T };
      if (!parsed.savedAt || parsed.data === undefined) {
        window.localStorage.removeItem(fullKey);
        return;
      }
      // 초기값과 동일하면 draft 의미 없음
      if (JSON.stringify(parsed.data) === initialJsonRef.current) {
        window.localStorage.removeItem(fullKey);
        return;
      }
      setDraftAvailable({ savedAt: parsed.savedAt, data: parsed.data });
    } catch {
      try { window.localStorage.removeItem(fullKey); } catch { /* noop */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce 자동 저장
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const currentJson = JSON.stringify(values);
    // 초기값과 동일하면 저장 skip (실 변경 없음)
    if (currentJson === initialJsonRef.current) return;
    const handle = setTimeout(() => {
      try {
        const savedAt = new Date().toISOString();
        window.localStorage.setItem(fullKey, JSON.stringify({ savedAt, data: values }));
        setLastSavedAt(savedAt);
      } catch (err) {
        console.warn("[useFormDraft] save failed", err);
      }
    }, debounceMs);
    return () => clearTimeout(handle);
  }, [values, fullKey, debounceMs]);

  const applyDraft = useCallback((apply: (data: T) => void) => {
    if (!draftAvailable) return;
    apply(draftAvailable.data);
    setDraftAvailable(null);
  }, [draftAvailable]);

  const discardDraft = useCallback(() => {
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem(fullKey); } catch { /* noop */ }
    }
    setDraftAvailable(null);
  }, [fullKey]);

  /** 저장 성공 시 호출 — draft clear (서버 저장 완료 후 호출자 책임) */
  const clearDraft = useCallback(() => {
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem(fullKey); } catch { /* noop */ }
    }
    setLastSavedAt(null);
    setDraftAvailable(null);
  }, [fullKey]);

  return { lastSavedAt, draftAvailable, applyDraft, discardDraft, clearDraft };
}
