// @glitzy/web/components/admin/NavMenu — 글로벌 어드민 top-nav (P0 UX 개선)
// 9 entity 진입 메뉴 · 현재 active state 강조 · instanceSlug 자동 추출.
// usePathname() client component — layout.tsx 안 server boundary 뒤에 mount.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    label: "시술",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/treatments`),
  },
  {
    href: (slug) => `/admin/${slug}/articles`,
    label: "아티클",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/articles`),
  },
  {
    href: (slug) => `/admin/${slug}/categories`,
    label: "카테고리",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/categories`),
  },
  {
    href: (slug) => `/admin/${slug}/faqs`,
    label: "FAQ",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/faqs`),
  },
  {
    href: (slug) => `/admin/${slug}/publications`,
    label: "학술 인용",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/publications`),
  },
  {
    href: (slug) => `/admin/${slug}/media-appearances`,
    label: "미디어 출연",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/media-appearances`),
  },
  {
    href: (slug) => `/admin/${slug}/review-queue`,
    label: "검수 큐",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/review-queue`),
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
  const instanceSlug = extractInstanceSlug(pathname);
  if (!instanceSlug) return null;

  return (
    <nav aria-label="어드민 메뉴" className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <ul className="flex flex-wrap gap-x-1 gap-y-1 py-2 text-sm">
          {NAV_ITEMS.map((item) => {
            const href = item.href(instanceSlug);
            const active = item.match(pathname, instanceSlug);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
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
        </ul>
      </div>
    </nav>
  );
}
