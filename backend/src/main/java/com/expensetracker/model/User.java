package com.expensetracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String userId;
    private String name;
    private String email;
    private String password;
    private Double monthlyIncome;
    private Integer bonusPoints = 0;
    private LocalDateTime createdAt;
}
