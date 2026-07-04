package com.pkfokam.inscription.admin.service;

import com.pkfokam.inscription.admin.dto.StatsResponse;
import com.pkfokam.inscription.inscription.entity.Inscription;
import com.pkfokam.inscription.inscription.repository.InscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.*;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service @RequiredArgsConstructor @Transactional(readOnly=true)
public class AdminService {
    private final InscriptionRepository inscriptionRepo;

    public StatsResponse getStats() {
        return new StatsResponse(
            inscriptionRepo.count(),
            inscriptionRepo.countByStatut("BROUILLON"),
            inscriptionRepo.countByStatut("SOUMIS"),
            inscriptionRepo.countByStatut("EN_VALIDATION_DOC") + inscriptionRepo.countByStatut("EN_VALIDATION_FIN"),
            inscriptionRepo.countByStatut("APPROUVE"),
            inscriptionRepo.countByStatut("REJETE"),
            inscriptionRepo.countByStatut("EXPIRE")
        );
    }

    public byte[] exportExcel() throws IOException {
        List<Inscription> inscriptions = inscriptionRepo.findAll();
        try (Workbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet("Inscriptions");
            Row header = sheet.createRow(0);
            String[] cols = {"Référence","Candidat ID","Formation","Statut","Type","Année","Date Création","Date Soumission"};
            for (int i=0;i<cols.length;i++) header.createCell(i).setCellValue(cols[i]);
            int r=1;
            DateTimeFormatter fmt = DateTimeFormatter.ISO_INSTANT;
            for (Inscription i : inscriptions) {
                Row row = sheet.createRow(r++);
                row.createCell(0).setCellValue(i.getNumeroReference());
                row.createCell(1).setCellValue(i.getCandidatId().toString());
                row.createCell(2).setCellValue(i.getFormation()!=null?i.getFormation().getNom():"");
                row.createCell(3).setCellValue(i.getStatut());
                row.createCell(4).setCellValue(i.getTypeInscription()!=null?i.getTypeInscription():"");
                row.createCell(5).setCellValue(i.getAnneeAcademique()!=null?i.getAnneeAcademique():"");
                row.createCell(6).setCellValue(i.getDateCreation()!=null?i.getDateCreation().toString():"");
                row.createCell(7).setCellValue(i.getDateSoumission()!=null?i.getDateSoumission().toString():"");
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            wb.write(out); return out.toByteArray();
        }
    }

    public byte[] exportCsv() {
        List<Inscription> inscriptions = inscriptionRepo.findAll();
        StringBuilder sb = new StringBuilder("Référence,CandidatID,Formation,Statut,Type,Année,DateCréation\n");
        for (Inscription i : inscriptions) {
            sb.append(String.join(",", i.getNumeroReference(), i.getCandidatId().toString(),
                i.getFormation()!=null?i.getFormation().getNom():"", i.getStatut(),
                i.getTypeInscription()!=null?i.getTypeInscription():"",
                i.getAnneeAcademique()!=null?i.getAnneeAcademique():"",
                i.getDateCreation()!=null?i.getDateCreation().toString():"")).append("\n");
        }
        return sb.toString().getBytes();
    }
}
