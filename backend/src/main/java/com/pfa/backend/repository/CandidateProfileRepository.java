package com.pfa.backend.repository;


import com.pfa.backend.model.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {

    Optional<CandidateProfile> findByEmail(String email);

    Optional<CandidateProfile> findByEmailAndPassword(String email, String password);

    boolean existsByEmail(String email);
}

