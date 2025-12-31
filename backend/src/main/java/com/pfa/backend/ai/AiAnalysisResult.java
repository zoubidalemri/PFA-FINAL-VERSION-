package com.pfa.backend.ai;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AiAnalysisResult {

    // Domaine détecté / utilisé
    private String inferredDomain;

    // Score 0–100
    private int readinessScore;

    // Liste des actions recommandées
    private List<String> checklist = new ArrayList<>();
}
