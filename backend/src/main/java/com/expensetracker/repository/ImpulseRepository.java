package com.expensetracker.repository;

import com.expensetracker.model.ImpulseItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ImpulseRepository extends MongoRepository<ImpulseItem, String> {
    List<ImpulseItem> findByUserId(String userId);
    List<ImpulseItem> findByStatus(String status);
}
