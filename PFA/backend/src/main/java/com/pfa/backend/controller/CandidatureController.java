package com.pfa.backend.controller;

import com.pfa.backend.dto.CandidatureDTO;
import com.pfa.backend.Service.CandidatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruteur/candidatures")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CandidatureController {

    private final CandidatureService candidatureService;

    // CONSULTER CANDIDATURES - Par offre
    @GetMapping("/offre/{offreId}")
    public ResponseEntity<List<CandidatureDTO>> getCandidaturesParOffre(
            @PathVariable Long offreId) {
        try {
            List<CandidatureDTO> candidatures = candidatureService
                    .getCandidaturesParOffre(offreId);
            return new ResponseEntity<>(candidatures, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // CONSULTER CANDIDATURES - Par recruteur
    @GetMapping("/recruteur/{recruteurId}")
    public ResponseEntity<List<CandidatureDTO>> getCandidaturesParRecruteur(
            @PathVariable Long recruteurId) {
        try {
            List<CandidatureDTO> candidatures = candidatureService
                    .getCandidaturesParRecruteur(recruteurId);
            return new ResponseEntity<>(candidatures, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // POSTULER
    @PostMapping("/postuler")
    public ResponseEntity<CandidatureDTO> postuler(@RequestBody Map<String, Object> body) {
        try {
            Long offreId = Long.valueOf(body.get("offreId").toString());
            Long candidatId = Long.valueOf(body.get("candidatId").toString());
            String lettreMotivation = (String) body.getOrDefault("lettreMotivation", "");
            String cvUrl = (String) body.getOrDefault("cvUrl", "");

            CandidatureDTO createdCandidature = candidatureService.postuler(
                    offreId, candidatId, lettreMotivation, cvUrl);
            return new ResponseEntity<>(createdCandidature, HttpStatus.CREATED);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // CONSULTER CANDIDATURES - Détails d'une candidature
    @GetMapping("/{id}")
    public ResponseEntity<CandidatureDTO> getCandidatureById(@PathVariable Long id) {
        try {
            CandidatureDTO candidature = candidatureService.getCandidatureById(id);
            return new ResponseEntity<>(candidature, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // CONSULTER CANDIDATURES - Changer statut
    @PatchMapping("/{id}/statut")
    public ResponseEntity<CandidatureDTO> changerStatutCandidature(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String statut = body.get("statut");
            String commentaire = body.getOrDefault("commentaire", "");

            CandidatureDTO updatedCandidature = candidatureService
                    .changerStatutCandidature(id, statut, commentaire);
            return new ResponseEntity<>(updatedCandidature, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // CONSULTER CANDIDATURES - Accepter
    @PostMapping("/{id}/accepter")
    public ResponseEntity<CandidatureDTO> accepterCandidature(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String commentaire = body != null ? body.getOrDefault("commentaire", "") : "";
            CandidatureDTO candidature = candidatureService.accepterCandidature(id, commentaire);
            return new ResponseEntity<>(candidature, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // CONSULTER CANDIDATURES - Refuser
    @PostMapping("/{id}/refuser")
    public ResponseEntity<CandidatureDTO> refuserCandidature(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String commentaire = body != null ? body.getOrDefault("commentaire", "") : "";
            CandidatureDTO candidature = candidatureService.refuserCandidature(id, commentaire);
            return new ResponseEntity<>(candidature, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // CONSULTER CANDIDATURES - Mettre en cours
    @PostMapping("/{id}/en-cours")
    public ResponseEntity<CandidatureDTO> mettreEnCours(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String commentaire = body != null ? body.getOrDefault("commentaire", "") : "";
            CandidatureDTO candidature = candidatureService.mettreEnCours(id, commentaire);
            return new ResponseEntity<>(candidature, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // ==================== NEW INTERVIEW ENDPOINTS ====================

    // CONSULTER CANDIDATURES - Mettre en statut Interview
    @PostMapping("/{id}/interview")
    public ResponseEntity<CandidatureDTO> mettreEnInterview(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String commentaire = body != null ? body.getOrDefault("commentaire", "") : "";
            CandidatureDTO candidature = candidatureService.mettreEnInterview(id, commentaire);
            return new ResponseEntity<>(candidature, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // NOUVELLE FONCTION: Noter l'interview avec checklist
    @PostMapping("/{id}/noter-interview")
    public ResponseEntity<?> noterInterview(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String checklistResults = body.get("checklistResults");
            String skillComments = body.get("skillComments");
            String commentaire = body.getOrDefault("commentaire", "");

            CandidatureDTO candidature = candidatureService.noterInterview(
                    id, checklistResults, skillComments, commentaire);

            return new ResponseEntity<>(candidature, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    Map.of("message", e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    Map.of("message", "Erreur lors de la notation: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // ================================================================

    // CONSULTER CANDIDATURES - Filtrer par statut
    @GetMapping("/recruteur/{recruteurId}/statut/{statut}")
    public ResponseEntity<List<CandidatureDTO>> getCandidaturesParStatut(
            @PathVariable Long recruteurId,
            @PathVariable String statut) {
        try {
            List<CandidatureDTO> candidatures = candidatureService
                    .getCandidaturesParStatut(recruteurId, statut);
            return new ResponseEntity<>(candidatures, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}