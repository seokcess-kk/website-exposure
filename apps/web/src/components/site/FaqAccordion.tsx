// @glitzy/web/components/site/FaqAccordion — FAQ Accordion wrapper (client)
// SoT: 사용자 요청 (2026-05-20) — shadcn Accordion 패턴 정합.

"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/site/ui";

export type FaqAccordionItem = {
  id: string;
  question: string;
  answerHtml: string;
};

export function FaqAccordion({ items }: { items: FaqAccordionItem[] }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full rounded-3xl border border-transparent bg-elevated px-6 py-3 shadow-supanova ring-1 ring-ink-strong/5 md:px-8"
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>
            <span className="flex items-start gap-3">
              <span className="font-serif-heading text-lg text-brand-accent">Q.</span>
              <span>{item.question}</span>
            </span>
          </AccordionTrigger>
          {/* forceMount — 닫힌 답변도 SSR HTML 에 포함 (검색엔진이 Q&A 텍스트를 읽도록 · 시각 숨김은 data-state CSS) */}
          <AccordionContent forceMount>
            <div className="flex items-start gap-3">
              <span className="font-serif-heading text-lg text-brand-primary">A.</span>
              <div
                className="prose-site flex-1 max-w-none text-base leading-relaxed text-fg-default"
                dangerouslySetInnerHTML={{ __html: item.answerHtml }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
