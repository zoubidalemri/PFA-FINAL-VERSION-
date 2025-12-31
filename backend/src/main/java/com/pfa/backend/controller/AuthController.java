// com.pfa.backend.controller.AuthController.java

package com.pfa.backend.controller;

import com.pfa.backend.dto.AuthRequest;
import com.pfa.backend.dto.AuthResponse;
import com.pfa.backend.dto.RegisterRequest;
import com.pfa.backend.model.CandidateProfile;
import com.pfa.backend.repository.CandidateProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final CandidateProfileRepository profileRepository;

    public AuthController(CandidateProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {

        if (profileRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // 409
        }

        CandidateProfile profile = CandidateProfile.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword()) // en prod : encoder !
                .openToWork(true)
                .build();

        profile = profileRepository.save(profile);

        AuthResponse resp = new AuthResponse(
                profile.getId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getEmail()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {

        return profileRepository
                .findByEmailAndPassword(request.getEmail(), request.getPassword())
                .map(profile -> {
                    AuthResponse resp = new AuthResponse(
                            profile.getId(),
                            profile.getFirstName(),
                            profile.getLastName(),
                            profile.getEmail()
                    );
                    return ResponseEntity.ok(resp);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
