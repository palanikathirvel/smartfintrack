package com.expensetracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.expensetracker.model.Budget;
import com.expensetracker.service.BudgetService;
import com.expensetracker.security.UserDetailsImpl;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    BudgetService budgetService;

    private String getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @PostMapping
    public ResponseEntity<Budget> addBudget(@RequestBody Budget budget) {
        budget.setUserId(getCurrentUserId());
        return ResponseEntity.ok(budgetService.addBudget(budget));
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getBudgets() {
        return ResponseEntity.ok(budgetService.getBudgets(getCurrentUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable String id, @RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.updateBudget(id, budget));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable String id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/alerts/{category}")
    public ResponseEntity<String> getBudgetAlerts(@PathVariable String category) {
        String alert = budgetService.checkBudgetAlerts(getCurrentUserId(), category);
        if (alert != null) {
            return ResponseEntity.ok(alert);
        }
        return ResponseEntity.noContent().build();
    }
}
