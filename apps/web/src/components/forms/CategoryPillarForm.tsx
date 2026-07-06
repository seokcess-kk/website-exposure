// @glitzy/web/components/forms/CategoryPillarForm — NAVER_EXPOSURE Tier 2
// 카테고리별 pillar select + 일괄 저장. 컨트롤드 state → hidden "mappings" JSON 으로 서버액션에 전달.
// (ClinicMetadataEditor 의 JSON-string-field 패턴 + NaverVerificationForm 의 useFormState 골격.)
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { SaveResult } from "@/lib/save-result";

type Category = { id: string; name: string; slug: string; pillar: string; articleCount: number };
type PillarOption = { value: string; label: string };

type Props = {
  action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  categories: ReadonlyArray<Category>;
  pillarOptions: ReadonlyArray<PillarOption>;
};

export function CategoryPillarForm({ action, categories, pillarOptions }: Props) {
  const [state, formAction] = useFormState(action, null);
  const [pillars, setPillars] = useState<Record<string, string>>(
    () => Object.fromEntries(categories.map((c) => [c.id, c.pillar])),
  );

  const formError = state && state.ok === false ? state.formError : undefined;
  const saved = state?.ok === true;

  const optionValues = new Set(pillarOptions.map((p) => p.value));
  const mappings = categories.map((c) => ({ categoryId: c.id, pillar: pillars[c.id] ?? "" }));

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* 컨트롤드 hidden field — 제출 시 FormData 로 전달 */}
      <input type="hidden" name="mappings" value={JSON.stringify(mappings)} />
      <table className="w-full border-collapse rounded-md border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="px-3 py-2">카테고리</th>
            <th className="px-3 py-2">slug</th>
            <th className="px-3 py-2">발행 글</th>
            <th className="px-3 py-2">연결 Pillar</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => {
            const current = pillars[c.id] ?? "";
            // treatmentPillars 에서 제거된 slug 를 아직 참조 중이면(고아) 선택 상태 보존 + 재선택 유도.
            const orphan = current !== "" && !optionValues.has(current);
            return (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{c.name}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-500">{c.slug}</td>
                <td className="px-3 py-2 text-xs text-slate-500">{c.articleCount}</td>
                <td className="px-3 py-2">
                  <select
                    value={current}
                    onChange={(e) => setPillars((prev) => ({ ...prev, [c.id]: e.target.value }))}
                    className="rounded border border-slate-300 px-2 py-1 text-sm"
                  >
                    <option value="">미지정 (공유 키워드만)</option>
                    {orphan && <option value={current}>⚠ {current} (정의되지 않음 — 재선택 필요)</option>}
                    {pillarOptions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label} ({p.value})
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {formError && <p className="text-xs text-rose-700">{formError}</p>}
      {saved && <p className="text-xs text-emerald-700">저장됨 — 공개 사이트 교차링크에 즉시 반영됩니다.</p>}
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
    >
      {pending ? "저장 중…" : "매핑 저장"}
    </button>
  );
}
