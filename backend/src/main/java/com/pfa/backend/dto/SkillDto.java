// src/main/java/com/pfa/backend/dto/SkillDto.java
package com.pfa.backend.dto;

import lombok.Data;

@Data
public class SkillDto {
    private Long id;
    private String name;       // "Spring Boot", "SQL", "Power BI"
    private String level;      // optionnel : "Débutant", "Intermédiaire", "Avancé"
}
