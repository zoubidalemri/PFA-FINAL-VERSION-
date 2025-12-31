package com.pfa.backend.Service;

import com.pfa.backend.dto.RecruteurDTO;
import com.pfa.backend.entities.Recruteur;
import com.pfa.backend.repository.RecruteurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruteurService {

    private final RecruteurRepository recruteurRepository;

    @Transactional
    public RecruteurDTO creerRecruteur(RecruteurDTO recruteurDTO) {
        Recruteur recruteur = new Recruteur();
        recruteur.setNom(recruteurDTO.getNom());
        recruteur.setPrenom(recruteurDTO.getPrenom());
        recruteur.setEmail(recruteurDTO.getEmail());
        recruteur.setMotDePasse(recruteurDTO.getMotDePasse());
        recruteur.setEntreprise(recruteurDTO.getEntreprise());
        recruteur.setPoste(recruteurDTO.getPoste());
        recruteur.setTelephone(recruteurDTO.getTelephone());

        Recruteur savedRecruteur = recruteurRepository.save(recruteur);

        return convertToDTO(savedRecruteur);
    }

    private RecruteurDTO convertToDTO(Recruteur recruteur) {
        RecruteurDTO dto = new RecruteurDTO();
        dto.setNom(recruteur.getNom());
        dto.setPrenom(recruteur.getPrenom());
        dto.setEmail(recruteur.getEmail());
        dto.setEntreprise(recruteur.getEntreprise());
        dto.setPoste(recruteur.getPoste());
        dto.setTelephone(recruteur.getTelephone());
        // Note: The ID is not returned in this DTO, but it is saved in the database.
        return dto;
    }
}