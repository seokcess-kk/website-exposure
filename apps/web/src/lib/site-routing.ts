// @glitzy/web/lib/site-routing — middleware 라우팅 판정 순수 함수
// (PSR-DEFER-02 + SUBDOMAIN_SCALE_PLAN SDS-02 — 호스트 전이표의 SoT)
//
// middleware.ts 는 이 함수의 결정을 NextResponse 로 실체화만 한다.
// 순수 함수로 분리한 이유: 전이표(명시맵 canonical/alias · 파생 host · vercel.app · apex ×
// 규칙 1~4)를 vitest 로 고정하기 위함. 의존성 0 (custom-domains 만) — Edge 안전.
//
// 규칙:
//   (1) 매핑/파생 host 의 루트 기준 path → 내부 /<slug>/... rewrite (URL 은 도메인 루트 유지)
//   (2) 같은 host 로 /<slug>/* 직접 접근 → slug 를 벗긴 루트 경로로 301 (canonical dedupe)
//   (3) 비-커스텀 host(vercel.app 등)의 /<slug>/* — slug 가 canonical host 를 가지면 cross-host 301
//       ⚠️ SDS-02 수용 trade-off: BASE 파생 도입으로 라벨 규칙을 통과하는 임의 첫 segment 도
//       <segment>.<BASE> 로 301 된다 (인스턴스 미존재 시 그 host 에서 404 — Edge 는 DB 를 볼 수
//       없어 존재 검증 불가). production + GET/HEAD 한정이라 수용.
//   (4) host-canonical dedupe — slug 는 해석됐지만 이 host 가 canonical 이 아니면 canonical 로 301
//       (명시맵 alias host · slug 가 명시 canonical 을 가진 파생 host). 기존에는 alias host 가
//       중복 콘텐츠를 서빙했다 — 의도된 SEO 개선.
//   (3)(4) 는 crossHostEnabled(production 판정) + GET/HEAD 한정 — 전환기 stale 탭의
//   server action POST 를 redirect 로 유실시키지 않는다.
//   (5) BASE 하위인데 slug 해석 실패한 host (demo.<BASE>·mail.<BASE> 등) → 404 —
//       와일드카드 DNS 로만 도달 가능한 비인스턴스 host 가 RootLanding/path-based 콘텐츠를
//       200 서빙하는 노출 차단 (BASE 게이트 활성 시에만 발동).
//   (6) 어드민 진입점 단일화 (SDS-DEFER-03 후속) — admin.<BASE> 가 구성된 production 에서는
//       다른 모든 host(인스턴스 서브도메인·apex·vercel.app)의 /admin·/sign-in·/sign-out 을
//       admin host 로 301. 클라이언트 도메인 아래 어드민 로그인 화면 노출 제거 + 세션 쿠키
//       host 단일화. GET/HEAD 한정 — 전환기 stale 탭의 server action POST(로그인 submit ·
//       admin 저장)를 redirect 로 유실시키지 않는다 (규칙 3·4와 동일 trade-off).

import { slugForHost, canonicalHostForSlug, normalizeHost, isBaseSubdomainHost, isBaseAdminHost, baseAdminHostName } from "./custom-domains";

// rewrite/redirect 제외 — 정적·내부·운영 경로.
const PASSTHROUGH_PREFIXES = ["/admin", "/sign-in", "/sign-out", "/api", "/_next"];

// 규칙 (6) 대상 — 어드민 콘솔 표면. /api(공개 사이트 /api/track)·/_next 는 host 불문 제자리 유지.
const ADMIN_SURFACE_PREFIXES = ["/admin", "/sign-in", "/sign-out"];

export type SiteRouteDecision =
  | { kind: "next" }
  | { kind: "not-found" } // BASE 하위인데 slug 해석 실패 — 와일드카드로만 도달 가능한 비인스턴스 host 거부
  | { kind: "rewrite"; pathname: string }
  | { kind: "redirect-host"; url: string } // cross-host 301 (절대 URL · search 포함)
  | { kind: "redirect-path"; pathname: string }; // 같은 host 301 (search 는 호출측이 보존)

function isPassthrough(pathname: string): boolean {
  return PASSTHROUGH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isAdminSurface(pathname: string): boolean {
  return ADMIN_SURFACE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function decideSiteRoute(input: {
  rawHost: string | null;
  pathname: string;
  search: string;
  method: string;
  /** production 판정 (middleware crossHostRedirectEnabled) — cross-host 301 (3)(4) 활성 조건 */
  crossHostEnabled: boolean;
}): SiteRouteDecision {
  const { pathname, search } = input;
  const host = normalizeHost(input.rawHost);
  const slug = slugForHost(host);
  const isReadMethod = input.method === "GET" || input.method === "HEAD";

  // (6) 어드민 진입점 단일화 — admin host 가 아닌 모든 host 의 어드민 표면을 admin.<BASE> 로 301.
  //     slug 분기보다 먼저 — 인스턴스 host·apex·vercel.app 에 동일 적용. baseAdminHostName() 은
  //     BASE 게이트(production 한정)와 동일하므로 dev/preview 는 기존 passthrough 유지.
  const adminHost = baseAdminHostName();
  if (
    adminHost !== null &&
    host !== adminHost &&
    input.crossHostEnabled &&
    isReadMethod &&
    isAdminSurface(pathname)
  ) {
    return { kind: "redirect-host", url: `https://${adminHost}${pathname}${search}` };
  }

  if (!slug) {
    // 어드민 전용 host (admin.<BASE>) → passthrough — 관리자 콘솔(/admin·/sign-in·RootLanding)
    // 을 admin.<BASE> 에서 서빙 (SDS-DEFER-03). 규칙 5(404) 보다 먼저.
    if (isBaseAdminHost(host)) return { kind: "next" };

    // BASE 하위인데 slug 해석 실패 (제외 slug demo·예약어·무효 라벨·다중 레벨) → 404 거부.
    // 와일드카드 DNS 라이브 후 이 host 들이 passthrough 로 떨어지면 RootLanding(관리자 랜딩)·
    // path-based 콘텐츠가 브랜드 도메인 아래 200 서빙된다 (리뷰 3-lens 공통 지적).
    if (isBaseSubdomainHost(host)) return { kind: "not-found" };

    // (3) 비-커스텀 host: /<slug>/* 의 slug 가 canonical host 를 가지면 그쪽으로 301.
    if (!input.crossHostEnabled) return { kind: "next" };
    if (!isReadMethod) return { kind: "next" };
    if (isPassthrough(pathname)) return { kind: "next" };
    const firstSegment = pathname.split("/")[1] ?? "";
    const canonicalHost = firstSegment ? canonicalHostForSlug(firstSegment) : null;
    if (canonicalHost && canonicalHost !== host) {
      const stripped = pathname.slice(`/${firstSegment}`.length) || "/";
      return { kind: "redirect-host", url: `https://${canonicalHost}${stripped}${search}` };
    }
    return { kind: "next" }; // 매핑/파생 없는 경로 → 기존 path-based 동작
  }

  // 운영/정적 경로는 커스텀 도메인에서도 건드리지 않음
  if (isPassthrough(pathname)) return { kind: "next" };

  // IndexNow 키 파일 (public/<hex>.txt) — 호스트 루트에서 그대로 서빙 (rewrite 시 404 되므로 제외)
  if (/^\/[0-9a-fA-F]{8,128}\.txt$/.test(pathname)) return { kind: "next" };

  const slugPrefix = `/${slug}`;
  const hasSlugPrefix = pathname === slugPrefix || pathname.startsWith(slugPrefix + "/");
  const strippedPath = hasSlugPrefix ? pathname.slice(slugPrefix.length) || "/" : pathname;

  // (4) host-canonical dedupe — alias/비-canonical 파생 host 는 canonical host 로 301.
  //     비활성(비-production/POST)이면 fall-through: 기존처럼 이 host 에서 그대로 서빙.
  const canonical = canonicalHostForSlug(slug);
  if (canonical && canonical !== host && input.crossHostEnabled && isReadMethod) {
    return { kind: "redirect-host", url: `https://${canonical}${strippedPath}${search}` };
  }

  // (2) /<slug> · /<slug>/* 직접 접근 → slug 제거 루트로 301 (중복 URL 정리)
  if (hasSlugPrefix) return { kind: "redirect-path", pathname: strippedPath };

  // (1) 루트 기준 path → 내부 /<slug>/... 로 rewrite (URL 은 그대로)
  return { kind: "rewrite", pathname: pathname === "/" ? slugPrefix : `${slugPrefix}${pathname}` };
}
