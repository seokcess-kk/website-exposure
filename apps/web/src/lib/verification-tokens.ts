// @glitzy/web/lib/verification-tokens — 검색엔진 소유확인 토큰 (프로토콜상 공개 값)
//
// GSC URL-prefix property: daeatdiet-incheon.onwell.site 재등록 예정 (구 커스텀 도메인 폐기).
// root layout 과 (site) layout 양쪽에서 출력해야 함 — (site) layout 의 generateMetadata 가
// verification 필드를 통째로 교체(Next metadata shallow merge)하므로 root 에만 두면
// 네이버 DB 토큰이 있는 인스턴스의 커스텀 도메인 페이지에서 사라진다.
// 멀티테넌트 확장 시 clinic_profile 컬럼(C0051 naver_site_verification 패턴)으로 이관 검토.
export const GOOGLE_SITE_VERIFICATION = "48B-wBOtuZhe2mNjUcWBAMj3JLHtlAeZSaSvuLFITvg";
