package com.pkfokam.inscription.message.repository;

import com.pkfokam.inscription.message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    long countByConversationIdAndLuFalseAndExpediteurRoleNot(UUID conversationId, String role);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation.id = :convId AND m.lu = false AND m.expediteurRole != :role")
    long countNonLuForRole(@Param("convId") UUID conversationId, @Param("role") String role);

    @Modifying
    @Query("UPDATE Message m SET m.lu = true WHERE m.conversation.id = :convId AND m.expediteurRole != :role")
    void marquerLusParRole(@Param("convId") UUID conversationId, @Param("role") String role);
}
