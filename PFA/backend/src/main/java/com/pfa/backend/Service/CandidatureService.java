package com.pfa.backend.Service;

import com.pfa.backend.dto.CandidatureDTO;
import com.pfa.backend.entities.CandidateProfile;
import com.pfa.backend.entities.Candidature;
import com.pfa.backend.entities.Offre;
import com.pfa.backend.repository.CandidatRepository;
import com.pfa.backend.repository.CandidatureRepository;
import com.pfa.backend.repository.OffreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final OffreRepository offreRepository;
    private final CandidatRepository candidatRepository;

    // --- LOGIQUE DE SCORE AI (PROXY) ---

    private static final double WEIGHT_KEYWORDS = 0.50;
    private static final double WEIGHT_EXPERIENCE = 0.20;
    private static final double WEIGHT_EDUCATION = 0.20;
    private static final double WEIGHT_CONTRAT = 0.10;

    /**
     * Calcule le score de matching entre un candidat et une offre.
     */
    private double calculerScoreMatching(Offre offre, CandidateProfile candidat) {
        if (offre == null || candidat == null) return 0.0;

        double totalScore = 0.0;

        totalScore += matchingKeywords(offre.getCompetencesRequises(), candidat.getCompetences()) * WEIGHT_KEYWORDS;
        totalScore += matchingExperience(offre.getNiveauExperience(), candidat.getNiveauEtude()) * WEIGHT_EXPERIENCE;
        totalScore += matchingEducation(offre.getNiveauExperience(), candidat.getNiveauEtude()) * WEIGHT_EDUCATION;
        totalScore += matchingContrat(offre.getTypeContrat(), candidat.getFormation()) * WEIGHT_CONTRAT;

        double finalScore = Math.max(0.0, Math.min(100.0, totalScore * 100.0));

        return Math.round(finalScore);
    }

    private double matchingKeywords(String requiredSkills, String candidateSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) return 1.0;

        List<String> required = Arrays.stream(requiredSkills.toLowerCase().split("[ ,;]+"))
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        List<String> candidate = Arrays.stream(candidateSkills != null ? candidateSkills.toLowerCase().split("[ ,;]+") : new String[0])
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        if (required.isEmpty()) return 1.0;

        long matchedKeywords = required.stream()
                .filter(req -> candidate.stream().anyMatch(cand -> cand.contains(req) || req.contains(cand)))
                .count();

        return (double) matchedKeywords / required.size();
    }

    private double matchingExperience(String requiredExperience, String candidateEducation) {
        String expLower = requiredExperience != null ? requiredExperience.toLowerCase() : "";
        String eduLower = candidateEducation != null ? candidateEducation.toLowerCase() : "";

        if (expLower.contains("junior")) {
            if (eduLower.contains("licence") || eduLower.contains("master") || eduLower.contains("ingénieur")) return 1.0;
            return 0.5;
        } else if (expLower.contains("intermédiaire") || expLower.contains("confirmé")) {
            if (eduLower.contains("master") || eduLower.contains("ingénieur")) return 1.0;
            return 0.7;
        } else if (expLower.contains("senior")) {
            if (eduLower.contains("master") || eduLower.contains("ingénieur")) return 0.8;
            return 0.1;
        }
        return 0.5;
    }

    private double matchingEducation(String requiredExperience, String candidateEducation) {
        return matchingExperience(requiredExperience, candidateEducation);
    }

    private double matchingContrat(String typeContrat, String formation) {
        String contratLower = typeContrat != null ? typeContrat.toLowerCase() : "";
        String formLower = formation != null ? formation.toLowerCase() : "";

        if (contratLower.contains("stage") && formLower.contains("informatique")) {
            return 1.0;
        }

        if (contratLower.contains("cdi") && !formLower.contains("stage")) {
            return 1.0;
        }

        return 0.5;
    }

    // --- FONCTION DE CRÉATION DE CANDIDATURE (Postuler) ---
    @Transactional
    public CandidatureDTO postuler(Long offreId, Long candidatId, String lettreMotivation, String cvUrl) {
        Offre offre = offreRepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        CandidateProfile candidat = candidatRepository.findById(candidatId)
                .orElseThrow(() -> new RuntimeException("Candidat non trouvé"));

        Candidature candidature = new Candidature();
        candidature.setOffre(offre);
        candidature.setCandidat(candidat);
        candidature.setLettreMotivation(lettreMotivation);
        candidature.setCvUrl(cvUrl);
        candidature.setStatut("EN_ATTENTE");

        double score = calculerScoreMatching(offre, candidat);
        candidature.setScoreMatching(score);

        Candidature savedCandidature = candidatureRepository.save(candidature);
        return convertToDTO(savedCandidature);
    }

    // --- CONSULTATION ET GESTION DES CANDIDATURES ---

    @Transactional(readOnly = true)
    public List<CandidatureDTO> getCandidaturesParOffre(Long offreId) {
        List<Candidature> candidatures = candidatureRepository
                .findByOffreIdOrderByScoreMatchingDesc(offreId);
        return candidatures.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CandidatureDTO> getCandidaturesParRecruteur(Long recruteurId) {
        List<Candidature> candidatures = candidatureRepository
                .findByOffreRecruteurIdOrderByScoreMatchingDesc(recruteurId);
        return candidatures.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CandidatureDTO getCandidatureById(Long id) {
        Candidature candidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));
        return convertToDTO(candidature);
    }

    @Transactional
    public CandidatureDTO changerStatutCandidature(Long id, String nouveauStatut, String commentaire) {
        Candidature candidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        candidature.setStatut(nouveauStatut);
        candidature.setCommentaireRecruteur(commentaire);
        candidature.setDateReponse(LocalDateTime.now());

        Candidature updatedCandidature = candidatureRepository.save(candidature);
        return convertToDTO(updatedCandidature);
    }

    @Transactional(readOnly = true)
    public List<CandidatureDTO> getCandidaturesParStatut(Long recruteurId, String statut) {
        List<Candidature> candidatures = candidatureRepository
                .findByOffreRecruteurIdAndStatut(recruteurId, statut);
        return candidatures.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CandidatureDTO accepterCandidature(Long id, String commentaire) {
        return changerStatutCandidature(id, "ACCEPTEE", commentaire);
    }

    @Transactional
    public CandidatureDTO refuserCandidature(Long id, String commentaire) {
        return changerStatutCandidature(id, "REFUSEE", commentaire);
    }

    @Transactional
    public CandidatureDTO mettreEnCours(Long id, String commentaire) {
        return changerStatutCandidature(id, "EN_COURS", commentaire);
    }

    /**
     * NOUVEAU: Mettre la candidature en statut INTERVIEW
     */
    @Transactional
    public CandidatureDTO mettreEnInterview(Long candidatureId, String commentaire) {
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée"));

        candidature.setStatut("INTERVIEW");
        candidature.setCommentaireRecruteur(commentaire);
        candidature.setDateReponse(LocalDateTime.now());

        Candidature saved = candidatureRepository.save(candidature);
        return convertToDTO(saved);
    }

    /**
     * NOUVEAU: Noter l'interview avec la checklist des compétences
     */
    @Transactional
    public CandidatureDTO noterInterview(Long candidatureId, String checklistResults,
                                         String skillComments, String commentaire) {
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature non trouvée avec l'ID: " + candidatureId));

        // Enregistrer les résultats de la checklist
        candidature.setInterviewChecklistResults(checklistResults);
        candidature.setInterviewSkillComments(skillComments);
        candidature.setInterviewCommentaire(commentaire);

        // Mettre à jour le statut si pas déjà en INTERVIEW
        if (!"INTERVIEW".equals(candidature.getStatut())) {
            candidature.setStatut("INTERVIEW");
            candidature.setDateReponse(LocalDateTime.now());
        }

        Candidature saved = candidatureRepository.save(candidature);
        return convertToDTO(saved);
    }

    /**
     * Convertit une entité Candidature en DTO
     */
    private CandidatureDTO convertToDTO(Candidature candidature) {
        CandidatureDTO dto = new CandidatureDTO();

        dto.setId(candidature.getId());
        dto.setOffreId(candidature.getOffre().getId());
        dto.setTitrOffre(candidature.getOffre().getTitre());

        if (candidature.getCandidat() != null) {
            dto.setCandidatId(candidature.getCandidat().getId());
            dto.setNomCandidat(candidature.getCandidat().getNom());
            dto.setPrenomCandidat(candidature.getCandidat().getPrenom());
            dto.setEmailCandidat(candidature.getCandidat().getEmail());
            dto.setTelephoneCandidat(candidature.getCandidat().getTelephone());
            dto.setFormation(candidature.getCandidat().getFormation());
            dto.setNiveauEtude(candidature.getCandidat().getNiveauEtude());
            dto.setCompetences(candidature.getCandidat().getCompetences());
            dto.setCvUrl(candidature.getCandidat().getCvUrl());
        }

        dto.setStatut(candidature.getStatut());
        dto.setLettreMotivation(candidature.getLettreMotivation());
        dto.setScoreMatching(candidature.getScoreMatching());
        dto.setCommentaireRecruteur(candidature.getCommentaireRecruteur());

        // Nouveaux champs interview
        dto.setInterviewChecklistResults(candidature.getInterviewChecklistResults());
        dto.setInterviewSkillComments(candidature.getInterviewSkillComments());
        dto.setInterviewCommentaire(candidature.getInterviewCommentaire());

        dto.setDateCandidature(candidature.getDateCandidature());
        dto.setDateReponse(candidature.getDateReponse());

        return dto;
    }
}