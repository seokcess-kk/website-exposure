// @glitzy/web/hooks/useAutoSlug — SLUG_AUTOGEN_PLAN v0.3 § 3.2
// source 필드 변경 watch → pristine 이면 slug 자동 채움. 운영자 수동 편집 시 markSlugDirty 호출하면 watcher 중단.
// edit 모드 (isNew=false) 는 처음부터 not-pristine — 기존 slug 보존이 기본값.

"use client";
import { useEffect, useRef } from "react";

import { slugify, type SlugifyOptions } from "@/lib/slugify";

export type UseAutoSlugArgs = {
  source: string;
  setSlug: (v: string) => void;
  isNew: boolean;
  options: SlugifyOptions;
};

export type UseAutoSlugReturn = {
  /** slug 필드 onChange 시 호출 — 이후 source 변경에도 slug 자동 채움 중단 */
  markSlugDirty: () => void;
};

/**
 * Pure 함수 — useAutoSlug 의 핵심 결정 로직. testing-library 없이 vitest 단독으로 테스트.
 * 반환:
 *   - null: slug 변경 없음 (pristine=false 또는 source 변화 없음)
 *   - { next: "" }: source 가 빈 문자열 — slug도 비움
 *   - { next: "<slug>" }: slugify 결과
 */
export function computeAutoSlugUpdate(args: {
  source: string;
  lastSource: string;
  pristine: boolean;
  options: SlugifyOptions;
}): { next: string } | null {
  if (!args.pristine) return null;
  if (args.source === args.lastSource) return null;
  if (args.source.trim().length === 0) return { next: "" };
  return { next: slugify(args.source, args.options) };
}

export function useAutoSlug(args: UseAutoSlugArgs): UseAutoSlugReturn {
  const pristine = useRef(args.isNew);
  const lastSource = useRef(args.source);

  useEffect(() => {
    const update = computeAutoSlugUpdate({
      source: args.source,
      lastSource: lastSource.current,
      pristine: pristine.current,
      options: args.options,
    });
    lastSource.current = args.source;
    if (update !== null) args.setSlug(update.next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.source]);

  return {
    markSlugDirty: () => {
      pristine.current = false;
    },
  };
}
