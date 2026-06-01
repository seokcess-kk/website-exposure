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
import type { GapSummary, GapBucket, QueryGapRow } from "@/lib/admin/search-visibility-gap";
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
  sourceFilter: "all" | "google" | "naver";
  gap: GapSummary | null;
};

const SOURCE_TABS: ReadonlyArray<{ key: "all" | "google" | "naver"; label: string }> = [
  { key: "all", label: "전체" },
  { key: "google", label: "🅶 Google" },
  { key: "naver", label: "🅽 네이버" },
];

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

function formatVerificationMethod(method: string): string {
  switch (method) {
    case "gsc-service-account": return "GSC SA";
    case "naver-meta-tag": return "meta tag";
    case "naver-html-file": return "HTML 파일";
    case "naver-dns-record": return "DNS TXT";
    default: return method;
  }
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
    sourceFilter,
    gap,
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
          Google Search Console + 네이버 서치어드바이저 데이터 — 페이지/키워드별 노출·클릭·CTR·평균 순위.
        </p>
      </header>

      {/* === Source filter tab (NSA v1.x · 전체/Google/네이버 합산 path) === */}
      <nav className="flex items-center gap-1 border-b border-border">
        {SOURCE_TABS.map((tab) => {
          const active = sourceFilter === tab.key;
          const href = tab.key === "all"
            ? `/admin/${instanceSlug}/visibility-metrics`
            : `/admin/${instanceSlug}/visibility-metrics?source=${tab.key}`;
          return (
            <Link
              key={tab.key}
              href={href}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-fg-muted hover:border-border hover:text-fg-default"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

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
          <div className="flex items-baseline gap-3">
            {properties.some((p) => p.source === "naver-searchadvisor") && (
              <Link
                href={`/admin/${instanceSlug}/visibility-metrics/upload`}
                className="rounded-md border border-border bg-elevated px-3 py-1.5 text-xs font-medium hover:bg-bg-hover"
              >
                📋 네이버 데이터 paste 업로드
              </Link>
            )}
            {isSuperAdmin && (
              <span className="text-xs text-fg-muted">Property CRUD 는 super-admin 전용</span>
            )}
          </div>
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
                <th className="py-2 pr-2">검증 방식</th>
                <th className="py-2 pr-2">검증</th>
                <th className="py-2 pr-2">마지막 sync</th>
                <th className="py-2">액션</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => {
                const state = stateByProperty.get(p.id);
                const isNaver = p.source === "naver-searchadvisor";
                return (
                  <tr key={p.id} className="border-b border-border/50 align-top">
                    <td className="py-2 pr-2 text-xs">{isNaver ? "🅽 네이버" : "🅶 Google"}</td>
                    <td className="py-2 pr-2 break-all text-xs">{p.propertyUrl}</td>
                    <td className="py-2 pr-2 text-xs text-fg-muted">{formatVerificationMethod(p.verificationMethod)}</td>
                    <td className={`py-2 pr-2 text-xs ${statusToneClass(p.verificationStatus)}`}>
                      {p.verificationStatus}
                    </td>
                    <td className="py-2 pr-2 text-xs">
                      {state ? (
                        <>
                          <span className={statusToneClass(state.lastStatus)}>{state.lastStatus}</span>
                          {" · "}
                          {fmtDateTime(state.lastSyncAt)}
                          {isNaver && state.lastSyncedDate && (
                            <div className="text-xs text-fg-muted">기준일 {state.lastSyncedDate}</div>
                          )}
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
                        {isNaver ? (
                          <Link
                            href={`/admin/${instanceSlug}/visibility-metrics/upload`}
                            className="rounded border border-border bg-elevated px-2 py-1 text-xs hover:bg-bg-hover"
                          >
                            📋 paste 업로드
                          </Link>
                        ) : (
                          <>
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

      {summary && (
        <section className="rounded-md border border-border bg-elevated/30 p-4">
          <h2 className="mb-2 text-base font-semibold text-fg-default">
            지난 7일 요약{" "}
            <span className="text-xs text-fg-muted">
              ({summary.range.startDate} ~ {summary.range.endDate}
              {sourceFilter !== "all" && ` · ${sourceFilter === "google" ? "Google" : "네이버"} 만`})
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

      {summary ? (
        <>
          <DetailTable title="페이지별 상위 50" rows={summary.topPages} keyHeader="page_url" />
          <DetailTable title="키워드별 상위 50" rows={summary.topQueries} keyHeader="query" />
        </>
      ) : (
        <section className="rounded-md border border-dashed border-border bg-bg-default/30 p-4 text-sm text-fg-muted">
          {sourceFilter === "all"
            ? "아직 snapshot 데이터가 없습니다. property 등록 + sync (GSC) 또는 paste 업로드 (네이버) 진행 후 표시됩니다."
            : `${sourceFilter === "google" ? "Google" : "네이버"} source 의 snapshot 데이터가 없습니다.`}
        </section>
      )}

      {/* NSI-DEFER-07 — GSC ↔ NSA gap 분석. source filter 무관 (always all source) 안 비교. */}
      {gap && <GapSection gap={gap} />}

      <footer className="rounded-md border border-dashed border-border bg-bg-default/30 p-4 text-xs text-fg-muted">
        v1.x 범위: GSC property 등록 + 수동 sync + 네이버 paste 업로드 + 7일 요약 (source 별 합산) + 페이지/키워드별 표 + 키워드 gap 분석.
        네이버 키워드 데이터는 paste 가 유일 경로입니다 (NSA OpenAPI 는 키워드 분석을 제공하지 않아 NSI-DEFER-01 폐기).
      </footer>
    </main>
  );
}

const BUCKET_LABEL: Record<GapBucket, string> = {
  "google-only": "Google 만",
  "naver-only": "네이버 만",
  both: "양쪽",
};

const BUCKET_TONE: Record<GapBucket, string> = {
  "google-only": "border-sky-300 bg-sky-50 text-sky-900",
  "naver-only": "border-emerald-300 bg-emerald-50 text-emerald-900",
  both: "border-violet-300 bg-violet-50 text-violet-900",
};

const BUCKET_HINT: Record<GapBucket, string> = {
  "google-only": "네이버 검색 안 미노출 — 네이버 플레이스/사이트 인증/블로그 link 보강 검토",
  "naver-only": "Google 검색 안 미노출 — JSON-LD/sitemap/콘텐츠 보강 검토",
  both: "양쪽 모두 노출 — 현 수준 유지하며 click·CTR 모니터링",
};

// NAVER_SEARCH_INGEST_PLAN v1.x correctness 패치: page-level gap 제거.
// NSA 는 page_url 미제공(사이트 단위 집계)이라 page gap 은 모든 페이지를 거짓 'google-only' 로
// 분류 → 운영자에게 잘못된 작업 지시. query-level gap 만 진짜 비교 차원으로 유지.
// (Google 페이지별 노출은 위 "페이지별 상위 50" 표에 이미 존재.)
function GapSection({ gap }: { gap: GapSummary }) {
  const queryTotal = gap.queryCounts["google-only"] + gap.queryCounts["naver-only"] + gap.queryCounts.both;

  return (
    <section className="flex flex-col gap-3 rounded-md border border-border bg-elevated p-4">
      <header className="flex items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-fg-default">검색엔진 gap (GSC ↔ 네이버) · 키워드 {queryTotal}</h2>
        <span className="text-xs text-fg-muted">{gap.range.startDate} ~ {gap.range.endDate}</span>
      </header>

      {/* bucket summary — 3 카드 (키워드 기준) */}
      <div className="grid grid-cols-3 gap-2">
        {(["google-only", "naver-only", "both"] as GapBucket[]).map((bucket) => (
          <article key={bucket} className={`rounded-md border px-3 py-2 ${BUCKET_TONE[bucket]}`}>
            <div className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{BUCKET_LABEL[bucket]}</div>
            <div className="mt-0.5 text-xl font-semibold">{gap.queryCounts[bucket]}</div>
            <div className="mt-0.5 text-[10px] opacity-70">키워드</div>
          </article>
        ))}
      </div>

      <GapTable rows={gap.topQueries} keyHeader="키워드" />

      <p className="text-[11px] text-fg-muted">
        {BUCKET_HINT["google-only"]} · {BUCKET_HINT["naver-only"]} · {BUCKET_HINT.both}
      </p>
      <p className="text-[11px] text-fg-muted">
        키워드 기준 비교 — 네이버는 페이지별 데이터를 제공하지 않아 페이지 gap 은 산출하지 않습니다.
        띄어쓰기·대소문자 차이는 정규화해 같은 키워드로 묶습니다.
      </p>
    </section>
  );
}

function GapTable({
  rows,
  keyHeader,
}: {
  rows: ReadonlyArray<QueryGapRow>;
  keyHeader: string;
}) {
  if (rows.length === 0) {
    return <p className="text-xs text-fg-muted">표시할 데이터가 없습니다.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="min-w-full divide-y divide-border text-xs">
        <thead className="bg-bg-default text-fg-muted">
          <tr>
            <th className="px-3 py-1.5 text-left font-medium">{keyHeader}</th>
            <th className="px-3 py-1.5 text-left font-medium">분류</th>
            <th className="px-3 py-1.5 text-right font-medium">Google 노출</th>
            <th className="px-3 py-1.5 text-right font-medium">Google 클릭</th>
            <th className="px-3 py-1.5 text-right font-medium">네이버 노출</th>
            <th className="px-3 py-1.5 text-right font-medium">네이버 클릭</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-elevated">
          {rows.map((r) => {
            const k = r.query;
            return (
              <tr key={k}>
                <td className="max-w-[28rem] truncate px-3 py-1.5 text-fg-default" title={k}>{k || "—"}</td>
                <td className="px-3 py-1.5">
                  <span className={`inline-block rounded border px-2 py-0.5 text-[10px] font-medium ${BUCKET_TONE[r.bucket]}`}>
                    {BUCKET_LABEL[r.bucket]}
                  </span>
                </td>
                <td className="px-3 py-1.5 text-right font-mono text-fg-default">{fmtNum(r.googleImpressions)}</td>
                <td className="px-3 py-1.5 text-right font-mono text-fg-default">{fmtNum(r.googleClicks)}</td>
                <td className="px-3 py-1.5 text-right font-mono text-fg-default">{fmtNum(r.naverImpressions)}</td>
                <td className="px-3 py-1.5 text-right font-mono text-fg-default">{fmtNum(r.naverClicks)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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

type NaverVerificationMethod = "naver-meta-tag" | "naver-html-file" | "naver-dns-record";

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
  const [source, setSource] = useState<"google-search-console" | "naver-searchadvisor">("google-search-console");
  const [naverMethod, setNaverMethod] = useState<NaverVerificationMethod>("naver-meta-tag");

  const verificationMethod = source === "google-search-console" ? "gsc-service-account" : naverMethod;

  return (
    <div className="mt-4 rounded-md border border-border bg-bg-default/30 p-3">
      <h3 className="mb-2 text-sm font-medium text-fg-default">Property 추가 (super-admin)</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr_180px_auto] sm:items-end">
        <label>
          <span className="block text-xs text-fg-muted">Source</span>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as typeof source)}
            className="mt-1 w-full rounded border border-border bg-white px-2 py-1.5 text-sm"
          >
            <option value="google-search-console">Google Search Console</option>
            <option value="naver-searchadvisor">네이버 서치어드바이저</option>
          </select>
        </label>
        <label>
          <span className="block text-xs text-fg-muted">Property URL</span>
          <input
            type="text"
            placeholder={source === "naver-searchadvisor" ? "https://example.com/" : "https://example.com/  또는  sc-domain:example.com"}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 w-full rounded border border-border bg-white px-2 py-1.5 text-sm"
          />
        </label>
        <label>
          <span className="block text-xs text-fg-muted">검증 방식</span>
          {source === "google-search-console" ? (
            <input
              type="text"
              value="GSC Service Account"
              disabled
              className="mt-1 w-full rounded border border-border bg-bg-default px-2 py-1.5 text-sm text-fg-muted"
            />
          ) : (
            <select
              value={naverMethod}
              onChange={(e) => setNaverMethod(e.target.value as NaverVerificationMethod)}
              className="mt-1 w-full rounded border border-border bg-white px-2 py-1.5 text-sm"
            >
              <option value="naver-meta-tag">meta tag</option>
              <option value="naver-html-file">HTML 파일</option>
              <option value="naver-dns-record">DNS TXT</option>
            </select>
          )}
        </label>
        <button
          type="button"
          onClick={() => {
            const fd = new FormData();
            fd.set("source", source);
            fd.set("propertyUrl", url);
            fd.set("verificationMethod", verificationMethod);
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
        {source === "naver-searchadvisor"
          ? "네이버 property 는 외부 콘솔(searchadvisor.naver.com)에서 소유 확인 완료 후 등록 — 어드민은 verify 호출 안 함."
          : "URL prefix property 는 `/` 로 끝나야 하며 Domain property 는 `sc-domain:` prefix."}
      </p>
    </div>
  );
}
