// @glitzy/web/lib/admin/calendar-planned-events — CONTENT_CALENDAR_PLAN v1.1 § 12 (CCAL-DEFER-02)
// 운영자 추가 "계획 일정" (content_calendar_event) 로드 — published 파생 event 와 별 source.
// zod 방어 + planned_date date 타입 string 정합.

import type postgres from "postgres";
import { z } from "zod";
import type { CalendarEntityType } from "./calendar-events";

export type PlannedCalendarEvent = {
  id: string;
  plannedDate: string; // YYYY-MM-DD
  title: string;
  entityType: CalendarEntityType | null;
  note: string | null;
  done: boolean;
};

const ENTITY_TYPES = [
  "Article", "TreatmentPage", "MedicalConditionPage", "FAQ",
  "Publication", "MediaAppearance", "LegalDocument",
] as const;

const plannedRowSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  planned_date: z.union([
    z.string(),
    z.date().transform((d) => d.toISOString().slice(0, 10)),
  ]),
  entity_type: z.enum(ENTITY_TYPES).nullable(),
  note: z.string().nullable(),
  done: z.boolean(),
});

/**
 * 표시 범위 안 계획 일정 로드 (planned_date BETWEEN start AND end).
 * RLS tenant_isolation 으로 instance scope 보장 — WHERE instance_id 명시 이중 방어.
 */
export async function loadPlannedEvents(
  tx: postgres.TransactionSql,
  instanceId: string,
  options: { startDate: string; endDate: string },
): Promise<PlannedCalendarEvent[]> {
  const { startDate, endDate } = options;

  const rows = await tx<Array<{
    id: string;
    title: string;
    planned_date: Date | string;
    entity_type: string | null;
    note: string | null;
    done: boolean;
  }>>`
    SELECT id, title, planned_date::text AS planned_date, entity_type, note, done
      FROM content_calendar_event
     WHERE instance_id = ${instanceId}::uuid
       AND planned_date BETWEEN ${startDate}::date AND ${endDate}::date
     ORDER BY planned_date ASC, created_at ASC
  `;

  const events: PlannedCalendarEvent[] = [];
  for (const row of rows) {
    const parsed = plannedRowSchema.safeParse(row);
    if (!parsed.success) {
      console.warn("[calendar-planned-events] invalid row", row);
      continue;
    }
    const r = parsed.data;
    events.push({
      id: r.id,
      plannedDate: r.planned_date,
      title: r.title,
      entityType: r.entity_type,
      note: r.note,
      done: r.done,
    });
  }
  return events;
}
