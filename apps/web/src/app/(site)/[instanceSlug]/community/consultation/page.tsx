// @glitzy/web/(site)/[instanceSlug]/community/consultation — 1:1 비밀 상담소 form (단아 v1.0)

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadSiteInitial } from "@/lib/site-initial";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { ConsultationForm } from "@/components/site/ConsultationForm";
import { SectionHeading, Card } from "@/components/site/ui";
import { sitePathPrefix } from "@/lib/custom-domains";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "1:1 비밀 상담소",
    description: `${initial.clinic.name} 의료진 비공개 상담 신청`,
    canonicalPath: "/community/consultation",
  });
}

export default async function ConsultationPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const base = sitePathPrefix(params.instanceSlug);

  return (
    <>
      <Breadcrumb items={[
        { label: "홈", href: base || "/" },
        { label: "소통 공간", href: `${base}/community` },
        { label: "1:1 비밀 상담소", href: null },
      ]} />
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-2xl px-6">
          <SectionHeading
            eyebrow="🔒 PRIVATE"
            title="1:1 비밀 상담소"
            description="민감한 증상이나 진료 가능 여부, 비용 문의를 의료진에게 비공개로 직접 전달합니다. 본 상담 내용은 공개되지 않으며, 진료 외 용도로 사용되지 않습니다."
          />

          <div className="mt-12 rounded-2xl border-l-4 border-brand-accent bg-brand-accent-soft/30 p-4 text-xs text-ink-strong">
            ℹ 본 상담 창구는 진료 예약을 대체하지 않습니다. 응급 상황 시 119 또는 가까운 응급실로 즉시 연락 주십시오.
          </div>

          <Card padding="lg" className="mt-6">
            <ConsultationForm instanceSlug={params.instanceSlug} />
          </Card>
        </div>
      </section>
    </>
  );
}
