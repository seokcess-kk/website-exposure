// @glitzy/web/lib/internal-linkify — 본문 마크다운 첫-언급 내부링크 자동 삽입 (공용)
//
// AI Full Draft(article) 생성 직후 본문에 발행 시술명/클리닉 브랜드의 "첫 언급"을 내부링크로
// 치환한다 — readiness internal-links-min(본문 내부링크 ≥3) 선제 충족 + 본문 anchor text 시그널
// (하단 렌더타임 관련 모듈·RSS 본문과 별개). scripts/insert-body-internal-links.ts 의 배치 로직을
// 제품 경로용으로 이식한 것 — 배치 스크립트는 인스턴스 큐레이션 용어 맵, 이 lib 은 DB 파생
// (발행 treatment 제목 + clinic 이름)만 사용해 인스턴스 하드코딩이 없다 (3-layer Core 정합).
//
// 규칙 (배치 스크립트와 동일):
//   - 용어 길이 내림차순 매칭 · 같은 URL 문서당 1회 · 라인당 링크 1개 · 기본 최대 5개.
//   - 한글 경계 가드: 매칭 직전 문자가 한글/영숫자면 스킵 (예: "부평다이어트한의원" 안의
//     "다이어트한의원" 부분 링크 방지). 뒤따르는 조사는 앵커 밖에 남아 자연스럽다.
//   - 헤딩(#)·인용(>)·표(|)·코드펜스·이미지(![)·기존 링크("](") 라인은 건드리지 않는다.
//   - URL 은 `/<instanceSlug>/...` prefix — markdown.ts rewriteInternalHref 가 서브도메인에선
//     bare 경로로 재작성하고 dev/path-based 에선 원본 유지 (본문 내부링크 표준 컨벤션).
//
// treatment full draft 에는 적용하지 않는다 — 기존 페이지 재생성 시 자기 자신 링크 위험이
// 있고(제목=용어), 볼륨 경로는 article 이다. 필요 시 selfUrl 옵션으로 확장 가능.

import type postgres from "postgres";

export type InternalLinkTerm = { term: string; url: string };

export type LinkifyResult = {
  body: string;
  added: Array<{ term: string; url: string }>;
};

const KO_ALNUM = /[가-힣A-Za-z0-9]/;
const DEFAULT_MAX_LINKS = 5;
const MIN_TERM_LENGTH = 2;

export function linkifyFirstMentions(
  body: string,
  terms: InternalLinkTerm[],
  opts?: { selfUrl?: string | null; maxLinks?: number },
): LinkifyResult {
  const maxLinks = opts?.maxLinks ?? DEFAULT_MAX_LINKS;
  const selfUrl = opts?.selfUrl ?? null;
  const sorted = [...terms]
    .filter((t) => t.term.length >= MIN_TERM_LENGTH)
    .sort((a, b) => b.term.length - a.term.length);

  const lines = body.split(/\r?\n/);
  const added: Array<{ term: string; url: string }> = [];
  const usedUrls = new Set<string>();

  let fence = false;
  const inFence: boolean[] = lines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      fence = !fence;
      return true;
    }
    return fence;
  });

  const eligible = (i: number): boolean => {
    const line = lines[i]!;
    if (inFence[i]) return false;
    if (/^\s*(#|>|\|)/.test(line)) return false;
    if (line.includes("](") || line.includes("![")) return false;
    return true;
  };

  for (const { term, url } of sorted) {
    if (added.length >= maxLinks) break;
    if (selfUrl && url === selfUrl) continue;
    if (usedUrls.has(url)) continue;
    outer: for (let i = 0; i < lines.length; i += 1) {
      if (!eligible(i)) continue;
      let from = 0;
      while (true) {
        const idx = lines[i]!.indexOf(term, from);
        if (idx === -1) continue outer;
        const prev = idx > 0 ? lines[i]![idx - 1]! : "";
        if (prev && KO_ALNUM.test(prev)) {
          from = idx + 1; // 단어 중간 매칭 — 같은 라인의 다음 위치 재탐색
          continue;
        }
        lines[i] = lines[i]!.slice(0, idx) + `[${term}](${url})` + lines[i]!.slice(idx + term.length);
        added.push({ term, url });
        usedUrls.add(url);
        break outer;
      }
    }
  }
  return { body: lines.join("\n"), added };
}

/**
 * 링크 용어 로드 — 발행 treatment 제목(중복 제목은 slug 순 첫 행만) + clinic 이름(→ 홈).
 * tenant tx 안 호출 (RLS). 반환 URL 은 `/<instanceSlug>/...` prefix.
 */
export async function loadInternalLinkTerms(
  tx: postgres.TransactionSql,
  instanceId: string,
  instanceSlug: string,
): Promise<InternalLinkTerm[]> {
  const prefix = `/${instanceSlug}`;
  const treatments: Array<{ title: string; slug: string }> = await tx`
    SELECT DISTINCT ON (title) title, slug
      FROM treatment_page
     WHERE instance_id = ${instanceId}::uuid AND status = 'published'
     ORDER BY title, slug
  `;
  const clinicRows: Array<{ name: string }> = await tx`
    SELECT name FROM clinic_profile
     WHERE instance_id = ${instanceId}::uuid AND slug = 'clinic'
     LIMIT 1
  `;
  const terms: InternalLinkTerm[] = treatments.map((t) => ({
    term: t.title,
    url: `${prefix}/treatments/${t.slug}`,
  }));
  const clinicName = clinicRows[0]?.name?.trim();
  if (clinicName) {
    // "다이트한의원 인천 부평점" 같은 풀네임은 본문에 그대로 안 나오는 경우가 많아
    // 첫 어절(브랜드명)도 함께 등록 — 홈으로 연결.
    terms.push({ term: clinicName, url: prefix });
    const brand = clinicName.split(/\s+/)[0];
    if (brand && brand !== clinicName) terms.push({ term: brand, url: prefix });
  }
  return terms;
}
