package com.expensetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.model.Budget;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@Service
public class BudgetService {

    @Autowired
    BudgetRepository budgetRepository;

    @Autowired
    ExpenseRepository expenseRepository;

    public Budget addBudget(Budget budget) {
        // check if user already has budget for this category
        Budget existing = budgetRepository.findByUserIdAndCategory(budget.getUserId(), budget.getCategory());
        if(existing != null) {
            existing.setLimitAmount(budget.getLimitAmount());
            return budgetRepository.save(existing);
        }
        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgets(String userId) {
        return budgetRepository.findByUserId(userId);
    }

    public Budget updateBudget(String id, Budget budgetDetails) {
        Optional<Budget> budgetOpt = budgetRepository.findById(id);
        if(budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            budget.setLimitAmount(budgetDetails.getLimitAmount());
            return budgetRepository.save(budget);
        }
        throw new RuntimeException("Budget not found");
    }

    public void deleteBudget(String id) {
        budgetRepository.deleteById(id);
    }

    public String checkBudgetAlerts(String userId, String category) {
        Budget budget = budgetRepository.findByUserIdAndCategory(userId, category);
        if (budget == null) return null;

        List<Expense> expenses = expenseRepository.findByUserId(userId);
        
        LocalDate now = LocalDate.now();
        double currentMonthSpent = expenses.stream()
            .filter(e -> e.getCategory().equalsIgnoreCase(category))
            .filter(e -> e.getDate().getMonthValue() == now.getMonthValue() && e.getDate().getYear() == now.getYear())
            .mapToDouble(Expense::getAmount)
            .sum();

        if (currentMonthSpent > budget.getLimitAmount()) {
            return "Alert: You have exceeded your budget for " + category + "!";
        } else if (currentMonthSpent > budget.getLimitAmount() * 0.8) {
            return "Warning: You are nearing your budget limit for " + category + "!";
        }
        return null; // No alert
    }
}
