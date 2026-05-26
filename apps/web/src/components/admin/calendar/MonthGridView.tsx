// @glitzy/web/components/admin/calendar/MonthGridView — CONTENT_CALENDAR_PLAN v1.0 § 5.2
// 7×6 grid · 일요일 시작 · 요일 한글 column header · count+emoji dot summary
// padding day click → 그 월 navigation · today highlight (KST) · accessibility (table semantic + aria-label).

import Link from "next/link";
import type { CalendarEvent } from "@/lib/admin/calendar-events";
import { formatKstDate } from "@/lib/admin/calendar-events";
import { EVENT_TYPE_EMOJI } from "./EntityIcon";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function MonthGridView({
  monthYyyyMm,
  startDate,
  endDate,
  events,
  instanceSlug,
}: {
  monthYyyyMm: string;
  startDate: string;
  endDate: string;
  events: CalendarEvent[];
  instanceSlug: string;
}) {
  const todayKst = formatKstDate(new Date());

  // events 를 date 별 group
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const arr = eventsByDate.get(ev.date) ?? [];
    arr.push(ev);
    eventsByDate.set(ev.date, arr);
  }

  // grid cells = startDate ~ endDate (모든 일)
  const cells: Array<{ date: string; inMonth: boolean }> = [];
  const start = new Date(`${startDate}T12:00:00Z`);
  const end = new Date(`${endDate}T12:00:00Z`);
  const month = Number(monthYyyyMm.split("-")[1]);  // 1~12

  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const date = `${y}-${m}-${dd}`;
    const inMonth = d.getUTCMonth() + 1 === month;
    cells.push({ date, inMonth });
  }

  // 7 cells per row
  const rows: Array<typeof cells> = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <table className="w-full table-fixed border-collapse" role="grid" aria-label={`${monthYyyyMm} 콘텐츠 캘린더`}>
      <thead>
        <tr>
          {WEEKDAY_LABELS.map((w) => (
            <th
              key={w}
              scope="col"
              className="border border-border bg-bg-default/30 px-2 py-1.5 text-xs font-semibold text-fg-muted"
            >
              {w}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell) => (
              <DayCell
                key={cell.date}
                date={cell.date}
                inMonth={cell.inMonth}
                isToday={cell.date === todayKst}
                events={eventsByDate.get(cell.date) ?? []}
                instanceSlug={instanceSlug}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DayCell({
  date,
  inMonth,
  isToday,
  events,
  instanceSlug,
}: {
  date: string;
  inMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  instanceSlug: string;
}) {
  const dayNumber = Number(date.slice(8, 10));
  const monthOfCell = date.slice(0, 7);  // YYYY-MM

  // event count by type
  const counts: Record<string, number> = {};
  for (const ev of events) {
    counts[ev.eventType] = (counts[ev.eventType] ?? 0) + 1;
  }

  const baseClass = inMonth ? "" : "opacity-50";
  const todayClass = isToday ? "bg-brand-primary-soft" : "bg-white";
  const eventCount = events.length;
  const ariaLabel = `${date}${eventCount > 0 ? ` · 일정 ${eventCount}건` : ""}`;

  // padding day (다른 월) click → 그 월 navigation
  const cellContent = (
    <div className="flex h-16 flex-col gap-0.5 px-1.5 py-1">
      <div className="text-xs font-medium text-fg-default">{dayNumber}</div>
      {eventCount > 0 && (
        <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-[10px]">
          {Object.entries(counts).map(([eventType, count]) => (
            <span key={eventType} className="inline-flex items-center gap-0.5">
              {EVENT_TYPE_EMOJI[eventType as keyof typeof EVENT_TYPE_EMOJI]}
              <span className="text-fg-default">{count}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <td
      className={`border border-border ${todayClass} ${baseClass} p-0 align-top`}
      role="gridcell"
      aria-label={ariaLabel}
    >
      {!inMonth ? (
        <Link
          href={`/admin/${instanceSlug}/calendar?month=${monthOfCell}`}
          className="block h-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
          tabIndex={0}
        >
          {cellContent}
        </Link>
      ) : (
        <a
          href={`#date-${date}`}
          className="block h-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
          tabIndex={0}
        >
          {cellContent}
        </a>
      )}
    </td>
  );
}
