package com.pkfokam.inscription.auth.security;

import com.pkfokam.inscription.auth.entity.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.*;

@Service
public class JwtService {
    private final SecretKey key;
    private final long accessExp;
    private final long refreshExp;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.access-expiration}") long accessExp,
                      @Value("${app.jwt.refresh-expiration}") long refreshExp) {
        this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
        this.accessExp = accessExp; this.refreshExp = refreshExp;
    }

    public String generateAccessToken(UUID userId, String email, Role role) {
        return Jwts.builder().subject(userId.toString())
            .claim("email",email).claim("role",role.name()).claim("type","ACCESS")
            .issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+accessExp))
            .signWith(key).compact();
    }

    public String generateRefreshToken(UUID userId) {
        return Jwts.builder().subject(userId.toString()).claim("type","REFRESH")
            .issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+refreshExp))
            .signWith(key).compact();
    }

    public Claims parse(String token) { return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload(); }
    public UUID extractUserId(Claims c) { return UUID.fromString(c.getSubject()); }
    public Role extractRole(Claims c) { return Role.valueOf(c.get("role",String.class)); }
    public String extractEmail(Claims c) { return c.get("email",String.class); }
    public boolean isAccessToken(Claims c) { return "ACCESS".equals(c.get("type",String.class)); }
    public long getAccessExp() { return accessExp; }
}
