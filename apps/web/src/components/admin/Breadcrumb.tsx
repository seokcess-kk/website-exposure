// @glitzy/web/components/admin/Breadcrumb — pathname 기반 자동 breadcrumb (P1 UX 개선)
// usePathname() client component. NAV_ITEMS 와 동일 entity 라벨 매핑.
// dynamic segment (예: /doctors/[slug] · /review-queue/[entryId]) 는 그대로 표시 (slug 자체).

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENTITY_LABELS: Record<string, string> = {
  "clinic-profile": "의원 정보",
  "doctors": "의료진",
  "treatments": "시술/진료",
  "articles": "아티클",
  "categories": "카테고리",
  "faqs": "FAQ",
  "publications": "논문",
  "media-appearances": "미디어",
  "review-queue": "검수 큐",
};

const SUB_LABELS: Record<string, string> = {
  "new": "신규",
};

type Crumb = { href: string | null; label: string };

function buildCrumbs(pathname: string): Crumb[] {
  const m = pathname.match(/^\/admin\/([^/]+)(.*)$/);
  if (!m) return [];
  const instanceSlug = m[1]!;
  const rest = m[2] ?? "";
  const crumbs: Crumb[] = [
    { href: `/admin/${instanceSlug}`, label: "대시보드" },
  ];
  if (rest === "" || rest === "/") {
    // 대시보드 자체 — last crumb 는 비활성화 (현재 위치)
    crumbs[crumbs.length - 1]!.href = null;
    return crumbs;
  }
  const segments = rest.split("/").filter(Boolean);
  if (segments.length === 0) return crumbs;
  const entitySeg = segments[0]!;
  const entityLabel = ENTITY_LABELS[entitySeg] ?? entitySeg;
  const entityHref = `/admin/${instanceSlug}/${entitySeg}`;
  crumbs.push({ href: segments.length > 1 ? entityHref : null, label: entityLabel });
  // sub segments (예: /doctors/new · /doctors/dr-lee · /review-queue/uuid)
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i]!;
    const label = SUB_LABELS[seg] ?? seg;
    const isLast = i === segments.length - 1;
    crumbs.push({ href: isLast ? null : `/admin/${instanceSlug}/${segments.slice(0, i + 1).join("/")}`, label });
  }
  return crumbs;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);
  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="mx-auto max-w-7xl px-6 pt-4 text-xs text-slate-500">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1">
            {i > 0 ? <span aria-hidden className="text-slate-400">/</span> : null}
            {c.href ? (
              <Link href={c.href} className="hover:text-slate-900 hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-slate-900">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
