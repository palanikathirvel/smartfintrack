package com.expensetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.model.Report;
import com.expensetracker.model.User;
import com.expensetracker.repository.ReportRepository;
import com.expensetracker.repository.UserRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    ReportRepository reportRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AnalyticsService analyticsService;

    @Autowired
    InsightService insightService;

    public Report generateMonthlyReport(String userId) {
        LocalDate now = LocalDate.now();
        String currentMonth = now.getYear() + "-" + String.format("%02d", now.getMonthValue());

        Report existingReport = reportRepository.findByUserIdAndMonth(userId, currentMonth);
        if (existingReport != null) {
            reportRepository.delete(existingReport);
        }

        Map<String, Object> summary = analyticsService.getSummary(userId);
        Map<String, Double> categoryDistribution = analyticsService.getCategoryDistribution(userId);

        double income = (Double) summary.get("monthlyIncome");
        double totalExpensesThisMonth = (Double) summary.get("totalExpensesThisMonth");
        double savings = (Double) summary.get("savings");

        List<String> insights = insightService.generateInsights(income, totalExpensesThisMonth, categoryDistribution);

        Report report = new Report();
        report.setUserId(userId);
        report.setMonth(currentMonth);
        report.setIncome(income);
        report.setTotalExpenses(totalExpensesThisMonth);
        report.setSavings(savings);
        report.setCategoryBreakdown(categoryDistribution);
        report.setInsights(insights);

        return reportRepository.save(report);
    }
    
    public List<Report> getAllReports(String userId) {
        return reportRepository.findByUserId(userId);
    }
}
