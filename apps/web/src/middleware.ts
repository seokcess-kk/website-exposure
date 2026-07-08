// @glitzy/web/middleware — 커스텀 도메인/파생 서브도메인 → instance 매핑
// (PSR-DEFER-02 + SUBDOMAIN_SCALE_PLAN SDS-02)
//
// 라우팅 판정은 lib/site-routing.ts decideSiteRoute() 순수 함수가 SoT (전이표 vitest 고정) —
// 여기서는 결정을 NextResponse 로 실체화만 한다. 규칙 상세·수용 trade-off 는 site-routing.ts 주석.
// admin/sign-* /api 는 어느 host 에서도 passthrough (공개 사이트 전용 매핑).

import { NextResponse, type NextRequest } from "next/server";
import { decideSiteRoute } from "@/lib/site-routing";

// cross-host 301 (규칙 3·4) 활성 조건 — fail-closed: Vercel production 런타임에서만.
//     로컬 dev/next start·preview 에 CUSTOM_DOMAIN_MAP 이 있어도 라이브 클라이언트 도메인으로
//     튕기지 않게 명시적 production 판정일 때만 켠다. (system env 미노출 프로젝트에서는 기능이
//     조용히 꺼지는 trade-off — 배포 후 vercel.app/<slug> 301 여부를 curl 로 1회 확인할 것.
//     2026-07-02 prod 실측: vercel.app/<slug> → 301 정상.)
//     NODE_ENV 가드 — `vercel env pull` 로 로컬 .env 에 VERCEL_ENV=production 이 내려오는 실사례
//     확인됨 → next dev 에서도 켜지는 것 방지.
function crossHostRedirectEnabled(): boolean {
  if (process.env.NODE_ENV === "development") return false;
  return process.env.VERCEL_ENV === "production";
}

export function middleware(req: NextRequest) {
  const decision = decideSiteRoute({
    rawHost: req.headers.get("x-forwarded-host") ?? req.headers.get("host"),
    pathname: req.nextUrl.pathname,
    search: req.nextUrl.search,
    method: req.method,
    crossHostEnabled: crossHostRedirectEnabled(),
  });

  switch (decision.kind) {
    case "next":
      return NextResponse.next();
    case "not-found":
      return new NextResponse(null, { status: 404 });
    case "redirect-host":
      return NextResponse.redirect(decision.url, 301);
    case "redirect-path": {
      const url = req.nextUrl.clone();
      url.pathname = decision.pathname;
      return NextResponse.redirect(url, 301);
    }
    case "rewrite": {
      const url = req.nextUrl.clone();
      url.pathname = decision.pathname;
      return NextResponse.rewrite(url);
    }
  }
}

// 정적 자산(이미지·css·js·폰트)·내부 제외. 단 sitemap.xml·robots.txt 는 rewrite 대상이라 포함.
// favicon.ico(.ico 확장자) 도 포함 — 파생/커스텀 host 의 /favicon.ico 를 /<slug>/favicon.ico 로
// rewrite 해 인스턴스별 route handler 가 서빙한다 (네이버 수집기 host-루트 폴백 대응).
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|css|js|mjs|map|woff|woff2|ttf|otf|eot)$).*)",
  ],
};
