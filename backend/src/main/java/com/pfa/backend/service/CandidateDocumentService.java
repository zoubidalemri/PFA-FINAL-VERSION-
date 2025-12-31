package com.pfa.backend.service;

import com.pfa.backend.dto.CandidateDocumentDto;
import com.pfa.backend.model.CandidateDocument;
import com.pfa.backend.model.CandidateProfile;
import com.pfa.backend.repository.CandidateDocumentRepository;
import com.pfa.backend.repository.CandidateProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CandidateDocumentService {

    private final CandidateDocumentRepository documentRepository;
    private final CandidateProfileRepository profileRepository;

    private final Path uploadRoot = Paths.get("uploads");

    public CandidateDocumentService(CandidateDocumentRepository documentRepository,
                                    CandidateProfileRepository profileRepository) {
        this.documentRepository = documentRepository;
        this.profileRepository = profileRepository;
    }

    public CandidateDocumentDto uploadDocument(Long candidateId,
                                               String label,
                                               String type,
                                               MultipartFile file) {

        try {
            // 1) Vérifier que le profil existe
            CandidateProfile profile = profileRepository.findById(candidateId)
                    .orElseThrow(() ->
                            new RuntimeException("Profil non trouvé pour id=" + candidateId));

            // 2) Dossier uploads
            Files.createDirectories(uploadRoot);

            // 3) Sauvegarde du fichier
            String storedName = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path target = uploadRoot.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            // 4) Sauvegarde BDD
            CandidateDocument doc = new CandidateDocument();
            doc.setCandidateProfile(profile);
            doc.setLabel(label);
            doc.setType(type);
            doc.setFileName(file.getOriginalFilename());
            doc.setFilePath(target.toString());
            doc.setMimeType(file.getContentType());
            doc.setUploadedAt(LocalDateTime.now());

            doc = documentRepository.save(doc);

            // 5) DTO
            CandidateDocumentDto dto = new CandidateDocumentDto();
            dto.setId(doc.getId());
            dto.setLabel(doc.getLabel());
            dto.setType(doc.getType());
            dto.setFileName(doc.getFileName());
            dto.setUploadedAt(doc.getUploadedAt());
            return dto;

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'enregistrement du fichier", e);
        }
    }

    public List<CandidateDocumentDto> listDocuments(Long candidateId) {
        return documentRepository.findByCandidateProfileId(candidateId)
                .stream()
                .map(doc -> {
                    CandidateDocumentDto dto = new CandidateDocumentDto();
                    dto.setId(doc.getId());
                    dto.setLabel(doc.getLabel());
                    dto.setType(doc.getType());
                    dto.setFileName(doc.getFileName());
                    dto.setUploadedAt(doc.getUploadedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
