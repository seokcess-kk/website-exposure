// @glitzy/web/lib/admin/__tests__/keyword-bulk — 키워드 대량 등록 파서

import { describe, expect, it } from "vitest";

import {
  keywordSlugFromLabel,
  parseKeywordBulkLines,
} from "../keyword-bulk";

describe("keywordSlugFromLabel", () => {
  it("한글 라벨 — 공백을 하이픈으로 접는다", () => {
    expect(keywordSlugFromLabel("다이어트 한약 부작용")).toBe("다이어트-한약-부작용");
  });

  it("영문 대문자 — 소문자 정규화", () => {
    expect(keywordSlugFromLabel("GLP-1 다이어트")).toBe("glp-1-다이어트");
  });

  it("괄호·쉼표 등 특수문자는 하이픈으로 접고 양끝 하이픈 제거", () => {
    expect(keywordSlugFromLabel("(인천) 부평 한의원!")).toBe("인천-부평-한의원");
  });

  it("1자 라벨 — slug 규칙 (2자 이상) 미달 시 null", () => {
    expect(keywordSlugFromLabel("약")).toBeNull();
  });

  it("허용 문자 전무 — null", () => {
    expect(keywordSlugFromLabel("!!! ???")).toBeNull();
  });

  it("64자 초과 — cap 후에도 규칙 통과", () => {
    const long = "가나다라마바사 ".repeat(20).trim();
    const slug = keywordSlugFromLabel(long);
    expect(slug).not.toBeNull();
    expect(slug!.length).toBeLessThanOrEqual(64);
    expect(slug!.endsWith("-")).toBe(false);
  });
});

describe("parseKeywordBulkLines", () => {
  it("줄 단위 파싱 — 빈 줄 무시 + 앞뒤 공백 정리", () => {
    const r = parseKeywordBulkLines("다이어트 한약\n\n  부평 한의원  \r\n");
    expect(r.entries).toEqual([
      { label: "다이어트 한약", slug: "다이어트-한약" },
      { label: "부평 한의원", slug: "부평-한의원" },
    ]);
    expect(r.invalid).toEqual([]);
    expect(r.duplicateInInput).toEqual([]);
  });

  it("연속 공백은 라벨 안에서 한 칸으로 접는다", () => {
    const r = parseKeywordBulkLines("다이어트   한약");
    expect(r.entries[0]).toEqual({ label: "다이어트 한약", slug: "다이어트-한약" });
  });

  it("slug 충돌 입력 — 첫 등장만 유지, 이후는 duplicateInInput", () => {
    const r = parseKeywordBulkLines("다이어트 한약\n다이어트-한약");
    expect(r.entries).toHaveLength(1);
    expect(r.duplicateInInput).toEqual(["다이어트-한약"]);
  });

  it("invalid 줄 — 1-based 줄 번호와 사유 보고", () => {
    const r = parseKeywordBulkLines("정상 키워드\n약\n!!!");
    expect(r.entries).toHaveLength(1);
    expect(r.invalid).toHaveLength(2);
    expect(r.invalid[0]!.line).toBe(2);
    expect(r.invalid[1]!.line).toBe(3);
  });

  it("101자 라벨 — invalid", () => {
    const r = parseKeywordBulkLines("가".repeat(101));
    expect(r.entries).toHaveLength(0);
    expect(r.invalid[0]!.reason).toContain("100자");
  });
});
