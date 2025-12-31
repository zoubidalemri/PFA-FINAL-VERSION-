package com.pfa.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidatures")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "offre_id", nullable = false)
    private Offre offre;

    @ManyToOne
    @JoinColumn(name = "candidat_id", nullable = false)
    private CandidateProfile candidat;

    // Statut: EN_ATTENTE, EN_COURS, INTERVIEW, ACCEPTEE, REFUSEE
    @Column(nullable = false)
    private String statut;

    @Column(columnDefinition = "TEXT")
    private String lettreMotivation;

    private String cvUrl;

    @Column(name = "score_matching")
    private Double scoreMatching;

    @Column(columnDefinition = "TEXT")
    private String commentaireRecruteur;

    // --- CHAMPS POUR LA NOTATION D'INTERVIEW ---
    @Column(name = "interview_checklist_results", columnDefinition = "TEXT")
    private String interviewChecklistResults; // Format: "Skill1:true;Skill2:false;..."

    @Column(name = "interview_skill_comments", columnDefinition = "TEXT")
    private String interviewSkillComments; // JSON string: {"0": "comment1", "1": "comment2"}

    @Column(name = "interview_commentaire", columnDefinition = "TEXT")
    private String interviewCommentaire; // Global notes
    // -------------------------------------------

    @Column(name = "date_candidature")
    private LocalDateTime dateCandidature;

    @Column(name = "date_reponse")
    private LocalDateTime dateReponse;

    @PrePersist
    protected void onCreate() {
        dateCandidature = LocalDateTime.now();
    }
}