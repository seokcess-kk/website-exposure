// @glitzy/web/lib/media-meta — URL → MediaAppearance 메타 자동 추출
//
// 소스 우선순위:
//   1. YouTube URL → oEmbed (no key) — title · author_name(채널) · thumbnail_url
//   2. Fallback → 일반 og:* meta scrape (cheerio · article:published_time 포함)

import { fetchSiteMeta } from "./site-meta-fetch";

export type MediaMeta = {
  title: string | null;
  channelName: string | null;
  channelType: "broadcast" | "youtube" | "podcast" | "press" | null;
  publishedDate: string | null;  // YYYY-MM-DD
  durationSeconds: number | null;
  url: string | null;
  thumbnailUrl: string | null;
  summary: string | null;
  source: "youtube-oembed" | "og-scrape" | "none";
};

const FETCH_TIMEOUT_MS = 10_000;

const YOUTUBE_HOST_REGEX = /(?:^|\.)(youtube\.com|youtu\.be)$/i;

function isYoutubeUrl(url: URL): boolean {
  return YOUTUBE_HOST_REGEX.test(url.hostname);
}

// === YouTube oEmbed ===
async function fetchYoutubeOembed(url: string): Promise<MediaMeta | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { signal: controller.signal },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, unknown>;
    const title = typeof json.title === "string" ? json.title : null;
    const authorName = typeof json.author_name === "string" ? json.author_name : null;
    const thumbnail = typeof json.thumbnail_url === "string" ? json.thumbnail_url : null;
    return {
      title,
      channelName: authorName,
      channelType: "youtube",
      publishedDate: null,  // oEmbed 안 제공 안 함
      durationSeconds: null,
      url,
      thumbnailUrl: thumbnail,
      summary: null,
      source: "youtube-oembed",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// === 일반 사이트 meta scrape (방송·언론 기사) ===
async function fetchGenericMeta(url: string): Promise<MediaMeta | null> {
  try {
    const site = await fetchSiteMeta(url);
    // 한 가지 추가 — site-meta-fetch 가 article:published_time 까지 보장 안 함
    // (date 는 og:* 안 보통 미포함이라 best-effort)
    return {
      title: site.name,
      channelName: site.siteName,
      channelType: "press",  // 기본 press 가정 — 사용자가 수정 가능
      publishedDate: null,
      durationSeconds: null,
      url: site.resolvedUrl,
      thumbnailUrl: site.ogImageUrl,
      summary: site.description ? site.description.slice(0, 300) : null,
      source: "og-scrape",
    };
  } catch {
    return null;
  }
}

/**
 * Public API — URL 입력 후 source 별 우선순위로 fetch.
 */
export async function fetchMediaMeta(input: string): Promise<MediaMeta> {
  const trimmed = input.trim();
  if (!trimmed) return emptyMeta();
  if (!/^https?:\/\//i.test(trimmed)) return emptyMeta();

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return emptyMeta();
  }

  if (isYoutubeUrl(parsed)) {
    const meta = await fetchYoutubeOembed(trimmed);
    if (meta) return meta;
  }

  const meta = await fetchGenericMeta(trimmed);
  return meta ?? emptyMeta();
}

function emptyMeta(): MediaMeta {
  return {
    title: null, channelName: null, channelType: null, publishedDate: null,
    durationSeconds: null, url: null, thumbnailUrl: null, summary: null,
    source: "none",
  };
}
