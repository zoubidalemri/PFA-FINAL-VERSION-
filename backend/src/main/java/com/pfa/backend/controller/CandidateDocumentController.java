package com.pfa.backend.controller;

import com.pfa.backend.dto.CandidateDocumentDto;
import com.pfa.backend.service.CandidateDocumentService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidates/{candidateId}/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidateDocumentController {

    private final CandidateDocumentService documentService;

    public CandidateDocumentController(CandidateDocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CandidateDocumentDto uploadDocument(
            @PathVariable Long candidateId,
            @RequestParam("label") String label,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file
    ) {
        return documentService.uploadDocument(candidateId, label, type, file);
    }

    @GetMapping
    public List<CandidateDocumentDto> listDocuments(@PathVariable Long candidateId) {
        return documentService.listDocuments(candidateId);
    }
}
