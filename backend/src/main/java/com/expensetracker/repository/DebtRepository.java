package com.expensetracker.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.expensetracker.model.Debt;
import java.util.List;

public interface DebtRepository extends MongoRepository<Debt, String> {
    List<Debt> findByUserId(String userId);
}
