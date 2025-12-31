// CandidateLanguageRepository.java
package com.pfa.backend.repository;

import com.pfa.backend.model.CandidateLanguage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateLanguageRepository extends JpaRepository<CandidateLanguage, Long> {
}