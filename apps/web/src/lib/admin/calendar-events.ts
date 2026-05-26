// @glitzy/web/lib/admin/calendar-events — CONTENT_CALENDAR_PLAN v1.0 § 3
// 7 entity 의 published_at + LegalDocument effective_date + 6 entity 의 stale-threshold (updated_at+30d) UNION ALL.
// KST date slice + zod 방어 + 빈 결과 안전.

import type postgres from "postgres";
import { z } from "zod";

export type CalendarEventType = "published" | "effective" | "stale-threshold";

export type CalendarEntityType =
  | "Article"
  | "TreatmentPage"
  | "MedicalConditionPage"
  | "FAQ"
  | "Publication"
  | "MediaAppearance"
  | "LegalDocument";

export type CalendarEvent = {
  id: string;                  // "<entityType>:<entityId>:<eventType>"
  date: string;                // KST YYYY-MM-DD
  eventType: CalendarEventType;
  entityType: CalendarEntityType;
  entityId: string;
  slug: string;
  title: string;
};

const ENTITY_TYPES = [
  "Article", "TreatmentPage", "MedicalConditionPage", "FAQ",
  "Publication", "MediaAppearance", "LegalDocument",
] as const;

const calendarRowSchema = z.object({
  entity_type: z.enum(ENTITY_TYPES),
  entity_id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  event_date: z.union([
    z.string(),
    z.date().transform((d) => d.toISOString().slice(0, 10)),
  ]),
  event_type: z.enum(["published", "effective", "stale-threshold"]),
});

/**
 * Asia/Seoul TZ 안 YYYY-MM-DD 포맷.
 */
export function formatKstDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

/**
 * `?month=YYYY-MM` query 검증 — invalid 시 KST 이번 달 fallback.
 */
export function parseMonth(raw: string | string[] | undefined): string {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (typeof v === "string" && MONTH_REGEX.test(v)) return v;
  return formatKstDate(new Date()).slice(0, 7);
}

/**
 * 표시 월 의 grid range — 첫 주 시작일 (일요일) ~ 마지막 주 끝일 (토요일).
 * 본 range 안 fetch 시 padding day cell 안 dot 도 정확.
 */
export function monthGridRange(monthYyyyMm: string): { startDate: string; endDate: string } {
  const [yearStr, monthStr] = monthYyyyMm.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);  // 1~12

  // 표시 월 1일 = UTC 안 KST 자정 (00:00 KST = 전날 15:00 UTC). 단 grid 안 date 만 사용 — UTC noon 안 동작 OK.
  const firstDay = new Date(Date.UTC(year, month - 1, 1, 12));  // UTC noon to avoid TZ edge
  const lastDay = new Date(Date.UTC(year, month, 0, 12));        // 다음 달 0일 = 이번 달 마지막

  // 일요일 = 0, 토요일 = 6 — 첫 주 시작일까지 padding day 빼기
  const startPadding = firstDay.getUTCDay();
  const endPadding = 6 - lastDay.getUTCDay();

  const start = new Date(firstDay);
  start.setUTCDate(start.getUTCDate() - startPadding);
  const end = new Date(lastDay);
  end.setUTCDate(end.getUTCDate() + endPadding);

  return {
    startDate: ymd(start),
    endDate: ymd(end),
  };
}

function ymd(d: Date): string {
  // UTC noon 안 day-of-month 직접 slice — TZ 의존 회피
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/**
 * 7 entity UNION ALL — published + effective + stale-threshold event 모두 수집.
 * KST date slice · postgres.js 안 Date 또는 string 반환 → zod safeParse 안 normalize.
 */
export async function loadCalendarEvents(
  tx: postgres.TransactionSql,
  instanceId: string,
  options: { startDate: string; endDate: string },
): Promise<CalendarEvent[]> {
  const { startDate, endDate } = options;

  const rows = await tx<Array<{
    entity_type: string;
    entity_id: string;
    slug: string;
    title: string;
    event_date: Date | string;
    event_type: string;
  }>>`
    SELECT * FROM (
      -- Article: published + stale-threshold
      SELECT 'Article' AS entity_type, id AS entity_id, slug, title,
             (published_at AT TIME ZONE 'Asia/Seoul')::date AS event_date,
             'published' AS event_type
        FROM article WHERE instance_id = ${instanceId}::uuid AND status='published' AND published_at IS NOT NULL
      UNION ALL
      SELECT 'Article', id, slug, title,
             ((updated_at AT TIME ZONE 'Asia/Seoul')::date + INTERVAL '30 days')::date,
             'stale-threshold'
        FROM article WHERE instance_id = ${instanceId}::uuid AND status='published' AND updated_at IS NOT NULL

      -- TreatmentPage
      UNION ALL
      SELECT 'TreatmentPage', id, slug, title,
             (published_at AT TIME ZONE 'Asia/Seoul')::date,
             'published'
        FROM treatment_page WHERE instance_id = ${instanceId}::uuid AND status='published' AND published_at IS NOT NULL
      UNION ALL
      SELECT 'TreatmentPage', id, slug, title,
             ((updated_at AT TIME ZONE 'Asia/Seoul')::date + INTERVAL '30 days')::date,
             'stale-threshold'
        FROM treatment_page WHERE instance_id = ${instanceId}::uuid AND status='published' AND updated_at IS NOT NULL

      -- MedicalConditionPage
      UNION ALL
      SELECT 'MedicalConditionPage', id, slug, title,
             (published_at AT TIME ZONE 'Asia/Seoul')::date,
             'published'
        FROM medical_condition_page WHERE instance_id = ${instanceId}::uuid AND status='published' AND published_at IS NOT NULL
      UNION ALL
      SELECT 'MedicalConditionPage', id, slug, title,
             ((updated_at AT TIME ZONE 'Asia/Seoul')::date + INTERVAL '30 days')::date,
             'stale-threshold'
        FROM medical_condition_page WHERE instance_id = ${instanceId}::uuid AND status='published' AND updated_at IS NOT NULL

      -- FAQ
      UNION ALL
      SELECT 'FAQ', id, slug, question AS title,
             (published_at AT TIME ZONE 'Asia/Seoul')::date,
             'published'
        FROM faq WHERE instance_id = ${instanceId}::uuid AND status='published' AND published_at IS NOT NULL
      UNION ALL
      SELECT 'FAQ', id, slug, question,
             ((updated_at AT TIME ZONE 'Asia/Seoul')::date + INTERVAL '30 days')::date,
             'stale-threshold'
        FROM faq WHERE instance_id = ${instanceId}::uuid AND status='published' AND updated_at IS NOT NULL

      -- Publication
      UNION ALL
      SELECT 'Publication', id, slug, title,
             (published_at AT TIME ZONE 'Asia/Seoul')::date,
             'published'
        FROM publication WHERE instance_id = ${instanceId}::uuid AND status='published' AND published_at IS NOT NULL
      UNION ALL
      SELECT 'Publication', id, slug, title,
             ((updated_at AT TIME ZONE 'Asia/Seoul')::date + INTERVAL '30 days')::date,
             'stale-threshold'
        FROM publication WHERE instance_id = ${instanceId}::uuid AND status='published' AND updated_at IS NOT NULL

      -- MediaAppearance
      UNION ALL
      SELECT 'MediaAppearance', id, slug, title,
             (published_at AT TIME ZONE 'Asia/Seoul')::date,
             'published'
        FROM media_appearance WHERE instance_id = ${instanceId}::uuid AND status='published' AND published_at IS NOT NULL
      UNION ALL
      SELECT 'MediaAppearance', id, slug, title,
             ((updated_at AT TIME ZONE 'Asia/Seoul')::date + INTERVAL '30 days')::date,
             'stale-threshold'
        FROM media_appearance WHERE instance_id = ${instanceId}::uuid AND status='published' AND updated_at IS NOT NULL

      -- LegalDocument: published + effective (stale-threshold 미적용 · CCAL-DEFER-10)
      UNION ALL
      SELECT 'LegalDocument', id, slug, title,
             (published_at AT TIME ZONE 'Asia/Seoul')::date,
             'published'
        FROM legal_document WHERE instance_id = ${instanceId}::uuid AND status='published' AND published_at IS NOT NULL
      UNION ALL
      SELECT 'LegalDocument', id, slug, title,
             effective_date,
             'effective'
        FROM legal_document WHERE instance_id = ${instanceId}::uuid AND status='published' AND effective_date IS NOT NULL
    ) all_events
    WHERE event_date BETWEEN ${startDate}::date AND ${endDate}::date
    ORDER BY event_date ASC
  `;

  const events: CalendarEvent[] = [];
  for (const row of rows) {
    const parsed = calendarRowSchema.safeParse(row);
    if (!parsed.success) {
      console.warn("[calendar-events] invalid row", row);
      continue;
    }
    const r = parsed.data;
    events.push({
      id: `${r.entity_type}:${r.entity_id}:${r.event_type}`,
      date: r.event_date,
      eventType: r.event_type,
      entityType: r.entity_type,
      entityId: r.entity_id,
      slug: r.slug,
      title: r.title,
    });
  }
  return events;
}
