// @glitzy/web/lib/revalidate-site — 공개 사이트 ISR 캐시 on-demand 무효화 (콘텐츠 발행/전이 후 호출)

import { revalidatePath } from "next/cache";

/**
 * 공개 사이트 full-route ISR 캐시를 무효화한다. 콘텐츠 발행 직후 호출.
 *
 * 콘텐츠는 렌더타임 클러스터 교차링크로 서로 참조되므로(예: 새 아티클이 시술 페이지 관련 링크에도 노출),
 * 타입별 경로만 골라 무효화하면 누락된다 → (site) `[instanceSlug]` 레이아웃 하위 전체를 무효화한다.
 *
 * NOTE: 단일 배포에 다수 instance 가 있으면 함께 재생성된다(발행은 사람 손 빈도 · P0 리전 co-location 후
 *   재생성 비용 낮음). 세분화가 필요해지면 콘텐츠 타입별 concrete 경로로 축소 가능.
 */
export function revalidatePublicSite(): void {
  revalidatePath("/[instanceSlug]", "layout");
}
