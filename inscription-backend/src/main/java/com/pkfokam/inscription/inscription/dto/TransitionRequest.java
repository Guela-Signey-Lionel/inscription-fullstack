package com.pkfokam.inscription.inscription.dto;
import jakarta.validation.constraints.NotBlank;
public record TransitionRequest(@NotBlank String action, String motif) {}
