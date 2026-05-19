-- @glitzy/web/scripts/seed-demo-incheon-doctors — 다이트한의원 인천 부평점 의료진 정합
-- 사용자 요청 (2026-05-20).
-- incheon.daeatdiet.com /theme/daeat/doctor_view_ajax.php?wr_id={2,43,55} 안 가져온 풀 정보 그대로 반영.
--
--   (A) 신수용 (slug='shin-soo-yong', wr_id=2)    — 대표원장. UPDATE.
--                                                    slug='shin-suyong' 으로 기존 row 가 있으면 'shin-soo-yong' 으로 rename.
--   (B) 정우령 (slug='jung-wooryeong', wr_id=43)   — 한방내과 전문의. INSERT.
--   (C) 최준수 (slug='choi-junsu',    wr_id=55)    — 진료원장.        INSERT.
--   (D) 방민우 (slug='kim-yejin')                  — 실제 서울점 병원장이므로 인천 인스턴스에서 제거.
--                                                    FK 참조 (article/faq/publication/media_appearance)
--                                                    는 신수용으로 reassign 후 DELETE.
--   (D2) 박준호 (slug='park-junho')                 — seed-demo-rich 안 fake 데이터. 실제 인천 부평점 진료원장은
--                                                    최준수이므로 박준호 row 제거. FK 참조 reassign 후 DELETE.
--   (E) 신수용 중복 정리 — slug='shin-soo-yong' row 만 살림. 그 외 name='신수용' row 는 모두 삭제 + FK reassign.
--
-- 사진 URL: ajax 응답 안 background-image url() 안에서 추출한 정확한 풀 URL 사용.
-- bio: ArticleBody (markdown) 렌더링 기준. 외부 link 는 plain text 로 표기 (sanitize·allowlist 우회).

\set ON_ERROR_STOP on

DO $$
DECLARE
  v_instance_id UUID;
  v_doc_shin_id UUID;
  v_doc_bang_id UUID;
  v_doc_park_id UUID;
  v_dup_id UUID;
  v_dup_count INT := 0;
  -- ajax 응답 안 background-image url() 안에서 발췌한 풀 URL
  v_photo_shin TEXT := 'https://incheon.daeatdiet.com/data/file/doctor/5eb19f0425a7dad52a35e8d6c5efaa66_qyFo4jLK_b3bad82401430a1312e2ce77b9bc2291db09051e.png';
  v_photo_jung TEXT := 'https://incheon.daeatdiet.com/data/file/doctor/4cf6067abf8245e5ab00ce7c9c709987_ICPcgE3X_c31f778c904a3685b12da1b21a0241583baebbc7.png';
  v_photo_choi TEXT := 'https://incheon.daeatdiet.com/data/file/doctor/1956530d4f3ac97f4dc44a27d3c31bc5_483noKjI_69f6af981db1ae1be1bf7f3401660b0d3cd56641.png';
BEGIN
  SELECT id INTO v_instance_id FROM instance WHERE slug = 'demo' LIMIT 1;
  IF v_instance_id IS NULL THEN
    RAISE EXCEPTION 'seed-demo-incheon-doctors: instance slug=demo 미발견. pnpm web:seed --instance-slug=demo 안 먼저 실행 필요.';
  END IF;

  -- (0) 신수용 row 확보 — slug='shin-soo-yong' 우선, 없으면 'shin-suyong' 을 rename 으로 이관
  SELECT id INTO v_doc_shin_id FROM doctor_profile
   WHERE instance_id = v_instance_id AND slug = 'shin-soo-yong';

  IF v_doc_shin_id IS NULL THEN
    UPDATE doctor_profile
       SET slug = 'shin-soo-yong', updated_at = now()
     WHERE instance_id = v_instance_id AND slug = 'shin-suyong'
    RETURNING id INTO v_doc_shin_id;

    IF v_doc_shin_id IS NULL THEN
      RAISE EXCEPTION 'seed-demo-incheon-doctors: doctor_profile slug=shin-soo-yong 또는 shin-suyong 미발견 — 신수용 row 부재.';
    END IF;
    RAISE NOTICE 'seed-demo-incheon-doctors: 신수용 slug rename shin-suyong → shin-soo-yong (id=%).', v_doc_shin_id;
  END IF;

  SELECT id INTO v_doc_bang_id FROM doctor_profile WHERE instance_id = v_instance_id AND slug = 'kim-yejin';
  SELECT id INTO v_doc_park_id FROM doctor_profile WHERE instance_id = v_instance_id AND slug = 'park-junho';

  -- (1) 신수용 중복 row 제거 — slug='shin-soo-yong' 외 name='신수용' row 모두 삭제 + FK reassign
  FOR v_dup_id IN
    SELECT id FROM doctor_profile
     WHERE instance_id = v_instance_id
       AND name = '신수용'
       AND id <> v_doc_shin_id
  LOOP
    UPDATE article          SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_dup_id;
    UPDATE faq              SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_dup_id;
    UPDATE publication      SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_dup_id;
    UPDATE media_appearance SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_dup_id;

    DELETE FROM doctor_profile WHERE id = v_dup_id;
    v_dup_count := v_dup_count + 1;
    RAISE NOTICE 'seed-demo-incheon-doctors: 신수용 중복 row id=% 삭제, FK reassign to slug=shin-soo-yong.', v_dup_id;
  END LOOP;
  RAISE NOTICE 'seed-demo-incheon-doctors: 신수용 중복 정리 % 건.', v_dup_count;

  -- (2) 방민우(slug=kim-yejin) row 안 FK 참조 reassign — 신수용으로 이관 후 DELETE
  IF v_doc_bang_id IS NOT NULL THEN
    UPDATE article          SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_doc_bang_id;
    UPDATE faq              SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_doc_bang_id;
    UPDATE publication      SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_doc_bang_id;
    UPDATE media_appearance SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_doc_bang_id;

    DELETE FROM doctor_profile WHERE id = v_doc_bang_id;
    RAISE NOTICE 'seed-demo-incheon-doctors: 방민우(slug=kim-yejin) row 삭제 완료. FK reassign to shin-soo-yong.';
  ELSE
    RAISE NOTICE 'seed-demo-incheon-doctors: slug=kim-yejin row 부재 (이미 삭제됨) — skip.';
  END IF;

  -- (2b) 박준호(slug=park-junho) row 안 FK 참조 reassign — 신수용으로 이관 후 DELETE
  --      seed-demo-rich.sql 안 fake 데이터로 들어간 row. 실제 인천 부평점 진료원장은 최준수(아래 INSERT).
  IF v_doc_park_id IS NOT NULL THEN
    UPDATE article          SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_doc_park_id;
    UPDATE faq              SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_doc_park_id;
    UPDATE publication      SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_doc_park_id;
    UPDATE media_appearance SET author_doctor_id = v_doc_shin_id, updated_at = now()
     WHERE instance_id = v_instance_id AND author_doctor_id = v_doc_park_id;

    DELETE FROM doctor_profile WHERE id = v_doc_park_id;
    RAISE NOTICE 'seed-demo-incheon-doctors: 박준호(slug=park-junho) row 삭제 완료. FK reassign to shin-soo-yong.';
  ELSE
    RAISE NOTICE 'seed-demo-incheon-doctors: slug=park-junho row 부재 (이미 삭제됨) — skip.';
  END IF;

  -- (3) 신수용 UPDATE — 인천 부평점 대표원장 (출처 wr_id=2)
  UPDATE doctor_profile SET
    name = '신수용',
    title = '대표원장',
    job_title = '한의사',
    honorific = NULL,
    bio = E'**약력**\n\n- 동국대학교 한의과대학 졸업\n- 前 다이트한의원 본점 수석원장\n\n**학회활동**\n\n- 한방비만학회 회원\n- 한방비만학회 한방비만치료 전문가 과정 수료\n- 일본비만학회 회원\n- 한국임상영양학회 회원\n- 미국영양협회 전문가 회원 (America Nutrition Association Professional Member)\n- 대한한방신경정신과학회 회원\n- 임상약침학회 회원\n- 대한한방내과학회 회원\n- 대한한방안이비인후피부과학회 회원\n- 척추신경추나의학회 회원\n\n**저서**\n\n- 다이어트 이론 — 다이트한의원\n- 젊은 당뇨병이 위험하다 — 다이트한의원',
    photo_url = v_photo_shin,
    display_order = 0,
    active = true,
    updated_at = now()
   WHERE id = v_doc_shin_id;

  -- (4) 정우령 INSERT — 인천 부평점 진료원장/전문의 · 한방내과 전문의 (출처 wr_id=43)
  INSERT INTO doctor_profile
    (instance_id, slug, name, title, job_title, honorific, bio, photo_url, display_order, active)
  VALUES (
    v_instance_id,
    'jung-wooryeong',
    '정우령',
    '진료원장/전문의',
    '한방내과 전문의',
    NULL,
    E'**약력**\n\n- 한방내과 전문의\n- 경희대학교 한의학과 학사 졸업\n- 前 광동한방병원 일반수련의 수료\n- 前 동국대학교 한방병원 전문수련의\n\n**학회활동**\n\n- 대한한방내과학회 정회원',
    v_photo_jung,
    1,
    true
  )
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    job_title = EXCLUDED.job_title,
    honorific = EXCLUDED.honorific,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    display_order = EXCLUDED.display_order,
    active = EXCLUDED.active,
    updated_at = now();

  -- (5) 최준수 INSERT — 인천 부평점 진료원장 (출처 wr_id=55)
  INSERT INTO doctor_profile
    (instance_id, slug, name, title, job_title, honorific, bio, photo_url, display_order, active)
  VALUES (
    v_instance_id,
    'choi-junsu',
    '최준수',
    '진료원장',
    '한의사',
    NULL,
    E'**약력**\n\n- 前 수지한의원 진료원장\n- 前 암사바른한의원 진료원장\n- 前 남창규한의원 진료원장\n- 前 금사보건지소 진료과장\n- 前 설악보건지소 지소장\n- 공중보건 경기도 도지사 표창 수상\n- 대한한의사협회 표창 수상\n- 경기도청 역학조사관 연임\n\n**학회활동**\n\n- 한방비만학회 회원\n- 한방비만학회 비만치료 전문가 과정 수료\n- 척추신경추나의학회 정회원\n- 척추신경추나의학회 정규워크숍 수료\n- 대한스포츠한의학회 정회원\n- 대한스포츠한의학회 기획위원\n- 대한스포츠한의학회 팀닥터프로그램 수료',
    v_photo_choi,
    2,
    true
  )
  ON CONFLICT (instance_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    job_title = EXCLUDED.job_title,
    honorific = EXCLUDED.honorific,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    display_order = EXCLUDED.display_order,
    active = EXCLUDED.active,
    updated_at = now();

  RAISE NOTICE 'seed-demo-incheon-doctors: 인천 부평점 의료진 정합 완료 — 신수용 UPDATE, 정우령·최준수 INSERT, 방민우·박준호 삭제, 신수용 중복 % 건 정리. instance_id=%', v_dup_count, v_instance_id;
END $$;
