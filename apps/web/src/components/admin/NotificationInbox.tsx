// @glitzy/web/components/admin/NotificationInbox — ADMIN_UX_REDESIGN v1.0 § 8
// 대시보드 안 알림함 — notification_outbox 안 envelope 표시.
// notification_outbox table 미적용 시 (NF-DEFER-04) safe fallback 안 빈 list.

import Link from "next/link";
import type postgres from "postgres";

export type NotificationEnvelope = {
  id: string;
  eventType: string;
  recipientUserId: string | null;
  payload: unknown;
  status: "pending" | "delivered" | "failed";
  createdAt: Date;
};

/**
 * loadNotifications — notification_outbox 안 SELECT (table 미적용 시 빈 list).
 *   instance_id scope 안 filter + admin user_id 안 fan-out 안 recipient match.
 */
export async function loadNotifications(
  tx: postgres.TransactionSql,
  instanceId: string,
  adminUserId: string,
  limit = 20,
): Promise<NotificationEnvelope[]> {
  // to_regclass — table 미존재 시 NULL 반환 (안전 · postgres-js tx abort 회피)
  const check = await tx<{ exists: string | null }[]>`
    SELECT to_regclass('public.notification_outbox')::text AS exists
  `;
  if (!check[0]?.exists) {
    // notification_outbox 마이그레이션 미적용 (UX-DEFER-21 · NF-DEFER-04) — 빈 list 반환
    return [];
  }

  const rows = await tx<Array<{
    id: string;
    event_type: string;
    recipient_user_id: string | null;
    payload: unknown;
    status: string;
    created_at: Date;
  }>>`
    SELECT id, event_type, recipient_user_id, payload, status::text AS status, created_at
      FROM notification_outbox
     WHERE instance_id = ${instanceId}::uuid
       AND (recipient_user_id = ${adminUserId}::uuid OR recipient_user_id IS NULL)
     ORDER BY created_at DESC
     LIMIT ${limit}
  `;
  return rows.map((r) => ({
    id: r.id,
    eventType: r.event_type,
    recipientUserId: r.recipient_user_id,
    payload: r.payload,
    status: r.status as "pending" | "delivered" | "failed",
    createdAt: r.created_at,
  }));
}

const EVENT_TYPE_LABEL: Record<string, string> = {
  "content-gate-queued": "콘텐츠 검수 큐 진입",
  "reviewer-approved": "검수 승인 완료",
  "reviewer-rejected": "검수 거부",
  "publish": "발행 완료",
  "instance.release-requested": "출시 검수 요청",
};

export function NotificationInbox({
  notifications,
  instanceSlug,
}: {
  notifications: NotificationEnvelope[];
  instanceSlug: string;
}) {
  if (notifications.length === 0) {
    return (
      <section className="rounded-md border border-border bg-elevated p-5">
        <h2 className="mb-2 text-base font-semibold text-fg-default">🔔 알림함</h2>
        <p className="text-sm text-fg-muted">아직 알림이 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 rounded-md border border-border bg-elevated p-5">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-fg-default">🔔 알림함</h2>
        <Link
          href={`/admin/${instanceSlug}/notifications`}
          className="text-xs text-brand-primary hover:underline"
        >
          전체 보기 ({notifications.length}건)
        </Link>
      </header>
      <ul className="flex flex-col gap-1">
        {notifications.slice(0, 5).map((n) => (
          <li
            key={n.id}
            className={`flex items-center justify-between rounded-md border border-border bg-canvas px-3 py-2 text-sm ${
              n.status === "failed" ? "border-error" : ""
            }`}
          >
            <div className="flex-1">
              <div className="text-fg-default">{EVENT_TYPE_LABEL[n.eventType] ?? n.eventType}</div>
              <div className="text-xs text-fg-muted">
                {n.createdAt.toLocaleString("ko-KR")}
                {n.status === "failed" && <span className="ml-2 text-error">실패</span>}
              </div>
            </div>
            <StatusDot status={n.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatusDot({ status }: { status: NotificationEnvelope["status"] }) {
  const colorClass =
    status === "delivered" ? "bg-success"
    : status === "failed" ? "bg-error"
    : "bg-warning";
  return <span className={`inline-block h-2 w-2 rounded-full ${colorClass}`} aria-label={status} />;
}
