package com.expensetracker.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.expensetracker.model.Expense;
import java.util.List;

public interface ExpenseRepository extends MongoRepository<Expense, String> {
    List<Expense> findByUserId(String userId);
    List<Expense> findByUserIdOrderByDateDesc(String userId);
}
