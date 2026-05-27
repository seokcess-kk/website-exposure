// @glitzy/web/(admin)/[instanceSlug]/keywords — SEO_KEYWORD_STRATEGY_PLAN v0.2 § 2
//
// 키워드 목록 페이지. SQL 안 primary/secondary 모두 fetch + TS 안 primary→children[] 그룹화 (cycle 1 #6).
// orphanSecondaries (parent 누락) 는 별도 섹션.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { KeywordMatchSuggestionPanel } from "@/components/ai/KeywordMatchSuggestionPanel";

type KeywordRow = {
  id: string;
  slug: string;
  label: string;
  keyword_type: "primary" | "secondary";
  parent_id: string | null;
  parent_label: string | null;
  intent: string;
  priority: "P0" | "P1" | "P2";
  difficulty: number | null;
  status: "active" | "paused" | "won" | "dropped";
  linked_content_count: string;
  primary_content_count: string;
  updated_at: Date;
};

type KeywordWithChildren = KeywordRow & { children: KeywordRow[] };

function groupKeywords(rows: KeywordRow[]): {
  primaries: KeywordWithChildren[];
  orphanSecondaries: KeywordRow[];
} {
  const primaries: Map<string, KeywordWithChildren> = new Map();
  const orphans: KeywordRow[] = [];
  for (const r of rows) {
    if (r.keyword_type === "primary") primaries.set(r.id, { ...r, children: [] });
  }
  for (const r of rows) {
    if (r.keyword_type !== "secondary") continue;
    if (r.parent_id && primaries.has(r.parent_id)) {
      primaries.get(r.parent_id)!.children.push(r);
    } else {
      orphans.push(r);
    }
  }
  return { primaries: [...primaries.values()], orphanSecondaries: orphans };
}

export default async function KeywordsPage({
  params,
}: {
  params: { instanceSlug: string };
}) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      return <main className="p-6"><p>{a.message}</p></main>;
    }
    throw err;
  }

  const rows = await withSkeletonTx(
    { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
    async (tx, ctx) => {
      return tx<KeywordRow[]>`
        SELECT
          kt.id, kt.slug, kt.label, kt.keyword_type, kt.parent_id,
          parent.label AS parent_label,
          kt.intent, kt.priority, kt.difficulty, kt.status, kt.updated_at,
          (SELECT count(*) FROM keyword_content_link
            WHERE instance_id = kt.instance_id AND keyword_id = kt.id)::text AS linked_content_count,
          (SELECT count(*) FROM keyword_content_link
            WHERE instance_id = kt.instance_id AND keyword_id = kt.id AND is_primary = true)::text AS primary_content_count
        FROM keyword_target kt
        LEFT JOIN keyword_target parent
          ON parent.id = kt.parent_id AND parent.instance_id = kt.instance_id
        WHERE kt.instance_id = ${ctx.instanceId}::uuid
        ORDER BY
          kt.keyword_type ASC,
          kt.priority ASC,
          kt.created_at ASC
      `;
    },
  );

  const { primaries, orphanSecondaries } = groupKeywords(rows);
  const primaryCount = primaries.length;
  const secondaryCount = rows.filter((r) => r.keyword_type === "secondary").length;
  const wonCount = rows.filter((r) => r.status === "won").length;

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-fg-default">타깃 키워드</h1>
          <p className="text-sm text-fg-muted">
            총 {rows.length}개 (primary {primaryCount} · secondary {secondaryCount})
            {wonCount > 0 && <> · 확보 {wonCount}건</>}
          </p>
        </div>
        <Link
          href={`/admin/${params.instanceSlug}/keywords/new`}
          className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-fg-inverse hover:bg-brand-primary-hover"
        >
          + 신규 키워드 추가
        </Link>
      </header>

      {primaries.length === 0 && orphanSecondaries.length === 0 ? (
        <section className="rounded-md border border-dashed border-border bg-bg-default/30 p-8 text-center">
          <p className="text-sm text-fg-muted">
            아직 등록된 키워드가 없습니다. 신규 추가로 첫 대표 키워드를 등록하세요.
          </p>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          {primaries.map((primary) => (
            <PrimaryKeywordCard
              key={primary.id}
              keyword={primary}
              instanceSlug={params.instanceSlug}
            />
          ))}
        </section>
      )}

      {orphanSecondaries.length > 0 && (
        <section className="rounded-md border border-warning/40 bg-warning/5 p-4">
          <h2 className="mb-2 text-sm font-semibold text-warning">미분류 보조 키워드</h2>
          <p className="mb-3 text-xs text-fg-muted">
            부모 (primary) 키워드가 비활성이거나 누락된 보조 키워드입니다. 부모를 다시 지정하거나 삭제하세요.
          </p>
          <ul className="flex flex-col gap-1">
            {orphanSecondaries.map((k) => (
              <li key={k.id}>
                <Link
                  href={`/admin/${params.instanceSlug}/keywords/${k.id}`}
                  className="block rounded px-3 py-2 text-sm hover:bg-warning/10"
                >
                  {k.label}
                  <span className="ml-2 text-xs text-fg-muted">· {k.intent} · {k.priority} · {k.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="rounded-md border border-dashed border-border bg-bg-default/30 p-4 text-xs text-fg-muted">
        Phase 5 합류 시 — Google Search Console / 네이버 서치어드바이저 안 검색량·순위·CTR 자동 ingestion 후
        키워드 별 실제 노출 지표가 카드 안 함께 표시됩니다.
      </footer>
    </main>
  );
}

function PrimaryKeywordCard({
  keyword,
  instanceSlug,
}: {
  keyword: KeywordWithChildren;
  instanceSlug: string;
}) {
  const linked = Number(keyword.linked_content_count);
  const primary = Number(keyword.primary_content_count);
  const noPrimary = primary === 0;
  return (
    <article className="rounded-md border border-border bg-elevated p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base font-semibold text-fg-default">{keyword.label}</h3>
            <span className="text-xs text-fg-muted">/ {keyword.slug}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
            <span className="font-medium text-fg-default">primary</span>
            <span>· {keyword.intent}</span>
            <span>· {keyword.priority}</span>
            <span>· {keyword.status}</span>
            {keyword.difficulty !== null && <span>· difficulty {keyword.difficulty}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-right text-xs ${noPrimary ? "text-error" : "text-fg-muted"}`}>
            <div>{linked} 연결 · {primary} primary</div>
            {noPrimary && <div className="font-medium">primary 콘텐츠 미연결</div>}
          </div>
          {noPrimary && (
            <KeywordMatchSuggestionPanel
              instanceSlug={instanceSlug}
              keywordId={keyword.id}
            />
          )}
          <Link
            href={`/admin/${instanceSlug}/keywords/${keyword.id}`}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-bg-hover"
          >
            편집 →
          </Link>
        </div>
      </header>

      {keyword.children.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
          {keyword.children.map((c) => {
            const cLinked = Number(c.linked_content_count);
            const cPrimary = Number(c.primary_content_count);
            return (
              <li key={c.id}>
                <Link
                  href={`/admin/${instanceSlug}/keywords/${c.id}`}
                  className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm hover:bg-bg-hover"
                >
                  <span className="flex items-baseline gap-2">
                    <span className="text-fg-muted">⤷</span>
                    <span className="text-fg-default">{c.label}</span>
                    <span className="text-xs text-fg-muted">{c.intent} · {c.priority} · {c.status}</span>
                  </span>
                  <span className="text-xs text-fg-muted">{cLinked} / {cPrimary}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
