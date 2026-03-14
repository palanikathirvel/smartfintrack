package com.finance.expenseTracker.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "impulses")
public class ImpulseItem {
    @Id
    private String impulseId;
    private String userId;
    private String name;
    private double amount;
    private String category;
    
    private LocalDateTime createdAt;
    private LocalDateTime unlockDate;
    
    // Status can be: LOCKED, UNLOCKED, BOUGHT, RESISTED
    private String status;

    public ImpulseItem() {}

    public ImpulseItem(String userId, String name, double amount, String category, int lockHours) {
        this.userId = userId;
        this.name = name;
        this.amount = amount;
        this.category = category;
        this.createdAt = LocalDateTime.now();
        this.unlockDate = this.createdAt.plusHours(lockHours);
        this.status = "LOCKED";
    }

    public String getImpulseId() { return impulseId; }
    public void setImpulseId(String impulseId) { this.impulseId = impulseId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUnlockDate() { return unlockDate; }
    public void setUnlockDate(LocalDateTime unlockDate) { this.unlockDate = unlockDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
