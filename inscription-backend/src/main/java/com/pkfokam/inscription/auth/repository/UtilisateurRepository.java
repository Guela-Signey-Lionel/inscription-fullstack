package com.pkfokam.inscription.auth.repository;

import com.pkfokam.inscription.auth.entity.Role;
import com.pkfokam.inscription.auth.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, UUID> {
    Optional<Utilisateur> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Utilisateur> findByProviderAndProviderId(
        com.pkfokam.inscription.auth.entity.Provider provider, String providerId);
    List<Utilisateur> findByRole(Role role);
}
