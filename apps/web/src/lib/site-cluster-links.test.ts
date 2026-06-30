// @glitzy/web/lib/site-cluster-links.test — dedupeBySlug 순수 로직 검증
// (SQL 부분은 typecheck + build + 시각 검수로 커버 · 본 테스트는 dedup/exclude/limit 불변식)

import { describe, expect, it } from "vitest";

import { dedupeBySlug } from "./site-cluster-links";

type Item = { slug: string; n: number };

const items: Item[] = [
  { slug: "a", n: 1 },
  { slug: "b", n: 2 },
  { slug: "c", n: 3 },
  { slug: "a", n: 99 }, // 중복 slug — 첫 등장만 유지
  { slug: "d", n: 4 },
];

describe("dedupeBySlug", () => {
  it("입력(=SQL 랭킹) 순서를 보존한다", () => {
    const out = dedupeBySlug(items, [], 10);
    expect(out.map((x) => x.slug)).toEqual(["a", "b", "c", "d"]);
  });

  it("같은 slug 의 첫 등장만 남기고 이후 중복은 버린다", () => {
    const out = dedupeBySlug(items, [], 10);
    expect(out.find((x) => x.slug === "a")?.n).toBe(1);
    expect(out).toHaveLength(4);
  });

  it("excludeSlugs 에 포함된 slug 는 제외한다 (수동 큐레이션 중복 노출 방지)", () => {
    const out = dedupeBySlug(items, ["b", "d"], 10);
    expect(out.map((x) => x.slug)).toEqual(["a", "c"]);
  });

  it("limit 상한을 dedup·exclude 적용 후 기준으로 적용한다", () => {
    const out = dedupeBySlug(items, [], 2);
    expect(out.map((x) => x.slug)).toEqual(["a", "b"]);
  });

  it("exclude 로 앞 항목이 빠져도 limit 만큼 채운다", () => {
    const out = dedupeBySlug(items, ["a"], 2);
    expect(out.map((x) => x.slug)).toEqual(["b", "c"]);
  });

  it("빈 입력은 빈 배열", () => {
    expect(dedupeBySlug([], [], 3)).toEqual([]);
  });

  it("Set 도 excludeSlugs 로 받는다", () => {
    const out = dedupeBySlug(items, new Set(["c"]), 10);
    expect(out.map((x) => x.slug)).toEqual(["a", "b", "d"]);
  });
});
