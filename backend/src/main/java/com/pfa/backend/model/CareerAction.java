package com.pfa.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_action")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "career_path_goal_id")
    private CareerPathGoal careerPathGoal;

    private String label;
    private String category;

    private Boolean completed = false;

    private Integer weight;
    private String estimatedTime;     // ✅ manquait
    private String priority;          // ✅ manquait
    private Integer orderIndex;        // ✅ manquait

    private String resourceUrl;        // ✅ manquait

    @Column(length = 2000)
    private String detailedDescription; // ✅ manquait
}
