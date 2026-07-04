package com.pkfokam.inscription.auth.repository;

import com.pkfokam.inscription.auth.entity.OtpVerification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.Instant;
import java.util.*;

public interface OtpRepository extends JpaRepository<OtpVerification, UUID> {
    Optional<OtpVerification> findTopByEmailAndUtiliseFalseAndExpirationAfterOrderByDateCreationDesc(String email, Instant now);
    @Modifying @Query("DELETE FROM OtpVerification o WHERE o.email=:email")
    void deleteByEmail(@Param("email") String email);
}
