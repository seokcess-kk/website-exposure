// @glitzy/web/components/site/ConsultCompleteTracker — thank-you 페이지 안 1회 발사
// MEANINGFUL_TRAFFIC_LOOP v1.0 § 6.2.
// consult_form_complete = 실 INSERT 성공 후 redirect 도달 시점. server action 안 client beacon 직접 호출 불가 →
// thank-you 페이지 mount 시 useEffect 안 발사.

"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/site-tracking/beacon";

export function ConsultCompleteTracker() {
  useEffect(() => {
    trackEvent("consult_form_complete", { cta_id: "consult-form-default" });
    // 의존 X — mount 시 한 번만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
