// @glitzy/web/components/forms/KeywordTargetForm — SEO_KEYWORD_STRATEGY_PLAN v0.2 § 3
//
// 키워드 entity form + 콘텐츠 매핑 panel.
// Field/SelectField 재사용 + KeywordContentLinkPanel.

"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { Field, SelectField } from "./Field";
import { KeywordContentLinkPanel } from "@/components/admin/KeywordContentLinkPanel";
import type { EvidenceLinkOptions } from "@/lib/admin/evidence-link-options";
import type { KeywordParentOption } from "@/lib/admin/keyword-parent-options";
import type { KeywordContentLink } from "@/lib/admin/keyword-content-link";
import type {
  KeywordIntent,
  KeywordPriority,
  KeywordStatus,
  KeywordType,
} from "@glitzy/core-content";
import type { SaveResult } from "@/lib/save-result";

export type KeywordTargetInitial = {
  slug: string;
  label: string;
  keywordType: KeywordType;
  parentId: string; // empty for primary
  intent: KeywordIntent;
  priority: KeywordPriority;
  difficulty: string;
  regionScope: string;
  status: KeywordStatus;
};

const empty: KeywordTargetInitial = {
  slug: "",
  label: "",
  keywordType: "primary",
  parentId: "",
  intent: "informational",
  priority: "P1",
  difficulty: "",
  regionScope: "",
  status: "active",
};

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

export function KeywordTargetForm({
  action,
  initial,
  isNew,
  parentOptions,
  evidenceOptions,
  existingLinks,
}: {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  initial: KeywordTargetInitial | null;
  isNew: boolean;
  parentOptions: ReadonlyArray<KeywordParentOption>;
  evidenceOptions: EvidenceLinkOptions;
  existingLinks: ReadonlyArray<KeywordContentLink>;
}) {
  const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  const [v, setV] = useState<KeywordTargetInitial>(initial ?? empty);
  const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  const formError = state && state.ok === false ? state.formError ?? null : null;
  const set = <K extends keyof KeywordTargetInitial>(k: K, val: KeywordTargetInitial[K]) =>
    setV((p) => ({ ...p, [k]: val }));

  const isSecondary = v.keywordType === "secondary";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-5">
          {state?.ok === true && (
            <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
              저장되었습니다.
            </div>
          )}
          {formError && (
            <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
          )}

          <Field
            name="label"
            label="키워드 라벨"
            required
            value={v.label}
            onChange={(x) => set("label", x)}
            errors={fieldErrors.label}
            maxLength={100}
            hint="사용자 검색어 그대로 (예: 인천 피부과, 다이어트 한약 부작용)"
          />

          <Field
            name="slug"
            label="내부 식별자 (slug)"
            required
            value={v.slug}
            onChange={(x) => set("slug", x)}
            errors={fieldErrors.slug}
            maxLength={64}
            hint="한글/영문 모두 허용 · 소문자/숫자/하이픈 (예: incheon-piboo-gwa · 다이어트-한약). 3~64자."
          />

          <fieldset className="flex flex-col gap-2 text-sm">
            <legend className="font-medium">키워드 유형</legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="keywordType"
                  value="primary"
                  checked={v.keywordType === "primary"}
                  onChange={() => { set("keywordType", "primary"); set("parentId", ""); }}
                />
                <span>대표 (primary)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="keywordType"
                  value="secondary"
                  checked={v.keywordType === "secondary"}
                  onChange={() => set("keywordType", "secondary")}
                />
                <span>보조 (secondary)</span>
              </label>
            </div>
            {fieldErrors.keywordType && (
              <div className="text-xs text-rose-700">{fieldErrors.keywordType.join(", ")}</div>
            )}
          </fieldset>

          {isSecondary && (
            <SelectField
              name="parentId"
              label="대표 키워드 (parent)"
              required
              value={v.parentId}
              onChange={(x) => set("parentId", x)}
              options={parentOptions}
              errors={fieldErrors.parentId}
              hint="보조 키워드의 부모. 대표 (primary) 키워드만 부모로 지정 가능합니다."
            />
          )}
          {/* primary 일 때도 hidden 으로 빈 값 전송 — server-side 안 NULL 강제 */}
          {!isSecondary && <input type="hidden" name="parentId" value="" />}

          <SelectField
            name="intent"
            label="검색 의도"
            required
            value={v.intent}
            onChange={(x) => set("intent", x as KeywordIntent)}
            options={INTENT_OPTIONS}
            errors={fieldErrors.intent}
          />

          <SelectField
            name="priority"
            label="우선순위"
            required
            value={v.priority}
            onChange={(x) => set("priority", x as KeywordPriority)}
            options={PRIORITY_OPTIONS}
            errors={fieldErrors.priority}
          />

          <Field
            name="difficulty"
            label="난이도 (선택)"
            value={v.difficulty}
            onChange={(x) => set("difficulty", x)}
            errors={fieldErrors.difficulty}
            type="text"
            hint="0~100 정수. 비어두면 측정 안 됨. Phase 5 합류 시 외부 데이터 자동 산정 예정."
          />

          <Field
            name="regionScope"
            label="지역 (선택)"
            value={v.regionScope}
            onChange={(x) => set("regionScope", x)}
            errors={fieldErrors.regionScope}
            maxLength={100}
            hint="지역 키워드의 범위 (예: 인천, 인천 부평구)"
          />

          <SelectField
            name="status"
            label="추적 상태"
            required
            value={v.status}
            onChange={(x) => set("status", x as KeywordStatus)}
            options={STATUS_OPTIONS}
            errors={fieldErrors.status}
            hint="active 만 카운트 분모에 포함. paused/dropped 는 제외, won 은 별도 표시."
          />

          <KeywordContentLinkPanel options={evidenceOptions} initialLinks={existingLinks.map((l) => ({
            entityType: l.entityType,
            entityId: l.entityId,
            isPrimary: l.isPrimary,
          }))} />

          <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
            <SubmitButton isNew={isNew} />
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-800">키워드 전략 메모</h3>
            <ul className="flex list-disc flex-col gap-2 pl-4 text-xs text-slate-600">
              <li>primary 키워드 한 개 → 그 아래 보조 키워드들 (보통 3~7개)</li>
              <li>각 키워드의 1차 타깃 콘텐츠 (★ primary 마커) 가 있어야 readiness 가 평가</li>
              <li>같은 콘텐츠가 여러 키워드의 primary 가능 — 단 캐니발리제이션 위험 (Phase 4 합류 시 경고)</li>
              <li>active 만 대시보드 분모. paused/dropped 는 카운트 제외, won 은 별도 footer</li>
            </ul>
          </div>
        </aside>
      </div>
    </form>
  );
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
    >
      {pending ? "저장 중…" : isNew ? "저장 + 콘텐츠 매핑" : "변경 저장"}
    </button>
  );
}
