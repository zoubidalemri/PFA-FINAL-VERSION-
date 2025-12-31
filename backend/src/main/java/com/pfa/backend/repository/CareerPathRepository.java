package com.pfa.backend.repository;

import com.pfa.backend.model.CareerPathGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CareerPathRepository extends JpaRepository<CareerPathGoal, Long> {

    // candidate est un objet CandidateProfile (OneToOne), donc on traverse candidate.id
    Optional<CareerPathGoal> findByCandidate_Id(Long candidateId);

    boolean existsByCandidate_Id(Long candidateId);

    void deleteByCandidate_Id(Long candidateId);

    @Query("SELECT cp FROM CareerPathGoal cp LEFT JOIN FETCH cp.actions WHERE cp.candidate.id = :candidateId")
    Optional<CareerPathGoal> findByCandidateIdWithActions(@Param("candidateId") Long candidateId);
}
