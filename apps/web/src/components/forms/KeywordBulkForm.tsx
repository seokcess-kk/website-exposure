// @glitzy/web/components/forms/KeywordBulkForm — 키워드 대량 등록 폼
//
// textarea 한 줄 = 키워드 라벨 하나. slug 는 서버에서 자동 파생.
// 공통 속성 (유형·부모·의도·우선순위·상태) 을 전체 줄에 일괄 적용.

"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { Field, SelectField } from "./Field";
import type { KeywordParentOption } from "@/lib/admin/keyword-parent-options";
import type { BulkKeywordResult } from "@/app/(admin)/admin/[instanceSlug]/keywords/actions";

const INTENT_OPTIONS = [
  { value: "informational", label: "정보 탐색 (informational)" },
  { value: "comparison", label: "비교 (comparison)" },
  { value: "pre-booking", label: "예약 직전 (pre-booking)" },
  { value: "local", label: "지역 탐색 (local)" },
];

const PRIORITY_OPTIONS = [
  { value: "P0", label: "P0 — 핵심" },
  { value: "P1", label: "P1 — 일반" },
  { value: "P2", label: "P2 — 후순위" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "추적 중 (active)" },
  { value: "paused", label: "일시 중단 (paused)" },
  { value: "won", label: "확보 (won)" },
  { value: "dropped", label: "포기 (dropped)" },
];

function SubmitButton({ lineCount }: { lineCount: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || lineCount === 0}
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
    >
      {pending ? "등록 중…" : lineCount > 0 ? `${lineCount}개 키워드 등록` : "키워드 등록"}
    </button>
  );
}

export function KeywordBulkForm({
  action,
  parentOptions,
}: {
  action: (prev: BulkKeywordResult | null, formData: FormData) => Promise<BulkKeywordResult>;
  parentOptions: ReadonlyArray<KeywordParentOption>;
}) {
  const [state, formAction] = useFormState<BulkKeywordResult | null, FormData>(action, null);
  const [lines, setLines] = useState("");
  const [keywordType, setKeywordType] = useState<"primary" | "secondary">("primary");
  const [parentId, setParentId] = useState("");
  const [intent, setIntent] = useState("informational");
  const [priority, setPriority] = useState("P1");
  const [status, setStatus] = useState("active");

  // 성공 시 textarea 만 비움 (공통 속성은 이어서 다음 배치에 재사용)
  const prevState = useRef<BulkKeywordResult | null>(null);
  useEffect(() => {
    if (state !== prevState.current && state?.ok === true) setLines("");
    prevState.current = state;
  }, [state]);

  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const lineCount = lines.split(/\r?\n/).filter((l) => l.trim().length > 0).length;
  const isSecondary = keywordType === "secondary";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.ok === true && <BulkResultSummary result={state} />}
      {formError && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Field
          name="lines"
          label="키워드 목록"
          required
          textarea
          rows={14}
          value={lines}
          onChange={setLines}
          errors={fieldErrors.lines}
          placeholder={"다이어트 한약 부작용\n부평 다이어트 한의원\n산후 다이어트 방법"}
          hint="한 줄에 키워드 하나 — 사용자 검색어 그대로. slug 는 자동 생성되며, 이미 등록된 키워드는 건너뜁니다. 한 번에 최대 200개."
        />

        <div className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2 text-sm">
            <legend className="font-medium">키워드 유형 (전체 적용)</legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="keywordType"
                  value="primary"
                  checked={!isSecondary}
                  onChange={() => { setKeywordType("primary"); setParentId(""); }}
                />
                <span>대표 (primary)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="keywordType"
                  value="secondary"
                  checked={isSecondary}
                  onChange={() => setKeywordType("secondary")}
                />
                <span>보조 (secondary)</span>
              </label>
            </div>
          </fieldset>

          {isSecondary && (
            <SelectField
              name="parentId"
              label="부모 대표 키워드"
              required
              value={parentId}
              onChange={setParentId}
              options={parentOptions.map((o) => ({
                value: o.value,
                label: o.sublabel ? `${o.label} (${o.sublabel})` : o.label,
              }))}
              errors={fieldErrors.parentId}
              hint="모든 줄이 이 대표 키워드의 보조로 등록됩니다."
            />
          )}

          <SelectField name="intent" label="검색 의도" value={intent} onChange={setIntent} options={INTENT_OPTIONS} required errors={fieldErrors.intent} />
          <SelectField name="priority" label="우선순위" value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} required errors={fieldErrors.priority} />
          <SelectField name="status" label="상태" value={status} onChange={setStatus} options={STATUS_OPTIONS} required errors={fieldErrors.status} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton lineCount={lineCount} />
        <span className="text-xs text-slate-500">
          의도·우선순위가 다른 키워드는 배치를 나눠 등록하세요. 콘텐츠 매핑은 등록 후 각 키워드 편집에서.
        </span>
      </div>
    </form>
  );
}

function BulkResultSummary({ result }: { result: Extract<BulkKeywordResult, { ok: true }> }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
        {result.inserted}개 키워드를 등록했습니다.
      </div>
      {result.skippedExisting.length > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          이미 등록되어 건너뜀 ({result.skippedExisting.length}): {result.skippedExisting.join(", ")}
        </div>
      )}
      {result.duplicateInInput.length > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          입력 안 중복으로 건너뜀 ({result.duplicateInInput.length}): {result.duplicateInInput.join(", ")}
        </div>
      )}
      {result.invalid.length > 0 && (
        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">
          형식 오류로 건너뜀 ({result.invalid.length}):{" "}
          {result.invalid.map((i) => `${i.line}행 "${i.raw}" (${i.reason})`).join(" · ")}
        </div>
      )}
    </div>
  );
}
