package com.pfa.backend.controller;



import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Ce contrôleur est utilisé pour vérifier la santé (health check) et
 * la connectivité entre le frontend et le backend.
 */
@RestController
@RequestMapping("/api")
public class StatusController {

    /**
     * Point de terminaison pour vérifier le statut du service.
     * @return un message de confirmation simple.
     */
    @GetMapping("/status")
    public String getStatus() {
        // Renvoie un message simple indiquant que le backend est en cours d'exécution.
        return "Backend is running successfully!";
    }
}
