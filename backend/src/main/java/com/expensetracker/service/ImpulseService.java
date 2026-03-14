package com.expensetracker.service;

import com.expensetracker.model.Expense;
import com.expensetracker.model.ImpulseItem;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.ImpulseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ImpulseService {

    @Autowired
    ImpulseRepository impulseRepository;

    @Autowired
    ExpenseRepository expenseRepository;

    @Autowired
    FinancialHealthService financialHealthService;

    public List<ImpulseItem> getItemsByUserId(String userId) {
        return impulseRepository.findByUserId(userId);
    }

    public ImpulseItem createItem(ImpulseItem item) {
        item.setCreatedAt(LocalDateTime.now());
        item.setUnlockDate(item.getCreatedAt().plusHours(48)); // Default 48h
        item.setStatus("LOCKED");
        return impulseRepository.save(item);
    }

    public ImpulseItem resistItem(String id) {
        ImpulseItem item = impulseRepository.findById(id).orElseThrow();
        if ("RESISTED".equals(item.getStatus()) || "BOUGHT".equals(item.getStatus())) {
            return item;
        }
        item.setStatus("RESISTED");
        item = impulseRepository.save(item);
        
        // Reward Health Score
        financialHealthService.updateScoreOnImpulseResist(item.getUserId(), (int)(item.getAmount() / 100));
        
        return item;
    }

    public Expense buyItem(String id) {
        ImpulseItem item = impulseRepository.findById(id).orElseThrow();
        item.setStatus("BOUGHT");
        impulseRepository.save(item);

        // Convert to Expense
        Expense expense = new Expense();
        expense.setUserId(item.getUserId());
        expense.setDescription(item.getName());
        expense.setAmount(item.getAmount());
        expense.setCategory(item.getCategory());
        expense.setDate(java.time.LocalDate.now()); // Using LocalDate as per project pattern
        
        return expenseRepository.save(expense);
    }

    public void checkUnlocks() {
        List<ImpulseItem> lockedItems = impulseRepository.findByStatus("LOCKED");
        for (ImpulseItem item : lockedItems) {
            if (item.getUnlockDate().isBefore(LocalDateTime.now())) {
                item.setStatus("UNLOCKED");
                impulseRepository.save(item);
                // Notification link to be done in AnomalyDetectionService/InsightService logic?
            }
        }
    }
}
