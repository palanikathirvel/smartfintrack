package com.expensetracker.controller;

import com.expensetracker.model.Debt;
import com.expensetracker.service.DebtService;
import com.expensetracker.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/debts")
public class DebtController {

    @Autowired
    private DebtService debtService;

    private String getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping
    public ResponseEntity<List<Debt>> getDebts() {
        return ResponseEntity.ok(debtService.getUserDebts(getCurrentUserId()));
    }

    @PostMapping
    public ResponseEntity<Debt> addDebt(@RequestBody Debt debt) {
        return ResponseEntity.ok(debtService.addDebt(getCurrentUserId(), debt));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDebt(@PathVariable String id) {
        debtService.deleteDebt(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/payoff-strategy")
    public ResponseEntity<Map<String, Object>> getPayoffStrategy(@RequestParam(defaultValue = "0") double extraContribution) {
        return ResponseEntity.ok(debtService.calculatePayoffStrategy(getCurrentUserId(), extraContribution));
    }
}
