// @glitzy/web/components/site/TrackedPhoneLink — server component 안 tel: link 안 beacon 발사 wrapper.
// MEANINGFUL_TRAFFIC_LOOP v1.0 § 6.2.

"use client";

import type { ReactNode } from "react";
import { trackEvent, type TrackableCtaId } from "@/lib/site-tracking/beacon";

export function TrackedPhoneLink({
  href,
  ctaId,
  className,
  children,
}: {
  href: string;
  ctaId: TrackableCtaId;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackEvent("phone_click", { cta_id: ctaId })}
    >
      {children}
    </a>
  );
}
