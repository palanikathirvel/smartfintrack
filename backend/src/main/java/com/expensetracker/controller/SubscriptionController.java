package com.expensetracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.expensetracker.model.Subscription;
import com.expensetracker.service.SubscriptionService;
import com.expensetracker.security.UserDetailsImpl;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    SubscriptionService subscriptionService;

    private String getCurrentUserId() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getId();
    }

    @GetMapping
    public ResponseEntity<List<Subscription>> getSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getSubscriptions(getCurrentUserId()));
    }

    @PostMapping("/detect")
    public ResponseEntity<?> triggerDetection() {
        subscriptionService.detectSubscriptions(getCurrentUserId());
        return ResponseEntity.ok().build();
    }
}
