package com.expensetracker.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.expensetracker.model.Report;
import java.util.List;

public interface ReportRepository extends MongoRepository<Report, String> {
    List<Report> findByUserId(String userId);
    Report findByUserIdAndMonth(String userId, String month);
}
