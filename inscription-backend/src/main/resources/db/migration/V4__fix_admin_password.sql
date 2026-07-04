-- V4__fix_admin_password.sql
-- Corrige le mot de passe admin qui avait été mal initialisé par V1.
-- V1 insérait admin@pkfokam.edu avec un hash BCrypt incorrect qui ne correspondait pas à "Admin@1234".
-- V3 tentait de le corriger mais émigrait (ON CONFLICT DO NOTHING) car l'email existait déjà.

UPDATE utilisateurs
SET mot_de_passe = '$2a$12$YoRTBHHHrIpcbbSMtuJABeejn9qSFsX4o4TbVJ6Xz/IJNNZSxNHmG'
WHERE email = 'admin@pkfokam.edu'
  AND mot_de_passe IS DISTINCT FROM '$2a$12$YoRTBHHHrIpcbbSMtuJABeejn9qSFsX4o4TbVJ6Xz/IJNNZSxNHmG';
