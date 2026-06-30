// @glitzy/web/lib/custom-domains — 커스텀 도메인 루트 → instance slug 매핑 SoT (PSR-DEFER-02)
//
// 의존성 0 (Edge 미들웨어 + Node 서버 양쪽에서 import 가능해야 함 — postgres.js·@glitzy/auth 금지).
// 매핑 소스 = env CUSTOM_DOMAIN_MAP (JSON). 예: {"bupyeong.key-mom.kr":"demo"}
//   - 키 = 정규화된 host(lowercase·포트제거·www 제거), 값 = instance slug.
//   - 미설정/파싱실패 시 빈 매핑 → 모든 host 가 기존 path-based 동작(무영향).
// 단일 SoT 원칙: middleware(rewrite)·site-url(URL 출력)·sitemap·robots 가 전부 이 모듈만 본다.
//   → rewrite 와 canonical/sitemap 이 항상 같은 slug 정책을 쓰게 강제 (canonical 중복 SEO 사고 방지).

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

/** 이 host 가 커스텀 도메인 매핑을 가지면 그 instance slug, 아니면 null. */
export function slugForHost(rawHost: string | null | undefined): string | null {
  const h = normalizeHost(rawHost);
  if (!h) return null;
  return HOST_TO_SLUG[h] ?? null;
}

/** 이 host 가 루트 매핑된 커스텀 도메인인가. */
export function isCustomDomainHost(rawHost: string | null | undefined): boolean {
  return slugForHost(rawHost) !== null;
}
