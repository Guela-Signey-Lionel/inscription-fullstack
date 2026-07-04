package com.pkfokam.inscription.inscription.repository;

import com.pkfokam.inscription.inscription.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface FormationRepository extends JpaRepository<Formation, UUID> {
    List<Formation> findByActifTrue();
}
