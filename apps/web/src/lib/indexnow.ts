// @glitzy/web/lib/indexnow — 네이버 IndexNow 색인 알림 (발행 훅)
//
// 네이버는 2023-07 부터 IndexNow 프로토콜 공식 지원 (blog.naver.com/naver_webmaster/223165612654).
// NSA OpenAPI 폐기와 무관한 오픈 프로토콜 — 발행 즉시 색인 신호를 보낼 유일한 프로그래매틱 채널.
// 서치어드바이저의 수동 '웹 페이지 수집' 요청(일 ~50개)을 보완한다.
//
// 키 규약: 사이트 루트에 <key>.txt (내용 = key) 서빙 — apps/web/public/<key>.txt 로 커밋,
// middleware 가 hex .txt 파일을 rewrite 에서 제외해 커스텀 도메인 루트에서도 서빙된다.
// env NAVER_INDEXNOW_KEY 와 파일명이 일치해야 한다. 키는 프로토콜상 공개 값(루트에서 서빙됨).
//
// best-effort: 실패해도 발행 액션은 성공 처리 (알림 유실 시 자연 수집/sitemap/RSS 가 커버).

import { canonicalHostForSlug } from "./custom-domains";

const INDEXNOW_ENDPOINT = "https://searchadvisor.naver.com/indexnow";
const TIMEOUT_MS = 3000;

/** 인스턴스의 canonical origin — 커스텀 도메인 우선, 없으면 PUBLIC_SITE_ORIGIN/<slug>. 둘 다 없으면 null (dev). */
function canonicalBaseForNotify(instanceSlug: string): string | null {
  const customHost = canonicalHostForSlug(instanceSlug);
  if (customHost) return `https://${customHost}`;
  const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  if (trustedOrigin && trustedOrigin.length > 0) {
    return `${trustedOrigin.replace(/\/$/, "")}/${instanceSlug}`;
  }
  return null;
}

/**
 * 발행/갱신된 공개 페이지의 색인을 네이버에 알린다.
 * @param sitePath — 사이트 루트 기준 path (예: `/insights/diet/some-article`, `/treatments/goodbye-diet`)
 */
export async function notifyIndexNow(instanceSlug: string, sitePath: string): Promise<void> {
  // fail-closed: Vercel production 에서만 발사 (middleware cross-host 301 과 동일 정책).
  // dev/preview 에 CUSTOM_DOMAIN_MAP·키가 내려와 있어도 라이브 URL 을 네이버에 제출하지 않는다.
  if (process.env.VERCEL_ENV !== "production") return;
  const key = process.env.NAVER_INDEXNOW_KEY;
  if (!key) return; // env 미설정 — 기능 비활성 (미온보딩 인스턴스)
  const base = canonicalBaseForNotify(instanceSlug);
  if (!base) return; // canonical origin 계산 불가 (dev) — 알림 무의미
  const url = `${base}${sitePath}`;
  try {
    const res = await fetch(
      `${INDEXNOW_ENDPOINT}?url=${encodeURIComponent(url)}&key=${encodeURIComponent(key)}`,
      { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" },
    );
    // IndexNow 스펙: 200 OK / 202 Accepted 정상. 4xx 는 키/URL 문제 — 로그만.
    if (!res.ok && res.status !== 202) {
      console.warn(`[indexnow] non-ok ${res.status} for ${url}`);
    }
  } catch (err) {
    console.warn(`[indexnow] notify failed for ${url}`, err);
  }
}
