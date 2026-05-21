// @glitzy/web/lib/admin/evidence-link-options — EVIDENCE_LINKING_PLAN v0.2 Phase A.1
//
// EvidenceLinkPanel 의 selector options 데이터 prefetch.
//   - draft target 도 포함 (admin 안 사전 연결 가능 — cycle 1 #8 정합)
//   - label 안 `(미발행)` suffix 로 운영자에게 신호
//   - active/published 가 아닌 target 은 disabled=true 로 marker (v1 안 단순 표시만; 후속 cycle 안 정렬·필터)
//
// SoT: EVIDENCE_LINKING_PLAN v0.2 § 3.3 · § 4

import type postgres from "postgres";

import type { SeoLinkTargetType } from "@glitzy/core-content";

export type EvidenceLinkOption = {
  value: string; // "<targetType>:<targetId>"
  label: string;
  sublabel?: string;
  disabled?: boolean; // draft/inactive marker — v1 안 단순 표시만
};

export type EvidenceLinkOptions = {
  publications: EvidenceLinkOption[];
  mediaAppearances: EvidenceLinkOption[];
  faqs: EvidenceLinkOption[];
  treatmentPages: EvidenceLinkOption[];
  articles: EvidenceLinkOption[];
};

function token(targetType: SeoLinkTargetType, targetId: string): string {
  return `${targetType}:${targetId}`;
}

function suffix(label: string, draft: boolean): string {
  return draft ? `${label} (미발행)` : label;
}

export async function loadEvidenceLinkOptions(
  tx: postgres.TransactionSql,
  instanceId: string,
): Promise<EvidenceLinkOptions> {
  const [pubs, media, faqs, treatments, articles] = await Promise.all([
    tx`
      SELECT id, title, status::text AS status, journal
        FROM publication
       WHERE instance_id = ${instanceId}::uuid
       ORDER BY status DESC, updated_at DESC
       LIMIT 200
    ` as Promise<Array<{ id: string; title: string; status: string; journal: string | null }>>,
    tx`
      SELECT id, title, status::text AS status, channel_name
        FROM media_appearance
       WHERE instance_id = ${instanceId}::uuid
       ORDER BY status DESC, updated_at DESC
       LIMIT 200
    ` as Promise<Array<{ id: string; title: string; status: string; channel_name: string }>>,
    tx`
      SELECT id, question, status::text AS status
        FROM faq
       WHERE instance_id = ${instanceId}::uuid
       ORDER BY status DESC, updated_at DESC
       LIMIT 200
    ` as Promise<Array<{ id: string; question: string; status: string }>>,
    tx`
      SELECT id, title, status::text AS status, pillar_slug
        FROM treatment_page
       WHERE instance_id = ${instanceId}::uuid
       ORDER BY status DESC, display_order ASC, updated_at DESC
       LIMIT 200
    ` as Promise<Array<{ id: string; title: string; status: string; pillar_slug: string | null }>>,
    tx`
      SELECT id, title, status::text AS status
        FROM article
       WHERE instance_id = ${instanceId}::uuid
       ORDER BY status DESC, updated_at DESC
       LIMIT 200
    ` as Promise<Array<{ id: string; title: string; status: string }>>,
  ]);

  return {
    publications: pubs.map((r) => {
      const draft = r.status !== "published";
      return {
        value: token("Publication", r.id),
        label: suffix(r.title, draft),
        ...(r.journal ? { sublabel: r.journal } : {}),
        ...(draft ? { disabled: false } : {}),
      };
    }),
    mediaAppearances: media.map((r) => {
      const draft = r.status !== "published";
      return {
        value: token("MediaAppearance", r.id),
        label: suffix(r.title, draft),
        sublabel: r.channel_name,
      };
    }),
    faqs: faqs.map((r) => {
      const draft = r.status !== "published";
      return {
        value: token("FAQ", r.id),
        label: suffix(r.question, draft),
      };
    }),
    treatmentPages: treatments.map((r) => {
      const draft = r.status !== "published";
      return {
        value: token("TreatmentPage", r.id),
        label: suffix(r.title, draft),
        ...(r.pillar_slug ? { sublabel: r.pillar_slug } : {}),
      };
    }),
    articles: articles.map((r) => {
      const draft = r.status !== "published";
      return {
        value: token("Article", r.id),
        label: suffix(r.title, draft),
      };
    }),
  };
}

/**
 * "<TargetType>:<id>" 토큰 → 사람 가독 label lookup (form 안 chip 표시용).
 * 호출자는 existingLinks 의 token 을 이 헬퍼로 매핑.
 */
export function lookupOptionLabel(
  options: EvidenceLinkOptions,
  tokenValue: string,
): string | null {
  const all: EvidenceLinkOption[] = [
    ...options.publications,
    ...options.mediaAppearances,
    ...options.faqs,
    ...options.treatmentPages,
    ...options.articles,
  ];
  return all.find((o) => o.value === tokenValue)?.label ?? null;
}
