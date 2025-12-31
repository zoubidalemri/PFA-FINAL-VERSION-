// src/main/java/com/pfa/backend/model/CandidateProfile.java
package com.pfa.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "candidate_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Identité + login
    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;  // pour l'instant le mot de passe est géré ici

    // Contact / localisation
    private String phone;
    private String country;
    private String city;
    private String address;

    // Infos personnelles
    private LocalDate dateOfBirth;

    // Résumé professionnel
    private String headline;

    @Column(length = 2000)
    private String bio;

    // Liens pro
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;

    // Disponibilité
    private Boolean openToWork;

    // ---------- Sections CV complètes ----------

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Education> educations = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Certification> certifications = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CandidateLanguage> languages = new ArrayList<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Skill> skills = new ArrayList<>();
}