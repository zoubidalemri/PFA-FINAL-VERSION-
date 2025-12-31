// src/main/java/com/pfa/backend/dto/EducationDto.java
package com.pfa.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EducationDto {
    private Long id;
    private String school;     // "ENSIAS"
    private String degree;     // "Ingénieur d'État"
    private String field;      // "Informatique"
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
}
