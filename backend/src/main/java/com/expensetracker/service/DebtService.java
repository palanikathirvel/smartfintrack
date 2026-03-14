package com.expensetracker.service;

import com.expensetracker.model.Debt;
import com.expensetracker.repository.DebtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
public class DebtService {

    @Autowired
    private DebtRepository debtRepository;

    public List<Debt> getUserDebts(String userId) {
        return debtRepository.findByUserId(userId);
    }

    public Debt addDebt(String userId, Debt debt) {
        debt.setUserId(userId);
        return debtRepository.save(debt);
    }

    public void deleteDebt(String debtId) {
        debtRepository.deleteById(debtId);
    }

    // Calculates months to payoff for both methods based on an extra monthly contribution
    public Map<String, Object> calculatePayoffStrategy(String userId, double extraContribution) {
        List<Debt> debts = debtRepository.findByUserId(userId);
        if (debts.isEmpty()) return new HashMap<>();

        Map<String, Object> result = new HashMap<>();

        // Avalanche: Highest interest first
        List<Debt> avalanche = debts.stream()
            .sorted(Comparator.comparingDouble(Debt::getInterestRate).reversed())
            .collect(Collectors.toList());
        result.put("avalancheMonths", simulatePayoff(avalanche, extraContribution));

        // Snowball: Smallest balance first
        List<Debt> snowball = debts.stream()
            .sorted(Comparator.comparingDouble(Debt::getBalance))
            .collect(Collectors.toList());
        result.put("snowballMonths", simulatePayoff(snowball, extraContribution));

        return result;
    }

    private int simulatePayoff(List<Debt> sortedDebts, double extra) {
        // Create a deep copy to simulate balances without modifying DB
        List<double[]> balances = sortedDebts.stream()
            .map(d -> new double[]{d.getBalance(), d.getMinimumPayment(), d.getInterestRate()})
            .collect(Collectors.toList());
        
        int months = 0;
        boolean allPaid = false;
        
        // Failsafe limit
        while (!allPaid && months < 600) {
            months++;
            allPaid = true;
            double availableExtra = extra;

            // Pay minimums on all first
            for (double[] b : balances) {
                if (b[0] > 0) {
                    allPaid = false;
                    // Apply interest
                    double monthlyInterest = b[0] * ((b[2] / 100.0) / 12.0);
                    b[0] += monthlyInterest;
                    
                    if (b[0] > b[1]) {
                        b[0] -= b[1]; // pay minimum
                    } else {
                        availableExtra += (b[1] - b[0]); // leftover minimum goes to extra
                        b[0] = 0;
                    }
                }
            }

            // Apply extra to the first target debt with a balance
            for (double[] b : balances) {
                if (b[0] > 0 && availableExtra > 0) {
                    if (b[0] <= availableExtra) {
                        availableExtra -= b[0];
                        b[0] = 0;
                    } else {
                        b[0] -= availableExtra;
                        availableExtra = 0;
                    }
                }
            }
        }
        return months;
    }
}
