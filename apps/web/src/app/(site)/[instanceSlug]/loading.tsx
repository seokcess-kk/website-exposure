export default function SiteLoading() {
  return (
    <main className="min-h-[60vh] bg-canvas">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12">
        <div className="h-4 w-28 animate-pulse rounded-full bg-brand-primary-soft" />
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="flex flex-col gap-4">
            <div className="h-10 w-4/5 animate-pulse rounded-md bg-subtle" />
            <div className="h-10 w-2/3 animate-pulse rounded-md bg-subtle" />
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-subtle" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-subtle" />
            <div className="mt-4 flex gap-3">
              <div className="h-10 w-28 animate-pulse rounded-full bg-brand-primary-soft" />
              <div className="h-10 w-28 animate-pulse rounded-full bg-subtle" />
            </div>
          </div>
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-subtle" />
        </div>
      </div>
    </main>
  );
}
