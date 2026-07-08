// @glitzy/web/(site)/[instanceSlug]/favicon.ico — 인스턴스별 same-origin 파비콘.
//
// 네이버 파비콘 수집기는 link 태그 외에 host 루트 /favicon.ico 폴백을 보는데, middleware 가
// 파생/커스텀 host 의 /favicon.ico 를 /<slug>/favicon.ico 로 rewrite 해 이 handler 에 도달한다
// (matcher 제외 해제 — middleware.ts 주석 참조). clinic favicon(정사각형 · C0052)을 프록시로
// 서빙해 cross-origin(Supabase) 을 못 따라가는 수집기까지 커버한다. 둘 다 없으면 404
// (head 의 전역 icon.svg 링크가 여전히 유효).

import { loadSiteInitial } from "@/lib/site-initial";

export const revalidate = 3600;

export async function GET(
  _req: Request,
  { params }: { params: { instanceSlug: string } },
) {
  const initial = await loadSiteInitial(params.instanceSlug);
  const iconUrl = initial?.clinic.faviconUrl ?? initial?.clinic.logoUrl;
  if (!iconUrl) return new Response(null, { status: 404 });

  const upstream = await fetch(iconUrl, { next: { revalidate: 3600 } });
  if (!upstream.ok) return new Response(null, { status: 404 });

  const body = await upstream.arrayBuffer();
  return new Response(body, {
    headers: {
      // .ico 경로지만 실제 포맷은 PNG — Content-Type 이 우선되므로 브라우저/수집기 모두 정상 해석.
      "Content-Type": upstream.headers.get("content-type") ?? "image/png",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
