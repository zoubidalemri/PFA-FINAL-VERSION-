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
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id")
    private CandidateProfile candidate;

    private String school;
    private String degree;
    private String field;
    private LocalDate startDate;
    private LocalDate endDate;

    @Column(length = 1000)
    private String description;
}
