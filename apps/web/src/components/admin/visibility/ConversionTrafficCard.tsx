// @glitzy/web/components/admin/visibility/ConversionTrafficCard — MEANINGFUL_TRAFFIC_LOOP v1.0 § 7
// 7일 5 event count + 외부 검색 click 분모 conversion rate.
// search_property 0 instance 안 "외부 검색 미연결" message + /visibility-metrics link.

import Link from "next/link";
import type { ConversionSummary } from "@/lib/admin/conversion-summary";

const EVENT_LABEL: Record<keyof ConversionSummary["byEvent"], string> = {
  phone_click: "전화 클릭",
  kakao_click: "카카오 클릭",
  booking_click: "예약 클릭",
  consult_form_start: "상담 시작",
  consult_form_complete: "상담 완료",
};

export function ConversionTrafficCard({
  data,
  instanceSlug,
}: {
  data: ConversionSummary;
  instanceSlug: string;
}) {
  const rateLabel =
    data.conversionRate !== null
      ? `${data.conversionRate.toFixed(2)}%`
      : "—";

  return (
    <article className="flex flex-col gap-2 rounded-md border border-border bg-elevated p-4">
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
          유입·전환 (지난 7일)
        </h3>
        <span className="text-[10px] text-fg-muted">
          {data.windowStart} ~ {data.windowEnd}
        </span>
      </header>

      <ul className="flex flex-col gap-0.5 text-sm text-fg-default">
        {(Object.keys(EVENT_LABEL) as Array<keyof typeof EVENT_LABEL>).map((key) => (
          <li key={key} className="flex items-center justify-between">
            <span className="text-fg-muted">{EVENT_LABEL[key]}</span>
            <span className="font-semibold">{data.byEvent[key]}</span>
          </li>
        ))}
      </ul>

      <div className="mt-1 border-t border-border pt-2">
        {data.searchClicks === null ? (
          <p className="text-xs text-fg-muted">
            외부 검색 미연결 — 절대값 카운트만 의미. {" "}
            <Link
              href={`/admin/${instanceSlug}/visibility-metrics`}
              className="text-brand-primary hover:underline"
            >
              Search Console 연결 →
            </Link>
          </p>
        ) : (
          <p className="text-xs text-fg-muted">
            전환률{" "}
            <span className="font-semibold text-fg-default">{rateLabel}</span>{" "}
            <span className="text-[10px]">
              ({data.totalConversions} / 외부 검색 click {data.searchClicks})
            </span>
          </p>
        )}
      </div>
    </article>
  );
}
