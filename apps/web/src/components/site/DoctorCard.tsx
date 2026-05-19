import Link from "next/link";
import type { DoctorProjection } from "@/lib/db-projection";

export function DoctorCard({ doctor, baseHref }: { doctor: DoctorProjection; baseHref: string }) {
  return (
    <Link
      href={`${baseHref}/doctors/${doctor.slug}`}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-elevated p-5 shadow-sm hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-card-hover"
    >
      <div className="relative overflow-hidden rounded-lg">
        {doctor.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doctor.photoUrl}
            alt=""
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-subtle to-elevated" aria-hidden="true">
            <span className="text-5xl text-fg-disabled">👤</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-lg font-semibold text-fg-default">{doctor.name}</div>
        {doctor.title ? <div className="text-sm text-fg-muted">{doctor.title}</div> : null}
      </div>
    </Link>
  );
}
