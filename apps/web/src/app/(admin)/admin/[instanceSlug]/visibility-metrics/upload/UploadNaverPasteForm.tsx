"use client";

// @glitzy/web/(admin)/[instanceSlug]/visibility-metrics/upload UploadNaverPasteForm
// NAVER_SEARCH_INGEST_PLAN v0.4 § 7.4 task #4 — paste UI client form.

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { SearchPropertyRow } from "@/lib/admin/search-visibility";
import { uploadNaverPasteAction, type UploadNaverPasteResult } from "./actions";

type Props = {
  instanceSlug: string;
  properties: SearchPropertyRow[];
  defaultReferenceDate: string;
};

export function UploadNaverPasteForm({ instanceSlug, properties, defaultReferenceDate }: Props) {
  const action = uploadNaverPasteAction.bind(null, instanceSlug);
  const [state, formAction] = useFormState<UploadNaverPasteResult | null, FormData>(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-md border border-border bg-elevated p-6">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-fg-default">사이트 (네이버 source · verified)</span>
        <select
          name="propertyId"
          required
          className="rounded-md border border-border bg-bg-default px-3 py-2 text-sm focus:border-fg-default focus:outline-none"
        >
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.propertyUrl}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-fg-default">기준 날짜</span>
        <input
          type="date"
          name="referenceDate"
          required
          defaultValue={defaultReferenceDate}
          className="rounded-md border border-border bg-bg-default px-3 py-2 text-sm focus:border-fg-default focus:outline-none"
        />
        <span className="text-xs text-fg-muted">
          NSA TOP30 은 누적 스냅샷이라 일별 분해 불가 — 이 날짜를 snapshot_date 로 저장합니다.
        </span>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-fg-default">표 데이터 (클립보드 paste)</span>
        <textarea
          name="pasteText"
          required
          rows={12}
          placeholder="NSA 콘솔 → 콘텐츠 노출/클릭 → 검색 키워드 TOP30 표 영역을 드래그·복사한 뒤 여기 붙여넣기 (Ctrl+V)"
          className="rounded-md border border-border bg-bg-default px-3 py-2 font-mono text-xs focus:border-fg-default focus:outline-none"
        />
        <span className="text-xs text-fg-muted">
          header 행 포함해도 됩니다. 첫 컬럼 (No) 자동 제외 · 검색 키워드 안 공백 포함 가능 ·
          셀마다 줄바꿈되는 세로 복사, &ldquo;1,234&rdquo; 콤마 숫자, &ldquo;25%&rdquo; 표기 모두 지원.
        </span>
      </label>

      <SubmitButton />

      {state && <ResultBanner result={state} />}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
    >
      {pending ? "처리 중..." : "ingestion 실행"}
    </button>
  );
}

function ResultBanner({ result }: { result: UploadNaverPasteResult }) {
  const [showErrors, setShowErrors] = useState(true);
  if (result.ok) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-success/40 bg-success/10 p-4 text-sm">
        <p className="font-medium text-success">{result.message}</p>
        <p className="text-xs text-fg-muted">감지 format: {result.detectedFormat}</p>
        {result.errors.length > 0 && showErrors && (
          <details className="text-xs text-fg-muted" open>
            <summary className="cursor-pointer">건너뛴 행 {result.errors.length}건 보기</summary>
            <ul className="mt-2 list-disc pl-5">
              {result.errors.map((e, i) => (
                <li key={i}>
                  행 {e.rowIndex}: {e.reason}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowErrors(false)}
              className="mt-2 text-xs underline"
            >
              닫기
            </button>
          </details>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 rounded-md border border-danger/40 bg-danger/10 p-4 text-sm">
      <p className="font-medium text-danger">{result.formError}</p>
      {result.errors && result.errors.length > 0 && (
        <details className="text-xs text-fg-muted" open>
          <summary className="cursor-pointer">상세 오류 {result.errors.length}건</summary>
          <ul className="mt-2 list-disc pl-5">
            {result.errors.map((e, i) => (
              <li key={i}>
                행 {e.rowIndex}: {e.reason}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
