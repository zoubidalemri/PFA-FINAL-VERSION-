package com.pfa.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * Data Transfer Object pour les données de Candidature affichées au Recruteur.
 */
@Data
public class CandidatureDTO {
    private Long id;

    // Détails de l'Offre
    private Long offreId;
    private String titrOffre;

    // Détails du Candidat
    private Long candidatId;
    private String nomCandidat;
    private String prenomCandidat;
    private String emailCandidat;
    private String telephoneCandidat;
    private String formation;
    private String niveauEtude;
    private String competences;
    private String cvUrl;

    // Détails de la Candidature
    private String statut;
    private String lettreMotivation;
    private Double scoreMatching;
    private String commentaireRecruteur;

    // Nouveaux champs pour l'interview
    private String interviewChecklistResults;
    private String interviewSkillComments;
    private String interviewCommentaire;

    private LocalDateTime dateCandidature;
    private LocalDateTime dateReponse;
}