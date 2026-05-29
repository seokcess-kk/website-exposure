// @glitzy/web/components/admin/SuperAdminToolsCard — ADMIN_PERMISSION_SEPARATION v1 § 5
// super-admin 만 노출되는 dashboard 안 widget. operator 는 본 컴포넌트 자체 미렌더 (page level 분기).

import Link from "next/link";

export function SuperAdminToolsCard({ instanceSlug }: { instanceSlug: string }) {
  return (
    <section className="rounded-md border border-violet-300 bg-violet-50 p-4">
      <header className="mb-2 flex items-center gap-2">
        <span aria-hidden className="text-base">🛡️</span>
        <h2 className="text-sm font-semibold text-fg-default">운영자 도구 (super-admin)</h2>
      </header>
      <p className="mb-3 text-xs text-fg-muted">
        클라이언트(웹사이트 관리자) 에게는 보이지 않는 시스템 관리 작업입니다.
      </p>
      <ul className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <ToolLink
          href="/admin/super/instances"
          title="사이트 관리"
          description="전체 instance 생성·활성/비활성"
        />
        <ToolLink
          href="/admin/super/users"
          title="사용자 관리"
          description="계정 초대·멤버십·권한 부여"
        />
        <ToolLink
          href="/admin"
          title="운영 현황"
          description="관리 중인 전체 instance KPI 보기"
        />
        <ToolLink
          href={`/admin/${instanceSlug}/visibility-metrics`}
          title="검색 노출 property 등록"
          description="GSC · 네이버 서치어드바이저 site verification"
        />
      </ul>
    </section>
  );
}

function ToolLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex flex-col gap-0.5 rounded-md border border-violet-200 bg-white p-3 text-sm transition hover:border-violet-400 hover:bg-violet-50"
      >
        <span className="font-medium text-fg-default">{title}</span>
        <span className="text-xs text-fg-muted">{description}</span>
      </Link>
    </li>
  );
}
