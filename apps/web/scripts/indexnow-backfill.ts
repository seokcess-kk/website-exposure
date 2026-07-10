// @glitzy/web/scripts/indexnow-backfill — 라이브 sitemap 전체 URL IndexNow 일괄 재제출 (ops)
//
// 용도: 도메인 전환·대량 시드 직후 신규 host URL 을 참여 엔진(네이버 직접 + api.indexnow.org
// 팬아웃)에 재알림. 발행 훅은 발행 시점 host 로만 나가므로 host 가 바뀌면 이 스크립트로 백필한다.
//
// 사용: pnpm --filter @glitzy/web exec tsx scripts/indexnow-backfill.ts --host=daeatdiet-incheon.onwell.site [--dry-run]
//
// 키: env NAVER_INDEXNOW_KEY 우선, 없으면 public/<hex64>.txt 파일명에서 파생 (키는 프로토콜상
// 공개 값 — 사이트 루트에서 서빙됨). lib/indexnow.ts 와 동일 규약.

import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const INDEXNOW_ENDPOINTS = [
  "https://searchadvisor.naver.com/indexnow",
  "https://api.indexnow.org/indexnow",
] as const;

function parseArgs(): { host: string; dryRun: boolean } {
  const hostArg = process.argv.find((a) => a.startsWith("--host="))?.slice("--host=".length);
  if (!hostArg) {
    console.error("사용법: tsx scripts/indexnow-backfill.ts --host=<라이브 host> [--dry-run]");
    process.exit(1);
  }
  return { host: hostArg.replace(/^https?:\/\//, "").replace(/\/$/, ""), dryRun: process.argv.includes("--dry-run") };
}

function resolveKey(): string {
  const envKey = process.env.NAVER_INDEXNOW_KEY;
  if (envKey && envKey.length > 0) return envKey;
  const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public");
  const keyFile = readdirSync(publicDir).find((f) => /^[0-9a-f]{32,128}\.txt$/.test(f));
  if (!keyFile) {
    console.error("IndexNow 키를 찾지 못함 — env NAVER_INDEXNOW_KEY 또는 public/<hex>.txt 필요");
    process.exit(1);
  }
  return keyFile.replace(/\.txt$/, "");
}

function unescapeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

async function main(): Promise<void> {
  const { host, dryRun } = parseArgs();
  const key = resolveKey();

  const sitemapUrl = `https://${host}/sitemap.xml`;
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    console.error(`sitemap 조회 실패: ${res.status} ${sitemapUrl}`);
    process.exit(1);
  }
  const xml = await res.text();
  const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => unescapeXml(m[1].trim()));
  if (urlList.length === 0) {
    console.error("sitemap 에서 URL 을 찾지 못함");
    process.exit(1);
  }
  console.log(`sitemap URL ${urlList.length}건 (${sitemapUrl})`);

  const payload = { host, key, keyLocation: `https://${host}/${key}.txt`, urlList };
  if (dryRun) {
    console.log("[dry-run] 제출 생략. payload:");
    console.log(JSON.stringify({ ...payload, urlList: urlList.slice(0, 5).concat(`... 외 ${urlList.length - 5}건`) }, null, 2));
    return;
  }

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const submit = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000),
      });
      // IndexNow 스펙: 200 OK / 202 Accepted 정상.
      console.log(`${endpoint} → ${submit.status}${submit.ok || submit.status === 202 ? " (정상)" : " (확인 필요)"}`);
    } catch (err) {
      console.error(`${endpoint} → 제출 실패`, err);
    }
  }
}

await main();
