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
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id")
    private CandidateProfile candidate;

    private String title;
    private String company;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;

    @Column(length = 2000)
    private String description;
}