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
  /** ADMIN_PERMISSION_SEPARATION v1 § 4 — super-admin 만 노출 (operator 시 hide) */
  superAdminOnly?: boolean;
};

const GROUP_ORDER: NavGroupKey[] = ["ops", "content", "setup"];

const GROUP_LABEL: Record<NavGroupKey, string> = {
  ops: "운영",
  content: "콘텐츠",
  setup: "설정",
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
  {
    href: (slug) => `/admin/${slug}/contract`,
    label: "계약",
    group: "setup",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/contract`),
    superAdminOnly: true,
  },
  {
    href: (slug) => `/admin/${slug}/clone`,
    label: "사이트 복제",
    group: "setup",
    match: (pathname, slug) => pathname.startsWith(`/admin/${slug}/clone`),
    superAdminOnly: true,
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

export function NavMenu({ isSuperAdmin = false }: { isSuperAdmin?: boolean }) {
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

  // 그룹별 분류 — super-admin only 항목은 isSuperAdmin=false 시 hide
  const itemsByGroup: Record<NavGroupKey, NavItem[]> = { ops: [], content: [], setup: [] };
  for (const item of NAV_ITEMS) {
    if (item.superAdminOnly && !isSuperAdmin) continue;
    itemsByGroup[item.group].push(item);
  }

  // 2026-05-27 NavMenu 재구성 v3 — "← 사이트 일람" 은 header link 로 이동 (사용자 결정).
  //  row 1: 운영 (ops · brand tint) + 설정 (setup · slate tint)
  //  row 2: 콘텐츠 (content · 흰 배경) — 단독 줄
  return (
    <nav aria-label="어드민 메뉴" className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-2">
        {/* === Row 1: 운영 + 설정 === */}
        <ul className="flex flex-wrap items-center gap-2 text-sm">
          <GroupBox
            group="ops"
            items={itemsByGroup.ops}
            instanceSlug={instanceSlug}
            pathname={pathname}
            prefetchOnce={prefetchOnce}
          />
          <GroupBox
            group="setup"
            items={itemsByGroup.setup}
            instanceSlug={instanceSlug}
            pathname={pathname}
            prefetchOnce={prefetchOnce}
          />
        </ul>

        {/* === Row 2: 콘텐츠 (7 항목 단독 줄) === */}
        <ul className="flex flex-wrap items-center gap-2 text-sm">
          <GroupBox
            group="content"
            items={itemsByGroup.content}
            instanceSlug={instanceSlug}
            pathname={pathname}
            prefetchOnce={prefetchOnce}
          />
        </ul>
      </div>
    </nav>
  );
}

function GroupBox({
  group,
  items,
  instanceSlug,
  pathname,
  prefetchOnce,
}: {
  group: NavGroupKey;
  items: NavItem[];
  instanceSlug: string;
  pathname: string;
  prefetchOnce: (href: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <li className={groupContainerClass(group)}>
      <span className={groupLabelChipClass(group)} aria-hidden>
        {GROUP_LABEL[group]}
      </span>
      <ul className="flex flex-wrap items-center gap-1">
        {items.map((item) => {
          const href = item.href(instanceSlug);
          const active = item.match(pathname, instanceSlug);
          return (
            <li key={href}>
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
      </ul>
    </li>
  );
}

// === styling helpers ===

/** 그룹 wrapper container — background tint + 약한 border + 내부 padding */
function groupContainerClass(group: NavGroupKey): string {
  const base = "flex flex-wrap items-center gap-1.5 rounded-md border px-2 py-1";
  if (group === "ops") return `${base} border-brand-primary/20 bg-brand-primary-soft/40`;
  if (group === "content") return `${base} border-slate-200 bg-white`;
  // setup — neutral
  return `${base} border-slate-200 bg-slate-100`;
}

/** 그룹 라벨 chip — 색 tier + 모바일도 노출 */
function groupLabelChipClass(group: NavGroupKey): string {
  const base = "select-none rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white";
  if (group === "ops") return `${base} bg-brand-primary`;
  if (group === "content") return `${base} bg-slate-700`;
  // setup
  return `${base} bg-slate-500`;
}

/** 항목 link 색 — active 시 slate-900 강조, 비활성 시 그룹별 hover */
function navItemClass(group: NavGroupKey, active: boolean): string {
  if (active) {
    return "rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white";
  }
  if (group === "ops") {
    return "rounded-md px-3 py-1.5 font-medium text-slate-800 hover:bg-white hover:text-brand-primary";
  }
  if (group === "content") {
    return "rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900";
  }
  return "rounded-md px-3 py-1.5 text-slate-600 hover:bg-white hover:text-slate-900";
}
