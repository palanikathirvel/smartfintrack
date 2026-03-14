import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import { Calendar } from 'lucide-react';

const SpendingHeatmap = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await expenseService.getExpenses();
                setExpenses(res.data);
            } catch (err) {
                console.error("Failed to fetch expenses for heatmap", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    if (loading) return <div className="text-gray-500 text-sm">Loading Heatmap...</div>;

    // Generate last 35 days (5 weeks)
    const days = 35;
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]); // yyyy-mm-dd
    }

    // Group expenses by date
    const dailyTotals = {};
    expenses.forEach(exp => {
        if (exp && exp.date) {
            const dateStr = exp.date.toString().substring(0, 10);
            if (!dailyTotals[dateStr]) dailyTotals[dateStr] = 0;
            dailyTotals[dateStr] += exp.amount;
        }
    });

    // Find max for color scaling (but avoid dividing by zero or letting 1 huge spike ruin it)
    let maxSpend = Math.max(...Object.values(dailyTotals), 1);
    // Cap max at a reasonable daily average to prevent one big purchase muting everything else
    const values = Object.values(dailyTotals).filter(v => v > 0);
    const avgSpend = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 1;
    // Set max scale to 3x the average (anything above is max red)
    maxSpend = Math.max(avgSpend * 3, 100);

    const getColorClass = (amount) => {
        if (!amount || amount === 0) return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800'; // No spend (Good)
        const intensity = amount / maxSpend;
        if (intensity < 0.25) return 'bg-red-200 dark:bg-red-900/40 border-red-300 dark:border-red-800';
        if (intensity < 0.5) return 'bg-red-300 dark:bg-red-700/50 border-red-400 dark:border-red-600';
        if (intensity < 0.75) return 'bg-red-400 dark:bg-red-600/70 border-red-500 dark:border-red-500';
        return 'bg-red-500 dark:bg-red-500 border-red-600 dark:border-red-500 text-white'; // High spend
    };

    // Calculate weeks for grid rendering (7 rows)
    const gridCols = Math.ceil(days / 7);

    return (
        <div className="glass-card p-6 border-l-4 border-l-green-500 flex-1">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                Spending Heatmap <span className="text-xs font-normal text-gray-500 ml-1">(Last 35 Days)</span>
            </h3>
            
            <div className="flex gap-1 overflow-x-auto pb-2">
                {Array.from({ length: gridCols }).map((_, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, rowIndex) => {
                            const dateIndex = colIndex * 7 + rowIndex;
                            if (dateIndex >= days) return null;
                            const dateStr = dates[dateIndex];
                            const amount = dailyTotals[dateStr] || 0;
                            
                            // Title format for tooltip
                            const displayDate = new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                            const title = `₹${amount.toLocaleString()} spent on ${displayDate}`;
                            
                            return (
                                <div 
                                    key={dateStr}
                                    title={title}
                                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm border ${getColorClass(amount)} hover:ring-2 hover:ring-offset-1 hover:ring-primary transition-all cursor-crosshair`}
                                ></div>
                            );
                        })}
                    </div>
                ))}
            </div>
            
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                <span>No Spend</span>
                <div className="w-3 h-3 rounded-sm bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800"></div>
                <div className="w-3 h-3 rounded-sm bg-red-200 border border-red-300 dark:bg-red-900/40 dark:border-red-800 ml-2"></div>
                <div className="w-3 h-3 rounded-sm bg-red-300 border border-red-400 dark:bg-red-700/50 dark:border-red-600"></div>
                <div className="w-3 h-3 rounded-sm bg-red-400 border border-red-500 dark:bg-red-600/70 dark:border-red-500"></div>
                <div className="w-3 h-3 rounded-sm bg-red-500 border border-red-600 dark:bg-red-500 dark:border-red-500"></div>
                <span>High Spend</span>
            </div>
        </div>
    );
};

export default SpendingHeatmap;
