package com.pfa.backend.controller;

import com.pfa.backend.dto.*;
import com.pfa.backend.service.CandidateProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidateProfileController {

    private final CandidateProfileService service;

    public CandidateProfileController(CandidateProfileService service) {
        this.service = service;
    }

    // ===================== PROFIL =====================

    @GetMapping("/{id}/profile")
    public ResponseEntity<CandidateProfileDto> getProfile(@PathVariable Long id) {
        CandidateProfileDto dto = service.getFullProfile(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<CandidateProfileDto> updateProfile(
            @PathVariable Long id,
            @RequestBody CandidateProfileDto dto
    ) {
        CandidateProfileDto updated = service.createOrUpdateProfile(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{candidateId}/profile/autofill-from-cv")
    public ResponseEntity<CandidateProfileDto> autofillFromCv(
            @PathVariable Long candidateId,
            @RequestParam Long documentId
    ) {
        CandidateProfileDto dto = service.autofillProfileFromCv(candidateId, documentId);
        return ResponseEntity.ok(dto);
    }

    // ===================== SECTIONS CV =====================

    @PostMapping("/{candidateId}/experiences")
    public ResponseEntity<ExperienceDto> addExperience(
            @PathVariable Long candidateId,
            @RequestBody ExperienceDto dto
    ) {
        ExperienceDto created = service.addExperience(candidateId, dto);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{candidateId}/educations")
    public ResponseEntity<EducationDto> addEducation(
            @PathVariable Long candidateId,
            @RequestBody EducationDto dto
    ) {
        EducationDto created = service.addEducation(candidateId, dto);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{candidateId}/certifications")
    public ResponseEntity<CertificationDto> addCertification(
            @PathVariable Long candidateId,
            @RequestBody CertificationDto dto
    ) {
        CertificationDto created = service.addCertification(candidateId, dto);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{candidateId}/languages")
    public ResponseEntity<CandidateLanguageDto> addLanguage(
            @PathVariable Long candidateId,
            @RequestBody CandidateLanguageDto dto
    ) {
        CandidateLanguageDto created = service.addLanguage(candidateId, dto);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{candidateId}/skills")
    public ResponseEntity<SkillDto> addSkill(
            @PathVariable Long candidateId,
            @RequestBody SkillDto dto
    ) {
        SkillDto created = service.addSkill(candidateId, dto);
        return ResponseEntity.ok(created);
    }
}
