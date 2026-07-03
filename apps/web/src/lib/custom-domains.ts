// @glitzy/web/lib/custom-domains — 커스텀 도메인/서브도메인 → instance slug 매핑 SoT
// (PSR-DEFER-02 + SUBDOMAIN_SCALE_PLAN SDS-01)
//
// 의존성 0 (Edge 미들웨어 + Node 서버 양쪽에서 import 가능해야 함 — postgres.js·@glitzy/auth 금지).
// 매핑 소스 2단:
//   1. env CUSTOM_DOMAIN_MAP (JSON · 명시 매핑 · 항상 우선). 예: {"clinic.example.com":"my-clinic"}
//      - 키 = 정규화된 host(lowercase·포트제거·www 제거), 값 = instance slug.
//      - 미설정/파싱실패 시 빈 매핑 → 기존 path-based 동작(무영향).
//   2. env BASE_SITE_DOMAIN (라벨=slug 파생 · SDS-01). host `<label>.<BASE>` 의 단일 라벨을
//      instance slug 로 파생 — 인스턴스 추가 시 env 수정·redeploy 불필요(zero-touch).
//      파생은 production 게이트(아래) + 라벨 유효성 + 예약어/제외/명시맵 선점 검사를 전부 통과해야 한다.
// 단일 SoT 원칙: middleware(rewrite)·site-url(URL 출력)·sitemap·robots·IndexNow·track 이 전부 이 모듈만 본다.
//   → rewrite 와 canonical/sitemap 이 항상 같은 slug 정책을 쓰게 강제 (canonical 중복 SEO 사고 방지).
// 대칭 불변식 (SDS-01): slugForHost(host)=slug ⟺ canonicalHostForSlug(slug)=host 가 되도록
//   파생 판정은 반드시 derivableLabel() 하나를 공유한다 — 비대칭은 hijacked/dead canonical 을 만든다.

/** host 정규화 — lowercase + 포트 제거 + 선행 www 제거. middleware·server 양쪽 동일 규칙 필수. */
export function normalizeHost(rawHost: string | null | undefined): string {
  if (!rawHost) return "";
  return rawHost.toLowerCase().split(":")[0]!.replace(/^www\./, "").trim();
}

function parseDomainMap(): Record<string, string> {
  const raw = process.env.CUSTOM_DOMAIN_MAP;
  if (!raw || raw.trim() === "") return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [host, slug] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof slug === "string" && slug.length > 0) {
        out[normalizeHost(host)] = slug;
      }
    }
    return out;
  } catch {
    return {};
  }
}

// module-load 1회 파싱 (env 변경은 redeploy 필요 — Vercel env 와 동일 수명).
const HOST_TO_SLUG: Record<string, string> = parseDomainMap();

// === BASE_SITE_DOMAIN 라벨=slug 파생 (SDS-01) ===

// 파생 게이트 — fail-closed: Vercel production 런타임에서만 (middleware crossHostRedirectEnabled ·
// indexnow 와 동일 패턴). `vercel env pull` 이 로컬 .env 에 VERCEL_ENV=production 을 내려준 실사례
// (commit 22002ec) 가 있어 NODE_ENV 가드 병행 — 게이트 없이 BASE 가 dev/preview 에 유입되면
// 전 인스턴스 sitePathPrefix 가 "" 로 flip → rewrite 없는 host 에서 모든 내부링크 404.
// trade-off: preview 의 canonical 은 path 기반으로 남음 (preview 는 Vercel 이 noindex 부여 — 수용).
const BASE_DOMAIN: string = (() => {
  if (process.env.NODE_ENV === "development") return "";
  if (process.env.VERCEL_ENV !== "production") return "";
  return normalizeHost(process.env.BASE_SITE_DOMAIN);
})();

// 파생 금지 예약 라벨 — 시스템/인프라 용도 선점. `www` 는 normalizeHost 가 선제 strip 하므로
// 도달 불가(dead entry)라 넣지 않는다.
const RESERVED_LABELS = new Set(["admin", "api", "mail", "smtp", "ns1", "ns2"]);

// 파생 제외 slug (CSV) — 내부/세일즈 인스턴스가 클라이언트 브랜드 도메인 아래 색인 노출되는 것 방지.
// env 미설정 시 기본 {"demo"} (G0-2). 빈 문자열을 명시하면 제외 없음.
const EXCLUDED_SLUGS: Set<string> = (() => {
  const raw = process.env.BASE_DOMAIN_EXCLUDE_SLUGS;
  if (raw === undefined) return new Set(["demo"]);
  return new Set(raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
})();

// 유효 DNS 라벨 (RFC 1123 LDH): 3~63자 + 끝 하이픈 금지.
// instance slug regex(^[a-z0-9][a-z0-9-]{2,63}$ — 3~64자·끝 하이픈 허용)보다 엄격 —
// 불통과 slug 는 파생 host 가 invalid hostname 이 되므로 path-based 로 남긴다.
const DERIVABLE_LABEL_RE = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

/**
 * 파생 판정 공유 함수 — slugForHost/canonicalHostForSlug 대칭 불변식의 단일 지점.
 * 명시맵 선점 검사: `<label>.<BASE>` 가 CUSTOM_DOMAIN_MAP 에서 "다른 slug" 로 이미 점유돼
 * 있으면 파생 금지 — 없으면 미래 slug(예: bupyeong) 인스턴스의 canonical/sitemap/IndexNow 가
 * 타 인스턴스 콘텐츠를 서빙하는 host 를 가리키게 된다 (hijack).
 */
function derivableLabel(label: string, base: string): boolean {
  if (!base) return false;
  if (!DERIVABLE_LABEL_RE.test(label)) return false;
  if (RESERVED_LABELS.has(label)) return false;
  if (EXCLUDED_SLUGS.has(label)) return false;
  const claimed = HOST_TO_SLUG[`${label}.${base}`];
  if (claimed !== undefined && claimed !== label) return false;
  return true;
}

/** 이 host 가 커스텀 도메인(명시 매핑) 또는 파생 서브도메인이면 그 instance slug, 아니면 null. */
export function slugForHost(rawHost: string | null | undefined): string | null {
  const h = normalizeHost(rawHost);
  if (!h) return null;
  const explicit = HOST_TO_SLUG[h];
  if (explicit) return explicit;
  // 파생: `<label>.<BASE>` 단일 라벨 (다중 레벨 a.b.<BASE> · apex 는 대상 아님)
  if (BASE_DOMAIN && h.endsWith(`.${BASE_DOMAIN}`)) {
    const label = h.slice(0, -(BASE_DOMAIN.length + 1));
    if (!label.includes(".") && derivableLabel(label, BASE_DOMAIN)) return label;
  }
  return null;
}

// slug → canonical host 역방향 맵 (module-load 1회). 한 slug 에 여러 host 매핑 시 첫 host 를 canonical 로.
const SLUG_TO_HOST: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  for (const [host, slug] of Object.entries(HOST_TO_SLUG)) {
    if (!(slug in out)) out[slug] = host;
  }
  return out;
})();

/**
 * 이 slug 의 canonical host — 명시 매핑 우선, 없으면 BASE 파생(`<slug>.<BASE>`), 둘 다 없으면 null.
 * canonical/OG/JSON-LD URL 을 request header 없이 계산하기 위한 역방향 lookup
 * (render 중 headers() 호출 회피 → 공개 페이지 static/ISR 유지).
 */
export function canonicalHostForSlug(slug: string): string | null {
  const explicit = SLUG_TO_HOST[slug];
  if (explicit) return explicit;
  if (BASE_DOMAIN && derivableLabel(slug, BASE_DOMAIN)) return `${slug}.${BASE_DOMAIN}`;
  return null;
}

/**
 * (site) 내부 링크의 path prefix.
 * 커스텀 도메인/파생 서브도메인이 있는 slug 는 "" — `/<slug>/...` 링크는 커스텀 도메인에서
 * middleware 301 을 매 클릭/크롤마다 경유시키므로 루트 기준 path 로 렌더해야 한다.
 * 매핑이 없으면 기존 path-based `/<slug>`.
 * 홈 링크는 빈 prefix 가 invalid href 가 되므로 `sitePathPrefix(slug) || "/"` 로 쓸 것.
 * env 기반(render 중 headers() 불필요) — client component 에서는 직접 호출 금지(env 부재
 * 로 hydration mismatch). SiteInitial.basePath 로 서버 계산값을 내려받아 사용한다.
 */
export function sitePathPrefix(slug: string): string {
  return canonicalHostForSlug(slug) ? "" : `/${slug}`;
}

// === 어드민 인스턴스 생성 검증 (SDS-04) ===

export type SlugSubdomainIssue = "dns-label" | "reserved" | "claimed";

/**
 * 이 slug 가 서브도메인 파생을 받을 수 없는 사유 (없으면 null) — 인스턴스 생성/복제/seed 시 사전 차단용.
 * 파생 게이트(production 한정)·BASE env 와 무관하게 정적 규칙으로 판정한다 — BASE 는 Phase 2 에야
 * 설정되므로 env 의존이면 그 이전 시간창에 선점 slug 생성이 조용히 통과된다 (리뷰 지적).
 * BASE_DOMAIN_EXCLUDE_SLUGS 는 의도된 운영 정책이므로 issue 로 취급하지 않는다.
 */
export function slugSubdomainIssue(slug: string): SlugSubdomainIssue | null {
  if (!DERIVABLE_LABEL_RE.test(slug)) return "dns-label";
  if (RESERVED_LABELS.has(slug)) return "reserved";
  // 명시맵 선점 — 맵 키의 첫 라벨이 slug 인데 다른 slug 로 매핑돼 있으면 미래 파생과 충돌 소지.
  // base 도메인 무관 보수 판정 (false-positive 는 생성 차단 용도로 수용).
  for (const [host, mapped] of Object.entries(HOST_TO_SLUG)) {
    if (host.split(".")[0] === slug && mapped !== slug) return "claimed";
  }
  return null;
}

/**
 * 이 host 가 (production 게이트 활성 상태의) BASE 하위 서브도메인인가 — `<x>.<BASE>` suffix.
 * 와일드카드 DNS 로만 도달 가능한 host 가 slug 해석에 실패한 경우(제외 slug·예약어·무효 라벨·
 * 다중 레벨) 라우팅이 404 로 거부하기 위한 판정 — 방치 시 RootLanding·path-based 콘텐츠가
 * 브랜드 도메인 아래 200 서빙된다 (SDS-02 · 리뷰 공통 지적). BASE 미설정/비프로덕션에선 항상 false.
 */
export function isBaseSubdomainHost(rawHost: string | null | undefined): boolean {
  if (!BASE_DOMAIN) return false;
  return normalizeHost(rawHost).endsWith(`.${BASE_DOMAIN}`);
}

/**
 * 이 host 가 어드민 전용 서브도메인(`admin.<BASE>`)인가.
 * `admin` 은 RESERVED 라벨이라 파생(slug)은 안 되지만, 규칙 5(404) 대신 passthrough 시켜
 * 관리자 콘솔(/admin·/sign-in·RootLanding)을 admin.<BASE> 에서 서빙한다 (SDS-DEFER-03).
 * BASE 미설정/비프로덕션에선 false — 그 경우 어드민은 vercel.app 프로덕션 도메인으로 접근.
 */
export function isBaseAdminHost(rawHost: string | null | undefined): boolean {
  if (!BASE_DOMAIN) return false;
  return normalizeHost(rawHost) === `admin.${BASE_DOMAIN}`;
}
