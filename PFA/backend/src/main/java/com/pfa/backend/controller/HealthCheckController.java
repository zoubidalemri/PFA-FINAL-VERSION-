package com.pfa.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Contrôleur simple pour vérifier que le backend est opérationnel.
 * L'endpoint /api/health est utilisé par le frontend React pour
 * tester la connectivité.
 */
@RestController
@RequestMapping("/api")
public class HealthCheckController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> checkHealth() {
        // Retourne un statut simple pour confirmer que l'application est en cours d'exécution.
        return ResponseEntity.ok(Map.of("status", "UP", "message", "Spring Boot is alive and kicking!"));
    }
}