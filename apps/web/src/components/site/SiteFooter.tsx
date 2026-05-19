// @glitzy/web/components/site/SiteFooter — 공개 사이트 푸터
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.1 PSR-COMP-03 (cycle2 PSR-26: 법적 페이지 링크 v0.1 단계 숨김 — broken link 회피)

import type { SiteInitial } from "@/lib/site-initial";
import { formatAddress } from "@/lib/db-projection";

export function SiteFooter({ initial }: { initial: SiteInitial }) {
  const loc = initial.locationMain;
  return (
    <footer className="mt-12 border-t border-border bg-subtle">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-fg-muted md:flex-row md:justify-between">
        <div>
          <div className="text-base font-semibold text-fg-default">{initial.clinic.name}</div>
          {loc ? (
            <ul className="mt-2 space-y-1">
              <li>주소: {formatAddress(loc)}</li>
              {loc.telephone ? <li>전화: {loc.telephone}</li> : null}
              {loc.email ? <li>이메일: {loc.email}</li> : null}
            </ul>
          ) : null}
        </div>
        {loc && loc.businessHours.openingHours.length > 0 ? (
          <div>
            <div className="font-medium text-fg-default">진료 시간</div>
            <ul className="mt-2 space-y-1">
              {loc.businessHours.openingHours.map((oh, i) => (
                <li key={i}>
                  {oh.dayOfWeek.join(", ")}: {oh.opens} – {oh.closes}
                </li>
              ))}
              {loc.businessHours.lunchBreaks.map((lb, i) => (
                <li key={`lunch-${i}`}>
                  점심 ({lb.dayOfWeek.join(", ")}): {lb.from} – {lb.to}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="text-xs text-fg-disabled">
          © {new Date().getUTCFullYear()} {initial.clinic.name}
          {initial.clinic.legalEntityName ? ` (${initial.clinic.legalEntityName})` : null}
        </div>
      </div>
      {/* PSR-26: LegalDocument 공개 합류 (PSR-DEFER-13) 시점에 정책 5종 링크 추가 */}
    </footer>
  );
}
