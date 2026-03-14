package com.finance.expenseTracker.repositories;

import com.finance.expenseTracker.models.ImpulseItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ImpulseRepository extends MongoRepository<ImpulseItem, String> {
    List<ImpulseItem> findByUserId(String userId);
    List<ImpulseItem> findByStatus(String status);
}
