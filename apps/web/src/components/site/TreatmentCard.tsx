import Link from "next/link";
import type { TreatmentProjection } from "@/lib/db-projection";

export function TreatmentCard({ treatment, baseHref }: { treatment: TreatmentProjection; baseHref: string }) {
  return (
    <Link
      href={`${baseHref}/treatments/${treatment.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-elevated shadow-sm hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-card-hover"
    >
      {treatment.heroImageUrl ? (
        <div className="overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={treatment.heroImageUrl}
            alt=""
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-subtle to-elevated" aria-hidden="true">
          <span className="text-4xl text-fg-disabled">🌿</span>
        </div>
      )}
      <div className="flex flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold text-fg-default group-hover:text-brand-primary">{treatment.name}</h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-fg-muted">{treatment.summary}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-primary opacity-0 transition-opacity group-hover:opacity-100">
          자세히 보기 <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
