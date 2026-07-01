// @glitzy/web/components/admin/ui/AdminListSkeleton — 어드민 목록/편집 라우트 이동용 Suspense fallback
// 하위 세그먼트별 loading.tsx 가 이 skeleton 을 노출 → 클릭 즉시 피드백(체감 지연↓).
// 대시보드 세그먼트는 자체 카드형 loading.tsx 사용 — 여기는 목록형 shape.

export function AdminListSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* 헤더 skeleton */}
      <div className="space-y-3">
        <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
      </div>

      {/* 목록 row skeleton */}
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="h-8 w-20 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
