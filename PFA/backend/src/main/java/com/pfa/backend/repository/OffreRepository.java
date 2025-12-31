package com.pfa.backend.repository;

import com.pfa.backend.entities.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OffreRepository extends JpaRepository<Offre, Long> {
    List<Offre> findByRecruteurIdOrderByCreatedAtDesc(Long recruteurId);
    List<Offre> findByRecruteurIdAndStatut(Long recruteurId, String statut);
}