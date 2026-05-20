// @glitzy/web/(site)/[instanceSlug]/loading — site segment Suspense fallback
// 사용자 검수 2026-05-20 — 페이지 이동 시 hero/카드 skeleton 노출

export default function SiteLoading() {
  return (
    <div>
      {/* Hero skeleton — 메인페이지 패턴 정합 */}
      <section className="bg-subtle/50 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-5">
              <div className="h-4 w-24 animate-pulse rounded bg-fg-muted/20" />
              <div className="h-12 w-3/4 animate-pulse rounded bg-fg-muted/30" />
              <div className="h-12 w-1/2 animate-pulse rounded bg-fg-muted/30" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full animate-pulse rounded bg-fg-muted/20" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-fg-muted/20" />
              </div>
            </div>
            <div className="aspect-[4/3] w-full animate-pulse rounded-3xl bg-fg-muted/20" />
          </div>
        </div>
      </section>

      {/* 본문 카드 grid skeleton */}
      <section className="bg-canvas py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-[2rem] bg-elevated p-1.5 ring-1 ring-border/40">
                <div className="aspect-video w-full animate-pulse rounded-2xl bg-fg-muted/15" />
                <div className="space-y-3 p-6">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-fg-muted/25" />
                  <div className="h-4 w-full animate-pulse rounded bg-fg-muted/15" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-fg-muted/15" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
