package com.expensetracker.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.expensetracker.model.Anomaly;
import java.util.List;

public interface AnomalyRepository extends MongoRepository<Anomaly, String> {
    List<Anomaly> findByUserIdOrderByDateDetectedDesc(String userId);
}
