package com.pkfokam.inscription.document.dto;
import java.time.Instant;
import java.util.*;

public record DocumentResponse(UUID id, UUID inscriptionId, String typeDocument, String nomOriginal, String mimeType, long taille, String statut, String motifRejet, Map<String,Object> donneesOcr, Instant dateUpload) {}
