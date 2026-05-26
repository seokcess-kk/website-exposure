// @glitzy/web/(admin)/[instanceSlug]/doctors/[slug] — 의료진 편집
// cycle2-3entity WEB-23: requirePageContext 통일
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { DoctorProfileForm, type DoctorProfileInitial } from "@/components/forms/DoctorProfileForm";
import { DeleteForm } from "@/components/forms/DeleteForm";
import { PublicSiteLink } from "@/components/admin/PublicSiteLink";
import { saveDoctorProfile, deleteDoctorProfile } from "../actions";

export default async function DoctorEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }

  // cycle5-3entity WEB-51: withSkeletonTx 의 TenantResolveError catch
  let initial: DoctorProfileInitial | null;
  try {
    initial = await withSkeletonTx(
    { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
    async (tx, ctx): Promise<DoctorProfileInitial | null> => {
      assertActionEligibility(ctx, "operator-edit-content");
      const rows = await tx<{
        slug: string;
        name: string;
        title: string | null;
        job_title: string | null;
        honorific: string | null;
        bio: string | null;
        photo_url: string | null;
        cv_photo_url: string | null;
        display_order: number;
        active: boolean;
        metadata: unknown;
      }[]>`
        SELECT slug, name, title, job_title, honorific, bio, photo_url, cv_photo_url, display_order, active, metadata
          FROM doctor_profile
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.slug}
         LIMIT 1
      `;
      const r = rows[0];
      if (!r) return null;
      const { parseDoctorMetadataForForm } = await import("@/lib/doctor-metadata");
      const meta = parseDoctorMetadataForForm(r.metadata);
      return {
        slug: r.slug,
        name: r.name,
        title: r.title ?? "",
        jobTitle: r.job_title ?? "",
        honorific: r.honorific ?? "",
        bio: r.bio ?? "",
        photoUrl: r.photo_url ?? "",
        cvPhotoUrl: r.cv_photo_url ?? "",
        displayOrder: String(r.display_order),
        active: r.active,
        credentials: meta.credentials,
        medicalSpecialties: meta.medicalSpecialties.join(", "),
      };
    },
  );
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }
  if (initial === null) notFound();

  const boundSave = saveDoctorProfile.bind(null, params.instanceSlug, params.slug);
  const boundDelete = deleteDoctorProfile.bind(null, params.instanceSlug, params.slug);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">의료진 편집 · {initial.name}</h1>
        <Link href={`/admin/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">
          ← 목록
        </Link>
      </header>

      <PublicSiteLink
        instanceSlug={params.instanceSlug}
        visible={initial.active}
        publicPath={`/doctors/${initial.slug}`}
        hiddenReason="활성 (active=true) 상태가 아닙니다"
      />

      <DoctorProfileForm action={boundSave} initial={initial} isNew={false} instanceSlug={params.instanceSlug} />

      <DeleteForm action={boundDelete} confirmMessage="정말 이 의료진을 삭제하시겠습니까?" />
    </main>
  );
}
