// @glitzy/web/components/site/Hero — P-001 Home hero
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 4.3 PSR-COMP-08

import type { ClinicProjection, PrimaryCta } from "@/lib/db-projection";

export function Hero({ clinic, cta }: { clinic: ClinicProjection; cta: PrimaryCta | null }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-elevated via-elevated to-subtle">
      {/* 한의원 톤 안 미세 장식 — 우측 상단 brand-secondary radial */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-secondary opacity-[0.07] blur-3xl"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20 md:py-32">
        {clinic.slogan ? (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-primary">
            <span className="mr-2 inline-block h-px w-8 align-middle bg-brand-primary" />
            {clinic.slogan}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight text-fg-default md:text-6xl md:leading-[1.1]">
          {clinic.name}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">{clinic.description}</p>
        {cta ? (
          <a
            href={cta.targetUrl}
            className="group mt-2 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-7 py-3.5 text-sm font-semibold text-fg-inverse shadow-md hover:bg-brand-primary-hover hover:shadow-lg"
          >
            {cta.label}
            <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
