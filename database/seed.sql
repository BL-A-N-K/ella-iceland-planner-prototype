-- Preset universities (reference seed data — do not run until USER_ID_PLACEHOLDER is replaced)

INSERT INTO universities (id, user_id, name, city, fee, fee_num, flag, color, accent, link, apply_link, housing_link, permit_link, notes, is_custom) VALUES

('ui', '[USER_ID_PLACEHOLDER]', 'University of Iceland', 'Reykjavík', '€750/year', 750, '🏛️', '#1A7A5A', '#2AE890', 'https://english.hi.is/nursing/bs', 'https://english.hi.is/study/apply', 'https://www.hi.is/en/student-services/housing', 'https://english.hi.is/study/apply/residence-permit-students', 'Largest university in Iceland. Nursing BSc is 4 years, taught in Icelandic. Most competitive.', false),

('unak', '[USER_ID_PLACEHOLDER]', 'University of Akureyri', 'Akureyri', '€550/year', 550, '🌊', '#1A5A8A', '#4AACF0', 'https://www.unak.is/english/university/schools-and-faculties/school-of-health-business-and-natural-sciences/faculty-of-nursing', 'https://www.unak.is/english/university/admission', 'https://www.unak.is/english/university/student-services/housing', 'https://utl.is', 'Northern Iceland. Smaller campus, tighter community. Lower living costs than Reykjavík.', false),

('holar', '[USER_ID_PLACEHOLDER]', 'Hólar University', 'Hólar í Hjaltadal', '€500/year', 500, '⛰️', '#5A3A8A', '#A07AE0', 'https://www.holar.is/en', 'https://www.holar.is/en/admission', 'https://www.holar.is/en/accommodation', 'https://utl.is', 'Rural setting in North Iceland. Very small, specialist focus.', false),

('lbhi', '[USER_ID_PLACEHOLDER]', 'Agricultural Univ. of Iceland', 'Borgarnes', '€450/year', 450, '🌿', '#2A6A1A', '#7ACA3A', 'https://www.lbhi.is/english', 'https://www.lbhi.is/english/admissions', 'https://www.lbhi.is/english/accommodation', 'https://utl.is', 'Most affordable registration fee. Rural campus. Confirm nursing availability directly.', false);
