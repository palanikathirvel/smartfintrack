package com.expensetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
public class AnalyticsService {

    @Autowired
    ExpenseRepository expenseRepository;

    @Autowired
    UserRepository userRepository;

    public Map<String, Object> getSummary(String userId) {
        // dynamic calculation
        Optional<User> userOpt = userRepository.findById(userId);
        double monthlyIncome = userOpt.map(User::getMonthlyIncome).orElse(0.0);

        List<Expense> expenses = expenseRepository.findByUserId(userId);
        
        LocalDate now = LocalDate.now();
        double currentMonthSpent = expenses.stream()
            .filter(e -> e.getDate().getMonthValue() == now.getMonthValue() && e.getDate().getYear() == now.getYear())
            .mapToDouble(Expense::getAmount)
            .sum();

        double savings = Math.max(0, monthlyIncome - currentMonthSpent);
        double savingsRate = monthlyIncome > 0 ? (savings / monthlyIncome) * 100 : 0.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("monthlyIncome", monthlyIncome);
        summary.put("totalExpensesThisMonth", currentMonthSpent);
        summary.put("savings", savings);
        summary.put("savingsRate", savingsRate);

        return summary;
    }

    public Map<String, Double> getCategoryDistribution(String userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        
        return expenses.stream()
            .collect(Collectors.groupingBy(
                Expense::getCategory,
                Collectors.summingDouble(Expense::getAmount)
            ));
    }

    public Map<String, Double> getMonthlyTrends(String userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        
        return expenses.stream()
            .collect(Collectors.groupingBy(
                e -> e.getDate().getYear() + "-" + String.format("%02d", e.getDate().getMonthValue()),
                Collectors.summingDouble(Expense::getAmount)
            ));
    }
}
