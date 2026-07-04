package com.pkfokam.inscription.message.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class MessageDtos {

    public record MessageResponse(
        UUID id,
        String expediteurRole,
        String contenu,
        String pieceJointeUrl,
        String pieceJointeNom,
        boolean lu,
        Instant dateEnvoi
    ) {}

    public record ConversationSummary(
        UUID id,
        UUID candidatId,
        String candidatNom,
        String candidatPrenom,
        UUID inscriptionId,
        String formation,
        String objet,
        Instant derniereDate,
        long nonLu,
        String statut,
        MessageResponse dernierMessage
    ) {}

    public record ConversationDetail(
        UUID id,
        UUID candidatId,
        String candidatNom,
        String candidatPrenom,
        UUID inscriptionId,
        String formation,
        String objet,
        String statut,
        Instant dateCreation,
        List<MessageResponse> messages
    ) {}

    public record EnvoyerMessageRequest(
        UUID conversationId,
        String contenu,
        String pieceJointeUrl,
        String pieceJointeNom
    ) {}

    public record CreerConversationRequest(
        UUID inscriptionId,
        String objet,
        String premierMessage
    ) {}

    public record UpdateConversationRequest(String statut) {}
}
