package com.pfa.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "career_path_goal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerPathGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Un objectif est lié à un profil candidat
    @OneToOne
    @JoinColumn(name = "candidate_id", unique = true)
    private CandidateProfile candidate;

    private String targetJob;
    private String targetDomain;
    private String objectiveType;      
    private Integer timeHorizonMonths;
    @Column(length = 2000)
    private String description;

    private Integer readinessScore;    

    @OneToMany(mappedBy = "careerPathGoal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CareerAction> actions = new ArrayList<>();
}