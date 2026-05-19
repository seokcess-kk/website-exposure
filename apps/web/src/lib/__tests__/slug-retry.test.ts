// @glitzy/web/lib/__tests__/slug-retry — SLUG_AUTOGEN_PLAN v0.3 § 8.2

import { describe, expect, it, vi } from "vitest";

import { withSlugRetry, isUniqueSlugViolation } from "@/lib/slug-retry";

function uniqueViolation(constraint: string): Error {
  const err = new Error(`duplicate key value violates unique constraint "${constraint}"`);
  (err as any).code = "23505";
  (err as any).constraint_name = constraint;
  return err;
}

describe("withSlugRetry", () => {
  // RT-01: 1회차 성공
  it("RT-01: 1회차 성공 — fn 1회 호출, base slug 반환", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const result = await withSlugRetry("hello", fn);
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("hello");
  });

  // RT-02: 1회차 23505 → 2회차 성공
  it("RT-02: 1회차 23505 → 2회차 성공 — fn 2회 호출, `${base}-2` 반환", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(uniqueViolation("article_instance_slug_unique"))
      .mockResolvedValueOnce("ok-2");
    const result = await withSlugRetry("hello", fn);
    expect(result).toBe("ok-2");
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, "hello");
    expect(fn).toHaveBeenNthCalledWith(2, "hello-2");
  });

  // RT-03: 1~4회차 모두 23505 → 5회차 성공
  it("RT-03: 4회 충돌 후 5회차 성공 — fn 5회 호출", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(uniqueViolation("publication_instance_slug_unique"))
      .mockRejectedValueOnce(uniqueViolation("publication_instance_slug_unique"))
      .mockRejectedValueOnce(uniqueViolation("publication_instance_slug_unique"))
      .mockRejectedValueOnce(uniqueViolation("publication_instance_slug_unique"))
      .mockResolvedValueOnce("ok-5");
    const result = await withSlugRetry("hello", fn);
    expect(result).toBe("ok-5");
    expect(fn).toHaveBeenCalledTimes(5);
    expect(fn).toHaveBeenNthCalledWith(5, "hello-5");
  });

  // RT-04: 5회 모두 23505 → 마지막 에러 throw
  it("RT-04: 5회 모두 충돌 → 마지막 에러 propagate", async () => {
    const lastErr = uniqueViolation("faq_instance_slug_unique");
    const fn = vi.fn().mockRejectedValue(lastErr);
    await expect(withSlugRetry("hello", fn)).rejects.toBe(lastErr);
    expect(fn).toHaveBeenCalledTimes(5);
  });

  // RT-05: 23505 가 아닌 에러 → 즉시 throw, retry 안 함
  it("RT-05: non-23505 에러 → 즉시 throw, retry 안 함", async () => {
    const checkErr: any = new Error("check violation");
    checkErr.code = "23514";
    const fn = vi.fn().mockRejectedValue(checkErr);
    await expect(withSlugRetry("hello", fn)).rejects.toBe(checkErr);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // RT-06: 23505 + constraint suffix 다름 (instance_id_unique 같은) → throw, retry 안 함
  it("RT-06: 23505 + slug_unique 외 constraint → 즉시 throw", async () => {
    const otherErr: any = new Error("other unique");
    otherErr.code = "23505";
    otherErr.constraint_name = "article_instance_id_unique"; // slug_unique 아님
    const fn = vi.fn().mockRejectedValue(otherErr);
    await expect(withSlugRetry("hello", fn)).rejects.toBe(otherErr);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("isUniqueSlugViolation", () => {
  it("23505 + *_instance_slug_unique constraint → true", () => {
    expect(isUniqueSlugViolation(uniqueViolation("article_instance_slug_unique"))).toBe(true);
    expect(isUniqueSlugViolation(uniqueViolation("publication_instance_slug_unique"))).toBe(true);
    expect(isUniqueSlugViolation(uniqueViolation("faq_instance_slug_unique"))).toBe(true);
  });

  it("23505 + 다른 constraint → false", () => {
    expect(isUniqueSlugViolation(uniqueViolation("article_instance_id_unique"))).toBe(false);
  });

  it("non-23505 → false", () => {
    const err: any = new Error("check");
    err.code = "23514";
    err.constraint_name = "article_instance_slug_unique"; // code 가 다름
    expect(isUniqueSlugViolation(err)).toBe(false);
  });

  it("non-object → false", () => {
    expect(isUniqueSlugViolation(null)).toBe(false);
    expect(isUniqueSlugViolation("string")).toBe(false);
    expect(isUniqueSlugViolation(undefined)).toBe(false);
  });
});
