// @glitzy/web/lib/admin/__tests__/calendar-planned-events — CONTENT_CALENDAR_PLAN v1.1 § 12.4 (CCAL-DEFER-02)
// loadPlannedEvents 매핑 + zod 방어 (mock tx).

import { describe, it, expect, vi } from "vitest";
import type { TransactionSql } from "postgres";
import { loadPlannedEvents } from "../calendar-planned-events";

type Row = Record<string, unknown>;

function makeTx(rows: ReadonlyArray<Row>): TransactionSql {
  return vi.fn(() => Promise.resolve(rows as unknown)) as unknown as TransactionSql;
}

const INSTANCE = "00000000-0000-0000-0000-000000000001";
const RANGE = { startDate: "2026-06-01", endDate: "2026-06-30" };

describe("loadPlannedEvents", () => {
  it("정상 매핑 — entityType null/non-null · done · planned_date string", async () => {
    const tx = makeTx([
      {
        id: "11111111-1111-1111-1111-111111111111",
        title: "다이어트 칼럼 작성",
        planned_date: "2026-06-15",
        entity_type: "Article",
        note: "요요 방지 주제",
        done: false,
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        title: "촬영 일정",
        planned_date: "2026-06-20",
        entity_type: null,
        note: null,
        done: true,
      },
    ]);
    const out = await loadPlannedEvents(tx, INSTANCE, RANGE);
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({
      id: "11111111-1111-1111-1111-111111111111",
      plannedDate: "2026-06-15",
      title: "다이어트 칼럼 작성",
      entityType: "Article",
      note: "요요 방지 주제",
      done: false,
    });
    expect(out[1]?.entityType).toBeNull();
    expect(out[1]?.note).toBeNull();
    expect(out[1]?.done).toBe(true);
  });

  it("planned_date 가 Date 객체여도 YYYY-MM-DD 로 normalize", async () => {
    const tx = makeTx([
      {
        id: "33333333-3333-3333-3333-333333333333",
        title: "D",
        planned_date: new Date("2026-06-10T00:00:00Z"),
        entity_type: "FAQ",
        note: null,
        done: false,
      },
    ]);
    const out = await loadPlannedEvents(tx, INSTANCE, RANGE);
    expect(out[0]?.plannedDate).toBe("2026-06-10");
  });

  it("zod 방어 — 잘못된 row(비-uuid id · 잘못된 entity_type) skip", async () => {
    const tx = makeTx([
      { id: "not-a-uuid", title: "X", planned_date: "2026-06-01", entity_type: "Article", note: null, done: false },
      { id: "44444444-4444-4444-4444-444444444444", title: "Y", planned_date: "2026-06-02", entity_type: "Bogus", note: null, done: false },
      { id: "55555555-5555-5555-5555-555555555555", title: "Z", planned_date: "2026-06-03", entity_type: null, note: null, done: false },
    ]);
    const out = await loadPlannedEvents(tx, INSTANCE, RANGE);
    expect(out).toHaveLength(1);
    expect(out[0]?.title).toBe("Z");
  });

  it("빈 결과 — 빈 배열", async () => {
    const tx = makeTx([]);
    const out = await loadPlannedEvents(tx, INSTANCE, RANGE);
    expect(out).toEqual([]);
  });
});
