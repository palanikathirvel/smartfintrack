package com.expensetracker.controller;

import com.expensetracker.service.FinancialHealthService;
import com.expensetracker.service.ForecastingService;
import com.expensetracker.service.PdfReportService;
import com.expensetracker.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/advanced")
public class AdvancedAnalyticsController {

    @Autowired
    private FinancialHealthService healthService;

    @Autowired
    private ForecastingService forecastingService;

    @Autowired
    private PdfReportService pdfReportService;

    private String getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/health-score")
    public ResponseEntity<Map<String, Integer>> getHealthScore() {
        int score = healthService.calculateHealthScore(getCurrentUserId());
        Map<String, Integer> response = new HashMap<>();
        response.put("score", score);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/forecast")
    public ResponseEntity<Map<String, Double>> getForecast() {
        double forecast = forecastingService.forecastMonthEndSpend(getCurrentUserId());
        Map<String, Double> response = new HashMap<>();
        response.put("forecastedSpend", forecast);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pdf-report")
    public ResponseEntity<byte[]> downloadPdfReport() {
        byte[] pdfBytes = pdfReportService.generateTaxAuditPdf(getCurrentUserId());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Tax_Audit_Report.pdf");

        return ResponseEntity.ok()
            .headers(headers)
            .body(pdfBytes);
    }
}
