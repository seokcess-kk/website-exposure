// buildIndexNowPayload — IndexNow 배치 payload 조립 (host/keyLocation 파생 규약 고정)

import { describe, expect, it } from "vitest";

import { buildIndexNowPayload } from "./indexnow";

const KEY = "abc123def456";

describe("buildIndexNowPayload", () => {
  it("커스텀/파생 도메인 base — host 는 hostname, keyLocation 은 host 루트", () => {
    const payload = buildIndexNowPayload(`https://daeatdiet-incheon.onwell.site`, KEY, [
      "/insights/diet/some-article",
      "/treatments/goodbye-diet",
    ]);
    expect(payload.host).toBe("daeatdiet-incheon.onwell.site");
    expect(payload.keyLocation).toBe(`https://daeatdiet-incheon.onwell.site/${KEY}.txt`);
    expect(payload.urlList).toEqual([
      "https://daeatdiet-incheon.onwell.site/insights/diet/some-article",
      "https://daeatdiet-incheon.onwell.site/treatments/goodbye-diet",
    ]);
    expect(payload.key).toBe(KEY);
  });

  it("path-prefix fallback base(origin/<slug>) — keyLocation 은 slug 아닌 origin 루트", () => {
    const payload = buildIndexNowPayload(`https://onwell.site/demo`, KEY, ["/insights/diet/a"]);
    expect(payload.host).toBe("onwell.site");
    // 키 파일은 public/ 정적 서빙이라 slug prefix 아래가 아닌 origin 루트에 존재한다.
    expect(payload.keyLocation).toBe(`https://onwell.site/${KEY}.txt`);
    expect(payload.urlList).toEqual(["https://onwell.site/demo/insights/diet/a"]);
  });
});
