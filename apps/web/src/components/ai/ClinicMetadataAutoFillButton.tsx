// @glitzy/web/components/ai/ClinicMetadataAutoFillButton — 의원정보 고급 문안 AI 자동 채움
//
// 기존 사실 데이터 (기관 소개·시술·키워드·소재지) 기반으로 metadata 초안 생성.
// 사실 데이터 (keyStats · naverPlace) 는 merge 시 기존 값 보존 — 문안 5키만 덮어씀.

"use client";

import { useState } from "react";

import { generateClinicMetadataDraftAction } from "@/lib/ai/clinic-metadata-draft";
import { mergeClinicMetadataPreservingFacts } from "@/lib/ai/clinic-metadata-draft-helpers";

export function ClinicMetadataAutoFillButton({
  instanceSlug,
  currentJson,
  onApply,
}: {
  instanceSlug: string;
  currentJson: string;
  onApply: (mergedJson: string) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  const run = async () => {
    if (pending) return;
    if (
      currentJson.trim() !== "" &&
      !window.confirm(
        "기존 고급 문안을 AI 초안으로 덮어씁니다.\n(키 통계 · 네이버 플레이스 값은 유지됩니다)\n계속할까요?",
      )
    ) {
      return;
    }
    setPending(true);
    setError(null);
    setApplied(false);
    try {
      const r = await generateClinicMetadataDraftAction(instanceSlug);
      if (!r.ok) {
        setError(r.message);
      } else {
        onApply(mergeClinicMetadataPreservingFacts(currentJson, r.data.metadataJson));
        setApplied(true);
      }
    } catch {
      setError("AI 호출 중 오류가 발생했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-indigo-200 bg-indigo-50/60 p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={pending}
          className="shrink-0 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {pending ? "생성 중…" : "✨ 문안 AI 자동 채움 (1 quota)"}
        </button>
        <span className="text-xs text-slate-600">
          기관 소개 · 발행된 시술 · 타깃 키워드 · 소재지 기반으로 아래 문안을 자동 작성합니다. 적용 후 검수하고 저장하세요.
        </span>
      </div>
      <span className="text-[11px] text-slate-500">
        키 통계 (KeyStats) 는 의료광고법상 검증 출처가 필요해 자동 생성하지 않습니다. 네이버 플레이스 값도 그대로 유지됩니다.
      </span>
      {applied && (
        <span className="text-xs text-emerald-700">
          ✅ 초안이 아래 편집기에 채워졌습니다 — 검수 후 페이지 하단 <strong>저장</strong>을 눌러야 반영됩니다.
        </span>
      )}
      {error && <span className="text-xs text-rose-700">{error}</span>}
    </div>
  );
}
