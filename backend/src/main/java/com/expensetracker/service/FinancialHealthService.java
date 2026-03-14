package com.expensetracker.service;

import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

@Service
public class FinancialHealthService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private BudgetRepository budgetRepository;

    public int calculateHealthScore(String userId) {
        int score = 500; // Base baseline score
        
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getMonthlyIncome() <= 0) return 500;

        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        // Add bonus points (e.g., from Impulse Vault)
        if (user.getBonusPoints() != null) {
            score += user.getBonusPoints();
        }

        var expenses = expenseRepository.findByUserIdOrderByDateDesc(userId).stream()
            .filter(e -> e.getDate().getMonthValue() == month && e.getDate().getYear() == year)
            .toList();

        double totalSpent = expenses.stream().mapToDouble(e -> e.getAmount()).sum();
        
        // 1. Savings Rate Metric (Boost if saving > 20%, penalize if deficit)
        double savings = user.getMonthlyIncome() - totalSpent;
        double savingsRate = savings / user.getMonthlyIncome();
        
        if (savingsRate >= 0.20) score += 150;
        else if (savingsRate >= 0.10) score += 75;
        else if (savingsRate < 0) score -= 200; // living beyond means

        // 2. Budget adherence metric
        var budgets = budgetRepository.findByUserId(userId);
        if (!budgets.isEmpty()) {
            int budgetViolations = 0;
            for (var b : budgets) {
                double spentInCat = expenses.stream()
                    .filter(e -> e.getCategory().equals(b.getCategory()))
                    .mapToDouble(e -> e.getAmount()).sum();
                if (spentInCat > b.getLimitAmount()) {
                    budgetViolations++;
                }
            }
            if (budgetViolations == 0) score += 100;
            else score -= (budgetViolations * 40);
        }

        // 3. Entertainment restraint penalty check (Optional but gamified check)
        double entertainmentSpend = expenses.stream()
            .filter(e -> e.getCategory().equals("Entertainment"))
            .mapToDouble(e -> e.getAmount()).sum();
            
        if (entertainmentSpend > (user.getMonthlyIncome() * 0.15)) {
            score -= 50; // penalize spending >15% on fun
        } else if (entertainmentSpend < (user.getMonthlyIncome() * 0.05)) {
            score += 50; // reward frugality
        }

        // Clamp to 0 - 1000
        return Math.max(0, Math.min(1000, score));
    }

    public void updateScoreOnImpulseResist(String userId, int points) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            int currentPoints = user.getBonusPoints() != null ? user.getBonusPoints() : 0;
            user.setBonusPoints(currentPoints + points);
            userRepository.save(user);
        }
    }
}
