package com.pfa.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Informations de base
    private String nom;
    private String prenom;
    private String email;
    private String telephone; // ← AJOUT DU NUMÉRO DE TÉLÉPHONE

    // Informations utilisées pour le Scoring IA
    @Column(columnDefinition = "TEXT")
    private String competences; // Liste des compétences (ex: Java, Spring Boot, React)
    private String niveauEtude; // Dernier diplôme ou niveau de qualification (ex: Master, Ingénieur)
    private String formation;   // Domaine général de la formation (ex: Informatique, Management)
    private String cvUrl;

    // Champs de suivi (Audit)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}