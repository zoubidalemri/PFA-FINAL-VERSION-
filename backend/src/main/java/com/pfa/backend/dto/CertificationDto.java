// src/main/java/com/pfa/backend/dto/CertificationDto.java
package com.pfa.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CertificationDto {
    private Long id;
    private String name;        // "AZ-900"
    private String provider;    // "Microsoft"
    private LocalDate dateObtained;
    private LocalDate expiryDate;
    private String credentialUrl;
}
