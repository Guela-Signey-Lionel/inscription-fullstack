package com.pkfokam.inscription.admin.controller;

import com.pkfokam.inscription.admin.dto.StatsResponse;
import com.pkfokam.inscription.admin.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController @RequestMapping("/api/v1/admin")
@RequiredArgsConstructor @Tag(name="Administration") @PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/stats") @Operation(summary="KPIs dashboard temps réel")
    public ResponseEntity<StatsResponse> stats() { return ResponseEntity.ok(adminService.getStats()); }

    @GetMapping("/export") @Operation(summary="Export Excel/CSV")
    public ResponseEntity<byte[]> export(@RequestParam(defaultValue="excel") String format) throws IOException {
        if ("csv".equalsIgnoreCase(format)) {
            return ResponseEntity.ok().contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"inscriptions.csv\"")
                .body(adminService.exportCsv());
        }
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"inscriptions.xlsx\"")
            .body(adminService.exportExcel());
    }
}
