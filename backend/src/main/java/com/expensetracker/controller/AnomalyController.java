package com.expensetracker.controller;

import com.expensetracker.model.Anomaly;
import com.expensetracker.service.AnomalyDetectionService;
import com.expensetracker.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/anomalies")
public class AnomalyController {

    @Autowired
    private AnomalyDetectionService anomalyService;

    private String getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping
    public ResponseEntity<List<Anomaly>> getAnomalies() {
        return ResponseEntity.ok(anomalyService.getUserAnomalies(getCurrentUserId()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        anomalyService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
