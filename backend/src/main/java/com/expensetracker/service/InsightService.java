package com.expensetracker.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class InsightService {

    public List<String> generateInsights(double income, double totalExpenses, Map<String, Double> categoryTotals) {
        List<String> insights = new ArrayList<>();

        if (income <= 0) {
            insights.add("Please update your monthly income in profile to get accurate insights.");
            return insights;
        }

        double savingsRate = ((income - totalExpenses) / income) * 100;

        if (savingsRate < 20) {
            insights.add("Try reducing discretionary spending. Your savings rate is below the recommended 20%.");
        } else if (savingsRate >= 40) {
            insights.add("Great job! You are saving a significant portion of your income.");
        }

        Double foodExpense = categoryTotals.getOrDefault("Food", 0.0);
        if (foodExpense > (income * 0.35)) {
            insights.add("You spend heavily on food. Consider cooking more at home to save money.");
        }

        Double shoppingExpense = categoryTotals.getOrDefault("Shopping", 0.0);
        if (shoppingExpense > (income * 0.20)) {
            insights.add("Your shopping expenses are high this month. Keep an eye on impulse purchases.");
        }
        
        if (insights.isEmpty()) {
            insights.add("Your spending looks healthy and well-balanced this month.");
        }

        return insights;
    }
}
