package com.pfa.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecruteurDTO {
    // ID is omitted for creation
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    private String entreprise;
    private String poste;
    private String telephone;
}