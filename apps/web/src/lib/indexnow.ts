// @glitzy/web/lib/indexnow — IndexNow 색인 알림 (발행 훅 · 네이버 + 공용 팬아웃)
//
// IndexNow 는 엔진 무관 오픈 프로토콜 — 한 번 제출하면 참여 엔진(빙·얀덱스·Seznam·네이버 등)이 공유한다.
// 네이버는 2023-07 부터 공식 지원 (blog.naver.com/naver_webmaster/223165612654). NSA OpenAPI 폐기와
// 무관하게 발행 즉시 색인 신호를 보낼 유일한 프로그래매틱 채널. 서치어드바이저 수동 수집요청(일 ~50)을 보완.
//
// 엔드포인트: 네이버 직접 + 공용 api.indexnow.org(빙·얀덱스·Seznam 팬아웃). 같은 URL 을 여러 엔드포인트에
// 제출해도 무방(각 엔진이 dedup). 키는 프로토콜상 도메인 소유확인용 — 모든 엔진에 동일 키를 쓴다.
//
// 키 규약: 사이트 루트에 <key>.txt (내용 = key) 서빙 — apps/web/public/<key>.txt 로 커밋,
// middleware 가 hex .txt 파일을 rewrite 에서 제외해 커스텀 도메인 루트에서도 서빙된다.
// env NAVER_INDEXNOW_KEY 와 파일명이 일치해야 한다. 키는 프로토콜상 공개 값(루트에서 서빙됨).
//
// best-effort: 실패해도 발행 액션은 성공 처리 (알림 유실 시 자연 수집/sitemap/RSS 가 커버).

import { canonicalHostForSlug } from "./custom-domains";

// 제출 대상 IndexNow 엔드포인트. 네이버 직접 + 공용(빙 등 참여 엔진 팬아웃). 동일 URL 중복 제출은 무해(엔진 dedup).
const INDEXNOW_ENDPOINTS = [
  "https://searchadvisor.naver.com/indexnow",
  "https://api.indexnow.org/indexnow",
] as const;
const TIMEOUT_MS = 3000;
const BATCH_TIMEOUT_MS = 10_000;

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

/** 단일 엔드포인트 제출 (best-effort · 개별 timeout · 실패는 로그만). */
async function submitToEndpoint(endpoint: string, url: string, key: string): Promise<void> {
  try {
    const res = await fetch(
      `${endpoint}?url=${encodeURIComponent(url)}&key=${encodeURIComponent(key)}`,
      { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" },
    );
    // IndexNow 스펙: 200 OK / 202 Accepted 정상. 4xx 는 키/URL 문제 — 로그만.
    if (!res.ok && res.status !== 202) {
      console.warn(`[indexnow] non-ok ${res.status} from ${endpoint} for ${url}`);
    }
  } catch (err) {
    console.warn(`[indexnow] notify failed via ${endpoint} for ${url}`, err);
  }
}

/** IndexNow 배치 POST payload (스펙: host/key/keyLocation/urlList). 순수 함수 — vitest 대상. */
export function buildIndexNowPayload(
  base: string,
  key: string,
  sitePaths: string[],
): { host: string; key: string; keyLocation: string; urlList: string[] } {
  const origin = new URL(base);
  return {
    host: origin.hostname,
    key,
    // 키 파일은 항상 host 루트에서 서빙 (public/<key>.txt · middleware hex .txt rewrite 제외) —
    // path-prefix fallback(origin/<slug>) 이어도 keyLocation 은 origin 루트가 맞다.
    keyLocation: `${origin.origin}/${key}.txt`,
    urlList: sitePaths.map((p) => `${base}${p}`),
  };
}

async function submitBatchToEndpoint(
  endpoint: string,
  payload: ReturnType<typeof buildIndexNowPayload>,
): Promise<void> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(BATCH_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok && res.status !== 202) {
      console.warn(`[indexnow] batch non-ok ${res.status} from ${endpoint} (${payload.urlList.length} urls)`);
    }
  } catch (err) {
    console.warn(`[indexnow] batch notify failed via ${endpoint}`, err);
  }
}

export type IndexNowBatchResult = { submitted: number; host?: string; skipped?: string };

/**
 * 여러 공개 페이지를 IndexNow 배치 POST 로 한 번에 알린다 (cron 재제출·일괄 발행용).
 * 단건 notifyIndexNow 와 동일한 production/env 가드 — 결과를 요약으로 반환해 cron 응답에서 관측 가능.
 */
export async function notifyIndexNowBatch(
  instanceSlug: string,
  sitePaths: string[],
): Promise<IndexNowBatchResult> {
  if (sitePaths.length === 0) return { submitted: 0, skipped: "대상 URL 없음" };
  if (process.env.NODE_ENV === "development") return { submitted: 0, skipped: "development" };
  if (process.env.VERCEL_ENV !== "production") return { submitted: 0, skipped: "non-production" };
  const key = process.env.NAVER_INDEXNOW_KEY;
  if (!key) return { submitted: 0, skipped: "NAVER_INDEXNOW_KEY 미설정" };
  const base = canonicalBaseForNotify(instanceSlug);
  if (!base) return { submitted: 0, skipped: "canonical origin 계산 불가" };
  const payload = buildIndexNowPayload(base, key, sitePaths);
  await Promise.allSettled(INDEXNOW_ENDPOINTS.map((endpoint) => submitBatchToEndpoint(endpoint, payload)));
  return { submitted: payload.urlList.length, host: payload.host };
}

/**
 * 발행/갱신/삭제된 공개 페이지의 색인을 IndexNow 참여 엔진(네이버 + 빙 등)에 알린다.
 * @param sitePath — 사이트 루트 기준 path (예: `/insights/diet/some-article`, `/doctors/hong`)
 */
export async function notifyIndexNow(instanceSlug: string, sitePath: string): Promise<void> {
  // fail-closed: Vercel production 에서만 발사 (middleware cross-host 301 과 동일 정책).
  // dev/preview 에 CUSTOM_DOMAIN_MAP·키가 내려와 있어도 라이브 URL 을 제출하지 않는다.
  // NODE_ENV 가드 — `vercel env pull` 로 로컬 .env 에 VERCEL_ENV=production 이 내려오는 실사례 확인됨.
  if (process.env.NODE_ENV === "development") return;
  if (process.env.VERCEL_ENV !== "production") return;
  const key = process.env.NAVER_INDEXNOW_KEY;
  if (!key) return; // env 미설정 — 기능 비활성 (미온보딩 인스턴스)
  const base = canonicalBaseForNotify(instanceSlug);
  if (!base) return; // canonical origin 계산 불가 (dev) — 알림 무의미
  const url = `${base}${sitePath}`;
  // 여러 엔드포인트 병렬 제출 — 하나 실패해도 나머지는 진행 (allSettled).
  await Promise.allSettled(INDEXNOW_ENDPOINTS.map((endpoint) => submitToEndpoint(endpoint, url, key)));
}
