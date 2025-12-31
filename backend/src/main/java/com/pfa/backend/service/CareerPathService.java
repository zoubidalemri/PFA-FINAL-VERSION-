package com.pfa.backend.service;

import com.pfa.backend.ai.CareerAiClient;
import com.pfa.backend.ai.CareerPlanResponse;
import com.pfa.backend.dto.CareerActionDto;
import com.pfa.backend.dto.CareerPathDto;
import com.pfa.backend.dto.CandidateProfileDto;
import com.pfa.backend.model.CandidateProfile;
import com.pfa.backend.model.CareerAction;
import com.pfa.backend.model.CareerPathGoal;
import com.pfa.backend.repository.CareerActionRepository;
import com.pfa.backend.repository.CareerPathRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CareerPathService {

    private final CareerAiClient careerAiClient;
    private final CandidateProfileService candidateProfileService;
    private final CareerPathRepository careerPathRepository;
    private final CareerActionRepository careerActionRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public CareerPathService(
            CareerAiClient careerAiClient,
            CandidateProfileService candidateProfileService,
            CareerPathRepository careerPathRepository,
            CareerActionRepository careerActionRepository
    ) {
        this.careerAiClient = careerAiClient;
        this.candidateProfileService = candidateProfileService;
        this.careerPathRepository = careerPathRepository;
        this.careerActionRepository = careerActionRepository;
    }

    // ============================================================
    // GET
    // ============================================================

    @Transactional(readOnly = true)
    public CareerPathDto getCareerPath(Long candidateId) {
        log.debug("Getting career path for candidate: {}", candidateId);

        CareerPathGoal entity = careerPathRepository
                .findByCandidate_Id(candidateId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No career path found for candidate: " + candidateId));

        return mapToDto(entity);
    }

    // ============================================================
    // UPDATE / CREATE
    // ============================================================

    @Transactional
    public CareerPathDto updateCareerPath(Long candidateId, CareerPathDto dto) {
        log.info("Updating career path for candidate: {}", candidateId);

        CareerPathGoal entity = careerPathRepository
                .findByCandidate_Id(candidateId)
                .orElseGet(() -> {
                    CareerPathGoal newPath = new CareerPathGoal();
                    newPath.setCandidate(candidateRef(candidateId));
                    return newPath;
                });

        entity.setTargetJob(dto.getTargetJob());
        entity.setTargetDomain(dto.getTargetDomain());
        entity.setObjectiveType(dto.getObjectiveType());
        entity.setTimeHorizonMonths(dto.getTimeHorizonMonths());
        entity.setDescription(dto.getDescription());

        CareerPathGoal saved = careerPathRepository.save(entity);
        return mapToDto(saved);
    }

    @Transactional
    public CareerPathDto generateFromProfile(Long candidateId) {
        log.info("Generating career path from profile for candidate: {}", candidateId);

        CandidateProfileDto profile = candidateProfileService.getFullProfile(candidateId);
        if (profile == null) {
            throw new IllegalStateException("Profile not found for candidate: " + candidateId);
        }

        CareerPathGoal entity = careerPathRepository
                .findByCandidate_Id(candidateId)
                .orElseGet(() -> {
                    CareerPathGoal newPath = new CareerPathGoal();
                    newPath.setCandidate(candidateRef(candidateId));
                    return newPath;
                });

        if (entity.getTargetJob() == null || entity.getTargetJob().isBlank()) {
            entity.setTargetJob("Poste généré depuis profil");
            // ✅ CandidateProfileDto n'a pas getTargetDomain() => valeur neutre
            entity.setTargetDomain("Non spécifié");
            entity.setObjectiveType("FIRST_JOB");
            entity.setTimeHorizonMonths(6);
            entity.setDescription("Objectif généré automatiquement depuis votre profil");
        }

        careerPathRepository.save(entity);

        // Optionnel : générer les actions via IA
        return refreshCareerPath(candidateId);
    }

    // ============================================================
    // AI
    // ============================================================

    @Transactional
    public CareerPathDto refreshCareerPath(Long candidateId) {
        log.info("Refreshing career path with AI for candidate: {}", candidateId);

        CareerPathGoal entity = careerPathRepository
                .findByCandidate_Id(candidateId)
                .orElseThrow(() -> new IllegalStateException(
                        "No career path to refresh for candidate: " + candidateId));

        CandidateProfileDto profile = candidateProfileService.getFullProfile(candidateId);

        String profileText = buildProfileText(profile);
        String objectiveText = buildObjectiveText(entity);

        try {
            CareerPlanResponse aiResponse = careerAiClient.getCareerPlan(
                    profileText,
                    objectiveText,
                    5
            );

            int scorePercent = (int) Math.round(aiResponse.compatibilityScore() * 100);
            entity.setReadinessScore(scorePercent);

            // supprimer anciennes actions
            careerActionRepository.deleteByCareerPathId(entity.getId());

            List<CareerAction> newActions = new ArrayList<>();
            int order = 0;

            for (var aiAction : aiResponse.actions()) {
                CareerAction action = new CareerAction();
                action.setCareerPathGoal(entity);
                action.setLabel(aiAction.label());
                action.setCategory(aiAction.category());
                action.setCompleted(false);
                action.setWeight(calculateWeight(aiAction.category()));
                action.setEstimatedTime(estimateTime(aiAction.category()));
                action.setPriority(determinePriority(order, aiResponse.actions().size()));
                action.setOrderIndex(order++);
                newActions.add(action);
            }

            careerActionRepository.saveAll(newActions);
            entity.setActions(newActions);

            CareerPathGoal saved = careerPathRepository.save(entity);
            log.info("Career path refreshed for candidate {} (score {}%)", candidateId, scorePercent);

            return mapToDto(saved);

        } catch (Exception e) {
            log.error("Error calling AI service for candidate {}: {}", candidateId, e.getMessage(), e);
            throw new RuntimeException("Failed to refresh career path with AI", e);
        }
    }

    @Transactional
    public CareerPathDto toggleActionCompletion(Long candidateId, Long actionId) {
        log.info("Toggling action {} for candidate {}", actionId, candidateId);

        CareerAction action = careerActionRepository.findById(actionId)
                .orElseThrow(() -> new IllegalArgumentException("Action not found: " + actionId));

        Long ownerCandidateId = action.getCareerPathGoal() != null && action.getCareerPathGoal().getCandidate() != null
                ? action.getCareerPathGoal().getCandidate().getId()
                : null;

        if (ownerCandidateId == null || !ownerCandidateId.equals(candidateId)) {
            throw new IllegalArgumentException("Action does not belong to candidate");
        }

        action.setCompleted(!Boolean.TRUE.equals(action.getCompleted()));
        careerActionRepository.save(action);

        updateReadinessScore(action.getCareerPathGoal());

        return mapToDto(action.getCareerPathGoal());
    }

    // ============================================================
    // Helpers
    // ============================================================

    private CandidateProfile candidateRef(Long candidateId) {
        return entityManager.getReference(CandidateProfile.class, candidateId);
    }

    private String buildProfileText(CandidateProfileDto profile) {
        if (profile == null) return "Profil candidat: (profil indisponible)\n";

        StringBuilder sb = new StringBuilder();
        sb.append("Profil candidat:\n");
        sb.append("Nom: ")
                .append(nullSafe(profile.getFirstName())).append(" ")
                .append(nullSafe(profile.getLastName())).append("\n");

        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            sb.append("Compétences: ").append(joinAny(profile.getSkills())).append("\n");
        }

        if (profile.getExperiences() != null && !profile.getExperiences().isEmpty()) {
            sb.append("Expériences: ").append(profile.getExperiences().size()).append(" expérience(s)\n");
            profile.getExperiences().forEach(exp ->
                    sb.append("  - ").append(nullSafe(exp.getTitle()))
                            .append(" chez ").append(nullSafe(exp.getCompany()))
                            .append("\n")
            );
        }

        // ✅ CandidateProfileDto n'a pas getEducation() => bloc supprimé

        if (profile.getLanguages() != null && !profile.getLanguages().isEmpty()) {
            sb.append("Langues: ").append(joinAny(profile.getLanguages())).append("\n");
        }

        return sb.toString();
    }

    private String buildObjectiveText(CareerPathGoal careerPath) {
        return String.format("""
                Objectif professionnel:
                - Poste visé: %s
                - Domaine: %s
                - Type d'objectif: %s
                - Horizon: %s mois
                - Description: %s
                """,
                nullSafe(careerPath.getTargetJob()),
                nullSafe(careerPath.getTargetDomain()),
                nullSafe(careerPath.getObjectiveType()),
                careerPath.getTimeHorizonMonths() != null ? careerPath.getTimeHorizonMonths() : 0,
                nullSafe(careerPath.getDescription())
        );
    }

    private String nullSafe(String s) {
        return s == null ? "" : s;
    }

    private String joinAny(List<?> list) {
        return list.stream()
                .map(x -> x == null ? "" : x.toString())
                .collect(Collectors.joining(", "));
    }

    private int calculateWeight(String category) {
        if (category == null) return 10;
        return switch (category.toUpperCase()) {
            case "CERTIFICATION" -> 20;
            case "PROJECT" -> 15;
            case "EXPERIENCE" -> 15;
            case "SKILL" -> 10;
            case "PORTFOLIO" -> 10;
            case "NETWORKING" -> 15;
            case "CV" -> 10;
            case "INTERVIEW" -> 5;
            default -> 10;
        };
    }

    private String estimateTime(String category) {
        if (category == null) return "À déterminer";
        return switch (category.toUpperCase()) {
            case "CERTIFICATION" -> "1-2 mois";
            case "PROJECT" -> "2-4 semaines";
            case "EXPERIENCE" -> "Variable";
            case "SKILL" -> "2-3 semaines";
            case "PORTFOLIO" -> "1-2 semaines";
            case "NETWORKING" -> "1-2 semaines";
            case "CV" -> "1 semaine";
            case "INTERVIEW" -> "1 semaine";
            default -> "À déterminer";
        };
    }

    private String determinePriority(int order, int total) {
        if (total <= 0) return "medium";
        if (order < total * 0.3) return "high";
        if (order < total * 0.7) return "medium";
        return "low";
    }

    private void updateReadinessScore(CareerPathGoal careerPath) {
        if (careerPath == null) return;

        List<CareerAction> actions = careerPath.getActions();
        if (actions == null || actions.isEmpty()) return;

        int totalWeight = actions.stream()
                .mapToInt(a -> a.getWeight() != null ? a.getWeight() : 0)
                .sum();

        int completedWeight = actions.stream()
                .filter(a -> Boolean.TRUE.equals(a.getCompleted()))
                .mapToInt(a -> a.getWeight() != null ? a.getWeight() : 0)
                .sum();

        int newScore = totalWeight > 0
                ? (int) Math.round((completedWeight * 100.0) / totalWeight)
                : 0;

        int currentScore = careerPath.getReadinessScore() != null ? careerPath.getReadinessScore() : 0;
        careerPath.setReadinessScore((currentScore + newScore) / 2);

        careerPathRepository.save(careerPath);
    }

    // ============================================================
    // Mapping
    // ============================================================

    private CareerPathDto mapToDto(CareerPathGoal entity) {
        List<CareerActionDto> actionDtos = entity.getActions() != null
                ? entity.getActions().stream().map(this::mapActionToDto).collect(Collectors.toList())
                : new ArrayList<>();

        Long candidateId = (entity.getCandidate() != null) ? entity.getCandidate().getId() : null;

        CareerPathDto dto = CareerPathDto.builder()
                .id(entity.getId())
                .candidateId(candidateId)
                .targetJob(entity.getTargetJob())
                .targetDomain(entity.getTargetDomain())
                .objectiveType(entity.getObjectiveType())
                .timeHorizonMonths(entity.getTimeHorizonMonths())
                .description(entity.getDescription())
                .readinessScore(entity.getReadinessScore())
                .actions(actionDtos)
                .createdAt(LocalDateTime.now())
                .build();

        dto.calculateStats();
        return dto;
    }

    private CareerActionDto mapActionToDto(CareerAction entity) {
        return CareerActionDto.builder()
                .id(entity.getId())
                .label(entity.getLabel())
                .category(entity.getCategory())
                .completed(entity.getCompleted())
                .weight(entity.getWeight())
                .estimatedTime(entity.getEstimatedTime())
                .priority(entity.getPriority())
                .orderIndex(entity.getOrderIndex())
                .resourceUrl(entity.getResourceUrl())
                .detailedDescription(entity.getDetailedDescription())
                .build();
    }
}
