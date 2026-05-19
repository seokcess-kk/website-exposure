// @glitzy/web/components/admin/PublicSiteLink — 어드민 edit 화면 안 공개 사이트 link (P2 UX 개선)
// status 또는 active 조건 충족 시 표시. server component (siteBaseUrl 가 headers() 호출).
//
// 입력: entity 별 path 결정 정보 + 표시 가능 여부 (published / active).
// 비표시 case: status='draft'·'review-queued'·rejected 등.

import { siteBaseUrl } from "@/lib/site-url";

type Props = {
  instanceSlug: string;
  /** 활성 여부 — false 면 안내 텍스트 표시 (공개 사이트 미노출) */
  visible: boolean;
  /** 공개 path (instanceSlug 제외 · 시작 슬래시 포함). 예: `/doctors/dr-lee`, `/insights/general/my-article` */
  publicPath: string;
  /** 비표시 안내 (visible=false 시) */
  hiddenReason?: string;
};

export function PublicSiteLink({ instanceSlug, visible, publicPath, hiddenReason }: Props) {
  if (!visible) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        🔒 공개 사이트 미노출 — {hiddenReason ?? "발행되지 않음"}
      </div>
    );
  }
  const base = siteBaseUrl(instanceSlug);
  const url = `${base}${publicPath}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
    >
      <span aria-hidden>🌐</span>
      <span>공개 사이트에서 보기</span>
      <span className="text-xs text-emerald-700 break-all">{url}</span>
    </a>
  );
}
