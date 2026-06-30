// @glitzy/web/components/admin/NavMenu — MVP 단순화 v2.0 (재설계 2026-06-30)
// 7 항목 단일 nav — 운영자 일상(발행 → 노출) 집중. 그룹 chrome·super 분기 제거.
// 흐름: 대시보드 → [콘텐츠] 의료진·시술·아티클 → [노출] 키워드·검색노출 → [설정] 의원정보 → 공개 사이트.

"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  href: (instanceSlug: string) => string;
  label: string;
  /** 활성 여부 판정 — pathname 안 sub-segment 매칭 */
  match: (pathname: string, instanceSlug: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: (slug) => `/admin/${slug}`,
    label: "대시보드",
    match: (pathname, slug) => pathname === `/admin/${slug}`,
  },
  // === 콘텐츠 (발행 대상 핵심 3종) ===
  {
    href: (slug) => `/admin/${slug}/doctors`,
    label: "의료진",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/doctors`),
  },
  {
    href: (slug) => `/admin/${slug}/treatments`,
    label: "시술/진료",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/treatments`),
  },
  {
    href: (slug) => `/admin/${slug}/articles`,
    label: "아티클",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/articles`),
  },
  // === 노출 (검색 노출 테스트 루프) ===
  {
    href: (slug) => `/admin/${slug}/keywords`,
    label: "키워드",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/keywords`),
  },
  {
    href: (slug) => `/admin/${slug}/visibility-metrics`,
    label: "검색 노출",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/visibility-metrics`),
  },
  // === 설정 ===
  {
    href: (slug) => `/admin/${slug}/clinic-profile`,
    label: "의원 정보",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/clinic-profile`),
  },
];

/**
 * pathname 안 첫 segment 가 admin/{slug} 형태일 때 slug 추출.
 * 매칭 실패 시 null — NavMenu 자체 비표시 (예: /sign-in/cleanup 등).
 */
function extractInstanceSlug(pathname: string): string | null {
  const m = pathname.match(/^\/admin\/([^/]+)/);
  return m ? m[1]! : null;
}

export function NavMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const prefetched = useRef<Set<string>>(new Set());
  const instanceSlug = extractInstanceSlug(pathname);
  if (!instanceSlug) return null;

  function prefetchOnce(href: string) {
    if (prefetched.current.has(href)) return;
    prefetched.current.add(href);
    router.prefetch(href);
  }

  return (
    <nav aria-label="어드민 메뉴" className="border-b border-slate-200 bg-slate-50">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-6 py-2 text-sm">
        {NAV_ITEMS.map((item) => {
          const href = item.href(instanceSlug);
          const active = item.match(pathname, instanceSlug);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => prefetchOnce(href)}
                onFocus={() => prefetchOnce(href)}
                className={navItemClass(active)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        {/* 공개 사이트 — 운영자가 발행 결과를 바로 확인 (새 탭) */}
        <li className="ml-auto">
          <a
            href={`/${instanceSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-slate-500 hover:bg-white hover:text-brand-primary"
          >
            공개 사이트 보기 ↗
          </a>
        </li>
      </ul>
    </nav>
  );
}

/** 항목 link 색 — active 시 slate-900 강조, 비활성 시 hover */
function navItemClass(active: boolean): string {
  if (active) {
    return "rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white";
  }
  return "rounded-md px-3 py-1.5 font-medium text-slate-700 hover:bg-white hover:text-brand-primary";
}
