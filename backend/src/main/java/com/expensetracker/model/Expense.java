package com.expensetracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDate;

@Data
@Document(collection = "expenses")
public class Expense {
    @Id
    private String expenseId;
    private String userId;
    private String category;
    private Double amount;
    private String description;
    private String paymentMethod;
    private LocalDate date;
}
