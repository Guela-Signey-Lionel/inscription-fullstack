package com.pkfokam.inscription.paiement.repository;

import com.pkfokam.inscription.paiement.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface PaiementRepository extends JpaRepository<Paiement, UUID> {
    Optional<Paiement> findByInscriptionId(UUID inscriptionId);
    Optional<Paiement> findByStripePaymentIntentId(String intentId);
}
