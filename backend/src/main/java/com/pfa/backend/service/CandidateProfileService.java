package com.pfa.backend.service;

import com.pfa.backend.dto.*;
import com.pfa.backend.model.*;
import com.pfa.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
public class CandidateProfileService {

    private final CandidateProfileRepository profileRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final CertificationRepository certificationRepository;
    private final CandidateLanguageRepository languageRepository;
    private final SkillRepository skillRepository;

    public CandidateProfileService(CandidateProfileRepository profileRepository,
                                   ExperienceRepository experienceRepository,
                                   EducationRepository educationRepository,
                                   CertificationRepository certificationRepository,
                                   CandidateLanguageRepository languageRepository,
                                   SkillRepository skillRepository) {
        this.profileRepository = profileRepository;
        this.experienceRepository = experienceRepository;
        this.educationRepository = educationRepository;
        this.certificationRepository = certificationRepository;
        this.languageRepository = languageRepository;
        this.skillRepository = skillRepository;
    }

    // ---------- PROFIL COMPLET ----------

    public CandidateProfileDto getFullProfile(Long id) {
        CandidateProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Candidate profile not found for id " + id));

        return toDto(profile);
    }

    public CandidateProfileDto createOrUpdateProfile(Long id, CandidateProfileDto dto) {
        CandidateProfile profile = profileRepository.findById(id)
                .orElseGet(CandidateProfile::new);

        profile.setId(id);
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setEmail(dto.getEmail());
        profile.setPhone(dto.getPhone());
        profile.setCountry(dto.getCountry());
        profile.setCity(dto.getCity());
        profile.setAddress(dto.getAddress());
        profile.setDateOfBirth(dto.getDateOfBirth());
        profile.setHeadline(dto.getHeadline());
        profile.setBio(dto.getBio());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setGithubUrl(dto.getGithubUrl());
        profile.setPortfolioUrl(dto.getPortfolioUrl());
        profile.setOpenToWork(dto.getOpenToWork());

        CandidateProfile saved = profileRepository.save(profile);
        return toDto(saved);
    }

    // Pour l'instant : on ne modifie rien, on renvoie juste le profil
    public CandidateProfileDto autofillProfileFromCv(Long candidateId, Long documentId) {
        CandidateProfile profile = profileRepository.findById(candidateId)
                .orElseThrow(() -> new EntityNotFoundException("Candidate profile not found for id " + candidateId));

        // TODO: ici tu pourras appliquer ton parsing de CV / IA

        CandidateProfile saved = profileRepository.save(profile);
        return toDto(saved);
    }

    // ---------- AJOUT SECTIONS CV ----------

    public ExperienceDto addExperience(Long candidateId, ExperienceDto dto) {
        CandidateProfile candidate = getCandidate(candidateId);

        Experience exp = Experience.builder()
                .candidate(candidate)
                .title(dto.getTitle())
                .company(dto.getCompany())
                .location(dto.getLocation())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .description(dto.getDescription())
                .build();

        Experience saved = experienceRepository.save(exp);
        return toDto(saved);
    }

    public EducationDto addEducation(Long candidateId, EducationDto dto) {
        CandidateProfile candidate = getCandidate(candidateId);

        Education edu = Education.builder()
                .candidate(candidate)
                .school(dto.getSchool())
                .degree(dto.getDegree())
                .field(dto.getField())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .description(dto.getDescription())
                .build();

        Education saved = educationRepository.save(edu);
        return toDto(saved);
    }

    public CertificationDto addCertification(Long candidateId, CertificationDto dto) {
        CandidateProfile candidate = getCandidate(candidateId);

        Certification cert = Certification.builder()
                .candidate(candidate)
                .name(dto.getName())
                .provider(dto.getProvider())
                .dateObtained(dto.getDateObtained())
                .expiryDate(dto.getExpiryDate())
                .credentialUrl(dto.getCredentialUrl())
                .build();

        Certification saved = certificationRepository.save(cert);
        return toDto(saved);
    }

    public CandidateLanguageDto addLanguage(Long candidateId, CandidateLanguageDto dto) {
        CandidateProfile candidate = getCandidate(candidateId);

        CandidateLanguage lang = CandidateLanguage.builder()
                .candidate(candidate)
                .language(dto.getLanguage())
                .level(dto.getLevel())
                .build();

        CandidateLanguage saved = languageRepository.save(lang);
        return toDto(saved);
    }

    public SkillDto addSkill(Long candidateId, SkillDto dto) {
        CandidateProfile candidate = getCandidate(candidateId);

        Skill skill = Skill.builder()
                .candidate(candidate)
                .name(dto.getName())
                .level(dto.getLevel())
                .build();

        Skill saved = skillRepository.save(skill);
        return toDto(saved);
    }

    // ---------- HELPERS ----------

    private CandidateProfile getCandidate(Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Candidate profile not found for id " + id));
    }

    // ---------- MAPPERS ENTITÉ -> DTO ----------

    private CandidateProfileDto toDto(CandidateProfile profile) {
        CandidateProfileDto dto = new CandidateProfileDto();
        dto.setId(profile.getId());
        dto.setFirstName(profile.getFirstName());
        dto.setLastName(profile.getLastName());
        dto.setEmail(profile.getEmail());
        dto.setPhone(profile.getPhone());
        dto.setCountry(profile.getCountry());
        dto.setCity(profile.getCity());
        dto.setAddress(profile.getAddress());
        dto.setDateOfBirth(profile.getDateOfBirth());
        dto.setHeadline(profile.getHeadline());
        dto.setBio(profile.getBio());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setPortfolioUrl(profile.getPortfolioUrl());
        dto.setOpenToWork(profile.getOpenToWork());

        dto.setExperiences(
                profile.getExperiences().stream()
                        .map(this::toDto)
                        .collect(Collectors.toList())
        );
        dto.setEducations(
                profile.getEducations().stream()
                        .map(this::toDto)
                        .collect(Collectors.toList())
        );
        dto.setCertifications(
                profile.getCertifications().stream()
                        .map(this::toDto)
                        .collect(Collectors.toList())
        );
        dto.setLanguages(
                profile.getLanguages().stream()
                        .map(this::toDto)
                        .collect(Collectors.toList())
        );
        dto.setSkills(
                profile.getSkills().stream()
                        .map(this::toDto)
                        .collect(Collectors.toList())
        );

        return dto;
    }

    private ExperienceDto toDto(Experience exp) {
        ExperienceDto dto = new ExperienceDto();
        dto.setId(exp.getId());
        dto.setTitle(exp.getTitle());
        dto.setCompany(exp.getCompany());
        dto.setLocation(exp.getLocation());
        dto.setStartDate(exp.getStartDate());
        dto.setEndDate(exp.getEndDate());
        dto.setDescription(exp.getDescription());
        return dto;
    }

    private EducationDto toDto(Education edu) {
        EducationDto dto = new EducationDto();
        dto.setId(edu.getId());
        dto.setSchool(edu.getSchool());
        dto.setDegree(edu.getDegree());
        dto.setField(edu.getField());
        dto.setStartDate(edu.getStartDate());
        dto.setEndDate(edu.getEndDate());
        dto.setDescription(edu.getDescription());
        return dto;
    }

    private CertificationDto toDto(Certification cert) {
        CertificationDto dto = new CertificationDto();
        dto.setId(cert.getId());
        dto.setName(cert.getName());
        dto.setProvider(cert.getProvider());
        dto.setDateObtained(cert.getDateObtained());
        dto.setExpiryDate(cert.getExpiryDate());
        dto.setCredentialUrl(cert.getCredentialUrl());
        return dto;
    }

    private CandidateLanguageDto toDto(CandidateLanguage lang) {
        CandidateLanguageDto dto = new CandidateLanguageDto();
        dto.setId(lang.getId());
        dto.setLanguage(lang.getLanguage());
        dto.setLevel(lang.getLevel());
        return dto;
    }

    private SkillDto toDto(Skill skill) {
        SkillDto dto = new SkillDto();
        dto.setId(skill.getId());
        dto.setName(skill.getName());
        dto.setLevel(skill.getLevel());
        return dto;
    }
}
