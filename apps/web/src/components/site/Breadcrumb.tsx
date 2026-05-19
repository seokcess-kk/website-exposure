// @glitzy/web/components/site/Breadcrumb — visible breadcrumb (UI)
// SCHEMA_MAPPING § 2.4 BreadcrumbList JSON-LD 는 별도 (Phase C json-ld generator)

import Link from "next/link";

export type BreadcrumbItem = { label: string; href: string | null };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb" className="mx-auto max-w-6xl px-4 py-3 text-xs text-fg-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {item.href ? (
              <Link href={item.href} className="hover:text-fg-default">{item.label}</Link>
            ) : (
              <span aria-current="page" className="text-fg-default">{item.label}</span>
            )}
            {i < items.length - 1 ? <span aria-hidden="true" className="text-fg-disabled">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
