package com.pfa.backend.repository;

import com.pfa.backend.entities.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidatRepository extends JpaRepository<CandidateProfile, Long> {

    // Ajoutez des méthodes personnalisées ici si nécessaire
}