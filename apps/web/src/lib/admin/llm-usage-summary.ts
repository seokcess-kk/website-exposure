// @glitzy/web/lib/admin/llm-usage-summary — CONTENT_AI_ASSIST_PLAN v1.0 cycle 2 #16
// /admin/<slug> 안 LlmUsageCard — 오늘/이번 달 calls·cost + prompt_template 분포.
//
// KST 자정 경계 + status='success' 만 cost 누적 (cap-exceeded 0 + error 0 + rate-limited 0 가
// 이미 insertLlmCallLog 안 보장되지만 SUM 안 정합 위해 명시 SUM).

import type postgres from "postgres";

import type { LlmPromptTemplate } from "@glitzy/core-content";

export type LlmUsageWindow = {
  /** 호출 총건수 (success + error + rate-limited + cap-exceeded). */
  totalCalls: number;
  /** 실 API 호출 (success + error + rate-limited). cap-exceeded 제외. */
  attemptedCalls: number;
  /** 성공 호출 (status='success'). */
  successCalls: number;
  /** cost USD 누적 (status='success' 만 — 다른 status 는 cost 0). */
  totalCostUsd: number;
};

export type LlmUsageSummary = {
  today: LlmUsageWindow;
  month: LlmUsageWindow;
  /** prompt_template 별 이번 달 success calls (0 row 도 표시 위해 모두 포함). */
  byTemplate: Record<LlmPromptTemplate, number>;
  /** dailyCap (env LLM_DAILY_CAP_PER_INSTANCE · default 100). UI 안 "오늘 N/100" 표시용. */
  dailyCap: number;
  /** KST today (YYYY-MM-DD). UI 안 footer 표시용. */
  todayKst: string;
  /** KST 이번 달 첫 날 (YYYY-MM-01). */
  monthStartKst: string;
};

const TEMPLATES: LlmPromptTemplate[] = [
  "seo-meta-suggest",
  "keyword-match-suggest",
  "review-comment-suggest",
  "article-full-draft",
  "article-brief-draft",
  "treatment-page-full-draft",
  "medical-condition-page-full-draft",
  "faq-full-draft",
];

const ZERO_BY_TEMPLATE: Record<LlmPromptTemplate, number> = {
  "seo-meta-suggest": 0,
  "keyword-match-suggest": 0,
  "review-comment-suggest": 0,
  "article-full-draft": 0,
  "article-brief-draft": 0,
  "treatment-page-full-draft": 0,
  "medical-condition-page-full-draft": 0,
  "faq-full-draft": 0,
};

const ZERO_WINDOW: LlmUsageWindow = {
  totalCalls: 0,
  attemptedCalls: 0,
  successCalls: 0,
  totalCostUsd: 0,
};

function formatKstDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getDailyCap(): number {
  const raw = process.env.LLM_DAILY_CAP_PER_INSTANCE;
  if (!raw) return 100;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 100;
}

type WindowRow = {
  status: string;
  cnt: string;
  cost: string | null;
};

function aggregateWindow(rows: ReadonlyArray<WindowRow>): LlmUsageWindow {
  const out: LlmUsageWindow = { ...ZERO_WINDOW };
  for (const r of rows) {
    const cnt = Number(r.cnt);
    out.totalCalls += cnt;
    if (r.status === "success") {
      out.successCalls += cnt;
      out.attemptedCalls += cnt;
      out.totalCostUsd += Number(r.cost ?? 0);
    } else if (r.status === "error" || r.status === "rate-limited") {
      out.attemptedCalls += cnt;
    }
  }
  return out;
}

export async function loadLlmUsageSummary(
  tx: postgres.TransactionSql,
  instanceId: string,
  options: { now?: Date } = {},
): Promise<LlmUsageSummary> {
  const now = options.now ?? new Date();
  const todayKst = formatKstDate(now);
  const monthStartKst = `${todayKst.slice(0, 7)}-01`;

  const todayRows = await tx<WindowRow[]>`
    SELECT status, COUNT(*)::bigint AS cnt, COALESCE(SUM(cost_usd), 0)::text AS cost
      FROM llm_call_log
     WHERE instance_id = ${instanceId}::uuid
       AND created_at >= ${todayKst}::date AT TIME ZONE 'Asia/Seoul'
       AND created_at <  (${todayKst}::date + INTERVAL '1 day') AT TIME ZONE 'Asia/Seoul'
     GROUP BY status
  `;
  const monthRows = await tx<WindowRow[]>`
    SELECT status, COUNT(*)::bigint AS cnt, COALESCE(SUM(cost_usd), 0)::text AS cost
      FROM llm_call_log
     WHERE instance_id = ${instanceId}::uuid
       AND created_at >= ${monthStartKst}::date AT TIME ZONE 'Asia/Seoul'
       AND created_at <  (date_trunc('month', ${monthStartKst}::date) + INTERVAL '1 month') AT TIME ZONE 'Asia/Seoul'
     GROUP BY status
  `;
  const templateRows = await tx<Array<{ prompt_template: string; cnt: string }>>`
    SELECT prompt_template, COUNT(*)::bigint AS cnt
      FROM llm_call_log
     WHERE instance_id = ${instanceId}::uuid
       AND status = 'success'
       AND created_at >= ${monthStartKst}::date AT TIME ZONE 'Asia/Seoul'
       AND created_at <  (date_trunc('month', ${monthStartKst}::date) + INTERVAL '1 month') AT TIME ZONE 'Asia/Seoul'
     GROUP BY prompt_template
  `;

  const byTemplate: Record<LlmPromptTemplate, number> = { ...ZERO_BY_TEMPLATE };
  for (const r of templateRows) {
    if (TEMPLATES.includes(r.prompt_template as LlmPromptTemplate)) {
      byTemplate[r.prompt_template as LlmPromptTemplate] = Number(r.cnt);
    }
  }

  return {
    today: aggregateWindow(todayRows),
    month: aggregateWindow(monthRows),
    byTemplate,
    dailyCap: getDailyCap(),
    todayKst,
    monthStartKst,
  };
}
