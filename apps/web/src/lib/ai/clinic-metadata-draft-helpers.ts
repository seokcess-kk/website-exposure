// @glitzy/web/lib/ai/clinic-metadata-draft-helpers — 의원정보 고급 문안 AI 초안 pure helper
// server-only 의존성 없이 vitest/client 양쪽 import 가능 (article-full-draft-helpers 패턴).
//
// sanitize: LLM 환각 방어 — pillar slug/title 은 DB 값 강제 · icon 은 whitelist 밖이면 기본값 대체.
// merge: AI 초안 적용 시 사실 데이터 (keyStats · naverPlace) 는 기존 값 보존.

import {
  CLINIC_METADATA_ICON_WHITELIST,
  type ClinicMetadataDraftOutput,
} from "./prompt-templates";

export type DbPillarRow = {
  slug: string;
  title: string;
  summary: string;
  spokeTitles: string[];
};

const ICON_SET: ReadonlySet<string> = new Set(CLINIC_METADATA_ICON_WHITELIST);

const DEFAULT_PILLAR_ICONS = [
  "mdi:medical-bag",
  "mdi:account-heart-outline",
  "mdi:human-male-height",
  "mdi:leaf",
  "mdi:heart-pulse",
  "mdi:stethoscope",
] as const;

const DEFAULT_PRINCIPLE_ICONS = [
  "solar:user-id-bold-duotone",
  "solar:leaf-bold-duotone",
  "solar:medal-star-bold-duotone",
] as const;

const DEFAULT_STRENGTH_ICONS = [
  "mdi:account-search",
  "mdi:calendar-check",
  "mdi:shield-check",
  "mdi:chart-line",
] as const;

export function sanitizeIcon(icon: string, fallback: string): string {
  return ICON_SET.has(icon.trim()) ? icon.trim() : fallback;
}

/** DB pillar 만으로 만드는 결정적 fallback subtitle — spoke 나열 우선, 없으면 summary 축약. */
export function pillarSubtitleFromDb(p: DbPillarRow): string {
  if (p.spokeTitles.length > 0) return p.spokeTitles.slice(0, 4).join(" · ").slice(0, 80);
  return p.summary.slice(0, 60);
}

/**
 * LLM 출력 → 저장 가능한 clinic metadata object.
 * - treatmentPillars: DB pillar 목록 기준으로 재구성 (LLM 이 누락/변조한 slug·title 은 DB 값 강제).
 * - icon whitelist 밖 값은 섹션별 기본 아이콘으로 대체.
 * - localKeywords: trim + 중복 제거.
 * - keyStats · naverPlace 는 생성하지 않음 (사실 데이터 — 운영자 직접 입력 영역).
 */
export function sanitizeClinicMetadataDraft(
  output: ClinicMetadataDraftOutput,
  dbPillars: ReadonlyArray<DbPillarRow>,
): Record<string, unknown> {
  const bySlug = new Map(output.treatmentPillars.map((p) => [p.slug, p] as const));
  const treatmentPillars = dbPillars.map((db, i) => {
    const llm = bySlug.get(db.slug);
    const fallbackIcon = DEFAULT_PILLAR_ICONS[i % DEFAULT_PILLAR_ICONS.length]!;
    return {
      slug: db.slug,
      icon: sanitizeIcon(llm?.icon ?? "", fallbackIcon),
      title: db.title,
      subtitle: (llm?.subtitle.trim() || pillarSubtitleFromDb(db)).slice(0, 80),
    };
  });

  const standardPrinciples = output.standardPrinciples.map((p, i) => ({
    n: p.n,
    icon: sanitizeIcon(p.icon, DEFAULT_PRINCIPLE_ICONS[i % DEFAULT_PRINCIPLE_ICONS.length]!),
    title: p.title.trim(),
    desc: p.desc.trim(),
  }));

  const systemStrengths = output.systemStrengths.map((s, i) => ({
    icon: sanitizeIcon(s.icon, DEFAULT_STRENGTH_ICONS[i % DEFAULT_STRENGTH_ICONS.length]!),
    title: s.title.trim(),
    description: s.description.trim(),
  }));

  const seen = new Set<string>();
  const localKeywords: string[] = [];
  for (const k of output.localKeywords) {
    const t = k.trim();
    if (t.length === 0 || seen.has(t)) continue;
    seen.add(t);
    localKeywords.push(t);
  }

  return {
    treatmentPillars,
    standardPrinciples,
    keyStats: [],
    systemStrengths,
    sectionCopy: {
      communityTitle: output.sectionCopy.communityTitle.trim(),
      communityDescription: output.sectionCopy.communityDescription.trim(),
      reservationHeadline: output.sectionCopy.reservationHeadline.trim(),
      reservationDescription: output.sectionCopy.reservationDescription.trim(),
    },
    ...(localKeywords.length > 0 ? { localKeywords } : {}),
  };
}

function parseJsonObject(raw: string): Record<string, unknown> | null {
  if (raw.trim() === "") return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * AI 초안 적용 merge — 문안 (pillars/principles/strengths/sectionCopy/localKeywords) 은 초안으로
 * 덮어쓰되, 사실 데이터 (keyStats · naverPlace) 는 기존 metadataJson 값을 그대로 보존.
 */
export function mergeClinicMetadataPreservingFacts(currentJson: string, draftJson: string): string {
  const draft = parseJsonObject(draftJson) ?? {};
  const current = parseJsonObject(currentJson);
  const merged: Record<string, unknown> = { ...draft };
  if (current) {
    if (Array.isArray(current.keyStats) && current.keyStats.length > 0) {
      merged.keyStats = current.keyStats;
    }
    if (typeof current.naverPlace === "object" && current.naverPlace !== null) {
      merged.naverPlace = current.naverPlace;
    }
  }
  return JSON.stringify(merged, null, 2);
}
