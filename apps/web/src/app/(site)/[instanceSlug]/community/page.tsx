// @glitzy/web/(site)/[instanceSlug]/community — 소통 공간 landing (단아 v1.0)

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { loadSiteInitial } from "@/lib/site-initial";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { buildPageMetadata } from "@/lib/site-metadata";
import { withPublicTenantTransaction } from "@/lib/public-tenant";
import { SectionHeading, Card, IconBadge } from "@/components/site/ui";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { instanceSlug: string } }): Promise<Metadata> {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) return {};
  return buildPageMetadata(initial.clinic, params.instanceSlug, {
    pageTitle: "소통 공간",
    description: `${initial.clinic.name} 자주 묻는 질문과 1:1 비밀 상담소`,
    canonicalPath: "/community",
  });
}

export default async function CommunityHubPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const counts = await withPublicTenantTransaction(params.instanceSlug, async (tx, ctx) => {
    const rows = await tx<{ faq_count: string }[]>`
      SELECT (SELECT count(*)::text FROM faq
               WHERE instance_id = ${ctx.instanceId}::uuid AND status = 'published') AS faq_count`;
    return { faqCount: Number(rows[0]?.faq_count ?? 0) };
  });
  if (!counts) notFound();
  const base = `/${params.instanceSlug}`;

  return (
    <>
      <Breadcrumb items={[{ label: "홈", href: base }, { label: "소통 공간", href: null }]} />
      <section className="bg-canvas py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading
            eyebrow="COMMUNITY"
            title="소통 공간"
            description="환자가 자주 물어보시는 질문과 비밀 상담 창구입니다. 진료 전 궁금증을 해소하세요."
          />

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card padding="lg">
              <div className="flex items-start gap-4">
                <IconBadge size="lg" variant="accent">💬</IconBadge>
                <div className="flex-1">
                  <h2 className="font-serif-heading text-xl text-ink-strong">자주 묻는 질문</h2>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    환자 분들이 가장 자주 물어보시는 질문 {counts.faqCount}건을 정리했습니다.
                  </p>
                </div>
              </div>
              <Link
                href={`${base}/faq`}
                className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-fg-inverse hover:bg-brand-primary-hover"
              >
                FAQ 모두 보기
              </Link>
            </Card>

            <Card padding="lg" className="bg-gradient-to-br from-brand-primary-soft/70 to-elevated">
              <div className="flex items-start gap-4">
                <IconBadge size="lg" variant="primary">🔒</IconBadge>
                <div className="flex-1">
                  <h2 className="font-serif-heading text-xl text-ink-strong">1:1 비밀 상담소</h2>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    민감한 증상이나 진료 가능 여부, 비용 문의 등을 의료진에게 비공개로 직접 상담을 신청하실 수 있습니다.
                  </p>
                </div>
              </div>
              <Link
                href={`${base}/community/consultation`}
                className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-fg-inverse hover:bg-brand-primary-hover"
              >
                상담 글 작성하기
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
