// @glitzy/web/(admin)/admin/[instanceSlug]/loading — admin segment Suspense fallback
// 사용자 검수 2026-05-20 — 페이지 이동 시 즉시 skeleton 노출 (streaming UI)

export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* 헤더 skeleton */}
      <div className="space-y-3">
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
      </div>

      {/* 카드 grid skeleton */}
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="mt-6 h-9 w-24 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
