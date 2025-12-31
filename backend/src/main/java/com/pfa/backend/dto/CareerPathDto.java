package com.pfa.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerPathDto {

    private Long id;
    private Long candidateId;

    private String targetJob;
    private String targetDomain;
    private String objectiveType;
    private Integer timeHorizonMonths;
    private String description;

    private Integer readinessScore;

    private List<CareerActionDto> actions = new ArrayList<>();

    // stats calculées
    private int totalActions;
    private int completedActions;
    private int totalWeight;
    private int completedWeight;

    private LocalDateTime createdAt;

    public void calculateStats() {
        if (actions == null || actions.isEmpty()) {
            totalActions = 0;
            completedActions = 0;
            totalWeight = 0;
            completedWeight = 0;
            return;
        }

        totalActions = actions.size();
        completedActions = (int) actions.stream()
                .filter(a -> Boolean.TRUE.equals(a.getCompleted()))
                .count();

        totalWeight = actions.stream()
                .mapToInt(a -> a.getWeight() != null ? a.getWeight() : 0)
                .sum();

        completedWeight = actions.stream()
                .filter(a -> Boolean.TRUE.equals(a.getCompleted()))
                .mapToInt(a -> a.getWeight() != null ? a.getWeight() : 0)
                .sum();
    }
}
