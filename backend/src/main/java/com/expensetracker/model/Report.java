package com.expensetracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.Map;
import java.util.List;

@Data
@Document(collection = "reports")
public class Report {
    @Id
    private String reportId;
    private String userId;
    private String month; // e.g., "2024-03"
    private Double income;
    private Double totalExpenses;
    private Double savings;
    private Map<String, Double> categoryBreakdown;
    private List<String> insights;
}
