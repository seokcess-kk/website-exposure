// @glitzy/web/components/site/ReservationChannels — CTA 채널 grid + beacon mount (MTL v1.0)
// type 별 event 매핑:
//   phone → phone_click
//   kakao-talk · kakao-channel → kakao_click
//   그 외 (naver-reservation · naver-talk · form · email · sms · video-consultation · map · external) → booking_click

"use client";

import type { PrimaryCta } from "@/lib/db-projection";
import { trackEvent, type TrackableEvent } from "@/lib/site-tracking/beacon";

const CHANNEL_LABEL: Record<string, string> = {
  phone: "전화",
  "kakao-talk": "카카오톡",
  "naver-reservation": "네이버 예약",
  email: "이메일",
  sms: "SMS",
  "kakao-channel": "카카오 채널",
  "naver-talk": "네이버 톡톡",
  form: "예약 폼",
  map: "지도",
  external: "외부 링크",
  "video-consultation": "화상 진료",
};

function ctaTypeToEvent(type: string): TrackableEvent {
  if (type === "phone") return "phone_click";
  if (type === "kakao-talk" || type === "kakao-channel") return "kakao_click";
  return "booking_click";
}

export function ReservationChannels({ ctas }: { ctas: PrimaryCta[] }) {
  if (ctas.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {ctas.map((c) => (
        <a
          key={c.id}
          href={c.targetUrl}
          className="rounded-md border border-border bg-elevated px-4 py-2 text-sm font-medium text-fg-default hover:border-brand-primary"
          onClick={() => trackEvent(ctaTypeToEvent(c.type))}
        >
          <span className="text-xs text-fg-muted">{CHANNEL_LABEL[c.type] ?? c.type}</span>
          <span className="ml-2">{c.label}</span>
        </a>
      ))}
    </div>
  );
}
