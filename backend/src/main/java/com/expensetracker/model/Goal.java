package com.expensetracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDate;

@Data
@Document(collection = "goals")
public class Goal {
    @Id
    private String goalId;
    private String userId;
    private String goalName;
    private Double targetAmount;
    private LocalDate deadline;
    private Double currentSavings;
}
