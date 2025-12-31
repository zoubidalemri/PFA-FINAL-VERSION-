package com.pfa.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OffreDTO {

    private Long id;
    private String titre;
    private String description;
    private String typeContrat;
    private String localisation;
    private String niveauExperience;
    private String competencesRequises;
    private Double salaireMin;
    private Double salaireMax;
    private String statut;
    private LocalDateTime datePublication;
    private LocalDateTime dateExpiration;
    private Long recruteurId;
    private String entreprise;
    private Integer nombreCandidatures;
    private Map<String, Object> interviewChecklist;
}