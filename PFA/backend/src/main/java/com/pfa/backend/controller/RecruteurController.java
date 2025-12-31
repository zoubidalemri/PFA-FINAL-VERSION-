package com.pfa.backend.controller;

import com.pfa.backend.dto.RecruteurDTO;
import com.pfa.backend.Service.RecruteurService;
import com.pfa.backend.entities.Offre;
import com.pfa.backend.repository.OffreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/recruteur")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RecruteurController {

    private final RecruteurService recruteurService;

    @Autowired
    private OffreRepository offreRepository;

    // ============================================
    // RECRUITER ENDPOINTS
    // ============================================

    /**
     * Create a new recruiter
     * POST /api/recruteur
     */
    @PostMapping
    public ResponseEntity<RecruteurDTO> creerRecruteur(@RequestBody RecruteurDTO recruteurDTO) {
        try {
            RecruteurDTO createdRecruteur = recruteurService.creerRecruteur(recruteurDTO);
            return new ResponseEntity<>(createdRecruteur, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ============================================
    // INTERVIEW CHECKLIST ENDPOINTS
    // ============================================

    /**
     * Get interview checklist for a specific job offer
     * GET /api/recruteur/offres/{id}/checklist
     */
    @GetMapping("/offres/{id}/checklist")
    public ResponseEntity<?> getChecklist(@PathVariable Long id) {
        try {
            return offreRepository.findById(id)
                    .map(offre -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("interviewChecklist", offre.getInterviewChecklist());
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Save/Update interview checklist for a specific job offer
     * PATCH /api/recruteur/offres/{id}/checklist
     */
    @PatchMapping("/offres/{id}/checklist")
    public ResponseEntity<?> updateChecklist(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {

        try {
            return offreRepository.findById(id)
                    .map(offre -> {
                        // Get the interviewChecklist from the payload
                        @SuppressWarnings("unchecked")
                        Map<String, Object> checklistData = (Map<String, Object>) payload.get("interviewChecklist");

                        // Save it directly to the offre
                        offre.setInterviewChecklist(checklistData);

                        // Save to database
                        Offre updatedOffre = offreRepository.save(offre);

                        // Return success response
                        Map<String, Object> response = new HashMap<>();
                        response.put("message", "Checklist saved successfully");
                        response.put("interviewChecklist", updatedOffre.getInterviewChecklist());

                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        Map<String, Object> errorResponse = new HashMap<>();
                        errorResponse.put("error", "Offre not found");
                        errorResponse.put("message", "No job offer found with ID: " + id);
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
                    });

        } catch (ClassCastException e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid data format");
            errorResponse.put("message", "The checklist data format is incorrect");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to save checklist");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Delete interview checklist for a specific job offer
     * DELETE /api/recruteur/offres/{id}/checklist
     */
    @DeleteMapping("/offres/{id}/checklist")
    public ResponseEntity<?> deleteChecklist(@PathVariable Long id) {
        try {
            return offreRepository.findById(id)
                    .map(offre -> {
                        offre.setInterviewChecklist(null);
                        offreRepository.save(offre);

                        Map<String, Object> response = new HashMap<>();
                        response.put("message", "Checklist deleted successfully");
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        Map<String, Object> errorResponse = new HashMap<>();
                        errorResponse.put("error", "Offre not found");
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
                    });
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete checklist");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}