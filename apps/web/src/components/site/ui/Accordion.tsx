// @glitzy/web/components/site/ui/Accordion — Radix Accordion wrapper (shadcn 등가 · 단아 brand 정합)
// SoT: 사용자 요청 (2026-05-20) — FAQ Accordion 패턴.

"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-dotted border-border last:border-b-0", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 cursor-pointer items-center justify-between gap-4 py-5 text-left text-base font-medium text-ink-strong transition-all duration-500 ease-supanova hover:text-brand-primary [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <svg
        className="h-5 w-5 shrink-0 text-fg-muted transition-transform duration-500 ease-supanova"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    // forceMount (FAQ SSR 텍스트 노출) 정합 — Radix height var 는 forceMount 에서 설정되지 않아
    // keyframe 애니메이션이 불가하므로 CSS grid-rows 전환으로 expand/collapse 를 구현한다.
    // 닫힘 상태: 0fr + invisible (시각·접근성 트리 제외) — 텍스트는 DOM 에 남아 크롤러가 읽는다.
    className="grid text-sm text-fg-muted transition-[grid-template-rows,visibility] duration-500 ease-supanova data-[state=closed]:invisible data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
    {...props}
  >
    <div className="min-h-0 overflow-hidden">
      <div className={cn("pb-5 pt-0", className)}>{children}</div>
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
