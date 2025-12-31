package com.pfa.backend.repository;

import com.pfa.backend.model.CandidateDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateDocumentRepository extends JpaRepository<CandidateDocument, Long> {

    List<CandidateDocument> findByCandidateProfileId(Long candidateId);
}
