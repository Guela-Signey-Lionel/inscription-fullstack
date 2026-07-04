package com.pkfokam.inscription.auth.config;

import com.pkfokam.inscription.auth.dto.*;
import com.pkfokam.inscription.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/auth")
@RequiredArgsConstructor @Tag(name="Authentification")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login") @Operation(summary="Connexion JWT")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/register") @Operation(summary="Créer un compte candidat")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest req) {
        return ResponseEntity.status(201).body(authService.register(req));
    }

    @PostMapping("/verify-otp") @Operation(summary="Vérifier l'email par OTP")
    public ResponseEntity<Void> verifyOtp(@RequestBody @Valid VerifyOtpRequest req) {
        authService.verifyOtp(req); return ResponseEntity.ok().build();
    }

    @PostMapping("/send-otp") @Operation(summary="Renvoyer le code OTP")
    public ResponseEntity<Void> sendOtp(@RequestParam String email) {
        authService.sendOtp(email); return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh") @Operation(summary="Renouveler le token")
    public ResponseEntity<AuthResponse> refresh(@RequestHeader("X-Refresh-Token") String token) {
        return ResponseEntity.ok(authService.refresh(token));
    }
}
