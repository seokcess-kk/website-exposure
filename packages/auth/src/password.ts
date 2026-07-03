// @glitzy/auth/password — scrypt 기반 비밀번호 해싱·검증 (node:crypto only · 외부 의존성 0)
//
// 저장 포맷 (self-describing · 파라미터 버전화):
//   scrypt$<N>$<r>$<p>$<saltB64>$<hashB64>
//   → admin_user.password_hash TEXT. verifyPassword 가 문자열에서 N/r/p/salt 를 파싱해
//     그 파라미터로 재도출하므로, 나중에 N 을 올려도 기존 해시는 계속 검증된다.

import { scrypt as _scrypt, randomBytes, timingSafeEqual, type ScryptOptions } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(_scrypt) as unknown as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: ScryptOptions,
) => Promise<Buffer>;

// 파라미터 — admin 로그인은 저빈도라 비용 여유. ⚠️ scrypt 기본 maxmem 은 32MiB 인데
// 필요 메모리 128*N*r(≈33.5MiB) 로 초과해 throw → maxmem 을 명시한다.
const N = 32768; // 2**15
const R = 8;
const P = 1;
const KEYLEN = 32;
const SALT_BYTES = 16;
const MAXMEM = 64 * 1024 * 1024; // 64 MiB
const SCRYPT_OPTS: ScryptOptions = { N, r: R, p: P, maxmem: MAXMEM };

const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 200; // scrypt 입력 상한 (DoS 방지)

export function validatePasswordStrength(plain: unknown): { ok: true } | { ok: false; reason: string } {
  if (typeof plain !== "string") return { ok: false, reason: "비밀번호가 필요합니다." };
  if (plain.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, reason: `비밀번호는 최소 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.` };
  }
  if (plain.length > MAX_PASSWORD_LENGTH) {
    return { ok: false, reason: `비밀번호는 ${MAX_PASSWORD_LENGTH}자 이하여야 합니다.` };
  }
  return { ok: true };
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derived = await scryptAsync(plain, salt, KEYLEN, SCRYPT_OPTS);
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${derived.toString("base64")}`;
}

/** stored 를 파싱해 동일 파라미터로 재도출 후 timing-safe 비교. 파싱/도출 실패는 throw 없이 false. */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  try {
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const n = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p) || n <= 1 || r <= 0 || p <= 0) {
      return false;
    }
    const salt = Buffer.from(parts[4]!, "base64");
    const expected = Buffer.from(parts[5]!, "base64");
    if (salt.length === 0 || expected.length === 0) return false;
    const derived = await scryptAsync(plain, salt, expected.length, { N: n, r, p, maxmem: MAXMEM });
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

// 사용자 열거/타이밍 방어 — stored 가 없을 때(유저 부재·password_hash NULL)도 동일 scrypt 작업량을
// 태워 "존재하는 유저의 오답"과 구분되지 않게 한다. 더미 해시는 최초 1회 생성 후 메모.
let dummyHashCache: string | null = null;
async function getDummyHash(): Promise<string> {
  if (dummyHashCache === null) {
    dummyHashCache = await hashPassword("glitzy-timing-defense-placeholder");
  }
  return dummyHashCache;
}

export async function verifyPasswordOrDummy(plain: string, stored: string | null | undefined): Promise<boolean> {
  if (typeof stored === "string" && stored.length > 0) {
    return verifyPassword(plain, stored);
  }
  // 유저 없음/비번 미설정 — 동일 scrypt 경로를 태운 뒤 항상 false.
  await verifyPassword(plain, await getDummyHash());
  return false;
}
