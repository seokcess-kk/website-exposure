-- @glitzy/web/scripts/delete-seed-doctors — demo instance 의 seed dummy 의료진 3명 완전 제거
-- 대상: shin-suyong (신수용) · kim-yejin (김예진) · park-junho (박준호)
-- 사용자 검수 2026-05-20 — placehold.co dummy 사진이 어드민에서 본인 의료진과 함께 노출되어 정리
--
-- FK 처리 순서 (ON DELETE NO ACTION 정합):
--   1. article·publication·media_appearance·faq 의 author_doctor_id 를 NULL 로 update
--   2. doctor_profile DELETE
--
-- 실행:
--   docker cp apps/web/scripts/delete-seed-doctors.sql spike-e-postgres:/tmp/delete-doctors.sql
--   docker exec -i spike-e-postgres psql -U postgres -d spike_e -f /tmp/delete-doctors.sql
--
-- 결과 확인:
--   docker exec -i spike-e-postgres psql -U postgres -d spike_e -c "SELECT slug, name, active FROM doctor_profile WHERE instance_id = (SELECT id FROM instance WHERE slug='demo') ORDER BY display_order;"

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_id UUID;
  v_deleted_count INTEGER;
  v_updated_article INTEGER;
  v_updated_publication INTEGER;
  v_updated_media INTEGER;
  v_updated_faq INTEGER;
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo';
  IF v_instance_id IS NULL THEN
    RAISE EXCEPTION 'demo instance 를 찾을 수 없습니다.';
  END IF;

  -- (1) article author_doctor_id 안 NULL update
  UPDATE article SET author_doctor_id = NULL
   WHERE instance_id = v_instance_id
     AND author_doctor_id IN (
       SELECT id FROM doctor_profile
        WHERE instance_id = v_instance_id
          AND slug IN ('shin-suyong', 'kim-yejin', 'park-junho')
     );
  GET DIAGNOSTICS v_updated_article = ROW_COUNT;

  -- (2) publication author_doctor_id 안 NULL update
  UPDATE publication SET author_doctor_id = NULL
   WHERE instance_id = v_instance_id
     AND author_doctor_id IN (
       SELECT id FROM doctor_profile
        WHERE instance_id = v_instance_id
          AND slug IN ('shin-suyong', 'kim-yejin', 'park-junho')
     );
  GET DIAGNOSTICS v_updated_publication = ROW_COUNT;

  -- (3) media_appearance author_doctor_id 안 NULL update
  UPDATE media_appearance SET author_doctor_id = NULL
   WHERE instance_id = v_instance_id
     AND author_doctor_id IN (
       SELECT id FROM doctor_profile
        WHERE instance_id = v_instance_id
          AND slug IN ('shin-suyong', 'kim-yejin', 'park-junho')
     );
  GET DIAGNOSTICS v_updated_media = ROW_COUNT;

  -- (4) faq author_doctor_id 안 NULL update
  UPDATE faq SET author_doctor_id = NULL
   WHERE instance_id = v_instance_id
     AND author_doctor_id IN (
       SELECT id FROM doctor_profile
        WHERE instance_id = v_instance_id
          AND slug IN ('shin-suyong', 'kim-yejin', 'park-junho')
     );
  GET DIAGNOSTICS v_updated_faq = ROW_COUNT;

  -- (5) doctor_profile DELETE
  DELETE FROM doctor_profile
   WHERE instance_id = v_instance_id
     AND slug IN ('shin-suyong', 'kim-yejin', 'park-junho');
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RAISE NOTICE 'doctor_profile 삭제: % 명', v_deleted_count;
  RAISE NOTICE 'article author NULL: % 건', v_updated_article;
  RAISE NOTICE 'publication author NULL: % 건', v_updated_publication;
  RAISE NOTICE 'media_appearance author NULL: % 건', v_updated_media;
  RAISE NOTICE 'faq author NULL: % 건', v_updated_faq;
END $$;
