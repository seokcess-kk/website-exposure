// checkInternalLinks — bare 경로 내부링크 판정 고정 (SUBDOMAIN_SCALE_PLAN 전환 정합)
// 2026-07-08: 기존 `/<slug>` prefix 전용 판정이 파생 host 시대 bare 경로(/insights/...)를
// 0개로 오측정 → 루트 상대 경로 전체를 내부로 세도록 보정. 회귀 방지 테스트.

import { describe, it, expect } from "vitest";

import { CHECK_CATALOG } from "../catalog";
import { checkInternalLinks } from "./shared";

const catalog = CHECK_CATALOG.find((c) => c.key === "internal-links-min")!;
const run = (body: string | null) => checkInternalLinks(catalog, 10, body, "daeatdiet-incheon");

describe("checkInternalLinks", () => {
  it("bare 내부 경로 3개 이상 → pass (slug prefix 불필요)", () => {
    const body = [
      "[굿바이 다이어트](/treatments/goodbye-diet) 참고.",
      "[칼럼](/insights/hanbang-diet) 과 [의료진](/doctors/shin-soo-yong) 도 보세요.",
    ].join("\n");
    expect(run(body).status).toBe("pass");
  });

  it("기존 slug-prefix 경로도 여전히 내부로 집계 (path-based 인스턴스 호환)", () => {
    const body =
      "[a](/daeatdiet-incheon/treatments/a) [b](/daeatdiet-incheon/insights/b) [c](/daeatdiet-incheon/faq)";
    expect(run(body).status).toBe("pass");
  });

  it("외부 URL·프로토콜 상대·앵커는 내부 링크로 세지 않음", () => {
    const body =
      "[ex](https://example.com/a) [pr](//cdn.example.com/b) [anchor](#section) [one](/insights/only-one)";
    const result = run(body);
    expect(result.status).toBe("fail");
    expect(result.detail).toContain("1/3");
  });

  it("본문 없음 → fail", () => {
    expect(run(null).status).toBe("fail");
  });
});
