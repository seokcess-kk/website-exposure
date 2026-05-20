// @glitzy/web/components/site/DoctorCard — Supanova Double-Bezel

import Link from "next/link";
import type { DoctorProjection } from "@/lib/db-projection";

export function DoctorCard({ doctor, baseHref }: { doctor: DoctorProjection; baseHref: string }) {
  return (
    <Link
      href={`${baseHref}/doctors/${doctor.slug}`}
      className="group relative block rounded-[2rem] bg-ink-strong/[0.04] p-1.5 ring-1 ring-border/40 shadow-supanova transition-all duration-500 ease-supanova hover:-translate-y-1 hover:shadow-supanova-lg"
    >
      <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-elevated shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
        <div className="relative overflow-hidden">
          {doctor.photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={doctor.photoUrl}
              alt={`${doctor.name}${doctor.title ? ` ${doctor.title}` : ""} 프로필 사진`}
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-supanova group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-brand-primary-soft via-subtle to-elevated" aria-hidden="true">
              <span className="text-6xl text-brand-primary/30">👤</span>
            </div>
          )}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-elevated/95 to-transparent" />
        </div>
        <div className="flex flex-col gap-1 px-6 pb-6 pt-5">
          {doctor.title ? (
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-primary">{doctor.title}</span>
          ) : null}
          <div className="text-xl font-bold tracking-tight text-ink-strong transition-colors duration-500 ease-supanova group-hover:text-brand-primary">
            {doctor.name}
          </div>
          {doctor.jobTitle ? <div className="text-sm text-fg-muted">{doctor.jobTitle}</div> : null}
        </div>
      </div>
    </Link>
  );
}
