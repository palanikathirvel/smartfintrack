package com.expensetracker.service;

import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ForecastingService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public double forecastMonthEndSpend(String userId) {
        LocalDate today = LocalDate.now();
        int daysInMonth = today.lengthOfMonth();
        int currentDay = today.getDayOfMonth();

        List<com.expensetracker.model.Expense> currentMonthExpenses = expenseRepository.findByUserIdOrderByDateDesc(userId)
            .stream()
            .filter(e -> e.getDate().getMonthValue() == today.getMonthValue() && e.getDate().getYear() == today.getYear())
            .toList();

        double totalSpentSoFar = currentMonthExpenses.stream().mapToDouble(e -> e.getAmount()).sum();

        if (currentDay == 0 || totalSpentSoFar == 0) return 0;

        // Simple run-rate prediction
        double dailyAverage = totalSpentSoFar / currentDay;
        return totalSpentSoFar + (dailyAverage * (daysInMonth - currentDay));
    }
}
