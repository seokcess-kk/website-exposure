// @glitzy/web/(admin)/[instanceSlug]/treatments/new
// cycle1-3entity WEB-02: page entry 에서 session/slug/tenant/eligibility 모두 검증
import Link from "next/link";
import { TenantResolveError } from "@glitzy/auth";
import { TreatmentPageForm } from "@/components/forms/TreatmentPageForm";
import { requirePageContext } from "@/lib/page-context";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { saveTreatmentPage } from "../actions";

export default async function TreatmentNewPage({ params }: { params: { instanceSlug: string } }) {
  try {
    await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }

  const bound = saveTreatmentPage.bind(null, params.instanceSlug, null);
  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">시술 페이지 추가</h1>
        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <TreatmentPageForm action={bound} initial={null} isNew />
    </main>
  );
}
