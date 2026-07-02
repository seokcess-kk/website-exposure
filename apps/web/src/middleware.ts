// @glitzy/web/middleware — 커스텀 도메인 루트 → instance 매핑 (PSR-DEFER-02)
//
// host 가 등록된 커스텀 도메인(CUSTOM_DOMAIN_MAP)일 때만 동작:
//   (1) 루트 기준 path 를 내부 /<slug>/... 라우트로 rewrite (URL 은 도메인 루트 유지).
//   (2) 같은 host 로 /<slug>/* 직접 접근 시 slug 를 벗긴 루트 경로로 301 (canonical dedupe).
// 비-커스텀 host(Vercel 프로덕션 도메인)는:
//   (3) /<slug>/* 의 slug 가 커스텀 도메인 매핑을 가지면 canonical host 로 cross-host 301
//       — 중복 색인 차단 + (루트 기준으로 렌더되는) 내부 링크가 비-커스텀 host 에서 깨지는 것 방지.
//       dev(localhost)·Vercel preview 는 제외 (preview 는 Vercel 이 X-Robots-Tag noindex 자동 부여).
// admin/sign-* 은 어느 host 에서도 passthrough (공개 사이트 전용 매핑).

import { NextResponse, type NextRequest } from "next/server";
import { slugForHost, canonicalHostForSlug, normalizeHost } from "@/lib/custom-domains";

// rewrite/redirect 제외 — 정적·내부·운영 경로.
const PASSTHROUGH_PREFIXES = ["/admin", "/sign-in", "/sign-out", "/api", "/_next"];

// (3) cross-host 301 활성 조건 — fail-closed: Vercel production 런타임에서만.
//     로컬 dev/next start·preview 에 CUSTOM_DOMAIN_MAP 이 있어도 라이브 클라이언트 도메인으로
//     튕기지 않게 명시적 production 판정일 때만 켠다. (system env 미노출 프로젝트에서는 기능이
//     조용히 꺼지는 trade-off — 배포 후 vercel.app/<slug> 301 여부를 curl 로 1회 확인할 것.)
function crossHostRedirectEnabled(): boolean {
  return process.env.VERCEL_ENV === "production";
}

export function middleware(req: NextRequest) {
  const host = normalizeHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  const slug = slugForHost(host);
  if (!slug) {
    // (3) 비-커스텀 host: /<slug>/* 의 slug 가 canonical 커스텀 도메인을 가지면 그쪽으로 301.
    //     GET/HEAD 한정 — 전환기 stale 탭의 server action POST 를 redirect 로 유실시키지 않는다.
    const { pathname, search } = req.nextUrl;
    if (!crossHostRedirectEnabled()) return NextResponse.next();
    if (req.method !== "GET" && req.method !== "HEAD") return NextResponse.next();
    if (PASSTHROUGH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      return NextResponse.next();
    }
    const firstSegment = pathname.split("/")[1] ?? "";
    const canonicalHost = firstSegment ? canonicalHostForSlug(firstSegment) : null;
    if (canonicalHost && canonicalHost !== host) {
      const stripped = pathname.slice(`/${firstSegment}`.length) || "/";
      return NextResponse.redirect(`https://${canonicalHost}${stripped}${search}`, 301);
    }
    return NextResponse.next(); // 매핑 없는 slug → 기존 path-based 동작
  }

  const { pathname, search } = req.nextUrl;

  // 운영/정적 경로는 커스텀 도메인에서도 건드리지 않음
  if (PASSTHROUGH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // IndexNow 키 파일 (public/<hex>.txt) — 호스트 루트에서 그대로 서빙 (rewrite 시 404 되므로 제외)
  if (/^\/[0-9a-fA-F]{8,128}\.txt$/.test(pathname)) {
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
