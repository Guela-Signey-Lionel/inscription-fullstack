package com.pkfokam.inscription.auth.security;
import com.pkfokam.inscription.auth.entity.Role;
import java.util.UUID;
public record AuthenticatedUser(UUID id, String email, Role role) {}
