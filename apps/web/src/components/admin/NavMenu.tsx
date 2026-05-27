// @glitzy/web/components/admin/NavMenu — Option A 운영자 일상 단순화 v1.0
// 14 항목 안 3 그룹 (운영 일상 · 콘텐츠 · 운영 setup) + separator. hide 안 함 — 사용자 혼란 회피.
// 일상 그룹 = brand-primary tier · 콘텐츠 · setup = neutral tier 안 시각 hierarchy 분리.

"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavGroupKey = "ops" | "content" | "setup";

type NavItem = {
  href: (instanceSlug: string) => string;
  label: string;
  group: NavGroupKey;
  /** 활성 여부 판정 — pathname 안 sub-segment 매칭 */
  match: (pathname: string, instanceSlug: string) => boolean;
};

const GROUP_ORDER: NavGroupKey[] = ["ops", "content", "setup"];

const GROUP_LABEL: Record<NavGroupKey, string> = {
  ops: "운영 일상",
  content: "콘텐츠",
  setup: "정보·설정",
};

const NAV_ITEMS: NavItem[] = [
  // === 운영 일상 (매일~주간 · brand-primary tier) ===
  {
    href: (slug) => `/admin/${slug}`,
    label: "대시보드",
    group: "ops",
    match: (pathname, slug) => pathname === `/admin/${slug}`,
  },
  {
    href: (slug) => `/admin/${slug}/improvement-queue`,
    label: "개선 큐",
    group: "ops",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/improvement-queue`),
  },
  {
    href: (slug) => `/admin/${slug}/visibility-metrics`,
    label: "검색 노출",
    group: "ops",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/visibility-metrics`),
  },
  {
    href: (slug) => `/admin/${slug}/calendar`,
    label: "캘린더",
    group: "ops",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/calendar`),
  },
  // === 콘텐츠 (이벤트 기반 · neutral tier) ===
  {
    href: (slug) => `/admin/${slug}/doctors`,
    label: "의료진",
    group: "content",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/doctors`),
  },
  {
    href: (slug) => `/admin/${slug}/treatments`,
    label: "시술/진료",
    group: "content",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/treatments`),
  },
  {
    href: (slug) => `/admin/${slug}/conditions`,
    label: "증상 안내",
    group: "content",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/conditions`),
  },
  {
    href: (slug) => `/admin/${slug}/articles`,
    label: "아티클",
    group: "content",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/articles`),
  },
  {
    href: (slug) => `/admin/${slug}/faqs`,
    label: "FAQ",
    group: "content",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/faqs`),
  },
  {
    href: (slug) => `/admin/${slug}/publications`,
    label: "논문",
    group: "content",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/publications`),
  },
  {
    href: (slug) => `/admin/${slug}/media-appearances`,
    label: "미디어",
    group: "content",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/media-appearances`),
  },
  // === 정보·설정 (월간/1회 setup · neutral 약 tier) ===
  {
    href: (slug) => `/admin/${slug}/clinic-profile`,
    label: "의원 정보",
    group: "setup",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/clinic-profile`),
  },
  {
    href: (slug) => `/admin/${slug}/keywords`,
    label: "키워드",
    group: "setup",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/keywords`),
  },
  // 사용자 검수 2026-05-20 — categories · review-queue menu 안 hide (즉시 발행 모드).
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

  // 그룹별 분류 — 같은 순서 안 render
  const itemsByGroup: Record<NavGroupKey, NavItem[]> = { ops: [], content: [], setup: [] };
  for (const item of NAV_ITEMS) {
    itemsByGroup[item.group].push(item);
  }

  return (
    <nav aria-label="어드민 메뉴" className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 py-2 text-sm">
          {GROUP_ORDER.map((group, groupIdx) => (
            <GroupSegment
              key={group}
              group={group}
              items={itemsByGroup[group]}
              instanceSlug={instanceSlug}
              pathname={pathname}
              prefetchOnce={prefetchOnce}
              showSeparator={groupIdx > 0}
            />
          ))}

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

function GroupSegment({
  group,
  items,
  instanceSlug,
  pathname,
  prefetchOnce,
  showSeparator,
}: {
  group: NavGroupKey;
  items: NavItem[];
  instanceSlug: string;
  pathname: string;
  prefetchOnce: (href: string) => void;
  showSeparator: boolean;
}) {
  return (
    <>
      {showSeparator && (
        <li aria-hidden className="mx-1 h-5 w-px bg-slate-300" />
      )}
      {items.map((item, idx) => {
        const href = item.href(instanceSlug);
        const active = item.match(pathname, instanceSlug);
        const isFirstInGroup = idx === 0;
        return (
          <li key={href} className="flex items-center gap-1">
            {isFirstInGroup && (
              <span
                className="hidden select-none text-[10px] font-semibold uppercase tracking-wide text-slate-400 md:inline"
                aria-hidden
                title={GROUP_LABEL[group]}
              >
                {GROUP_LABEL[group]}
              </span>
            )}
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              onMouseEnter={() => prefetchOnce(href)}
              onFocus={() => prefetchOnce(href)}
              className={navItemClass(group, active)}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </>
  );
}

function navItemClass(group: NavGroupKey, active: boolean): string {
  if (active) {
    // active 는 그룹 무관 강조 — slate-900 (대시보드 패러다임 일관성)
    return "rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white";
  }
  // 비활성 시 그룹 tier 별 색 강약 분리
  if (group === "ops") {
    // 운영 일상 — brand-primary 약한 hover
    return "rounded-md px-3 py-1.5 font-medium text-slate-800 hover:bg-brand-primary-soft hover:text-brand-primary";
  }
  if (group === "content") {
    return "rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-200 hover:text-slate-900";
  }
  // setup — neutral 약
  return "rounded-md px-3 py-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900";
}
