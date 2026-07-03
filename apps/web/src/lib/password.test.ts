// packages/auth scrypt 비밀번호 해싱 단위 테스트 (dist 를 @glitzy/auth 배럴로 import).
import { describe, it, expect } from "vitest";
import { scryptSync } from "node:crypto";
import { hashPassword, verifyPassword, verifyPasswordOrDummy, validatePasswordStrength } from "@glitzy/auth";

describe("password (scrypt)", () => {
  it("hash 포맷 scrypt$N$r$p$salt$hash + 동일 입력이라도 salt 가 달라 해시가 다름", async () => {
    const h1 = await hashPassword("correct horse battery");
    const h2 = await hashPassword("correct horse battery");
    expect(h1).toMatch(/^scrypt\$\d+\$\d+\$\d+\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/);
    expect(h1).not.toBe(h2);
  });

  it("verify — 정답 true, 오답 false", async () => {
    const h = await hashPassword("s3cret-password");
    expect(await verifyPassword("s3cret-password", h)).toBe(true);
    expect(await verifyPassword("wrong-password", h)).toBe(false);
  });

  it("verify — 손상/쓰레기 문자열은 throw 없이 false", async () => {
    expect(await verifyPassword("x", "not-a-hash")).toBe(false);
    expect(await verifyPassword("x", "scrypt$32768$8$1$onlytwo")).toBe(false);
    expect(await verifyPassword("x", "")).toBe(false);
    expect(await verifyPassword("x", "scrypt$abc$8$1$c2FsdA==$aGFzaA==")).toBe(false);
  });

  it("verify 는 해시에 임베드된 파라미터로 재도출한다 (기본 N 과 다른 N 해시도 검증)", async () => {
    const salt = Buffer.from("0123456789abcdef");
    const N = 16384; // 모듈 기본(32768)과 다름 — 파라미터를 문자열에서 읽는지 증명
    const derived = scryptSync("low-n-pw", salt, 32, { N, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
    const stored = `scrypt$${N}$8$1$${salt.toString("base64")}$${derived.toString("base64")}`;
    expect(await verifyPassword("low-n-pw", stored)).toBe(true);
    expect(await verifyPassword("wrong", stored)).toBe(false);
  });

  it("verifyPasswordOrDummy — stored 없음이면 항상 false (scrypt 경로 수행)", async () => {
    expect(await verifyPasswordOrDummy("anything", null)).toBe(false);
    expect(await verifyPasswordOrDummy("anything", "")).toBe(false);
    const h = await hashPassword("real-password");
    expect(await verifyPasswordOrDummy("real-password", h)).toBe(true);
    expect(await verifyPasswordOrDummy("nope", h)).toBe(false);
  });

  it("validatePasswordStrength 경계 (최소 10자)", () => {
    expect(validatePasswordStrength("123456789").ok).toBe(false); // 9자
    expect(validatePasswordStrength("1234567890").ok).toBe(true); // 10자
    expect(validatePasswordStrength("a".repeat(201)).ok).toBe(false);
    expect(validatePasswordStrength(123 as unknown as string).ok).toBe(false);
  });
});
