package com.expensetracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "budgets")
public class Budget {
    @Id
    private String budgetId;
    private String userId;
    private String category;
    private Double limitAmount;
}
