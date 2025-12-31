package com.pfa.backend.repository;

import com.pfa.backend.model.CareerAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerActionRepository extends JpaRepository<CareerAction, Long> {

    List<CareerAction> findByCareerPathGoal_IdOrderByOrderIndexAsc(Long careerPathId);

    List<CareerAction> findByCareerPathGoal_IdAndCompletedFalseOrderByOrderIndexAsc(Long careerPathId);

    List<CareerAction> findByCareerPathGoal_IdAndPriorityOrderByOrderIndexAsc(Long careerPathId, String priority);

    @Modifying
    @Query("DELETE FROM CareerAction ca WHERE ca.careerPathGoal.id = :careerPathId")
    void deleteByCareerPathId(@Param("careerPathId") Long careerPathId);

    @Query("SELECT COUNT(ca) FROM CareerAction ca WHERE ca.careerPathGoal.id = :careerPathId AND ca.completed = true")
    long countCompletedByCareerPathId(@Param("careerPathId") Long careerPathId);

    long countByCareerPathGoal_Id(Long careerPathId);
}
