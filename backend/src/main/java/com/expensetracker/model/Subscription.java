package com.expensetracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "subscriptions")
public class Subscription {
    @Id
    private String subscriptionId;
    private String userId;
    private String serviceName;
    private Double amount;
    private String billingCycle; // e.g., "Monthly", "Yearly"
}
