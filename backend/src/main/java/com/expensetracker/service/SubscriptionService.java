package com.expensetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.model.Expense;
import com.expensetracker.model.Subscription;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.SubscriptionRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    @Autowired
    SubscriptionRepository subscriptionRepository;

    @Autowired
    ExpenseRepository expenseRepository;

    public List<Subscription> getSubscriptions(String userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    // Automatically detect subscriptions based on recurring identical expenses
    public void detectSubscriptions(String userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        
        // Group by description and amount (simple heuristic for recurring payments)
        Map<String, List<Expense>> grouped = expenses.stream()
            .collect(Collectors.groupingBy(e -> e.getDescription() + "-" + e.getAmount()));
        
        List<Subscription> existingSubscriptions = subscriptionRepository.findByUserId(userId);
        Set<String> existingNames = existingSubscriptions.stream()
            .map(Subscription::getServiceName)
            .collect(Collectors.toSet());

        for (Map.Entry<String, List<Expense>> entry : grouped.entrySet()) {
            List<Expense> matches = entry.getValue();
            if (matches.size() >= 2) {
                // Occurs multiple times, likely a subscription
                Expense sample = matches.get(0);
                if (!existingNames.contains(sample.getDescription())) {
                    Subscription sub = new Subscription();
                    sub.setUserId(userId);
                    sub.setServiceName(sample.getDescription());
                    sub.setAmount(sample.getAmount());
                    sub.setBillingCycle("Monthly"); // Approximated
                    subscriptionRepository.save(sub);
                    existingNames.add(sample.getDescription());
                }
            }
        }
    }
}
