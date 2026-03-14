package com.expensetracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.expensetracker.model.Report;
import com.expensetracker.service.ReportService;
import com.expensetracker.security.UserDetailsImpl;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    ReportService reportService;

    private String getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping
    public ResponseEntity<List<Report>> getReports() {
        return ResponseEntity.ok(reportService.getAllReports(getCurrentUserId()));
    }

    @PostMapping("/generate")
    public ResponseEntity<Report> generateCurrentMonthReport() {
        return ResponseEntity.ok(reportService.generateMonthlyReport(getCurrentUserId()));
    }
    
    // Improved CSV Export implementation
    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv() {
        try {
            Report report = reportService.generateMonthlyReport(getCurrentUserId());
            
            StringBuilder csv = new StringBuilder();
            // Add UTF-8 BOM for Excel compatibility
            csv.append("\ufeff");
            csv.append("Month,Income,Total Expenses,Savings\n");
            csv.append(String.format("%s,%.2f,%.2f,%.2f\n", 
                report.getMonth(), 
                report.getIncome() != null ? report.getIncome() : 0.0, 
                report.getTotalExpenses() != null ? report.getTotalExpenses() : 0.0, 
                report.getSavings() != null ? report.getSavings() : 0.0));
                
            csv.append("\nCategory,Amount\n");
            if (report.getCategoryBreakdown() != null) {
                report.getCategoryBreakdown().forEach((k, v) -> {
                    csv.append(String.format("%s,%.2f\n", k, v != null ? v : 0.0));
                });
            }
            
            csv.append("\nInsights\n");
            if (report.getInsights() != null) {
                report.getInsights().forEach(insight -> {
                    csv.append(String.format("\"%s\"\n", insight.replace("\"", "\"\"")));
                });
            }
    
            byte[] output = csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));
            headers.setContentDispositionFormData("attachment", "smartfinance-report-" + report.getMonth() + ".csv");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
    
            return new ResponseEntity<>(output, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
