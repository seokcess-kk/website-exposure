// @glitzy/web/components/admin/BulkDraftGenerator — 어드민 다발 발행 (CONTENT_BULK)
// 키워드 목록 → 편당 AI Full Draft 생성 → status='draft' 저장. 순차 진행 + 진행률 표시.
// 생성물은 draft — 운영자가 아티클 목록에서 검수 후 1클릭 발행.

"use client";

import { useState } from "react";
import Link from "next/link";
import { generateArticleFullDraftAction } from "@/lib/ai/article-full-draft";
import { saveBulkDraftArticle } from "@/app/(admin)/admin/[instanceSlug]/articles/actions";

type RowStatus = "pending" | "generating" | "saving" | "done" | "error";
type RowState = { keyword: string; brief: string; categorySlug: string; status: RowStatus; message?: string; slug?: string };

const QUOTA_PER = 7; // article full draft weight

function synthBrief(keyword: string): string {
  return `${keyword}에 대해 개념·원인·일상 관리 방법·주의사항을 일반 정보 제공 목적으로 객관적이고 중립적으로 정리하는 칼럼입니다.`;
}

const STATUS_LABEL: Record<RowStatus, string> = {
  pending: "대기",
  generating: "AI 생성 중…",
  saving: "저장 중…",
  done: "draft 저장됨",
  error: "실패",
};
const STATUS_TONE: Record<RowStatus, string> = {
  pending: "bg-slate-100 text-slate-600",
  generating: "bg-blue-100 text-blue-700",
  saving: "bg-blue-100 text-blue-700",
  done: "bg-emerald-100 text-emerald-700",
  error: "bg-rose-100 text-rose-700",
};

export function BulkDraftGenerator({
  instanceSlug,
  categories,
}: {
  instanceSlug: string;
  categories: Array<{ slug: string; name: string }>;
}) {
  const [raw, setRaw] = useState("");
  // 인스턴스에 general 이 없을 수 있음 — 첫 카테고리로 fallback (controlled select 정합)
  const [batchCategory, setBatchCategory] = useState(
    () => (categories.some((c) => c.slug === "general") ? "general" : categories[0]?.slug ?? "general"),
  );
  const [rows, setRows] = useState<RowState[]>([]);
  const [running, setRunning] = useState(false);

  function parseLines(): Array<{ keyword: string; brief: string; categorySlug: string; invalidCategory?: string }> {
    const isCategory = (s: string) => categories.some((c) => c.slug === s);
    return raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        // 형식: 키워드 | 브리프(선택) | 카테고리slug(선택 · 배치 선택값 override)
        // 브리프 안 '|' 보존 — 마지막 필드가 실존 카테고리 slug 일 때만 카테고리로 채택.
        const parts = line.split("|").map((p) => p.trim());
        const keyword = parts[0] ?? "";
        let briefParts = parts.slice(1);
        let categorySlug = batchCategory;
        let invalidCategory: string | undefined;
        const last = briefParts[briefParts.length - 1];
        if (last !== undefined) {
          if (isCategory(last)) {
            categorySlug = last;
            briefParts = briefParts.slice(0, -1);
          } else if (briefParts.length >= 2 && /^[a-z0-9][a-z0-9-]{1,63}$/.test(last)) {
            // 명시적 3번째 필드인데 실존 카테고리가 아님 — quota 낭비 전에 에러로 마킹
            invalidCategory = last;
            briefParts = briefParts.slice(0, -1);
          }
        }
        const briefRaw = briefParts.join(" | ").trim();
        const brief = briefRaw.length >= 50 ? briefRaw.slice(0, 200) : synthBrief(keyword);
        return { keyword, brief, categorySlug, ...(invalidCategory ? { invalidCategory } : {}) };
      })
      .filter((x) => x.keyword.length > 0)
      .slice(0, 20); // 안전 상한
  }

  const parsedCount = parseLines().length;

  async function run() {
    const items = parseLines();
    if (items.length === 0 || running) return;
    setRunning(true);
    setRows(items.map((it) => ({ keyword: it.keyword, brief: it.brief, categorySlug: it.categorySlug, status: "pending" as RowStatus })));

    for (let i = 0; i < items.length; i++) {
      const it = items[i]!;
      // 카테고리 오타는 생성 전에 차단 — AI quota(weight 7) 소모 후 저장 실패 방지
      if (it.invalidCategory) {
        setRows((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "error", message: `카테고리 '${it.invalidCategory}' 없음 — 생성 skip` } : r,
          ),
        );
        continue;
      }
      setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, status: "generating" } : r)));
      try {
        const gen = await generateArticleFullDraftAction(instanceSlug, {
          primaryKeyword: it.keyword,
          secondaryKeywords: [],
          brief: it.brief,
          categoryName: categories.find((c) => c.slug === it.categorySlug)?.name,
        });
        if (!gen.ok) {
          setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, status: "error", message: gen.message } : r)));
          continue;
        }
        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, status: "saving" } : r)));
        const saved = await saveBulkDraftArticle(instanceSlug, {
          slug: gen.data.slug,
          title: gen.data.title,
          summary: gen.data.summary,
          bodyMarkdown: gen.data.bodyMarkdown,
          keywordLabel: it.keyword,
          regionScope: null,
          intent: "informational",
          categorySlug: it.categorySlug,
        });
        setRows((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? saved.ok
                ? { ...r, status: "done", slug: saved.slug }
                : { ...r, status: "error", message: saved.error }
              : r,
          ),
        );
      } catch {
        setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, status: "error", message: "오류" } : r)));
      }
    }
    setRunning(false);
  }

  const doneCount = rows.filter((r) => r.status === "done").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        ⚠ AI 초안은 모두 <strong>draft</strong> 로 저장됩니다. 의료광고법 책임은 운영자에게 있으니 목록에서 <strong>검수 후 발행</strong>하세요.
        편당 약 {QUOTA_PER} quota 차감 · 환자 실명/연락처 등 PII 입력 금지.
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-fg-default">기본 카테고리 (주제 클러스터 신호 — 줄별 3번째 필드로 override 가능)</span>
        <select
          value={batchCategory}
          onChange={(e) => setBatchCategory(e.target.value)}
          disabled={running}
          className="w-fit rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name} ({c.slug})
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-fg-default">키워드 목록 (줄당 1개 · <code>키워드 | 브리프(선택) | 카테고리slug(선택)</code>)</span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={8}
          disabled={running}
          placeholder={"부평 다이어트 한약 부작용\n갱년기 체중 관리 | 갱년기 호르몬 변화와 체중 증가의 관계, 일상 관리법을 정리 | lifecycle-diet\n당질조절 다이어트 | | diet"}
          className="rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
        />
        <span className="text-xs text-fg-muted">
          인식된 키워드 {parsedCount}개 (최대 20) · 브리프 미입력 시 자동 생성 · 카테고리 미입력 시 위 기본 카테고리
        </span>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={running || parsedCount === 0}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {running ? `생성 중… (${doneCount}/${rows.length})` : `AI 초안 ${parsedCount}편 생성`}
        </button>
        {rows.length > 0 && !running && (
          <Link href={`/admin/${instanceSlug}/articles`} className="text-sm text-blue-700 underline">
            아티클 목록에서 검수·발행 →
          </Link>
        )}
      </div>

      {rows.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {rows.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium text-fg-default">{r.keyword}</span>
                <span className="ml-2 text-xs text-slate-400">[{r.categorySlug}]</span>
                {r.message && <span className="ml-2 text-xs text-rose-600">— {r.message}</span>}
              </span>
              {r.status === "done" && r.slug && (
                <Link href={`/admin/${instanceSlug}/articles/${r.slug}`} className="shrink-0 text-xs text-blue-700 underline">
                  편집
                </Link>
              )}
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${STATUS_TONE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
