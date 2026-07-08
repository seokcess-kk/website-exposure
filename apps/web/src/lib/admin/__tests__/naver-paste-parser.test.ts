// @glitzy/web/lib/admin/__tests__/naver-paste-parser — NAVER_SEARCH_INGEST_PLAN v0.4 task #8
// G1 sample 정합 + cycle 3 (a)~(h) 시나리오.

import { describe, it, expect } from "vitest";
import { detectAndParse, normalizeRow, buildNaverRowMetadata } from "../naver-paste-parser";

// G1 sample — TOP30 표 10 row (사용자 paste 결과 정합)
const G1_HTML = `<table><thead><tr><th>No</th><th>검색 키워드</th><th>클릭</th><th>노출</th><th>CTR(%)</th></tr></thead>
<tbody>
<tr><td>1</td><td><div class="url_text_JmCF8">병원 마케팅 에이전시</div></td><td>1</td><td>4</td><td>25</td></tr>
<tr><td>2</td><td><div class="url_text_JmCF8">http://www.glitzy.kr/</div></td><td>1</td><td>2</td><td>50</td></tr>
<tr><td>3</td><td><div class="url_text_JmCF8">스트럭쳐그로스</div></td><td>0</td><td>3</td><td>0</td></tr>
</tbody></table>`;

const G1_TSV = `No\t검색 키워드\t클릭\t노출\tCTR(%)
1\t병원 마케팅 에이전시\t1\t4\t25
2\thttp://www.glitzy.kr/\t1\t2\t50
3\t스트럭쳐그로스\t0\t3\t0`;

const G1_CSV = `No,검색 키워드,클릭,노출,CTR(%)
1,병원 마케팅 에이전시,1,4,25
2,http://www.glitzy.kr/,1,2,50
3,스트럭쳐그로스,0,3,0`;

describe("naver-paste-parser — detectAndParse", () => {
  it("HTML table — G1 sample 정합 · 3 row · format='html'", () => {
    const result = detectAndParse(G1_HTML);
    expect(result.detectedFormat).toBe("html");
    expect(result.validRows.length).toBe(3);
    expect(result.skippedRows).toBe(0);
    expect(result.validRows[0]).toEqual({
      검색키워드: "병원 마케팅 에이전시",
      클릭: 1,
      노출: 4,
      CTR: 25,
    });
  });

  it("TSV plain text — primary path · format='tsv'", () => {
    const result = detectAndParse(G1_TSV);
    expect(result.detectedFormat).toBe("tsv");
    expect(result.validRows.length).toBe(3);
    expect(result.validRows[1]!.검색키워드).toBe("http://www.glitzy.kr/");
    expect(result.validRows[1]!.CTR).toBe(50);
  });

  it("CSV — fallback path · format='csv'", () => {
    const result = detectAndParse(G1_CSV);
    expect(result.detectedFormat).toBe("csv");
    expect(result.validRows.length).toBe(3);
  });

  it("multi-space — NSA 표 공백 정렬 paste · format='multi-space'", () => {
    const text = `No  검색 키워드  클릭  노출  CTR(%)
1   병원 마케팅 에이전시  1   4   25
2   스트럭쳐그로스  0   3   0`;
    const result = detectAndParse(text);
    expect(result.detectedFormat).toBe("multi-space");
    expect(result.validRows.length).toBe(2);
    expect(result.validRows[0]!.검색키워드).toBe("병원 마케팅 에이전시");
  });

  it("empty paste → validRows 0 · format='unknown'", () => {
    const result = detectAndParse("");
    expect(result.detectedFormat).toBe("unknown");
    expect(result.validRows.length).toBe(0);
  });

  // === 2026-07-08 실사용 보강 — 세로 복사 · 콤마 · % · "-" · 4컬럼 ===

  it("천 단위 콤마 + % 접미사 (TSV) — 정규화 후 통과", () => {
    const text = `No\t검색 키워드\t클릭\t노출\tCTR(%)
1\t다이어트 한약\t23\t1,234\t1.86%
2\t부평 한의원\t102\t12,345\t0.83%`;
    const result = detectAndParse(text);
    expect(result.detectedFormat).toBe("tsv");
    expect(result.validRows).toEqual([
      { 검색키워드: "다이어트 한약", 클릭: 23, 노출: 1234, CTR: 1.86 },
      { 검색키워드: "부평 한의원", 클릭: 102, 노출: 12345, CTR: 0.83 },
    ]);
  });

  it("세로 복사 (셀마다 줄바꿈 · header 포함 · 5줄 그룹) — format='vertical'", () => {
    const text = `No
검색 키워드
클릭
노출
CTR(%)
1
다이어트 한약
23
1,234
1.86%
2
부평 다이어트 한의원
0
567
0`;
    const result = detectAndParse(text);
    expect(result.detectedFormat).toBe("vertical");
    expect(result.validRows).toEqual([
      { 검색키워드: "다이어트 한약", 클릭: 23, 노출: 1234, CTR: 1.86 },
      { 검색키워드: "부평 다이어트 한의원", 클릭: 0, 노출: 567, CTR: 0 },
    ]);
    expect(result.skippedRows).toBe(0);
  });

  it("NSA 실복사 3줄 그룹 (2026-07-08 사용자 확인 샘플) — 제목 줄 + 순번/키워드/숫자3 한 줄", () => {
    const text = `검색 키워드 TOP 30
1
다이트한의원 부평
0    26    0
2
부평 다이트한의원
0    23    0
3
부평다이트한의원
0    3    0
4
다이트한의원 인천
0    3    0
5
부평 다이트 한의원
0    1    0
6
다이트 한의원 본점
0    1    0
7
다이트 한의원 부평
0    1    0
8
다이트한의원부평
0    1    0
9
다이트한의원 본점
0    1    0
10
site:daeatdiet-incheon.onwell.site
0    1    0`;
    const result = detectAndParse(text);
    expect(result.detectedFormat).toBe("vertical");
    expect(result.validRows.length).toBe(10);
    expect(result.skippedRows).toBe(0);
    expect(result.validRows[0]).toEqual({ 검색키워드: "다이트한의원 부평", 클릭: 0, 노출: 26, CTR: 0 });
    expect(result.validRows[9]).toEqual({ 검색키워드: "site:daeatdiet-incheon.onwell.site", 클릭: 0, 노출: 1, CTR: 0 });
  });

  it("NSA 실복사 3줄 그룹 — 제목 없이 순번부터 선택 (첫 줄 trailing 공백 → multi-space 오감지 후 vertical fallback)", () => {
    const text = `1    \n다이트한의원 부평\n0    26    0\n2    \n부평 다이트한의원\n0    23    0`;
    const result = detectAndParse(text);
    expect(result.detectedFormat).toBe("vertical");
    expect(result.validRows.length).toBe(2);
    expect(result.validRows[1]).toEqual({ 검색키워드: "부평 다이트한의원", 클릭: 0, 노출: 23, CTR: 0 });
  });

  it("세로 복사 — 순번 없이 키워드+숫자3 한 줄 (2줄 그룹)", () => {
    const text = `다이트한의원 부평\n0    26    0\n부평 다이트한의원\n0    23    0`;
    const result = detectAndParse(text);
    expect(result.detectedFormat).toBe("vertical");
    expect(result.validRows.length).toBe(2);
  });

  it("세로 복사 — No 컬럼 없는 4줄 그룹", () => {
    const text = `다이어트 한약
23
1234
1.86
부평 한의원
5
100
5`;
    const result = detectAndParse(text);
    expect(result.detectedFormat).toBe("vertical");
    expect(result.validRows.length).toBe(2);
    expect(result.validRows[1]).toEqual({ 검색키워드: "부평 한의원", 클릭: 5, 노출: 100, CTR: 5 });
  });

  it("'-' 표기는 0 으로 정규화 (TSV)", () => {
    const text = `1\t다이어트 한약\t-\t345\t-`;
    const result = detectAndParse(text);
    expect(result.validRows[0]).toEqual({ 검색키워드: "다이어트 한약", 클릭: 0, 노출: 345, CTR: 0 });
  });

  it("No 컬럼 없는 4토큰 TSV 행 허용", () => {
    const text = `검색 키워드\t클릭\t노출\tCTR(%)
다이어트 한약\t23\t1,234\t1.86%`;
    const result = detectAndParse(text);
    expect(result.validRows).toEqual([
      { 검색키워드: "다이어트 한약", 클릭: 23, 노출: 1234, CTR: 1.86 },
    ]);
  });

  it("HTML table — 콤마/% 숫자 정규화", () => {
    const html = `<table><tbody>
<tr><td>1</td><td>다이어트 한약</td><td>23</td><td>1,234</td><td>1.86%</td></tr>
</tbody></table>`;
    const result = detectAndParse(html);
    expect(result.detectedFormat).toBe("html");
    expect(result.validRows[0]).toEqual({ 검색키워드: "다이어트 한약", 클릭: 23, 노출: 1234, CTR: 1.86 });
  });

  it("malformed row → skip + errors[] 누적", () => {
    const text = `No\t검색 키워드\t클릭\t노출\tCTR(%)
1\t유효한 키워드\t1\t4\t25
2\t결손\t1\t4
3\t또 다른 유효\t2\t8\t25`;
    const result = detectAndParse(text);
    expect(result.validRows.length).toBe(2);
    expect(result.skippedRows).toBe(1);
    expect(result.errors[0]!.rowIndex).toBe(2);
  });

  it("non-numeric clicks → zod skip + errors[]", () => {
    const text = `No\t검색 키워드\t클릭\t노출\tCTR(%)
1\t유효 키워드\tABC\t4\t25
2\t또 유효\t2\t8\t25`;
    const result = detectAndParse(text);
    expect(result.validRows.length).toBe(1);
    expect(result.skippedRows).toBe(1);
  });

  it("CTR > 100 → zod skip", () => {
    const text = `No\t검색 키워드\t클릭\t노출\tCTR(%)
1\t유효 키워드\t1\t4\t150`;
    const result = detectAndParse(text);
    expect(result.validRows.length).toBe(0);
    expect(result.skippedRows).toBe(1);
  });

  it("query 안 공백 정합 — multi-token query 처리", () => {
    // tab 으로 구분이라 query 안 공백 그대로 보존
    const text = `No\t검색 키워드\t클릭\t노출\tCTR(%)
1\t주식회사 글리치 · 471-86-03445\t0\t2\t0`;
    const result = detectAndParse(text);
    expect(result.validRows[0]!.검색키워드).toBe("주식회사 글리치 · 471-86-03445");
  });

  it("header 없는 row 만 — 첫 row 가 숫자로 시작 시 data 로 처리", () => {
    const text = `1\t키워드 A\t1\t4\t25
2\t키워드 B\t0\t3\t0`;
    const result = detectAndParse(text);
    expect(result.validRows.length).toBe(2);
    expect(result.validRows[0]!.검색키워드).toBe("키워드 A");
  });
});

describe("naver-paste-parser — normalizeRow (sentinel + CTR /100)", () => {
  it("CTR /100 변환 + sentinel '' · 1000", () => {
    const n = normalizeRow({ 검색키워드: "테스트", 클릭: 1, 노출: 4, CTR: 25 });
    expect(n.query).toBe("테스트");
    expect(n.clicks).toBe(1);
    expect(n.impressions).toBe(4);
    expect(n.ctr).toBe(0.25);
    expect(n.pageUrl).toBe("");
    expect(n.avgPosition).toBe(1000);
  });

  it("CTR 0 정합", () => {
    const n = normalizeRow({ 검색키워드: "test", 클릭: 0, 노출: 3, CTR: 0 });
    expect(n.ctr).toBe(0);
  });

  it("CTR 100 (이론상 max) 정합", () => {
    const n = normalizeRow({ 검색키워드: "test", 클릭: 5, 노출: 5, CTR: 100 });
    expect(n.ctr).toBe(1);
  });
});

describe("naver-paste-parser — buildNaverRowMetadata", () => {
  it("dataGrain · collectionDate · sourceWindowLabel · positionUnavailable", () => {
    const m = buildNaverRowMetadata("2026-05-22");
    expect(m.dataGrain).toBe("naver-top30-cumulative");
    expect(m.collectionDate).toBe("2026-05-22");
    expect(m.sourceWindowLabel).toBe("NSA TOP30 누적");
    expect(m.positionUnavailable).toBe(true);
  });
});
