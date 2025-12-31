package com.pfa.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_document")
public class CandidateDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Profil candidat propriétaire du document
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_profile_id", nullable = false)
    private CandidateProfile candidateProfile;

    @Column(nullable = false)
    private String label;        // ex: "CV principal", "Lettre de motivation stage"

    @Column(nullable = false)
    private String type;         // ex: "CV", "MOTIVATION", "LANGUAGE_CERT", "OTHER"

    @Column(nullable = false)
    private String fileName;     // nom original

    @Column(nullable = false)
    private String filePath;     // chemin sur le disque

    private String mimeType;     // content-type (pdf, docx, ...)

    private LocalDateTime uploadedAt;

    // --------- CONSTRUCTEURS ---------

    public CandidateDocument() {
    }

    // --------- GETTERS / SETTERS ---------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CandidateProfile getCandidateProfile() {
        return candidateProfile;
    }

    public void setCandidateProfile(CandidateProfile candidateProfile) {
        this.candidateProfile = candidateProfile;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
