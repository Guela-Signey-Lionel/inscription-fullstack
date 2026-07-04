package com.pkfokam.inscription.inscription.controller;

import com.pkfokam.inscription.inscription.entity.Formation;
import com.pkfokam.inscription.inscription.repository.FormationRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/v1/formations")
@RequiredArgsConstructor @Tag(name="Formations")
public class FormationController {
    private final FormationRepository formationRepo;

    @GetMapping @Operation(summary="Lister les formations disponibles")
    public ResponseEntity<List<Formation>> list() {
        return ResponseEntity.ok(formationRepo.findByActifTrue());
    }
}
