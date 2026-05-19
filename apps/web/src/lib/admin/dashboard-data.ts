// @glitzy/web/lib/admin/dashboard-data — ADMIN_UX_REDESIGN v1.0 § 4.2
// 대시보드 단일 load helper — readiness + quality-score + clinic 한 tx 안 통합.

import type postgres from "postgres";
import { loadReleaseReadiness, type ReleaseReadiness } from "./release-readiness";
import { computeQualityScore, type QualityScore } from "./quality-score";
import { loadNotifications, type NotificationEnvelope } from "@/components/admin/NotificationInbox";

export type DashboardData = {
  readiness: ReleaseReadiness;
  qualityScore: QualityScore;
  clinic: { id: string; name: string; updatedAt: Date } | null;
  warningQueueOpenCount: number;
  publishedEntityCount: number;
  notifications: NotificationEnvelope[];
};

export async function loadDashboardData(
  tx: postgres.TransactionSql,
  instanceId: string,
  instanceSlug: string,
  adminUserId: string,
): Promise<DashboardData> {
  // (1) readiness — InstanceEvalInput 함께 echo
  const readiness = await loadReleaseReadiness(tx, instanceId, instanceSlug);

  // (2) clinic projection (대시보드 header 안 표시)
  const clinicRows = await tx<{ id: string; name: string; updated_at: Date }[]>`
    SELECT id, name, updated_at FROM clinic_profile
     WHERE instance_id = ${instanceId}::uuid AND slug = 'clinic'
     LIMIT 1
  `;
  const clinic = clinicRows[0] ? {
    id: clinicRows[0].id,
    name: clinicRows[0].name,
    updatedAt: clinicRows[0].updated_at,
  } : null;

  // (3) warning queue (manual-review 큐 안 'warning' queue · 'open' status)
  const wqRows = await tx<{ count: string }[]>`
    SELECT count(*)::text AS count FROM review_queue_entry
     WHERE instance_id = ${instanceId}::uuid
       AND status IN ('open','in-progress')
  `;
  const warningQueueOpenCount = Number(wqRows[0]?.count ?? 0);

  // (4) published entity 합산 (sitemap entry 근사)
  const publishedCount = readiness.evalInput.treatments.filter((t) => t.status === "published").length
    + readiness.evalInput.articles.filter((a) => a.status === "published").length
    + readiness.evalInput.faqs.filter((f) => f.status === "published").length
    + readiness.evalInput.publications.filter((p) => p.status === "published").length
    + readiness.evalInput.media.filter((m) => m.status === "published").length;

  // (5) quality-score — readiness.evalInput 재사용
  const qualityScore = computeQualityScore({
    ...readiness.evalInput,
    complianceFindings: [],  // 향후 compliance_record 안 findings JSON SELECT 합류 가능
    sitemapEntryCount: publishedCount,
    warningQueueOpenCount,
  });

  // (6) NotificationInbox envelope (notification_outbox table 미적용 시 빈 list)
  const notifications = await loadNotifications(tx, instanceId, adminUserId, 20);

  return {
    readiness,
    qualityScore,
    clinic,
    warningQueueOpenCount,
    publishedEntityCount: publishedCount,
    notifications,
  };
}
