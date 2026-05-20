// @glitzy/web/(admin)/[instanceSlug]/clinic-profile — LOCATION_LEGAL_PLAN v1.0 (M0 v0.5)
// 3계약 동시 출력 (ClinicProfile + LocationProfile(main) + LegalDocument × 5)

import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import {
  ClinicProfileForm,
  emptyInitial,
  type ClinicProfileInitial,
} from "@/components/forms/ClinicProfileForm";
import {
  convertFromOpeningHoursSpec,
  type CT02BusinessHours,
  type PrimaryCtaInput,
} from "@/lib/clinic-profile-schema";

import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
import { PublicSiteLink } from "@/components/admin/PublicSiteLink";
import { saveClinicProfile } from "./actions";

type ClinicRow = {
  name: string;
  description: string;
  logo_url: string;
  og_image_url: string;
  business_registration_number: string | null;
  alternate_name: string | null;
  legal_entity_name: string | null;
  slogan: string | null;
  long_description: string | null;
  founding_date: string | null;
  founder: string | null;
  policy_contact_person: string | null;
  policy_contact_email: string | null;
  policy_contact_phone: string | null;
  policy_effective_date: string | null;
  primary_ctas: unknown;
  metadata: unknown;
};

type LocationRow = {
  street_address: string;
  address_locality: string;
  address_region: string;
  postal_code: string;
  address_country: string;
  phone: string | null;
  email: string | null;
  metadata: unknown;
};

// LL-WORKFLOW-INTEGRATION — 5 LegalDocument workflow state 표시 + 액션 버튼 + effective_date
// 사용자 검수 2026-05-20 — legalRows + legalWorkflowRows 두 SELECT 를 단일 SELECT 로 통합 (1 RTT 절약)
type LegalCombinedRow = { document_type: string; slug: string; status: string; effective_date: string };

function pickString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function parsePrimaryCtas(raw: unknown): PrimaryCtaInput[] {
  if (!Array.isArray(raw)) return [];
  const out: PrimaryCtaInput[] = [];
  for (const elem of raw) {
    if (typeof elem !== "object" || elem === null) continue;
    const e = elem as Record<string, unknown>;
    const id = pickString(e.id);
    const type = pickString(e.type);
    const label = pickString(e.label);
    const targetUrl = pickString(e.targetUrl);
    if (!id || !type || !label || !targetUrl) continue;
    if (type !== "phone" && type !== "kakao-talk" && type !== "naver-reservation") continue;
    out.push({ id, type, label, targetUrl });
  }
  return out;
}

function parseBusinessHoursMetadata(raw: unknown): CT02BusinessHours | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const bh = r.businessHours;
  if (typeof bh !== "object" || bh === null) return null;
  const b = bh as Record<string, unknown>;
  const openingHours = Array.isArray(b.openingHours) ? b.openingHours : [];
  const receptionHours = Array.isArray(b.receptionHours) ? b.receptionHours : [];
  const lunchBreaks = Array.isArray(b.lunchBreaks) ? b.lunchBreaks : [];
  const specialClosures = Array.isArray(b.specialClosures) ? b.specialClosures : [];
  return {
    openingHours: openingHours.filter((x): x is { dayOfWeek: string[]; opens: string; closes: string } => {
      if (typeof x !== "object" || x === null) return false;
      const o = x as Record<string, unknown>;
      return Array.isArray(o.dayOfWeek) && typeof o.opens === "string" && typeof o.closes === "string";
    }),
    receptionHours: receptionHours.filter((x): x is { dayOfWeek: string[]; opens: string; closes: string } => {
      if (typeof x !== "object" || x === null) return false;
      const o = x as Record<string, unknown>;
      return Array.isArray(o.dayOfWeek) && typeof o.opens === "string" && typeof o.closes === "string";
    }),
    lunchBreaks: lunchBreaks.filter((x): x is { dayOfWeek: string[]; from: string; to: string } => {
      if (typeof x !== "object" || x === null) return false;
      const o = x as Record<string, unknown>;
      return Array.isArray(o.dayOfWeek) && typeof o.from === "string" && typeof o.to === "string";
    }),
    specialClosures: specialClosures.filter((x): x is { date: string; reason?: string } => {
      if (typeof x !== "object" || x === null) return false;
      const o = x as Record<string, unknown>;
      return typeof o.date === "string";
    }),
  };
}

function parseFeaturedChannelId(raw: unknown): string {
  if (typeof raw !== "object" || raw === null) return "";
  const r = raw as Record<string, unknown>;
  const fc = r.featuredChannelId;
  return typeof fc === "string" ? fc : "";
}

/**
 * LLC-12 patch (cycle 1 code review):
 *   plan § 7 시나리오 15 의 "403" 은 다음 두 가지로 보장한다:
 *     1) 운영자에게 명확한 "접근 거부" UI 렌더 (본 컴포넌트 · role="main" · aria-labelledby)
 *     2) tenant resolver 단의 RLS app.current_instance_id 미설정 시 0 row 응답 → notFound() (404)
 *   Next.js 14 의 server component 는 직접 HTTP status code 를 설정할 수 없어 정확한 403 status 는
 *   Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21).
 *   감사 로그 emit 은 본 단계에서 미수행 — `assertActionEligibility` 가 throw 하기 전에 진입했으므로
 *   eligibility 단계 audit cascade marker 는 REVIEW_WORKFLOW v1.1 cascade (LL-CASCADE-06 후보).
 */
function ForbiddenAccessPage({ message }: { message: string }) {
  return (
    <main role="main" aria-labelledby="forbidden-title" className="flex flex-col gap-4 p-6">
      <h1 id="forbidden-title" className="text-2xl font-semibold">접근 거부</h1>
      <p className="text-sm text-slate-700">{message}</p>
    </main>
  );
}

export default async function ClinicProfilePage({
  params,
}: {
  params: { instanceSlug: string };
}) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "forbidden" || a.kind === "info") {
        return <ForbiddenAccessPage message={a.message} />;
      }
    }
    throw err;
  }

  type LegalWorkflowItem = { documentType: string; slug: string; status: string };
  let initial: ClinicProfileInitial | null = null;
  let legalWorkflow: LegalWorkflowItem[] = [];
  try {
    const result = await withSkeletonTx({ signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId }, async (tx, ctx): Promise<{ initial: ClinicProfileInitial | null; legalWorkflow: LegalWorkflowItem[] }> => {
      assertActionEligibility(ctx, "operator-edit-content");

      // 병렬화 (사용자 검수 2026-05-20) — 3 query Promise.all
      //   기존: 4 query 직렬 (clinic → location → legal × 2) ≈ 4 RTT
      //   변경: clinic + location + legal-combined 3 query 병렬 ≈ 1 RTT (pipelined)
      //   legal 두 SELECT 는 단일 SELECT 로 통합 (column 만 다름)
      const [clinicRows, locationRows, legalCombinedRows] = await Promise.all([
        tx<ClinicRow[]>`
          SELECT name, description, logo_url, og_image_url,
                 business_registration_number, alternate_name, legal_entity_name,
                 slogan, long_description,
                 to_char(founding_date, 'YYYY-MM-DD') AS founding_date,
                 founder,
                 policy_contact_person, policy_contact_email, policy_contact_phone,
                 to_char(policy_effective_date, 'YYYY-MM-DD') AS policy_effective_date,
                 primary_ctas, metadata
            FROM clinic_profile
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
           LIMIT 1
        `,
        tx<LocationRow[]>`
          SELECT street_address, address_locality, address_region, postal_code, address_country,
                 phone, email, metadata
            FROM location_profile
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
           LIMIT 1
        `,
        tx<LegalCombinedRow[]>`
          SELECT document_type::text AS document_type, slug, status::text AS status,
                 to_char(effective_date, 'YYYY-MM-DD') AS effective_date
            FROM legal_document
           WHERE instance_id = ${ctx.instanceId}::uuid
             AND document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
        `,
      ]);

      const clinic = clinicRows[0];
      if (!clinic) return { initial: null, legalWorkflow: [] };

      const location = locationRows[0] ?? null;
      const legalRows = legalCombinedRows;
      const legalWorkflowRows = legalCombinedRows;

      const overrides: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", string> = {
        privacy: "",
        terms: "",
        "non-covered": "",
        refund: "",
        complaint: "",
      };
      const fallback = clinic.policy_effective_date ?? "";
      for (const row of legalRows) {
        const t = row.document_type as keyof typeof overrides;
        if (overrides[t] !== undefined && row.effective_date !== fallback) {
          overrides[t] = row.effective_date;
        }
      }

      const businessHoursSpec = location ? parseBusinessHoursMetadata(location.metadata) : null;
      const primaryCtas = parsePrimaryCtas(clinic.primary_ctas);
      const featuredChannelId = location ? parseFeaturedChannelId(location.metadata) : "";

      const initialBuilt: ClinicProfileInitial = {
        ...emptyInitial,
        name: clinic.name,
        description: clinic.description,
        logoUrl: clinic.logo_url,
        ogImageUrl: clinic.og_image_url,
        businessRegistrationNumber: clinic.business_registration_number ?? "",
        alternateName: clinic.alternate_name ?? "",
        legalEntityName: clinic.legal_entity_name ?? "",
        slogan: clinic.slogan ?? "",
        longDescription: clinic.long_description ?? "",
        foundingDate: clinic.founding_date ?? "",
        founder: clinic.founder ?? "",
        metadataJson: (typeof clinic.metadata === "object" && clinic.metadata !== null && Object.keys(clinic.metadata).length > 0)
          ? JSON.stringify(clinic.metadata, null, 2)
          : "",
        streetAddress: location?.street_address ?? "",
        addressLocality: location?.address_locality ?? "",
        addressRegion: location?.address_region ?? "",
        postalCode: location?.postal_code ?? "",
        addressCountry: location?.address_country ?? "KR",
        locationTelephone: location?.phone ?? "",
        locationEmail: location?.email ?? "",
        businessHours: convertFromOpeningHoursSpec(businessHoursSpec),
        primaryCtas,
        featuredChannelId,
        policyContactPerson: clinic.policy_contact_person ?? "",
        policyContactEmail: clinic.policy_contact_email ?? "",
        policyContactPhone: clinic.policy_contact_phone ?? "",
        policyEffectiveDate: clinic.policy_effective_date ?? "",
        legalDocEffectiveOverrides: overrides,
      };

      return {
        initial: initialBuilt,
        legalWorkflow: legalWorkflowRows.map((r) => ({
          documentType: r.document_type,
          slug: r.slug,
          status: r.status,
        })),
      };
    });
    initial = result.initial;
    legalWorkflow = result.legalWorkflow;
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") {
        return <ForbiddenAccessPage message={action.message} />;
      }
    }
    throw err;
  }

  const boundSave = saveClinicProfile.bind(null, params.instanceSlug);

  // LL-WORKFLOW-INTEGRATION: 5 LegalDocument document_type 별 label
  const DOC_TYPE_LABEL: Record<string, string> = {
    privacy: "개인정보처리방침",
    terms: "이용약관",
    "non-covered": "비급여 진료 안내",
    refund: "환불 정책",
    complaint: "고충처리 방침",
  };
  const orderedTypes = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;
  const workflowByType = new Map(legalWorkflow.map((w) => [w.documentType, w]));

  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">사이트 기본 정보</h1>
      <p className="text-sm text-slate-500">
        한 화면에서 3계약(ClinicProfile + LocationProfile main + 5종 LegalDocument)을 동시 저장합니다. 5종 정책 문서 본문은 변수 치환으로 자동 생성됩니다.
      </p>
      <ClinicProfileForm action={boundSave} initial={initial} instanceSlug={params.instanceSlug} />

      {/* LWI-03 + LWI2-01 정정: section 항상 표시 — 0건 누락 시도 운영자 감지 가능 */}
      <section className="rounded-md border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-base font-medium">5종 정책 문서 검수·발행 (LL-WORKFLOW-INTEGRATION)</h2>
          <p className="mb-3 text-xs text-slate-500">
            본문 저장은 위 form 에서 자동 처리됩니다. 발행 게이트는 ComplianceRecord legalCounsel 필수 (LL-DEFER-01 부분 해소).
            검수 큐 진입 후 (draft/rejected 외 상태) 의 LegalDocument 는 본문 변경 차단 (LWI-01 정정 — 본문 drift 방지).
          </p>
          {/* LWI-03 정정: 5개 invariant 검증 — 누락 시 경고 */}
          {legalWorkflow.length !== 5 && (
            <div className="mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              ⚠ 5종 정책 문서 중 {legalWorkflow.length}건만 발견되었습니다. ClinicProfile 저장 시 누락된 row 가 자동 INSERT 됩니다 (재진입 후 확인).
            </div>
          )}
          <div className="flex flex-col gap-4">
            {orderedTypes.map((docType) => {
              const w = workflowByType.get(docType);
              if (!w) {
                return (
                  <div key={docType} className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                    {DOC_TYPE_LABEL[docType]} · 누락 (ClinicProfile 저장 시 자동 INSERT)
                  </div>
                );
              }
              return (
                <div key={docType} className="flex flex-col gap-2">
                  <div className="mb-1 text-sm font-medium text-fg-default">
                    {DOC_TYPE_LABEL[docType]} <span className="text-xs text-slate-500">· slug: {w.slug} · status: {w.status}</span>
                  </div>
                  <WorkflowActionButtons
                    instanceSlug={params.instanceSlug}
                    contentType="LegalDocument"
                    contentRef={w.slug}
                    currentStatus={w.status}
                  />
                  <PublicSiteLink
                    instanceSlug={params.instanceSlug}
                    visible={w.status === "published"}
                    publicPath={`/legal/${docType}`}
                    hiddenReason={`현재 status='${w.status}' — published 상태가 아닙니다`}
                  />
                </div>
              );
            })}
          </div>
      </section>
    </main>
  );
}
