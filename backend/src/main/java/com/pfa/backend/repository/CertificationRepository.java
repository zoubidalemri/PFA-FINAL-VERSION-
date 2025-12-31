// CertificationRepository.java
package com.pfa.backend.repository;

import com.pfa.backend.model.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
}