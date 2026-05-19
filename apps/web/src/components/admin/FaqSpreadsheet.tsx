// @glitzy/web/components/admin/FaqSpreadsheet — ADMIN_UX_REDESIGN v1.0 § 7
// FAQ 다건 동시 입력 — 5 row × 3 column (slug · question · answer) spreadsheet 형태.
// "전체 저장" 안 각 row 안 차례로 saveFaq action 호출 + 결과 표시.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveFaq } from "@/app/(admin)/admin/[instanceSlug]/faqs/actions";

type Row = {
  slug: string;
  question: string;
  answer: string;
  displayOrder: string;
  status: "pending" | "saving" | "saved" | "error";
  error: string | null;
};

const EMPTY_ROW: Row = {
  slug: "",
  question: "",
  answer: "",
  displayOrder: "0",
  status: "pending",
  error: null,
};

export function FaqSpreadsheet({ instanceSlug, initialRows = 5 }: { instanceSlug: string; initialRows?: number }) {
  const [rows, setRows] = useState<Row[]>(() => Array.from({ length: initialRows }, (_, i) => ({ ...EMPTY_ROW, displayOrder: String(i * 10) })));
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const updateRow = (i: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, { ...EMPTY_ROW, displayOrder: String(prev.length * 10) }]);
  };

  const saveAll = () => {
    startTransition(async () => {
      let anySaved = false;
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i]!;
        if (r.slug.trim() === "" || r.question.trim() === "" || r.answer.trim() === "") continue;
        if (r.status === "saved") continue;

        updateRow(i, { status: "saving", error: null });
        const fd = new FormData();
        fd.set("slug", r.slug.trim());
        fd.set("question", r.question.trim());
        fd.set("answer", r.answer.trim());
        fd.set("displayOrder", r.displayOrder);

        const result = await saveFaq(instanceSlug, null, null, fd);
        if (result.ok) {
          updateRow(i, { status: "saved", error: null });
          anySaved = true;
        } else {
          const keys = Object.keys(result.fieldErrors ?? {});
          const msg = result.formError ?? (keys.length > 0
            ? `${keys[0]}: ${(result.fieldErrors as Record<string, string[]>)[keys[0]!]?.[0] ?? "검증 실패"}`
            : "저장 실패");
          updateRow(i, { status: "error", error: msg });
        }
      }
      if (anySaved) router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-elevated p-4">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-fg-default">📋 FAQ 다건 입력 (spreadsheet)</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addRow}
            className="rounded-md border border-border bg-canvas px-3 py-1 text-xs text-fg-default hover:bg-subtle"
          >
            + 행 추가
          </button>
          <button
            type="button"
            onClick={saveAll}
            disabled={pending}
            className="rounded-md bg-brand-primary px-4 py-1 text-xs font-medium text-fg-inverse hover:bg-brand-primary-hover disabled:opacity-50"
          >
            {pending ? "저장 중…" : "전체 저장"}
          </button>
        </div>
      </header>

      <table className="w-full border-collapse text-xs">
        <thead className="text-left text-fg-muted">
          <tr>
            <th className="px-2 py-1 w-12">순서</th>
            <th className="px-2 py-1 w-40">slug (URL)</th>
            <th className="px-2 py-1">질문 (10자+)</th>
            <th className="px-2 py-1">답변 (50자+)</th>
            <th className="px-2 py-1 w-16">상태</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-t border-border ${r.status === "saved" ? "bg-success-subtle" : r.status === "error" ? "bg-error-subtle" : ""}`}>
              <td className="px-2 py-1">
                <input
                  type="text"
                  value={r.displayOrder}
                  onChange={(e) => updateRow(i, { displayOrder: e.target.value })}
                  className="w-12 rounded border border-border bg-canvas px-1 py-0.5 text-xs"
                  disabled={r.status === "saved"}
                />
              </td>
              <td className="px-2 py-1">
                <input
                  type="text"
                  value={r.slug}
                  onChange={(e) => updateRow(i, { slug: e.target.value })}
                  placeholder="faq-1"
                  pattern="^[a-z0-9][a-z0-9-]{2,99}$"
                  className="w-full rounded border border-border bg-canvas px-1 py-0.5 font-mono text-xs"
                  disabled={r.status === "saved"}
                />
              </td>
              <td className="px-2 py-1">
                <textarea
                  value={r.question}
                  onChange={(e) => updateRow(i, { question: e.target.value })}
                  rows={2}
                  className="w-full rounded border border-border bg-canvas px-1 py-0.5 text-xs"
                  disabled={r.status === "saved"}
                />
              </td>
              <td className="px-2 py-1">
                <textarea
                  value={r.answer}
                  onChange={(e) => updateRow(i, { answer: e.target.value })}
                  rows={3}
                  className="w-full rounded border border-border bg-canvas px-1 py-0.5 text-xs"
                  disabled={r.status === "saved"}
                />
              </td>
              <td className="px-2 py-1 text-center text-xs">
                {r.status === "saved" && <span className="text-success">✓ 저장</span>}
                {r.status === "saving" && <span className="text-info">…</span>}
                {r.status === "error" && <span className="text-error" title={r.error ?? ""}>❌</span>}
                {r.status === "pending" && <span className="text-fg-muted">대기</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.some((r) => r.status === "error") && (
        <div className="rounded-md border border-error bg-error-subtle p-2 text-xs text-fg-default">
          오류 발생 row — 위 표 안 해당 행 hover 시 오류 메시지 표시. 수정 후 "전체 저장" 다시 클릭.
        </div>
      )}
    </div>
  );
}
