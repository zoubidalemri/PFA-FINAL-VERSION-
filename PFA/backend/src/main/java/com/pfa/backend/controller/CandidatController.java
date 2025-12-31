package com.pfa.backend.controller;

import com.pfa.backend.Service.CandidatService;
import com.pfa.backend.entities.CandidateProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CandidatController {

    private final CandidatService candidatService;

    /**
     * Crée un nouveau Candidat (pour l'inscription ou les tests).
     * @param candidat Les données du Candidat.
     * @return Le Candidat créé avec son ID.
     */
    @PostMapping
    public ResponseEntity<CandidateProfile> createCandidat(@RequestBody CandidateProfile candidat) {
        try {
            CandidateProfile savedCandidat = candidatService.createCandidat(candidat);
            return new ResponseEntity<>(savedCandidat, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<CandidateProfile> getCandidatById(@PathVariable Long id) {
        try {
            CandidateProfile candidat = candidatService.getCandidatById(id);
            return new ResponseEntity<>(candidat, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // Vous pouvez ajouter un GET pour récupérer un candidat par ID ici pour les tests
}