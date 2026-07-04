package com.pkfokam.inscription.auth.security;

import io.jsonwebtoken.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    public JwtAuthFilter(JwtService jwtService) { this.jwtService = jwtService; }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest req, @NonNull HttpServletResponse res, @NonNull FilterChain chain) throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) { chain.doFilter(req,res); return; }
        try {
            Claims claims = jwtService.parse(header.substring(7));
            if (!jwtService.isAccessToken(claims)) { chain.doFilter(req,res); return; }
            AuthenticatedUser user = new AuthenticatedUser(jwtService.extractUserId(claims), jwtService.extractEmail(claims), jwtService.extractRole(claims));
            var auth = new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority("ROLE_"+user.role().name())));
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (JwtException e) { res.sendError(HttpServletResponse.SC_UNAUTHORIZED,"Token invalide"); return; }
        chain.doFilter(req,res);
    }
}
