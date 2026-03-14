package com.expensetracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "anomalies")
public class Anomaly {
    @Id
    private String anomalyId;
    private String userId;
    
    private String type; // "DUPLICATE", "SPIKE"
    private String message;
    private LocalDateTime dateDetected;
    private boolean isRead = false;
}
