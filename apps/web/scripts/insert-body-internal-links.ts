// @glitzy/web/scripts/insert-body-internal-links — 본문 문맥 내부링크 자동 삽입 (첫 언급 링크화)
// 사용:
//   드라이런: pnpm --filter @glitzy/web exec tsx --env-file=.env scripts/insert-body-internal-links.ts --instance-slug=daeatdiet-incheon
//   적용:     ... --instance-slug=daeatdiet-incheon --apply
//
// 배경 (2026-07-08): SEO readiness internal-links-min(본문 마크다운 내부링크 ≥3) 이 전 콘텐츠 fail.
// 2단 전략:
//   1) 문맥 링크 — 본문 안 시술명/주제어 "첫 언급"을 링크화 (하단 렌더타임 관련 모듈과 별개의
//      anchor text 시그널 · RSS 본문에도 실림). 한글 경계 가드: 매칭 직전 문자가 한글/영숫자면
//      스킵 ("부평다이어트한의원" 안 "다이어트한의원" 부분 링크 방지). 조사가 뒤에 붙는 건 허용.
//   2) 3개 미달 시 본문 끝 "관련 진료 안내" 한 줄 문단 — article_category.pillar ↔
//      treatment.pillar_slug 클러스터에서 주제 정합 대상만 선택 (하단 카드 모듈과 형태 상이).
//
// 규칙:
//   - 용어는 길이 내림차순 매칭 · 문서당 같은 URL 1회 · 라인당 링크 1개 · 문맥 링크 최대 5개.
//   - 헤딩(#)·인용(>)·표(|)·코드펜스·이미지(![)·기존 링크("](") 라인 제외. 자기 자신 링크 제외.
//   - URL 은 `/<instanceSlug>/...` prefix — markdown.ts rewriteInternalHref 컨벤션 (서브도메인
//     에선 bare 재작성 · dev/path-based 원본 유지).
//   - detox-program·postpartum-recovery 페이지는 title 중복/불일치 데이터 이슈로 링크 대상 제외.
//   - TERM/CLUSTER 맵은 다이트한의원 인스턴스 전용 큐레이션 — 타 인스턴스 적용 시 교체 필요.

import postgres from "postgres";

const SLUG_ARG = process.argv.find((a) => a.startsWith("--instance-slug="))?.split("=")[1];
const APPLY = process.argv.includes("--apply");
const MAX_CONTEXT_LINKS = 5;
const TARGET_MIN = 3;

function termMap(prefix: string): Array<{ term: string; url: string }> {
  const T = (p: string) => `${prefix}${p}`;
  const raw: Array<[string, string]> = [
    ["다이어트 한약 부작용", "/insights/general/diet-herbal-medicine-side-effects"],
    ["한약 부작용", "/insights/general/diet-herbal-medicine-side-effects"],
    ["출산 전후 다이어트", "/treatments/postpartum-diet"],
    ["당질조절 다이어트", "/treatments/carb-control"],
    ["요요방지 프로그램", "/treatments/yoyo-prevention"],
    ["소아비만 다이어트", "/treatments/child-obesity-diet"],
    ["갱년기 다이어트", "/treatments/menopause-diet"],
    ["마른비만 다이어트", "/treatments/slim-obesity-diet"],
    ["개인맞춤 다이어트", "/treatments/personalized-diet"],
    ["굿바이 다이어트", "/treatments/goodbye-diet"],
    ["다이트라인 약침", "/treatments/daet-line-pharmacopuncture"],
    ["지방분해 약침", "/treatments/lipolysis-pharmacopuncture"],
    ["지방분해약침", "/treatments/lipolysis-pharmacopuncture"],
    ["지방분해주사", "/treatments/lipolysis-pharmacopuncture"],
    ["3GO 다이어트", "/treatments/three-go-diet"],
    ["다이어트 한약", "/treatments/herbal-medicine"],
    ["다이어트한약", "/treatments/herbal-medicine"],
    ["한약 다이어트", "/treatments/herbal-medicine"],
    ["다이트 한약", "/treatments/herbal-medicine"],
    ["한방 다이어트", "/treatments/diet-treatment"],
    ["한방다이어트", "/treatments/diet-treatment"],
    ["산후 다이어트", "/treatments/postpartum-diet"],
    ["다이어트 치료", "/treatments/diet-treatment"],
    ["요요 현상", "/treatments/yoyo-prevention"],
    ["요요현상", "/treatments/yoyo-prevention"],
    ["사상체질", "/insights/diet/sasang-constitution-101"],
    ["소아비만", "/treatments/child-obesity-diet"],
    ["마른비만", "/treatments/slim-obesity-diet"],
    ["체질별", "/treatments/personalized-diet"],
    ["당질조절", "/treatments/carb-control"],
    ["지방분해", "/treatments/lipolysis-pharmacopuncture"],
    ["체형관리", "/treatments/body-shaping"],
    ["비만클리닉", "/treatments/diet-treatment"],
    ["갱년기", "/treatments/menopause-diet"],
    ["출산 후", "/treatments/postpartum-diet"],
    ["다이트한의원", ""],
    ["다이어트한의원", ""],
  ];
  return raw
    .map(([term, p]) => ({ term, url: p === "" ? prefix : T(p) }))
    .sort((a, b) => b.term.length - a.term.length);
}

// pillar → 관련 진료 안내 후보 (주제 정합 순). 미달분 보충용 universal 은 뒤에 이어붙인다.
function clusterCandidates(prefix: string, pillar: string | null): Array<{ label: string; url: string }> {
  const T = (p: string) => `${prefix}${p}`;
  const C: Record<string, Array<[string, string]>> = {
    "diet-treatment": [
      ["다이어트 치료", "/treatments/diet-treatment"],
      ["굿바이 다이어트", "/treatments/goodbye-diet"],
      ["당질조절 다이어트", "/treatments/carb-control"],
      ["요요방지 프로그램", "/treatments/yoyo-prevention"],
    ],
    "personalized-diet": [
      ["개인맞춤 다이어트", "/treatments/personalized-diet"],
      ["갱년기 다이어트", "/treatments/menopause-diet"],
      ["출산 전후 다이어트", "/treatments/postpartum-diet"],
      ["마른비만 다이어트", "/treatments/slim-obesity-diet"],
      ["소아비만 다이어트", "/treatments/child-obesity-diet"],
      ["3GO 다이어트", "/treatments/three-go-diet"],
    ],
    "body-shaping": [
      ["체형관리", "/treatments/body-shaping"],
      ["다이트라인 약침", "/treatments/daet-line-pharmacopuncture"],
      ["지방분해약침", "/treatments/lipolysis-pharmacopuncture"],
    ],
    "herbal-medicine": [["다이트 한약", "/treatments/herbal-medicine"]],
  };
  const universal: Array<[string, string]> = [
    ["다이트 한약", "/treatments/herbal-medicine"],
    ["개인맞춤 다이어트", "/treatments/personalized-diet"],
    ["다이어트 치료", "/treatments/diet-treatment"],
    ["굿바이 다이어트", "/treatments/goodbye-diet"],
  ];
  const primary = (pillar && C[pillar]) || [];
  const seen = new Set<string>();
  const out: Array<{ label: string; url: string }> = [];
  for (const [label, p] of [...primary, ...universal]) {
    const u = T(p);
    if (seen.has(u)) continue;
    seen.add(u);
    out.push({ label, url: u });
  }
  return out;
}

function countInternalLinks(md: string): number {
  return [...md.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].filter((m) => {
    const u = (m[1] ?? "").trim();
    return u.startsWith("/") && !u.startsWith("//");
  }).length;
}

function collectLinkedUrls(md: string): Set<string> {
  return new Set(
    [...md.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => (m[1] ?? "").trim()),
  );
}

const KO_ALNUM = /[가-힣A-Za-z0-9]/;

type LinkPlan = { term: string; url: string; line: number };

function insertContextLinks(
  body: string,
  terms: Array<{ term: string; url: string }>,
  selfUrl: string | null,
): { next: string; plans: LinkPlan[] } {
  const lines = body.split(/\r?\n/);
  const plans: LinkPlan[] = [];
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

  for (const { term, url } of terms) {
    if (plans.length >= MAX_CONTEXT_LINKS) break;
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
          from = idx + 1; // 단어 중간 매칭 (예: 부평|다이어트한의원) — 다음 위치 탐색
          continue;
        }
        lines[i] = lines[i]!.slice(0, idx) + `[${term}](${url})` + lines[i]!.slice(idx + term.length);
        plans.push({ term, url, line: i + 1 });
        usedUrls.add(url);
        break outer;
      }
    }
  }
  return { next: lines.join("\n"), plans };
}

async function main(): Promise<void> {
  if (!SLUG_ARG) {
    console.error("usage: tsx scripts/insert-body-internal-links.ts --instance-slug=<slug> [--apply]");
    process.exit(1);
  }
  const dbUrl = process.env.SEED_DATABASE_URL;
  if (!dbUrl) {
    console.error("SEED_DATABASE_URL 환경 변수 필요 (apps/web/.env).");
    process.exit(1);
  }
  const sql = postgres(dbUrl, { max: 1 });
  try {
    const inst = await sql`SELECT id FROM instance WHERE slug = ${SLUG_ARG} LIMIT 1`;
    if (inst.length === 0) throw new Error(`instance not found: ${SLUG_ARG}`);
    const iid = inst[0]!.id as string;
    const prefix = `/${SLUG_ARG}`;
    const terms = termMap(prefix);

    const articles = await sql`
      SELECT a.id, a.slug, a.title, a.body_markdown, ac.slug AS category_slug, ac.pillar AS pillar
        FROM article a LEFT JOIN article_category ac ON ac.id = a.category_id
       WHERE a.instance_id = ${iid}::uuid ORDER BY a.title`;
    const treatments = await sql`
      SELECT id, slug, title, body_markdown, pillar_slug AS pillar FROM treatment_page
       WHERE instance_id = ${iid}::uuid ORDER BY slug`;

    let touched = 0;
    let reached = 0;
    const summary: string[] = [];

    const process1 = async (
      kind: "article" | "treatment",
      row: {
        id: string; slug: string; title: string; body_markdown: string | null;
        category_slug?: string | null; pillar: string | null;
      },
    ) => {
      const body = row.body_markdown;
      if (!body || body.trim().length === 0) {
        summary.push(`SKIP(본문 없음) ${kind} ${row.slug}`);
        return;
      }
      const selfUrl =
        kind === "treatment"
          ? `${prefix}/treatments/${row.slug}`
          : `${prefix}/insights/${row.category_slug ?? "general"}/${row.slug}`;

      // 1) 문맥 링크
      const { next: afterContext, plans } = insertContextLinks(body, terms, selfUrl);
      let next = afterContext;
      let appended: string[] = [];

      // 2) 3개 미달 시 관련 진료 안내 문단 (자기 pillar 클러스터 · 이미 링크된 대상 제외)
      const deficit = TARGET_MIN - countInternalLinks(next);
      if (deficit > 0) {
        const linked = collectLinkedUrls(next);
        // treatment 는 자기 pillar (spoke 면 소속 pillar · pillar 페이지면 자기 slug 가 클러스터 키)
        const pillarKey = kind === "treatment" ? (row.pillar ?? row.slug) : (row.pillar ?? null);
        const picks = clusterCandidates(prefix, pillarKey)
          .filter((c) => c.url !== selfUrl && !linked.has(c.url))
          .slice(0, Math.max(deficit, 0));
        if (picks.length > 0) {
          const label = kind === "treatment" ? "관련 프로그램 안내" : "관련 진료 안내";
          next = `${next.replace(/\s+$/, "")}\n\n**${label}** · ${picks
            .map((p) => `[${p.label}](${p.url})`)
            .join(" · ")}\n`;
          appended = picks.map((p) => p.label);
        }
      }

      const before = countInternalLinks(body);
      const after = countInternalLinks(next);
      if (next === body) {
        summary.push(`NOCHANGE ${kind} ${row.slug} (내부링크 ${before})`);
        return;
      }
      touched += 1;
      if (after >= TARGET_MIN) reached += 1;
      summary.push(
        `${APPLY ? "APPLIED" : "PLAN"} ${kind} ${row.slug} | ${before}→${after}개 | 문맥:${plans
          .map((p) => `${p.term}(L${p.line})`)
          .join(",") || "-"} | 안내:${appended.join(",") || "-"}`,
      );
      if (APPLY) {
        if (kind === "article") {
          await sql`UPDATE article SET body_markdown = ${next}, updated_at = NOW() WHERE id = ${row.id}::uuid AND instance_id = ${iid}::uuid`;
        } else {
          await sql`UPDATE treatment_page SET body_markdown = ${next}, updated_at = NOW() WHERE id = ${row.id}::uuid AND instance_id = ${iid}::uuid`;
        }
      }
    };

    for (const row of articles) await process1("article", row as never);
    for (const row of treatments) await process1("treatment", row as never);

    console.log(summary.join("\n"));
    console.log(
      `\n[insert-body-internal-links] ${APPLY ? "적용" : "드라이런"} 완료 — 변경 ${touched}건 · ${TARGET_MIN}개 도달 ${reached}건 · 무변경/스킵 ${summary.length - touched}건`,
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("[insert-body-internal-links] failed:", err);
  process.exit(1);
});
