// @glitzy/web/components/site/TreatmentCard — Supanova Double-Bezel

import Link from "next/link";
import type { TreatmentProjection } from "@/lib/db-projection";

export function TreatmentCard({ treatment, baseHref }: { treatment: TreatmentProjection; baseHref: string }) {
  return (
    <Link
      href={`${baseHref}/treatments/${treatment.slug}`}
      className="group relative block rounded-[2rem] bg-ink-strong/[0.04] p-1.5 ring-1 ring-border/40 shadow-supanova transition-all duration-500 ease-supanova hover:-translate-y-1 hover:shadow-supanova-lg"
    >
      <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-elevated shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
        {treatment.heroImageUrl ? (
          <div className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={treatment.heroImageUrl}
              alt={`${treatment.name} 시술/진료 안내`}
              className="aspect-video w-full object-cover transition-transform duration-700 ease-supanova group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-brand-primary-soft via-subtle to-elevated" aria-hidden="true">
            <iconify-icon icon="solar:leaf-bold-duotone" width="48" className="text-brand-primary/40" />
          </div>
        )}
        <div className="flex flex-col gap-3 p-6 md:p-7">
          <h3 className="text-xl font-bold tracking-tight text-ink-strong transition-colors duration-500 ease-supanova group-hover:text-brand-primary">
            {treatment.name}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-fg-muted">{treatment.summary}</p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-brand-primary">
            자세히 보기
          </span>
        </div>
      </div>
    </Link>
  );
}
