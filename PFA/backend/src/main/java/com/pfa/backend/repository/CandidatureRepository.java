package com.pfa.backend.repository;

import com.pfa.backend.entities.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CandidatureRepository extends JpaRepository<Candidature, Long> {

    // Trier par score IA
    List<Candidature> findByOffreIdOrderByScoreMatchingDesc(Long offreId);

    // Filtrer par Recruteur ID et trier par score IA (méthode ajustée)
    List<Candidature> findByOffreRecruteurIdOrderByScoreMatchingDesc(Long recruteurId);

    // Filtrer par Recruteur ID
    List<Candidature> findByOffreRecruteurId(Long recruteurId);

    // Filtrer par Recruteur ID et Statut
    List<Candidature> findByOffreRecruteurIdAndStatut(Long recruteurId, String statut);
}