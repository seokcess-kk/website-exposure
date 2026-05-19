import type { PrimaryCta } from "@/lib/db-projection";

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

export function ReservationChannels({ ctas }: { ctas: PrimaryCta[] }) {
  if (ctas.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {ctas.map((c) => (
        <a
          key={c.id}
          href={c.targetUrl}
          className="rounded-md border border-border bg-elevated px-4 py-2 text-sm font-medium text-fg-default hover:border-brand-primary"
        >
          <span className="text-xs text-fg-muted">{CHANNEL_LABEL[c.type] ?? c.type}</span>
          <span className="ml-2">{c.label}</span>
        </a>
      ))}
    </div>
  );
}
