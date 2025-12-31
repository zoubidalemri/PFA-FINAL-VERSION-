package com.pfa.backend.entities;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import io.hypersistence.utils.hibernate.type.json.JsonType;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "offres")
// @EntityListeners(Offre.class) <-- REMOVED THIS LINE
public class Offre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Core Offer Fields
    private String titre;
    private String description;
    @Column(nullable = false)
    private String typeContrat;
    @Column(nullable = false)
    private String localisation;
    private String niveauExperience;
    private String competencesRequises;
    private Double salaireMin;
    private Double salaireMax;
    private String statut;

    // Date Fields
    @Column(nullable = false)
    private LocalDateTime datePublication;
    private LocalDateTime dateExpiration;

    // Audit Fields
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruteur_id", nullable = false)
    private Recruteur recruteur;

    @OneToMany(mappedBy = "offre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Candidature> candidatures = new ArrayList<>();

    // --- JPA LIFECYCLE CALLBACKS ---

    @PrePersist
    protected void onCreate() {
        // No Object parameter needed when defined inside the Entity

        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        // Ensure mandatory status and publication date are set if not provided
        if (this.statut == null) {
            this.statut = "BROUILLON";
        }
        // Set datePublication only if status is ACTIVE or if it's explicitly null
        if (this.datePublication == null) {
            this.datePublication = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        // No Object parameter needed when defined inside the Entity

        this.updatedAt = LocalDateTime.now();
    }
    @Type(JsonType.class)
    @Column(name = "interview_checklist", columnDefinition = "jsonb")
    private Map<String, Object> interviewChecklist;
}