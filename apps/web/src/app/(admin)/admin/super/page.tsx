// @glitzy/web/(admin)/admin/super — super-admin hub 진입점. 현재는 instances 로 redirect.
// ADMIN_PERMISSION_SEPARATION v1.1 § 8.1 (super 진입점) · v1.2 에서 users 등 합류 시 hub 화면으로 확장.
// 가드는 부모 super/layout.tsx 가 수행.

import { redirect } from "next/navigation";

export default function SuperAdminHubPage() {
  redirect("/admin/super/instances");
}
