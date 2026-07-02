// @glitzy/web/(site)/[instanceSlug]/media-appearances/[slug] — 미디어 detail

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { normalizeMediaAppearance, type MediaAppearanceRow } from "@/lib/db-projection";
import { loadSiteInitial } from "@/lib/site-initial";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { sitePathPrefix } from "@/lib/custom-domains";

export const revalidate = 300;

const loadMediaDetail = cache(async (instanceSlug: string, slug: string) => {
  return withPublicTenantTransaction(instanceSlug, async (tx, ctx) => {
    const rows = await tx<MediaAppearanceRow[]>`
      SELECT slug, title, channel_name, channel_type::text AS channel_type,
             to_char(published_date, 'YYYY-MM-DD') AS published_date,
             duration_seconds, url, thumbnail_url, summary, author_doctor_id,
             published_at, updated_at
        FROM media_appearance
       WHERE instance_id = ${ctx.instanceId}::uuid
         AND status = 'published' AND published_at IS NOT NULL AND published_at <= now() AND slug = ${slug}
       LIMIT 1
    `;
    return rows.length === 0 ? null : normalizeMediaAppearance(rows[0]!);
  });
});

export async function generateMetadata({ params }: { params: { instanceSlug: string; slug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  const media = await loadMediaDetail(params.instanceSlug, params.slug);
  if (!media) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: media.title,
    description: media.summary,
    canonicalPath: `/media-appearances/${media.slug}`,
    imageUrl: media.thumbnailUrl ?? undefined,
  });
}

// YouTube 영상 ID 추출 — watch / shorts / embed / v / youtu.be 모든 형식 지원
function extractYouTubeVideoId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1]! : null;
}

export default async function MediaDetailPage({ params }: { params: { instanceSlug: string; slug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const media = await loadMediaDetail(params.instanceSlug, params.slug);
  if (!media) notFound();
  const base = sitePathPrefix(params.instanceSlug);
  const youtubeId = media.channelType === "youtube" ? extractYouTubeVideoId(media.url) : null;

  return (
    <>
      <Breadcrumb items={[
        { label: "홈", href: base || "/" },
        { label: "미디어", href: `${base}/media-appearances` },
        { label: media.title, href: null },
      ]} />
      <article className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-6 flex flex-col gap-2">
          <div className="text-sm text-fg-muted">{media.channelName} · {media.publishedDate}</div>
          <h1 className="text-3xl font-bold text-fg-default">{media.title}</h1>
        </header>

        {youtubeId ? (
          <div className="mb-6 aspect-video w-full overflow-hidden rounded-md">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={media.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : media.thumbnailUrl ? (
          <a href={media.url} target="_blank" rel="noopener noreferrer" className="mb-6 block">
            <img src={media.thumbnailUrl} alt={`${media.title} 미디어 썸네일`} loading="lazy" decoding="async" className="w-full rounded-md object-cover" />
          </a>
        ) : null}

        <section className="prose prose-sm mb-6 max-w-none text-fg-default">
          <p>{media.summary}</p>
        </section>

        <a
          href={media.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md bg-brand-primary px-5 py-2 text-sm font-semibold text-fg-inverse hover:bg-brand-primary-hover"
        >
          {media.channelType === "youtube" ? "YouTube에서 보기 ↗" : "원본 보기 ↗"}
        </a>

        <div className="mt-8">
          <Link href={`${base}/media-appearances`} className="text-sm text-brand-primary hover:underline">
            ← 미디어 목록으로
          </Link>
        </div>
      </article>
    </>
  );
}
