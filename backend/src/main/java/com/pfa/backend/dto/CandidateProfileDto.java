
package com.pfa.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CandidateProfileDto {

    private Long id;

    private String firstName;
    private String lastName;
    private String email;

    private String phone;
    private String country;
    private String city;
    private String address;

    private LocalDate dateOfBirth;

    private String headline;
    private String bio;

    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;

    private Boolean openToWork;

    // --- Sections CV façon LinkedIn ---
    private List<ExperienceDto> experiences;
    private List<EducationDto> educations;
    private List<CertificationDto> certifications;
    private List<CandidateLanguageDto> languages;
    private List<SkillDto> skills;
}
