package com.expensetracker.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.expensetracker.model.Goal;
import java.util.List;

public interface GoalRepository extends MongoRepository<Goal, String> {
    List<Goal> findByUserId(String userId);
}
