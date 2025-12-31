package com.pfa.backend.Service;

import com.pfa.backend.dto.OffreDTO;
import com.pfa.backend.entities.Offre;
import com.pfa.backend.entities.Recruteur;
import com.pfa.backend.repository.OffreRepository;
import com.pfa.backend.repository.RecruteurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OffreService {

    private final OffreRepository offreRepository;
    private final RecruteurRepository recruteurRepository;

    // Fonction 1: CRÉER OFFRE
    @Transactional
    public OffreDTO creerOffre(OffreDTO offreDTO) {
        // 1. Foreign Key check
        Recruteur recruteur = recruteurRepository.findById(offreDTO.getRecruteurId())
                .orElseThrow(() -> new RuntimeException("Recruteur non trouvé"));

        Offre offre = new Offre();
        offre.setTitre(offreDTO.getTitre());
        offre.setDescription(offreDTO.getDescription());
        offre.setTypeContrat(offreDTO.getTypeContrat());
        offre.setLocalisation(offreDTO.getLocalisation());
        offre.setNiveauExperience(offreDTO.getNiveauExperience());
        offre.setCompetencesRequises(offreDTO.getCompetencesRequises());
        offre.setSalaireMin(offreDTO.getSalaireMin());
        offre.setSalaireMax(offreDTO.getSalaireMax());

        // 2. Set default values for system-managed/optional fields
        // Status and DatePublication will be handled by @PrePersist if null
        offre.setStatut(offreDTO.getStatut());
        offre.setDatePublication(offreDTO.getDatePublication());

        offre.setDateExpiration(offreDTO.getDateExpiration() != null ?
                offreDTO.getDateExpiration() : LocalDateTime.now().plusDays(30));

        // 3. Audit fields are handled by @PrePersist in the entity

        // 4. Set the relationship
        offre.setRecruteur(recruteur);

        Offre savedOffre = offreRepository.save(offre);
        return convertToDTO(savedOffre);
    }

    // Fonction 2: GÉRER OFFRES
    @Transactional(readOnly = true)
    public List<OffreDTO> getOffresParRecruteur(Long recruteurId) {
        // Note: Assumes findByRecruteurIdOrderByCreatedAtDesc exists in OffreRepository
        List<Offre> offres = offreRepository.findByRecruteurIdOrderByCreatedAtDesc(recruteurId);
        return offres.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OffreDTO getOffreById(Long id) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        return convertToDTO(offre);
    }

    @Transactional
    public OffreDTO modifierOffre(Long id, OffreDTO offreDTO) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        offre.setTitre(offreDTO.getTitre());
        offre.setDescription(offreDTO.getDescription());
        offre.setTypeContrat(offreDTO.getTypeContrat());
        offre.setLocalisation(offreDTO.getLocalisation());
        offre.setNiveauExperience(offreDTO.getNiveauExperience());
        offre.setCompetencesRequises(offreDTO.getCompetencesRequises());
        offre.setSalaireMin(offreDTO.getSalaireMin());
        offre.setSalaireMax(offreDTO.getSalaireMax());
        offre.setStatut(offreDTO.getStatut());
        offre.setDateExpiration(offreDTO.getDateExpiration());
        // updatedAt is handled by @PreUpdate

        Offre updatedOffre = offreRepository.save(offre);
        return convertToDTO(updatedOffre);
    }

    @Transactional
    public void supprimerOffre(Long id) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        offreRepository.delete(offre);
    }

    @Transactional
    public OffreDTO changerStatutOffre(Long id, String nouveauStatut) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        offre.setStatut(nouveauStatut);

        // Ensure datePublication is set if the offer moves from BROUILLON to ACTIVE
        if ("ACTIVE".equals(nouveauStatut) && offre.getDatePublication() == null) {
            offre.setDatePublication(LocalDateTime.now());
        }
        // updatedAt is handled by @PreUpdate

        Offre updatedOffre = offreRepository.save(offre);
        return convertToDTO(updatedOffre);
    }

    @Transactional(readOnly = true)
    public List<OffreDTO> getOffresParStatut(Long recruteurId, String statut) {
        // Note: Assumes findByRecruteurIdAndStatut exists in OffreRepository
        List<Offre> offres = offreRepository.findByRecruteurIdAndStatut(recruteurId, statut);
        return offres.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Helper method (no changes needed)
    private OffreDTO convertToDTO(Offre offre) {
        OffreDTO dto = new OffreDTO();
        dto.setId(offre.getId());
        dto.setTitre(offre.getTitre());
        dto.setDescription(offre.getDescription());
        dto.setTypeContrat(offre.getTypeContrat());
        dto.setLocalisation(offre.getLocalisation());
        dto.setNiveauExperience(offre.getNiveauExperience());
        dto.setCompetencesRequises(offre.getCompetencesRequises());
        dto.setSalaireMin(offre.getSalaireMin());
        dto.setSalaireMax(offre.getSalaireMax());
        dto.setStatut(offre.getStatut());
        dto.setDatePublication(offre.getDatePublication());
        dto.setDateExpiration(offre.getDateExpiration());
        dto.setRecruteurId(offre.getRecruteur().getId());
        dto.setEntreprise(offre.getRecruteur().getEntreprise());
        dto.setNombreCandidatures(offre.getCandidatures() != null ?
                offre.getCandidatures().size() : 0);
        return dto;
    }
}