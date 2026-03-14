package com.expensetracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.expensetracker.service.AnalyticsService;
import com.expensetracker.security.UserDetailsImpl;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    AnalyticsService analyticsService;

    private String getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(analyticsService.getSummary(getCurrentUserId()));
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<String, Double>> getCategories() {
        return ResponseEntity.ok(analyticsService.getCategoryDistribution(getCurrentUserId()));
    }

    @GetMapping("/monthly")
    public ResponseEntity<Map<String, Double>> getMonthly() {
        return ResponseEntity.ok(analyticsService.getMonthlyTrends(getCurrentUserId()));
    }
}
