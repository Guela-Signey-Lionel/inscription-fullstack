package com.pkfokam.inscription.message.service;

import com.pkfokam.inscription.auth.repository.UtilisateurRepository;
import com.pkfokam.inscription.inscription.repository.InscriptionRepository;
import com.pkfokam.inscription.message.dto.MessageDtos.*;
import com.pkfokam.inscription.message.entity.Conversation;
import com.pkfokam.inscription.message.entity.Message;
import com.pkfokam.inscription.message.repository.ConversationRepository;
import com.pkfokam.inscription.message.repository.MessageRepository;
import com.pkfokam.inscription.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional
public class MessageService {

    private final ConversationRepository conversationRepo;
    private final MessageRepository messageRepo;
    private final UtilisateurRepository utilisateurRepo;
    private final InscriptionRepository inscriptionRepo;

    @Transactional(readOnly=true)
    public List<ConversationSummary> listeConversationsAdmin() {
        return conversationRepo.findAllByOrderByDateModificationDesc().stream()
            .map(c -> toSummary(c, "admin")).toList();
    }

    @Transactional(readOnly=true)
    public List<ConversationSummary> listeConversationsCandidat(UUID candidatId) {
        return conversationRepo.findByCandidatIdOrderByDateModificationDesc(candidatId).stream()
            .map(c -> toSummary(c, "candidat")).toList();
    }

    @Transactional(readOnly=true)
    public ConversationDetail detail(UUID id) {
        Conversation c = conversationRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation", id.toString()));
        return toDetail(c);
    }

    public ConversationDetail creerConversation(UUID candidatId, CreerConversationRequest req) {
        var inscription = req.inscriptionId() != null
            ? inscriptionRepo.findById(req.inscriptionId()).orElse(null) : null;
        Conversation c = Conversation.builder()
            .candidatId(candidatId)
            .inscriptionId(req.inscriptionId())
            .objet(req.objet())
            .statut("actif")
            .build();
        c = conversationRepo.save(c);

        if (req.premierMessage() != null && !req.premierMessage().isBlank()) {
            Message m = Message.builder()
                .conversation(c)
                .expediteurId(candidatId)
                .expediteurRole("candidat")
                .contenu(req.premierMessage())
                .lu(false)
                .build();
            c.getMessages().add(messageRepo.save(m));
        }
        return toDetail(c);
    }

    public MessageResponse envoyerMessage(UUID expediteurId, String expediteurRole, EnvoyerMessageRequest req) {
        Conversation c = conversationRepo.findById(req.conversationId())
            .orElseThrow(() -> new ResourceNotFoundException("Conversation", req.conversationId().toString()));
        Message m = Message.builder()
            .conversation(c)
            .expediteurId(expediteurId)
            .expediteurRole(expediteurRole)
            .contenu(req.contenu())
            .pieceJointeUrl(req.pieceJointeUrl())
            .pieceJointeNom(req.pieceJointeNom())
            .lu(false)
            .build();
        messageRepo.save(m);
        conversationRepo.save(c); // trigger @PreUpdate for dateModification
        return toMessageResponse(m);
    }

    public void marquerLus(UUID conversationId, String roleReader) {
        messageRepo.marquerLusParRole(conversationId, roleReader);
    }

    public ConversationSummary updateStatut(UUID id, UpdateConversationRequest req) {
        Conversation c = conversationRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation", id.toString()));
        c.setStatut(req.statut());
        return toSummary(conversationRepo.save(c), "admin");
    }

    private ConversationSummary toSummary(Conversation c, String readerRole) {
        var user = utilisateurRepo.findById(c.getCandidatId()).orElse(null);
        String nom = user != null ? user.getNom() : "";
        String prenom = user != null ? user.getPrenom() : "";
        String formation = "";
        if (c.getInscriptionId() != null) {
            var insc = inscriptionRepo.findById(c.getInscriptionId()).orElse(null);
            if (insc != null && insc.getFormation() != null) formation = insc.getFormation().getNom();
        }
        long nonLu = messageRepo.countNonLuForRole(c.getId(), readerRole);
        var messages = c.getMessages();
        MessageResponse dernierMsg = messages.isEmpty() ? null : toMessageResponse(messages.get(messages.size()-1));
        var lastDate = c.getDateModification() != null ? c.getDateModification() : c.getDateCreation();
        return new ConversationSummary(c.getId(), c.getCandidatId(), nom, prenom,
            c.getInscriptionId(), formation, c.getObjet(), lastDate, nonLu, c.getStatut(), dernierMsg);
    }

    private ConversationDetail toDetail(Conversation c) {
        var user = utilisateurRepo.findById(c.getCandidatId()).orElse(null);
        String nom = user != null ? user.getNom() : "";
        String prenom = user != null ? user.getPrenom() : "";
        String formation = "";
        if (c.getInscriptionId() != null) {
            var insc = inscriptionRepo.findById(c.getInscriptionId()).orElse(null);
            if (insc != null && insc.getFormation() != null) formation = insc.getFormation().getNom();
        }
        var msgs = c.getMessages().stream().map(this::toMessageResponse).toList();
        return new ConversationDetail(c.getId(), c.getCandidatId(), nom, prenom,
            c.getInscriptionId(), formation, c.getObjet(), c.getStatut(), c.getDateCreation(), msgs);
    }

    private MessageResponse toMessageResponse(Message m) {
        return new MessageResponse(m.getId(), m.getExpediteurRole(), m.getContenu(),
            m.getPieceJointeUrl(), m.getPieceJointeNom(), m.isLu(), m.getDateEnvoi());
    }
}
