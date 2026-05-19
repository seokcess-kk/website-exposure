// @glitzy/web/components/site/ui/OrnamentalDivider — 단아 v1.1 (한국 한의원 톤)
// 단순 horizontal accent — 한국 의료기관 사이트 안 가장 흔한 ornament.

export function OrnamentalDivider({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`divider-ornament ${className}`} />;
}
