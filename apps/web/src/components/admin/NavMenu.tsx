// @glitzy/web/components/admin/NavMenu — 글로벌 어드민 top-nav (P0 UX 개선)
// 9 entity 진입 메뉴 · 현재 active state 강조 · instanceSlug 자동 추출.
// usePathname() client component — layout.tsx 안 server boundary 뒤에 mount.

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
    // 정확히 /admin/{slug} 만 (하위 segment 없을 때) — 다른 entity active 와 충돌 회피
    match: (pathname, slug) => pathname === `/admin/${slug}`,
  },
  {
    href: (slug) => `/admin/${slug}/clinic-profile`,
    label: "의원 정보",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/clinic-profile`),
  },
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
  {
    href: (slug) => `/admin/${slug}/faqs`,
    label: "FAQ",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/faqs`),
  },
  {
    href: (slug) => `/admin/${slug}/keywords`,
    label: "키워드",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/keywords`),
  },
  {
    href: (slug) => `/admin/${slug}/improvement-queue`,
    label: "개선 큐",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/improvement-queue`),
  },
  {
    href: (slug) => `/admin/${slug}/publications`,
    label: "논문",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/publications`),
  },
  {
    href: (slug) => `/admin/${slug}/media-appearances`,
    label: "미디어",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/media-appearances`),
  },
  // 사용자 검수 2026-05-20 — categories(자주 추가 안 함) · review-queue(즉시 발행 모드) menu 안 hide.
  // route 자체는 유지 (사용자가 URL 안 직접 접근 가능) — 추후 별 cycle 안 완전 제거.
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

  // P1 UX 개선 — 공개 사이트 진입 link (모든 어드민 페이지에서 항상 가시)
  const siteHref = `/${instanceSlug}`;

  return (
    <nav aria-label="어드민 메뉴" className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 py-2 text-sm">
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
                  className={
                    active
                      ? "rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white"
                      : "rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}

          {/* 공개 사이트 보기 — 새 탭 · 우측 정렬 (사용자 결정 2026-05-20 P1) */}
          <li className="ml-auto">
            <a
              href={siteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-brand-primary/30 bg-brand-primary-soft px-3 py-1.5 font-medium text-brand-primary hover:bg-brand-primary hover:text-canvas"
            >
              <iconify-icon icon="solar:arrow-right-up-bold" width="14" />
              공개 사이트 보기
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
