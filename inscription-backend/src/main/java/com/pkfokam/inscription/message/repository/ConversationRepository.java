package com.pkfokam.inscription.message.repository;

import com.pkfokam.inscription.message.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    List<Conversation> findByCandidatIdOrderByDateModificationDesc(UUID candidatId);

    @Query("SELECT c FROM Conversation c ORDER BY COALESCE(c.dateModification, c.dateCreation) DESC")
    List<Conversation> findAllByOrderByDateModificationDesc();

    List<Conversation> findByInscriptionId(UUID inscriptionId);
}
