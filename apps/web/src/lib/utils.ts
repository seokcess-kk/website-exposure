// @glitzy/web/lib/utils — 공통 helper
// cn: tailwind className 합성 (shadcn 패턴 정합 · clsx + 단순 join)

export function cn(...args: Array<string | undefined | null | false>): string {
  return args.filter(Boolean).join(" ");
}
