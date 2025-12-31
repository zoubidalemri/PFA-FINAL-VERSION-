package com.pfa.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerActionDto {

    private Long id;

    private String label;
    private String category;

    private Boolean completed;

    private Integer weight;

    private String estimatedTime;
    private String priority;
    private Integer orderIndex;

    private String resourceUrl;
    private String detailedDescription;
}
