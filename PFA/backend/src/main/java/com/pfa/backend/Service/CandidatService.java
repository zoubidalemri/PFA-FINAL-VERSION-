package com.pfa.backend.Service;

import com.pfa.backend.entities.CandidateProfile;
import com.pfa.backend.repository.CandidatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CandidatService {

    private final CandidatRepository candidatRepository;

    @Transactional
    public CandidateProfile createCandidat(CandidateProfile candidat) {
        // Enregistrer le nouveau candidat dans la base de données
        return candidatRepository.save(candidat);
    }
    @Transactional(readOnly = true)
    public CandidateProfile getCandidatById(Long id) {
        return candidatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidat non trouvé"));
    }
    // Ajoutez d'autres méthodes de lecture (getById) si nécessaire
}