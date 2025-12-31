// src/main/java/com/pfa/backend/model/Certification.java
package com.pfa.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id")
    private CandidateProfile candidate;

    private String name;
    private String provider;
    private LocalDate dateObtained;
    private LocalDate expiryDate;
    private String credentialUrl;
}