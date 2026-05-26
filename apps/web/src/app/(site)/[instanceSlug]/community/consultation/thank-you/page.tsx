// @glitzy/web/(site)/[instanceSlug]/community/consultation/thank-you — 상담 접수 완료

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { loadSiteInitial } from "@/lib/site-initial";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { ConsultCompleteTracker } from "@/components/site/ConsultCompleteTracker";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: false },
    title: "상담 접수 완료",
  };
}

export default async function ConsultationThankYouPage({ params }: { params: { instanceSlug: string } }) {
  const initial = await loadSiteInitial(params.instanceSlug);
  if (!initial) notFound();
  const base = `/${params.instanceSlug}`;

  return (
    <>
      <ConsultCompleteTracker />
      <Breadcrumb items={[
        { label: "홈", href: base },
        { label: "소통 공간", href: `${base}/community` },
        { label: "1:1 비밀 상담소", href: `${base}/community/consultation` },
        { label: "접수 완료", href: null },
      ]} />
      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mb-4 text-6xl">✅</div>
        <h1 className="mb-4 text-3xl font-bold text-fg-default">상담 접수가 완료되었습니다</h1>
        <p className="mb-2 text-sm text-fg-muted">
          {initial.clinic.name} 의료진이 확인 후 빠르게 연락드리겠습니다.
        </p>
        <p className="mb-8 text-xs text-fg-muted">
          일반 영업일 기준 1~2일 안 답변드립니다. 비공개로 처리되며 제3자에게 공유되지 않습니다.
        </p>
        <Link
          href={base}
          className="inline-block rounded-md bg-brand-primary px-5 py-2 text-sm font-semibold text-fg-inverse hover:bg-brand-primary-hover"
        >
          홈으로 돌아가기
        </Link>
      </section>
    </>
  );
}
