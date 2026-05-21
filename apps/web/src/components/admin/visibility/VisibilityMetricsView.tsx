// @glitzy/web/components/admin/visibility/VisibilityMetricsView
// SEARCH_VISIBILITY_INGEST_PLAN v0.3 § 7 — client view: property 표 + 액션 + 요약 + 페이지/키워드별 + sparkline.

"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type {
  SearchPropertyRow,
  SearchSyncStateRow,
  SparklinePoint,
  VisibilityRow,
  VisibilitySnapshotSummary,
} from "@/lib/admin/search-visibility";
import {
  addSearchProperty,
  verifySearchProperty,
  deleteSearchProperty,
  syncSearchVisibility,
} from "@/app/(admin)/admin/[instanceSlug]/visibility-metrics/sync-actions";

type Props = {
  instanceSlug: string;
  gscConfigured: boolean;
  isSuperAdmin: boolean;
  properties: SearchPropertyRow[];
  syncStates: SearchSyncStateRow[];
  summary: VisibilitySnapshotSummary | null;
  summaryPropertyId: string | null;
};

function fmtNum(n: number): string {
  return n.toLocaleString("ko-KR", { maximumFractionDigits: 0 });
}

function fmtCtr(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}

function fmtPos(n: number): string {
  return n.toFixed(1);
}

function fmtDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ko-KR", { hour12: false });
}

function statusToneClass(status: string): string {
  switch (status) {
    case "verified": return "text-emerald-700";
    case "failed": return "text-rose-700";
    case "pending": return "text-amber-700";
    case "success": return "text-emerald-700";
    case "partial": return "text-amber-700";
    case "running": return "text-blue-700";
    case "never-synced": return "text-fg-muted";
    default: return "text-fg-muted";
  }
}

// inline svg sparkline — SVI-DEFER-08 까지 외부 라이브러리 회피
function Sparkline({ data, height = 24, width = 80 }: { data: SparklinePoint[]; height?: number; width?: number }) {
  if (data.length === 0) return <span className="text-xs text-fg-muted">—</span>;
  const max = Math.max(...data.map((p) => p.impressions), 1);
  const stepX = width / Math.max(data.length - 1, 1);
  const points = data
    .map((p, i) => `${i * stepX},${height - (p.impressions / max) * height}`)
    .join(" ");
  return (
    <svg width={width} height={height} className="inline-block align-middle">
      <polyline fill="none" stroke="currentColor" strokeWidth={1.5} points={points} />
    </svg>
  );
}

export function VisibilityMetricsView(props: Props) {
  const {
    instanceSlug,
    gscConfigured,
    isSuperAdmin,
    properties,
    syncStates,
    summary,
    summaryPropertyId,
  } = props;

  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const stateByProperty = new Map(syncStates.map((s) => [s.propertyId, s]));

  function runAction(fn: () => Promise<{ ok: boolean; message?: string; formError?: string }>) {
    setActionMessage(null);
    setActionError(null);
    startTransition(async () => {
      const result = await fn();
      if (result.ok) {
        setActionMessage(result.message ?? "완료");
        router.refresh();
      } else {
        setActionError(result.formError ?? "실패");
      }
    });
  }

  return (
    <main className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-fg-default">검색 노출 분석</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Google Search Console 데이터 ingestion — 페이지/키워드별 노출·클릭·CTR·평균 순위.{" "}
          <span className="text-xs">v1 안 GSC 만 지원 (네이버·Bing 은 별 cycle)</span>
        </p>
      </header>

      {!gscConfigured && (
        <section className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>GSC 환경 변수가 설정되어 있지 않습니다.</strong> sync 액션이 차단됩니다.
          <br />
          <Link href="/docs/runbooks/SEARCH_CONSOLE_SETUP.md" className="underline">
            발급 절차 (runbook)
          </Link>{" "}
          를 따라 service account 발급 + env 등록 후 재배포하세요.
        </section>
      )}

      {actionMessage && (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
          {actionMessage}
        </div>
      )}
      {actionError && (
        <div className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900">
          {actionError}
        </div>
      )}

      <section>
        <header className="mb-3 flex items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold text-fg-default">등록된 Search Property</h2>
          {isSuperAdmin && (
            <span className="text-xs text-fg-muted">Property CRUD 는 super-admin 전용</span>
          )}
        </header>

        {properties.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-bg-default/30 p-6 text-sm text-fg-muted">
            아직 property 가 없습니다.
            {isSuperAdmin ? " 아래 form 으로 추가하세요." : " super-admin 에게 등록 요청하세요."}
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="border-b border-border text-left text-xs text-fg-muted">
              <tr>
                <th className="py-2 pr-2">Source</th>
                <th className="py-2 pr-2">URL</th>
                <th className="py-2 pr-2">검증</th>
                <th className="py-2 pr-2">마지막 sync</th>
                <th className="py-2">액션</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => {
                const state = stateByProperty.get(p.id);
                return (
                  <tr key={p.id} className="border-b border-border/50 align-top">
                    <td className="py-2 pr-2 text-xs">{p.source}</td>
                    <td className="py-2 pr-2 break-all text-xs">{p.propertyUrl}</td>
                    <td className={`py-2 pr-2 text-xs ${statusToneClass(p.verificationStatus)}`}>
                      {p.verificationStatus}
                    </td>
                    <td className="py-2 pr-2 text-xs">
                      {state ? (
                        <>
                          <span className={statusToneClass(state.lastStatus)}>{state.lastStatus}</span>
                          {" · "}
                          {fmtDateTime(state.lastSyncAt)}
                          {state.lastError && (
                            <div className="text-rose-700">{state.lastError.slice(0, 100)}</div>
                          )}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-1">
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => runAction(() => verifySearchProperty(instanceSlug, p.id))}
                            disabled={pending || !gscConfigured}
                            className="rounded border border-border bg-elevated px-2 py-1 text-xs hover:bg-bg-hover disabled:opacity-50"
                          >
                            검증
                          </button>
                        )}
                        {p.verificationStatus === "verified" && (
                          <>
                            <SyncButton
                              instanceSlug={instanceSlug}
                              propertyId={p.id}
                              mode="recent"
                              label="최근 7일"
                              pending={pending}
                              disabled={!gscConfigured}
                              onRun={runAction}
                            />
                            <SyncButton
                              instanceSlug={instanceSlug}
                              propertyId={p.id}
                              mode="initial"
                              label="초기 90일"
                              pending={pending}
                              disabled={!gscConfigured}
                              onRun={runAction}
                            />
                          </>
                        )}
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              if (!confirm("삭제하시겠습니까? snapshot · sync state 모두 cascade 삭제됩니다.")) return;
                              runAction(() => deleteSearchProperty(instanceSlug, p.id));
                            }}
                            disabled={pending}
                            className="rounded border border-border bg-elevated px-2 py-1 text-xs text-rose-700 hover:bg-bg-hover disabled:opacity-50"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {isSuperAdmin && (
          <AddPropertyForm instanceSlug={instanceSlug} pending={pending} onRun={runAction} />
        )}
      </section>

      {summary && summaryPropertyId && (
        <section className="rounded-md border border-border bg-elevated/30 p-4">
          <h2 className="mb-2 text-base font-semibold text-fg-default">
            지난 7일 요약{" "}
            <span className="text-xs text-fg-muted">
              ({summary.range.startDate} ~ {summary.range.endDate})
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <Stat label="노출" value={fmtNum(summary.total.impressions)} />
            <Stat label="클릭" value={fmtNum(summary.total.clicks)} />
            <Stat label="CTR" value={fmtCtr(summary.total.ctr)} />
            <Stat label="평균 순위 (impressions-가중)" value={fmtPos(summary.total.avgPosition)} />
          </div>
          <div className="mt-3">
            <span className="text-xs text-fg-muted">일별 노출</span>
            <div className="text-blue-700">
              <Sparkline data={summary.daily} width={300} height={36} />
            </div>
          </div>
        </section>
      )}

      {summary && (
        <>
          <DetailTable title="페이지별 상위 50" rows={summary.topPages} keyHeader="page_url" />
          <DetailTable title="키워드별 상위 50" rows={summary.topQueries} keyHeader="query" />
        </>
      )}

      <footer className="rounded-md border border-dashed border-border bg-bg-default/30 p-4 text-xs text-fg-muted">
        v1 범위: 페이지 안 GSC property 등록 + 수동 sync + 7일 요약 + 페이지/키워드별 표.
        다음 cycle (v1.1·v1.2) — 대시보드 카드 합류 · keyword 편집 페이지 metric · entity 편집 mini card · 캘린더 (Phase 6) 합류.
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-fg-muted">{label}</div>
      <div className="text-xl font-semibold text-fg-default">{value}</div>
    </div>
  );
}

function DetailTable({
  title,
  rows,
  keyHeader,
}: {
  title: string;
  rows: VisibilityRow[];
  keyHeader: string;
}) {
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold text-fg-default">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-fg-muted">데이터 없음</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="border-b border-border text-left text-xs text-fg-muted">
              <tr>
                <th className="py-2 pr-2">{keyHeader}</th>
                <th className="py-2 pr-2 text-right">노출</th>
                <th className="py-2 pr-2 text-right">클릭</th>
                <th className="py-2 pr-2 text-right">CTR</th>
                <th className="py-2 text-right">평균 순위</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-border/50 align-top">
                  <td className="py-2 pr-2 break-all text-xs">{r.key}</td>
                  <td className="py-2 pr-2 text-right tabular-nums">{fmtNum(r.impressions)}</td>
                  <td className="py-2 pr-2 text-right tabular-nums">{fmtNum(r.clicks)}</td>
                  <td className="py-2 pr-2 text-right tabular-nums">{fmtCtr(r.ctr)}</td>
                  <td className="py-2 text-right tabular-nums">{fmtPos(r.avgPosition)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function SyncButton({
  instanceSlug,
  propertyId,
  mode,
  label,
  pending,
  disabled,
  onRun,
}: {
  instanceSlug: string;
  propertyId: string;
  mode: "recent" | "initial";
  label: string;
  pending: boolean;
  disabled: boolean;
  onRun: (fn: () => Promise<{ ok: boolean; message?: string; formError?: string }>) => void;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onRun(() => {
          const fd = new FormData();
          fd.set("propertyId", propertyId);
          fd.set("mode", mode);
          return syncSearchVisibility(instanceSlug, null, fd);
        })
      }
      disabled={pending || disabled}
      className="rounded border border-border bg-elevated px-2 py-1 text-xs hover:bg-bg-hover disabled:opacity-50"
    >
      {mode === "initial" ? "🗓️ " : "↻ "}
      {label} sync
    </button>
  );
}

function AddPropertyForm({
  instanceSlug,
  pending,
  onRun,
}: {
  instanceSlug: string;
  pending: boolean;
  onRun: (fn: () => Promise<{ ok: boolean; message?: string; formError?: string }>) => void;
}) {
  const [url, setUrl] = useState("");
  return (
    <div className="mt-4 rounded-md border border-border bg-bg-default/30 p-3">
      <h3 className="mb-2 text-sm font-medium text-fg-default">Property 추가 (super-admin)</h3>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="block text-xs text-fg-muted">Property URL</span>
          <input
            type="text"
            placeholder="https://example.com/  또는  sc-domain:example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 w-full rounded border border-border bg-white px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            const fd = new FormData();
            fd.set("source", "google-search-console");
            fd.set("propertyUrl", url);
            onRun(() => addSearchProperty(instanceSlug, null, fd));
            setUrl("");
          }}
          disabled={pending || !url.trim()}
          className="rounded-md border border-border bg-elevated px-3 py-1.5 text-sm font-medium hover:bg-bg-hover disabled:opacity-50"
        >
          추가
        </button>
      </div>
      <p className="mt-1 text-xs text-fg-muted">
        URL prefix property 는 `/` 로 끝나야 하며 Domain property 는 `sc-domain:` prefix.
      </p>
    </div>
  );
}
