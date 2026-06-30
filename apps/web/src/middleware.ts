// @glitzy/web/middleware — 커스텀 도메인 루트 → instance 매핑 (PSR-DEFER-02)
//
// host 가 등록된 커스텀 도메인(CUSTOM_DOMAIN_MAP)일 때만 동작:
//   (1) 루트 기준 path 를 내부 /<slug>/... 라우트로 rewrite (URL 은 도메인 루트 유지).
//   (2) 같은 host 로 /<slug>/* 직접 접근 시 slug 를 벗긴 루트 경로로 301 (canonical dedupe).
// 비-커스텀 host(Vercel 도메인·localhost)는 무동작 → 기존 path-based 동작 그대로.
// admin/sign-* 은 커스텀 도메인에서 passthrough (공개 사이트 전용 매핑).

import { NextResponse, type NextRequest } from "next/server";
import { slugForHost, normalizeHost } from "@/lib/custom-domains";

// rewrite/redirect 제외 — 정적·내부·운영 경로.
const PASSTHROUGH_PREFIXES = ["/admin", "/sign-in", "/sign-out", "/api", "/_next"];

export function middleware(req: NextRequest) {
  const host = normalizeHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  const slug = slugForHost(host);
  if (!slug) return NextResponse.next(); // 비-커스텀 도메인 → 기존 동작

  const { pathname, search } = req.nextUrl;

  // 운영/정적 경로는 커스텀 도메인에서도 건드리지 않음
  if (PASSTHROUGH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // (2) /<slug> · /<slug>/* 직접 접근 → slug 제거 루트로 301 (중복 URL 정리)
  const slugPrefix = `/${slug}`;
  if (pathname === slugPrefix || pathname.startsWith(slugPrefix + "/")) {
    const stripped = pathname.slice(slugPrefix.length) || "/";
    const url = req.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.redirect(url, 301);
  }

  // (1) 루트 기준 path → 내부 /<slug>/... 로 rewrite (URL 은 그대로)
  const rewritePath = pathname === "/" ? slugPrefix : `${slugPrefix}${pathname}`;
  const url = req.nextUrl.clone();
  url.pathname = rewritePath;
  url.search = search;
  return NextResponse.rewrite(url);
}

// 정적 자산(이미지·css·js·폰트)·내부·favicon 제외. 단 sitemap.xml·robots.txt 는 rewrite 대상이라 포함.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|js|mjs|map|woff|woff2|ttf|otf|eot)$).*)",
  ],
};
