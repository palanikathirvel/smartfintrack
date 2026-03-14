package com.expensetracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "debts")
public class Debt {
    @Id
    private String debtId;
    private String userId;
    
    private String name;
    private double balance;
    private double interestRate; // e.g., 15.5 for 15.5%
    private double minimumPayment;
}
