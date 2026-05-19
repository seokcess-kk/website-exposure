// @glitzy/web/components/site/ui/SectionHeading — 단아 v1.1 (한국 한의원 톤 보정)
// 한국 한의원 사이트 패턴 정합: 한국어 제목 우선 · sans bold + tight tracking · ornament 안 minimal.

import { OrnamentalDivider } from "./OrnamentalDivider";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  showDivider = true,
  level = 2,
}: {
  eyebrow?: string;
  title: string;
  description?: string | React.ReactNode;
  align?: "center" | "left";
  showDivider?: boolean;
  level?: 2 | 3;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";
  const titleClass = level === 2
    ? "text-section-title font-serif-heading text-ink-strong"
    : "font-serif-heading text-2xl text-ink-strong";

  return (
    <div className={`flex flex-col gap-5 ${alignClass}`}>
      {eyebrow ? <span className="text-eyebrow">{eyebrow}</span> : null}
      <Tag className={titleClass}>{title}</Tag>
      {showDivider && (
        <div className={align === "center" ? "flex justify-center" : "flex justify-start"}>
          <OrnamentalDivider />
        </div>
      )}
      {description ? (
        <p className="max-w-prose whitespace-pre-line text-base leading-relaxed text-fg-muted md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
