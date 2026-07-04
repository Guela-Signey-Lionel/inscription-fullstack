-- V2__messages_conversations.sql — Module messagerie PKFokam

-- =============================================
-- CONVERSATIONS
-- =============================================
CREATE TABLE conversations (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidat_id       UUID NOT NULL REFERENCES utilisateurs(id),
    inscription_id    UUID REFERENCES inscriptions(id),
    objet             VARCHAR(255) NOT NULL,
    statut            VARCHAR(20) NOT NULL DEFAULT 'actif'
                      CHECK (statut IN ('actif','resolu','ferme')),
    date_creation     TIMESTAMP NOT NULL DEFAULT NOW(),
    date_modification TIMESTAMP
);

CREATE INDEX idx_conversations_candidat ON conversations(candidat_id);
CREATE INDEX idx_conversations_inscription ON conversations(inscription_id);

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE messages (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    expediteur_id     UUID NOT NULL REFERENCES utilisateurs(id),
    expediteur_role   VARCHAR(20) NOT NULL CHECK (expediteur_role IN ('admin','candidat')),
    contenu           TEXT NOT NULL,
    piece_jointe_url  VARCHAR(500),
    piece_jointe_nom  VARCHAR(255),
    lu                BOOLEAN NOT NULL DEFAULT FALSE,
    date_envoi        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_lu ON messages(conversation_id, lu);
