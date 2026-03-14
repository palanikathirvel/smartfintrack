package com.expensetracker.service;

import com.expensetracker.model.Anomaly;
import com.expensetracker.model.ImpulseItem;
import com.expensetracker.repository.AnomalyRepository;
import com.expensetracker.repository.ImpulseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ImpulseScheduler {

    @Autowired
    private ImpulseRepository impulseRepository;

    @Autowired
    private AnomalyRepository anomalyRepository;

    // Check every 5 minutes
    @Scheduled(fixedRate = 300000)
    public void checkImpulseUnlocks() {
        List<ImpulseItem> lockedItems = impulseRepository.findByStatus("LOCKED");
        LocalDateTime now = LocalDateTime.now();

        for (ImpulseItem item : lockedItems) {
            if (item.getUnlockDate().isBefore(now)) {
                // Unlock
                item.setStatus("UNLOCKED");
                impulseRepository.save(item);

                // Create Notification
                Anomaly notification = new Anomaly();
                notification.setUserId(item.getUserId());
                notification.setType("VAULT_UNLOCKED");
                notification.setMessage(String.format("The cooling-off period for '%s' (₹%.2f) has ended. Do you still want to buy it or did you resist?", 
                    item.getName(), item.getAmount()));
                notification.setDateDetected(now);
                notification.setRead(false);
                anomalyRepository.save(notification);
            }
        }
    }
}
