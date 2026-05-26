// @glitzy/web/lib/admin/conversion-summary — MEANINGFUL_TRAFFIC_LOOP_PLAN v1.0 § 7.2
// /admin/<slug> 안 ConversionTrafficCard 의 7일 5 event count + 외부 검색 click 분모 conversion rate.
// search_visibility_snapshot 의 endDate (MAX(snapshot_date)) 와 동일 windowing.

import type postgres from "postgres";

export type TrackableEvent =
  | "phone_click"
  | "kakao_click"
  | "booking_click"
  | "consult_form_start"
  | "consult_form_complete";

export type ConversionSummary = {
  byEvent: Record<TrackableEvent, number>;
  totalConversions: number;
  searchClicks: number | null;  // search_property 0 instance 시 null
  conversionRate: number | null;  // %
  windowStart: string;            // KST YYYY-MM-DD
  windowEnd: string;
};

const ZERO_BY_EVENT: Record<TrackableEvent, number> = {
  phone_click: 0,
  kakao_click: 0,
  booking_click: 0,
  consult_form_start: 0,
  consult_form_complete: 0,
};

function formatKstDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function shiftKstDate(ymd: string, deltaDays: number): string {
  // ymd = "YYYY-MM-DD" KST. UTC date 안 변환 후 가감.
  const d = new Date(`${ymd}T00:00:00+09:00`);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return formatKstDate(d);
}

export async function loadConversionSummary(
  tx: postgres.TransactionSql,
  instanceId: string,
  options: { endDate?: string; days?: number; searchClicks?: number | null } = {},
): Promise<ConversionSummary> {
  const days = options.days ?? 7;
  const endDate = options.endDate ?? formatKstDate(new Date());
  const windowStart = shiftKstDate(endDate, -(days - 1));

  // KST date 안 (endDate + 1 day) 의 KST 자정 = exclusive upper bound (UTC 14:00 전날).
  // SQL 안 timestamptz 비교 위해 `${date}::date AT TIME ZONE 'Asia/Seoul'` 활용.
  const rows = await tx<Array<{ event_name: string; cnt: string }>>`
    SELECT event_name, COUNT(*)::bigint AS cnt
    FROM conversion_event
    WHERE instance_id = ${instanceId}::uuid
      AND created_at >= ${windowStart}::date AT TIME ZONE 'Asia/Seoul'
      AND created_at <  (${endDate}::date + INTERVAL '1 day') AT TIME ZONE 'Asia/Seoul'
    GROUP BY event_name
  `;

  const byEvent: Record<TrackableEvent, number> = { ...ZERO_BY_EVENT };
  for (const r of rows) {
    if (r.event_name in byEvent) {
      byEvent[r.event_name as TrackableEvent] = Number(r.cnt);
    }
  }
  const totalConversions = Object.values(byEvent).reduce((s, n) => s + n, 0);

  const searchClicks = options.searchClicks ?? null;
  const conversionRate =
    typeof searchClicks === "number" && searchClicks > 0
      ? (totalConversions / searchClicks) * 100
      : null;

  return {
    byEvent,
    totalConversions,
    searchClicks,
    conversionRate,
    windowStart,
    windowEnd: endDate,
  };
}
