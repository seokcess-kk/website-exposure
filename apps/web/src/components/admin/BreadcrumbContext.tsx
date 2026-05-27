// @glitzy/web/components/admin/BreadcrumbContext — ADMIN_SIMPLIFY A2
// dynamic segment (예: /doctors/[slug]) 의 마지막 crumb 를 운영자 친화 entity title 로 치환.
// page (server) 안 entity 조회 결과를 <BreadcrumbTitleSetter title={...}/> 로 주입 → context.

"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type BreadcrumbCtxValue = {
  override: string | null;
  setOverride: (v: string | null) => void;
};

const BreadcrumbCtx = createContext<BreadcrumbCtxValue | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<string | null>(null);
  return (
    <BreadcrumbCtx.Provider value={{ override, setOverride }}>
      {children}
    </BreadcrumbCtx.Provider>
  );
}

export function useBreadcrumbOverride(): string | null {
  const c = useContext(BreadcrumbCtx);
  return c?.override ?? null;
}

/** page server component 안 entity title 을 context 에 set. unmount 시 자동 cleanup. */
export function BreadcrumbTitleSetter({ title }: { title: string }) {
  const c = useContext(BreadcrumbCtx);
  useEffect(() => {
    if (!c || !title) return;
    c.setOverride(title);
    return () => c.setOverride(null);
  }, [c, title]);
  return null;
}
