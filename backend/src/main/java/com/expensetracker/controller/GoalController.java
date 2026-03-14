package com.expensetracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.expensetracker.model.Goal;
import com.expensetracker.service.GoalService;
import com.expensetracker.security.UserDetailsImpl;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    GoalService goalService;

    private String getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @PostMapping
    public ResponseEntity<Goal> addGoal(@RequestBody Goal goal) {
        goal.setUserId(getCurrentUserId());
        return ResponseEntity.ok(goalService.addGoal(goal));
    }

    @GetMapping
    public ResponseEntity<List<Goal>> getGoals() {
        return ResponseEntity.ok(goalService.getGoals(getCurrentUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable String id, @RequestBody Goal goal) {
        return ResponseEntity.ok(goalService.updateGoal(id, goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable String id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/monthly-required")
    public ResponseEntity<?> getRequiredMonthlySavings(@PathVariable String id) {
        Double required = goalService.calculateRequiredMonthlySavings(id);
        Map<String, Double> response = new HashMap<>();
        response.put("requiredMonthlySavings", required);
        return ResponseEntity.ok(response);
    }
}
