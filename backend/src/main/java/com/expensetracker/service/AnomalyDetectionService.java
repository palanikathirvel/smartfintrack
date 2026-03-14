package com.expensetracker.service;

import com.expensetracker.model.Anomaly;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.AnomalyRepository;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnomalyDetectionService {

    @Autowired
    private AnomalyRepository anomalyRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public void checkExpenseForAnomalies(String userId, Expense newExpense) {
        List<Expense> pastExpenses = expenseRepository.findByUserIdOrderByDateDesc(userId);
        
        // 1. Check Duplicate (same amount & category within 24h)
        long recentDuplicates = pastExpenses.stream()
            .filter(e -> !e.getExpenseId().equals(newExpense.getExpenseId()))
            .filter(e -> e.getCategory().equals(newExpense.getCategory()))
            .filter(e -> Math.abs(e.getAmount() - newExpense.getAmount()) < 0.01)
            .filter(e -> e.getDate().equals(newExpense.getDate())) // assuming LocalDate, so same day
            .count();

        if (recentDuplicates > 0) {
            Anomaly a = new Anomaly();
            a.setUserId(userId);
            a.setType("DUPLICATE");
            a.setMessage(String.format("Potential duplicate charge of ₹%.2f detected in %s on %s.", 
                newExpense.getAmount(), newExpense.getCategory(), newExpense.getDate().toString()));
            a.setDateDetected(LocalDateTime.now());
            anomalyRepository.save(a);
        }

        // 2. Check Spikes (>300% of average)
        double avgCategorySpend = pastExpenses.stream()
            .filter(e -> !e.getExpenseId().equals(newExpense.getExpenseId()))
            .filter(e -> e.getCategory().equals(newExpense.getCategory()))
            .mapToDouble(Expense::getAmount)
            .average()
            .orElse(0.0);

        if (avgCategorySpend > 0 && newExpense.getAmount() > (avgCategorySpend * 3)) {
            Anomaly a = new Anomaly();
            a.setUserId(userId);
            a.setType("SPIKE");
            a.setMessage(String.format("Unusual spike! You spent ₹%.2f on %s, over 300%% your average of ₹%.2f.", 
                newExpense.getAmount(), newExpense.getCategory(), avgCategorySpend));
            a.setDateDetected(LocalDateTime.now());
            anomalyRepository.save(a);
        }
    }

    public List<Anomaly> getUserAnomalies(String userId) {
        return anomalyRepository.findByUserIdOrderByDateDetectedDesc(userId);
    }
    
    public void markAsRead(String anomalyId) {
        anomalyRepository.findById(anomalyId).ifPresent(a -> {
            a.setRead(true);
            anomalyRepository.save(a);
        });
    }
}
