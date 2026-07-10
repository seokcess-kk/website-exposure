// @glitzy/web/(site)/[instanceSlug]/media-appearances — 미디어 list (단아 v1.0)

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeMediaAppearance, type MediaAppearanceRow, type MediaAppearanceProjection } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { SectionHeading, CardLink } from "@/components/site/ui";
import { sitePathPrefix } from "@/lib/custom-domains";
import { siteBaseUrl } from "@/lib/site-url";
import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
import { mediaListGraph } from "@/lib/json-ld/builders";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  // soft-404 방지 — 스트리밍 셸(200) 전 metadata 단계에서 404 확정
  if (!initial) notFound();
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "미디어",
    description: `${initial.clinic.name} 의료진 방송·유튜브·팟캐스트·언론 출연 기록`,
    canonicalPath: "/media-appearances",
  });
}

const CHANNEL_LABEL: Record<MediaAppearanceProjection["channelType"], string> = {
  broadcast: "방송", youtube: "유튜브", podcast: "팟캐스트", press: "언론",
};

export default async function MediaAppearancesListPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const rows = await tx<MediaAppearanceRow[]>`
      SELECT slug, title, channel_name, channel_type::text AS channel_type,
             to_char(published_date, 'YYYY-MM-DD') AS published_date,
             duration_seconds, url, thumbnail_url, summary, author_doctor_id,
             published_at, updated_at
        FROM media_appearance
       WHERE instance_id = ${ctx.instanceId}::uuid AND status = 'published' AND published_at IS NOT NULL AND published_at <= now()
       ORDER BY published_date DESC NULLS LAST`;
    return rows.map(normalizeMediaAppearance);
  });
  if (!data) notFound();
  const base = sitePathPrefix(params.instanceSlug);

  const listGraph = mediaListGraph(
    { siteBaseUrl: siteBaseUrl(params.instanceSlug), pagePath: "/media-appearances" },
    initial.clinic,
    data.map((m) => ({ slug: m.slug, title: m.title })),
    `${initial.clinic.name} 의료진 방송·유튜브·팟캐스트·언론 출연 기록`,
  );

  return (
    <>
      <JsonLdScript graph={listGraph} />
      <Breadcrumb items={[{ label: "홈", href: base || "/" }, { label: "미디어", href: null }]} />
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            level={1}
            eyebrow="MEDIA"
            title="미디어"
            description={`${initial.clinic.name} 의료진의 방송·유튜브·팟캐스트·언론 인터뷰 기록.`}
          />
          <div className="mt-16">
            {data.length === 0 ? (
              <p className="text-center text-sm text-fg-muted">아직 등록된 미디어가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((m) => <MediaCard key={m.slug} media={m} base={base} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function MediaCard({ media, base }: { media: MediaAppearanceProjection; base: string }) {
  return (
    <CardLink href={`${base}/media-appearances/${media.slug}`} padding="none">
      <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-subtle">
        {media.thumbnailUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={media.thumbnailUrl} alt={`${media.title} 미디어 썸네일`} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">🎬</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-canvas/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-primary backdrop-blur">
          {CHANNEL_LABEL[media.channelType]}
        </span>
        {media.durationSeconds && (
          <span className="absolute bottom-3 right-3 rounded-full bg-ink-strong/85 px-2 py-0.5 text-[10px] font-medium text-fg-inverse tabular-nums">
            {formatDuration(media.durationSeconds)}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 p-6">
        <div className="text-eyebrow text-xs">{media.channelName} · {media.publishedDate}</div>
        <h2 className="font-serif-heading text-lg leading-snug text-ink-strong group-hover:text-brand-primary">{media.title}</h2>
        <p className="line-clamp-2 text-xs text-fg-muted">{media.summary}</p>
      </div>
    </CardLink>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
