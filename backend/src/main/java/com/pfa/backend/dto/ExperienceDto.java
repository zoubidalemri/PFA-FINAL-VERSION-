// src/main/java/com/pfa/backend/dto/ExperienceDto.java
package com.pfa.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ExperienceDto {
    private Long id;
    private String title;      // "Data analyst"
    private String company;    // "Société X"
    private String location;   // "Casablanca"
    private LocalDate startDate;
    private LocalDate endDate; // null = poste actuel
    private String description;
}
