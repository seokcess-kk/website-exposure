// @glitzy/web/(admin)/[instanceSlug]/calendar — CONTENT_CALENDAR_PLAN v1.0 § 4
// read-only 일정 시각화 — 7 entity 의 published/effective/stale-threshold 월 grid + list.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import {
  loadCalendarEvents,
  monthGridRange,
  parseMonth,
} from "@/lib/admin/calendar-events";
import { MonthGridView } from "@/components/admin/calendar/MonthGridView";
import { EventListView } from "@/components/admin/calendar/EventListView";

function shiftMonth(monthYyyyMm: string, delta: number): string {
  const [yStr, mStr] = monthYyyyMm.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  // m 1~12 — delta 적용 후 normalize
  const total = y * 12 + (m - 1) + delta;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

function formatMonthLabel(monthYyyyMm: string): string {
  const [y, m] = monthYyyyMm.split("-");
  return `${y}년 ${Number(m)}월`;
}

export default async function CalendarPage({
  params,
  searchParams,
}: {
  params: { instanceSlug: string };
  searchParams?: { month?: string | string[] };
}) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      return <main className="p-6"><p>{a.message}</p></main>;
    }
    throw err;
  }

  const monthYyyyMm = parseMonth(searchParams?.month);
  const { startDate, endDate } = monthGridRange(monthYyyyMm);

  const events = await withSkeletonTx(
    { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
    async (tx, ctx) => loadCalendarEvents(tx, ctx.instanceId, { startDate, endDate }),
  );

  const slug = params.instanceSlug;
  const prevMonth = shiftMonth(monthYyyyMm, -1);
  const nextMonth = shiftMonth(monthYyyyMm, 1);

  return (
    <main className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-fg-default">콘텐츠 캘린더</h1>
        <nav aria-label="월 navigation" className="flex items-center gap-2">
          <Link
            href={`/admin/${slug}/calendar?month=${prevMonth}`}
            className="rounded border border-border bg-elevated px-3 py-1 text-sm hover:bg-bg-hover"
          >
            ← 이전
          </Link>
          <span className="min-w-[7em] text-center text-sm font-medium text-fg-default">
            {formatMonthLabel(monthYyyyMm)}
          </span>
          <Link
            href={`/admin/${slug}/calendar?month=${nextMonth}`}
            className="rounded border border-border bg-elevated px-3 py-1 text-sm hover:bg-bg-hover"
          >
            다음 →
          </Link>
        </nav>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <MonthGridView
          monthYyyyMm={monthYyyyMm}
          startDate={startDate}
          endDate={endDate}
          events={events}
          instanceSlug={slug}
        />
        <aside className="rounded-md border border-border bg-elevated/30 p-3">
          <EventListView events={events} instanceSlug={slug} />
        </aside>
      </div>

      <footer className="rounded-md border border-dashed border-border bg-bg-default/30 p-3 text-xs text-fg-muted">
        v1 범위: 7 entity 의 발행/발효/stale 임계 (updated_at+30d) 일정만 표시. 예약 발행 · alert · 사용자 추가 일정 은 v2+ (CCAL-DEFER 참조).
      </footer>
    </main>
  );
}
