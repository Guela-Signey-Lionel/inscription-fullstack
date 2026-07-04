-- V1__initial_schema.sql — Plateforme Inscription PKFokam PROJ-04

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- UTILISATEURS
-- =============================================
CREATE TABLE utilisateurs (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom           VARCHAR(100) NOT NULL,
    prenom        VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe  VARCHAR(255),
    role          VARCHAR(30) NOT NULL CHECK (role IN ('CANDIDAT','AGENT_SCOLARITE','AGENT_FINANCIER','SUPER_ADMIN')),
    actif         BOOLEAN NOT NULL DEFAULT TRUE,
    provider      VARCHAR(20) NOT NULL DEFAULT 'LOCAL' CHECK (provider IN ('LOCAL','GOOGLE','MICROSOFT')),
    provider_id   VARCHAR(255),
    tentatives_connexion INT NOT NULL DEFAULT 0,
    bloque_jusqu_au TIMESTAMP,
    date_creation TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================
-- OTP VERIFICATION
-- =============================================
CREATE TABLE otp_verifications (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email        VARCHAR(255) NOT NULL,
    code_hash    VARCHAR(255) NOT NULL,
    expiration   TIMESTAMP NOT NULL,
    utilise      BOOLEAN NOT NULL DEFAULT FALSE,
    date_creation TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================
-- FORMATIONS
-- =============================================
CREATE TABLE formations (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom                 VARCHAR(255) NOT NULL,
    code                VARCHAR(50) NOT NULL UNIQUE,
    filiere             VARCHAR(100) NOT NULL,
    niveau              VARCHAR(50) NOT NULL,
    places_disponibles  INT NOT NULL DEFAULT 30,
    places_total        INT NOT NULL DEFAULT 30,
    frais_inscription   NUMERIC(12,2) NOT NULL,
    prerequis           TEXT,
    description         TEXT,
    actif               BOOLEAN NOT NULL DEFAULT TRUE
);

-- =============================================
-- INSCRIPTIONS
-- =============================================
CREATE TABLE inscriptions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_reference    VARCHAR(30) NOT NULL UNIQUE,
    candidat_id         UUID NOT NULL REFERENCES utilisateurs(id),
    formation_id        UUID REFERENCES formations(id),
    statut              VARCHAR(30) NOT NULL DEFAULT 'BROUILLON'
                        CHECK (statut IN ('BROUILLON','SOUMIS','EN_VALIDATION_DOC','DOCS_VALIDES',
                               'EN_VALIDATION_FIN','APPROUVE','REJETE','EN_ATTENTE_COMPLEMENT','EXPIRE')),
    type_inscription    VARCHAR(30) CHECK (type_inscription IN ('PREMIERE','REINSCRIPTION','TRANSFERT')),
    annee_academique    VARCHAR(20),
    agent_scolarite_id  UUID REFERENCES utilisateurs(id),
    agent_financier_id  UUID REFERENCES utilisateurs(id),
    validation_scolarite BOOLEAN NOT NULL DEFAULT FALSE,
    validation_financier BOOLEAN NOT NULL DEFAULT FALSE,
    motif_rejet         TEXT,
    -- Informations personnelles (dénormalisées pour perf)
    date_naissance      DATE,
    sexe                VARCHAR(10),
    nationalite         VARCHAR(100),
    telephone           VARCHAR(30),
    adresse             TEXT,
    photo_url           VARCHAR(500),
    email_verifie       BOOLEAN NOT NULL DEFAULT FALSE,
    -- Dates workflow
    date_soumission     TIMESTAMP,
    date_traitement     TIMESTAMP,
    date_expiration     TIMESTAMP,
    -- Metadata
    date_creation       TIMESTAMP NOT NULL DEFAULT NOW(),
    date_modification   TIMESTAMP
);

CREATE INDEX idx_inscriptions_statut      ON inscriptions(statut);
CREATE INDEX idx_inscriptions_candidat    ON inscriptions(candidat_id);
CREATE INDEX idx_inscriptions_reference   ON inscriptions(numero_reference);
CREATE INDEX idx_inscriptions_formation   ON inscriptions(formation_id);

-- =============================================
-- DOCUMENTS
-- =============================================
CREATE TABLE documents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inscription_id  UUID NOT NULL REFERENCES inscriptions(id),
    type_document   VARCHAR(50) NOT NULL CHECK (type_document IN
                    ('CNI_PASSEPORT','DIPLOME','RELEVE_NOTES','PHOTO_IDENTITE','AUTRE')),
    nom_original    VARCHAR(255) NOT NULL,
    nom_stockage    VARCHAR(255) NOT NULL UNIQUE,
    mime_type       VARCHAR(100) NOT NULL,
    taille          BIGINT NOT NULL,
    statut          VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE'
                    CHECK (statut IN ('EN_ATTENTE','VALIDE','REJETE')),
    motif_rejet     TEXT,
    donnees_ocr     JSONB,
    validateur_id   UUID REFERENCES utilisateurs(id),
    date_upload     TIMESTAMP NOT NULL DEFAULT NOW(),
    date_validation TIMESTAMP
);

CREATE INDEX idx_documents_inscription ON documents(inscription_id);
CREATE INDEX idx_documents_statut      ON documents(statut);

-- =============================================
-- PAIEMENTS
-- =============================================
CREATE TABLE paiements (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inscription_id           UUID NOT NULL UNIQUE REFERENCES inscriptions(id),
    stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
    idempotency_key          VARCHAR(255) NOT NULL UNIQUE,
    montant                  NUMERIC(12,2) NOT NULL,
    devise                   VARCHAR(10) NOT NULL DEFAULT 'EUR',
    statut                   VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                             CHECK (statut IN ('PENDING','SUCCEEDED','FAILED','REFUNDED')),
    stripe_charge_id         VARCHAR(255),
    recu_pdf_url             VARCHAR(500),
    date_confirmation        TIMESTAMP,
    date_remboursement       TIMESTAMP,
    date_creation            TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =============================================
-- HISTORIQUE WORKFLOW
-- =============================================
CREATE TABLE historique_workflow (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inscription_id  UUID NOT NULL REFERENCES inscriptions(id),
    etat_depart     VARCHAR(30),
    etat_arrivee    VARCHAR(30) NOT NULL,
    evenement       VARCHAR(60),
    acteur_id       UUID REFERENCES utilisateurs(id),
    motif           TEXT,
    date_transition TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_historique_inscription ON historique_workflow(inscription_id);

-- =============================================
-- AUDIT LOG
-- =============================================
CREATE TABLE audit_logs (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action       VARCHAR(100) NOT NULL,
    ressource    VARCHAR(100),
    ressource_id VARCHAR(255),
    acteur_id    UUID REFERENCES utilisateurs(id),
    acteur_email VARCHAR(255),
    adresse_ip   VARCHAR(50),
    user_agent   VARCHAR(500),
    details      JSONB,
    date_action  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_date   ON audit_logs(date_action);
CREATE INDEX idx_audit_acteur ON audit_logs(acteur_id);
-- =============================================
-- DONNÉES INITIALES (formations seulement)
-- Les utilisateurs sont seedés dans V3__seed_test_data.sql
-- =============================================
INSERT INTO formations (id, nom, code, filiere, niveau, places_disponibles, places_total, frais_inscription, description) VALUES
(uuid_generate_v4(), 'Licence en Informatique', 'LIC-INFO', 'Informatique', 'Licence', 25, 30, 150000, 'Formation en génie logiciel et systèmes d''information'),
(uuid_generate_v4(), 'Master en Finance', 'MAST-FIN', 'Finance', 'Master', 20, 25, 200000, 'Formation avancée en finance d''entreprise'),
(uuid_generate_v4(), 'Licence en Marketing', 'LIC-MKT', 'Marketing', 'Licence', 28, 30, 140000, 'Formation en marketing digital et communication'),
(uuid_generate_v4(), 'Master en Génie Civil', 'MAST-GC', 'Génie Civil', 'Master', 15, 20, 180000, 'Formation en construction et génie des structures');
