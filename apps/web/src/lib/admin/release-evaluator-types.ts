// @glitzy/web/lib/admin/release-evaluator-types — ADMIN_UX_REDESIGN v1.0 § 4.3 type stub
// W1 안 컴포넌트 prop type 정의 만. 실 evaluator 구현은 W2.

export type ReleaseBlocker = {
  field: string;
  rule: string;
  message: string;
  source: "ux-schema" | "compliance-publishable" | "instance-lint";
};

export type ReleaseChecklistItem = {
  id: string;
  label: string;
  status: "complete" | "partial" | "missing";
  category: "basic" | "doctors" | "treatments" | "content" | "policy" | "review";
  href: string;
  reason: string | null;
  weight: number;
};

export type InstanceReleaseResult = {
  releasable: boolean;
  blockers: ReleaseBlocker[];
  recommendedItems: ReleaseChecklistItem[];
  lifecycle: "draft" | "ready" | "release-pending" | "published";
  scorePercent: number;
};

export type InstanceLifecycle = InstanceReleaseResult["lifecycle"];
