// @glitzy/web/components/site/BusinessHoursTable
// SoT: LL-SCHEMA-16 CT-02 + PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08

import type { LocationProjection } from "@/lib/db-projection";

const DAY_KO: Record<string, string> = {
  Monday: "월",
  Tuesday: "화",
  Wednesday: "수",
  Thursday: "목",
  Friday: "금",
  Saturday: "토",
  Sunday: "일",
};

export function BusinessHoursTable({ hours }: { hours: LocationProjection["businessHours"] }) {
  if (hours.openingHours.length === 0) {
    return <div className="text-sm text-fg-muted">진료 시간 정보가 등록되지 않았습니다.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-border text-sm">
        <thead className="bg-subtle">
          <tr>
            <th scope="col" className="border border-border px-3 py-2 text-left">요일</th>
            <th scope="col" className="border border-border px-3 py-2 text-left">진료 시간</th>
            <th scope="col" className="border border-border px-3 py-2 text-left">점심</th>
          </tr>
        </thead>
        <tbody>
          {hours.openingHours.map((oh, i) => {
            const dayLabel = oh.dayOfWeek.map((d) => DAY_KO[d] ?? d).join(", ");
            const lb = hours.lunchBreaks.find((l) => l.dayOfWeek.some((d) => oh.dayOfWeek.includes(d)));
            return (
              <tr key={i}>
                <th scope="row" className="border border-border px-3 py-2 text-left font-medium">{dayLabel}</th>
                <td className="border border-border px-3 py-2">{oh.opens} – {oh.closes}</td>
                <td className="border border-border px-3 py-2 text-fg-muted">{lb ? `${lb.from} – ${lb.to}` : "—"}</td>
              </tr>
            );
          })}
          {hours.specialClosures.length > 0 ? (
            <tr>
              <th scope="row" className="border border-border px-3 py-2 text-left font-medium">특수 휴진</th>
              <td colSpan={2} className="border border-border px-3 py-2 text-fg-muted">
                {hours.specialClosures.map((c) => `${c.date}${c.reason ? ` (${c.reason})` : ""}`).join(", ")}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
