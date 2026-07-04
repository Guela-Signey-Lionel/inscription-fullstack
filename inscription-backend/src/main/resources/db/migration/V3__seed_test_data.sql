-- V3__seed_test_data.sql — Données de test PKFokam
-- Mots de passe hashés BCrypt (rounds=12)
-- Admin@1234  → $2a$12$YoRTBHHHrIpcbbSMtuJABeejn9qSFsX4o4TbVJ6Xz/IJNNZSxNHmG
-- Test@1234   → $2a$12$gKrDY2Jlx6U9O4V3zW7GqPMakS8NpcI0fXt5YrE2L1BjVn4mQwHf
-- Agent@1234  → $2a$12$hLsEZ3Kmx7V0P5W4aX8HrQNblT9OqdJ1gYu6ZsF3M2CkWo5nRxIg

-- =============================================
-- UTILISATEURS DE TEST
-- =============================================
INSERT INTO utilisateurs (id, nom, prenom, email, mot_de_passe, role, actif, provider, date_creation)
VALUES
  -- Super Admin
  (uuid_generate_v4(), 'Guela', 'Signey Lionel',
   'admin@pkfokam.edu',
   '$2a$12$YoRTBHHHrIpcbbSMtuJABeejn9qSFsX4o4TbVJ6Xz/IJNNZSxNHmG',
   'SUPER_ADMIN', true, 'LOCAL', NOW()),

  -- Agent Scolarité
  (uuid_generate_v4(), 'Nkomo', 'Marie Claire',
   'scolarite@pkfokam.edu',
   '$2a$12$hLsEZ3Kmx7V0P5W4aX8HrQNblT9OqdJ1gYu6ZsF3M2CkWo5nRxIg',
   'AGENT_SCOLARITE', true, 'LOCAL', NOW()),

  -- Agent Financier
  (uuid_generate_v4(), 'Bello', 'Jean Pierre',
   'finance@pkfokam.edu',
   '$2a$12$hLsEZ3Kmx7V0P5W4aX8HrQNblT9OqdJ1gYu6ZsF3M2CkWo5nRxIg',
   'AGENT_FINANCIER', true, 'LOCAL', NOW()),

  -- Candidat de test
  (uuid_generate_v4(), 'Begoto', 'Prince',
   'candidat@test.cm',
   '$2a$12$gKrDY2Jlx6U9O4V3zW7GqPMakS8NpcI0fXt5YrE2L1BjVn4mQwHf',
   'CANDIDAT', true, 'LOCAL', NOW())

ON CONFLICT (email) DO NOTHING;

-- =============================================
-- FORMATIONS
-- =============================================
INSERT INTO formations (id, nom, code, filiere, niveau, places_total, places_disponibles, frais_inscription, actif)
VALUES
  (uuid_generate_v4(), 'Licence en Informatique — Génie Logiciel',    'LIC-INFO-GL',    'Informatique',     'LICENCE', 120, 120, 350000, true),
  (uuid_generate_v4(), 'Licence en Informatique — Réseaux & Sécurité','LIC-INFO-RS',    'Informatique',     'LICENCE', 80,  80,  350000, true),
  (uuid_generate_v4(), 'Licence en Économie-Gestion',                 'LIC-ECO-GES',   'Économie',         'LICENCE', 100, 100, 300000, true),
  (uuid_generate_v4(), 'Licence en Droit Privé',                      'LIC-DROIT-PRV', 'Droit',            'LICENCE', 90,  90,  280000, true),
  (uuid_generate_v4(), 'Master en Intelligence Artificielle',         'MST-IA',        'Informatique',     'MASTER',  40,  40,  600000, true),
  (uuid_generate_v4(), 'Master en Génie Civil',                       'MST-GC',        'Génie Civil',      'MASTER',  35,  35,  580000, true),
  (uuid_generate_v4(), 'Master en Biotechnologie',                    'MST-BIO',       'Sciences',         'MASTER',  30,  30,  620000, true),
  (uuid_generate_v4(), 'BTS en Comptabilité et Gestion',              'BTS-CG',        'Comptabilité',     'BTS',     60,  60,  200000, true),
  (uuid_generate_v4(), 'BTS en Informatique de Gestion',              'BTS-IG',        'Informatique',     'BTS',     60,  60,  210000, true)

ON CONFLICT DO NOTHING;
