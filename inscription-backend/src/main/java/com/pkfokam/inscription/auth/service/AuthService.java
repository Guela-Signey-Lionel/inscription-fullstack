package com.pkfokam.inscription.auth.service;

import com.pkfokam.inscription.auth.dto.*;
import com.pkfokam.inscription.auth.entity.*;
import com.pkfokam.inscription.auth.repository.*;
import com.pkfokam.inscription.auth.security.JwtService;
import com.pkfokam.inscription.notification.service.NotificationService;
import com.pkfokam.inscription.shared.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service @RequiredArgsConstructor @Transactional
public class AuthService {
    private final UtilisateurRepository utilisateurRepo;
    private final OtpRepository otpRepo;
    private final JwtService jwtService;
    private final PasswordEncoder encoder;
    private final NotificationService notificationService;

    @Value("${app.otp.expiration-minutes:10}") private int otpExpirationMinutes;

    @Transactional(readOnly=true)
    public AuthResponse login(LoginRequest req) {
        Utilisateur u = utilisateurRepo.findByEmail(req.email())
            .orElseThrow(() -> new BusinessException("Identifiants incorrects"));
        if (u.getBloqueJusquAu() != null && Instant.now().isBefore(u.getBloqueJusquAu()))
            throw new BusinessException("Compte temporairement bloqué. Réessayez plus tard.");
        if (!encoder.matches(req.motDePasse(), u.getMotDePasse())) {
            u.setTentativesConnexion(u.getTentativesConnexion()+1);
            if (u.getTentativesConnexion() >= 5) u.setBloqueJusquAu(Instant.now().plus(30,ChronoUnit.MINUTES));
            utilisateurRepo.save(u);
            throw new BusinessException("Identifiants incorrects");
        }
        u.setTentativesConnexion(0); u.setBloqueJusquAu(null);
        utilisateurRepo.save(u);
        return buildAuth(u);
    }

    public AuthResponse register(RegisterRequest req) {
        if (utilisateurRepo.existsByEmail(req.email())) throw new BusinessException("Email déjà utilisé");
        Utilisateur u = Utilisateur.builder()
            .nom(req.nom()).prenom(req.prenom()).email(req.email().toLowerCase())
            .motDePasse(encoder.encode(req.motDePasse()))
            .role(Role.CANDIDAT).provider(Provider.LOCAL).actif(true).build();
        utilisateurRepo.save(u);
        sendOtp(u.getEmail());
        return buildAuth(u);
    }

    public void sendOtp(String email) {
        otpRepo.deleteByEmail(email);
        String code = String.format("%06d", new SecureRandom().nextInt(999999));
        OtpVerification otp = OtpVerification.builder()
            .email(email).codeHash(encoder.encode(code))
            .expiration(Instant.now().plus(otpExpirationMinutes, ChronoUnit.MINUTES)).build();
        otpRepo.save(otp);
        notificationService.sendOtpEmail(email, code);
    }

    public void verifyOtp(VerifyOtpRequest req) {
        OtpVerification otp = otpRepo.findTopByEmailAndUtiliseFalseAndExpirationAfterOrderByDateCreationDesc(req.email(), Instant.now())
            .orElseThrow(() -> new BusinessException("Code OTP expiré ou invalide"));
        if (!encoder.matches(req.code(), otp.getCodeHash())) throw new BusinessException("Code OTP incorrect");
        otp.setUtilise(true); otpRepo.save(otp);
        utilisateurRepo.findByEmail(req.email()).ifPresent(u -> {
            utilisateurRepo.save(u);
        });
    }

    public AuthResponse loginOAuth2(String email, String nom, String prenom, Provider provider, String providerId) {
        Utilisateur u = utilisateurRepo.findByProviderAndProviderId(provider, providerId)
            .or(() -> utilisateurRepo.findByEmail(email))
            .orElseGet(() -> {
                Utilisateur newUser = Utilisateur.builder()
                    .nom(nom).prenom(prenom).email(email)
                    .role(Role.CANDIDAT).provider(provider).providerId(providerId).actif(true).build();
                return utilisateurRepo.save(newUser);
            });
        u.setProviderId(providerId);
        return buildAuth(utilisateurRepo.save(u));
    }

    @Transactional(readOnly=true)
    public AuthResponse refresh(String refreshToken) {
        var claims = jwtService.parse(refreshToken);
        return utilisateurRepo.findById(jwtService.extractUserId(claims))
            .map(this::buildAuth).orElseThrow(() -> new BusinessException("Utilisateur introuvable"));
    }

    private AuthResponse buildAuth(Utilisateur u) {
        String access = jwtService.generateAccessToken(u.getId(), u.getEmail(), u.getRole());
        String refresh = jwtService.generateRefreshToken(u.getId());
        return new AuthResponse(access, refresh, "Bearer", jwtService.getAccessExp()/1000,
            new AuthResponse.UserInfo(u.getId(), u.getNom(), u.getPrenom(), u.getEmail(), u.getRole()));
    }
}
