package com.expensetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.model.Goal;
import com.expensetracker.repository.GoalRepository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class GoalService {

    @Autowired
    GoalRepository goalRepository;

    public Goal addGoal(Goal goal) {
        if (goal.getCurrentSavings() == null) {
            goal.setCurrentSavings(0.0);
        }
        return goalRepository.save(goal);
    }

    public List<Goal> getGoals(String userId) {
        return goalRepository.findByUserId(userId);
    }

    public Goal updateGoal(String id, Goal goalDetails) {
        Optional<Goal> goalOpt = goalRepository.findById(id);
        if(goalOpt.isPresent()) {
            Goal goal = goalOpt.get();
            goal.setGoalName(goalDetails.getGoalName());
            goal.setTargetAmount(goalDetails.getTargetAmount());
            goal.setDeadline(goalDetails.getDeadline());
            goal.setCurrentSavings(goalDetails.getCurrentSavings());
            return goalRepository.save(goal);
        }
        throw new RuntimeException("Goal not found");
    }

    public void deleteGoal(String id) {
        goalRepository.deleteById(id);
    }

    public Double calculateRequiredMonthlySavings(String id) {
        Optional<Goal> goalOpt = goalRepository.findById(id);
        if(goalOpt.isPresent()) {
            Goal goal = goalOpt.get();
            double remainingAmount = goal.getTargetAmount() - goal.getCurrentSavings();
            
            if (remainingAmount <= 0) return 0.0;
            
            long months = ChronoUnit.MONTHS.between(LocalDate.now(), goal.getDeadline());
            
            if (months <= 0) return remainingAmount; // Deadline passed or is this month
            
            return remainingAmount / months;
        }
        throw new RuntimeException("Goal not found");
    }
}
