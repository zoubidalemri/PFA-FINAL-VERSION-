package com.pfa.backend.controller;

import com.pfa.backend.dto.OffreDTO;
import com.pfa.backend.Service.OffreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recruteur/offres")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OffreController {

    private final OffreService offreService;

    // CREATE - Créer une nouvelle offre
    @PostMapping
    public ResponseEntity<OffreDTO> creerOffre(@RequestBody OffreDTO offreDTO) {
        try {
            OffreDTO createdOffre = offreService.creerOffre(offreDTO);
            return new ResponseEntity<>(createdOffre, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Recruteur non trouvé")) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ - Obtenir une offre par ID
    @GetMapping("/{id}")
    public ResponseEntity<OffreDTO> getOffreById(@PathVariable Long id) {
        try {
            OffreDTO offre = offreService.getOffreById(id);
            return new ResponseEntity<>(offre, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ - Lister toutes les offres d'un recruteur
    @GetMapping("/recruteur/{recruteurId}")
    public ResponseEntity<List<OffreDTO>> getOffresParRecruteur(
            @PathVariable Long recruteurId) {
        try {
            List<OffreDTO> offres = offreService.getOffresParRecruteur(recruteurId);
            return new ResponseEntity<>(offres, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ - Lister les offres par recruteur et statut
    @GetMapping("/recruteur/{recruteurId}/statut/{statut}")
    public ResponseEntity<List<OffreDTO>> getOffresParStatut(
            @PathVariable Long recruteurId,
            @PathVariable String statut) {
        try {
            List<OffreDTO> offres = offreService.getOffresParStatut(recruteurId, statut);
            return new ResponseEntity<>(offres, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // UPDATE - Modifier une offre complète
    @PutMapping("/{id}")
    public ResponseEntity<OffreDTO> modifierOffre(
            @PathVariable Long id,
            @RequestBody OffreDTO offreDTO) {
        try {
            OffreDTO updatedOffre = offreService.modifierOffre(id, offreDTO);
            return new ResponseEntity<>(updatedOffre, HttpStatus.OK);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Offre non trouvée")) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // UPDATE - Changer le statut d'une offre
    @PatchMapping("/{id}/statut")
    public ResponseEntity<OffreDTO> changerStatutOffre(
            @PathVariable Long id,
            @RequestParam String statut) {
        try {
            System.out.println("Changing status for offre " + id + " to: " + statut);
            OffreDTO updatedOffre = offreService.changerStatutOffre(id, statut);
            return new ResponseEntity<>(updatedOffre, HttpStatus.OK);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Offre non trouvée")) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE - Supprimer une offre
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerOffre(@PathVariable Long id) {
        try {
            System.out.println("Attempting to delete offre with ID: " + id);
            offreService.supprimerOffre(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("Offre non trouvée")) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}