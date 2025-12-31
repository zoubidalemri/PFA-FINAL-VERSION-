package com.pfa.backend.controller;

import com.pfa.backend.dto.CareerPathDto;
import com.pfa.backend.service.CareerPathService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/career-path")
public class CareerPathController {

    private final CareerPathService careerPathService;

    public CareerPathController(CareerPathService careerPathService) {
        this.careerPathService = careerPathService;
    }

    @GetMapping("/{candidateId}")
    public ResponseEntity<CareerPathDto> getCareerPath(@PathVariable Long candidateId) {
        log.info("GET career path for candidate {}", candidateId);
        return ResponseEntity.ok(careerPathService.getCareerPath(candidateId));
    }

    @PostMapping("/{candidateId}")
    public ResponseEntity<CareerPathDto> updateCareerPath(
            @PathVariable Long candidateId,
            @Valid @RequestBody CareerPathDto dto
    ) {
        log.info("UPDATE career path for candidate {}", candidateId);
        return ResponseEntity.ok(careerPathService.updateCareerPath(candidateId, dto));
    }

    @PostMapping("/{candidateId}/generate")
    public ResponseEntity<CareerPathDto> generateFromProfile(@PathVariable Long candidateId) {
        log.info("GENERATE career path for candidate {}", candidateId);
        return ResponseEntity.ok(careerPathService.generateFromProfile(candidateId));
    }

    @PostMapping("/{candidateId}/refresh")
    public ResponseEntity<CareerPathDto> refresh(@PathVariable Long candidateId) {
        log.info("REFRESH career path for candidate {}", candidateId);
        return ResponseEntity.ok(careerPathService.refreshCareerPath(candidateId));
    }

    @PostMapping("/{candidateId}/actions/{actionId}/toggle")
    public ResponseEntity<CareerPathDto> toggleAction(
            @PathVariable Long candidateId,
            @PathVariable Long actionId
    ) {
        log.info("TOGGLE action {} for candidate {}", actionId, candidateId);
        return ResponseEntity.ok(
                careerPathService.toggleActionCompletion(candidateId, actionId)
        );
    }
}
