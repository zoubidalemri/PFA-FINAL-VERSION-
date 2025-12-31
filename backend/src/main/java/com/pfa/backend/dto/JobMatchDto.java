package com.pfa.backend.dto;

import lombok.Data;

@Data
public class JobMatchDto {
    private Long jobId;
    private int matchScore;
}
