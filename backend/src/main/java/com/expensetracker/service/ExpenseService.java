package com.expensetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    ExpenseRepository expenseRepository;

    @Autowired
    AnomalyDetectionService anomalyDetectionService;

    public Expense addExpense(Expense expense) {
        if (expense.getDate() == null) {
            expense.setDate(LocalDate.now());
        }
        
        // Auto-Categorization Logic
        expense.setCategory(detectCategory(expense.getDescription(), expense.getCategory()));

        Expense savedExpense = expenseRepository.save(expense);
        
        // Asynchronously or synchronously check for anomalies
        anomalyDetectionService.checkExpenseForAnomalies(savedExpense.getUserId(), savedExpense);

        return savedExpense;
    }

    public List<Expense> getExpensesByUserId(String userId) {
        return expenseRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Optional<Expense> getExpenseById(String expenseId) {
        return expenseRepository.findById(expenseId);
    }

    public Expense updateExpense(String expenseId, Expense updatedExpense) {
        Optional<Expense> existingOpt = expenseRepository.findById(expenseId);
        if (existingOpt.isPresent()) {
            Expense existing = existingOpt.get();
            existing.setAmount(updatedExpense.getAmount());
            existing.setDescription(updatedExpense.getDescription());
            existing.setDate(updatedExpense.getDate());
            existing.setPaymentMethod(updatedExpense.getPaymentMethod());
            existing.setCategory(detectCategory(updatedExpense.getDescription(), updatedExpense.getCategory()));
            return expenseRepository.save(existing);
        }
        throw new RuntimeException("Expense not found");
    }

    public void deleteExpense(String expenseId) {
        expenseRepository.deleteById(expenseId);
    }

    private String detectCategory(String description, String providedCategory) {
        if (description == null || description.isEmpty()) {
            return providedCategory != null ? providedCategory : "Other";
        }
        String descLower = description.toLowerCase();
        if (descLower.contains("uber") || descLower.contains("ola") || descLower.contains("transit")) {
            return "Transport";
        } else if (descLower.contains("swiggy") || descLower.contains("zomato") || descLower.contains("restaurant") || descLower.contains("food")) {
            return "Food";
        } else if (descLower.contains("amazon") || descLower.contains("flipkart") || descLower.contains("myntra")) {
            return "Shopping";
        } else if (descLower.contains("netflix") || descLower.contains("spotify") || descLower.contains("prime")) {
            return "Entertainment";
        } else if (descLower.contains("hospital") || descLower.contains("pharmacy") || descLower.contains("doctor")) {
            return "Health";
        }
        return providedCategory != null && !providedCategory.isEmpty() ? providedCategory : "Other";
    }
}
