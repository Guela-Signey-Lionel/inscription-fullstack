package com.pkfokam.inscription.auth.dto;
import jakarta.validation.constraints.*;
public record VerifyOtpRequest(@NotBlank @Email String email, @NotBlank @Size(min=6,max=6) String code) {}
