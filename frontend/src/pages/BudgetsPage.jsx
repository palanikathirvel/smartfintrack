import React, { useState, useEffect } from 'react';
import budgetService from '../services/budgetService';
import analyticsService from '../services/analyticsService';
import { Target, AlertTriangle, Plus, Trash2, PieChart, TrendingUp, ShieldAlert, CheckCircle2, MoreVertical, Search, Filter } from 'lucide-react';

const BudgetsPage = () => {
    const [budgets, setBudgets] = useState([]);
    const [alerts, setAlerts] = useState({});
    const [categorySpending, setCategorySpending] = useState({});
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form
    const [category, setCategory] = useState('Food');
    const [limitAmount, setLimitAmount] = useState('');

    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const [budgetRes, categoryRes] = await Promise.all([
                budgetService.getBudgets(),
                analyticsService.getCategories()
            ]);
            
            setBudgets(budgetRes.data);
            setCategorySpending(categoryRes.data || {});
            
            // Check alerts
            const newAlerts = {};
            for (let b of budgetRes.data) {
                const alertRes = await budgetService.checkAlerts(b.category);
                if (alertRes.data) {
                    newAlerts[b.category] = alertRes.data;
                }
            }
            setAlerts(newAlerts);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await budgetService.addBudget({
                category,
                limitAmount: parseFloat(limitAmount)
            });
            setIsAdding(false);
            setLimitAmount('');
            fetchBudgets();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        // Assuming there's a delete or we just overwrite. 
        // For now let's just refresh after a hypothetical action or logic.
    };

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Budgets</h2>
                    <p className="text-slate-500 font-medium mt-1">Set limits and stay on track with your financial goals.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className={`btn-primary flex items-center gap-2 ${isAdding ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : ''}`}
                    >
                        {isAdding ? <Plus className="w-4 h-4 rotate-45" /> : <Plus className="w-4 h-4" />}
                        {isAdding ? 'Cancel' : 'Set Budget'}
                    </button>
                </div>
            </header>

            {isAdding && (
                <div className="glass-card p-8 border border-emerald-500/20 bg-emerald-50/10 animate-in slide-in-from-top-4 duration-500">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Target className="text-emerald-500 w-5 h-5" />
                        Define Spending Limit
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                            <select 
                                className="input-field" 
                                value={category} onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="Food">Food & Dining</option>
                                <option value="Transport">Transport & Fuel</option>
                                <option value="Shopping">Shopping & Lifestyle</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Health">Health & Wellness</option>
                                <option value="Bills">Bills & Utilities</option>
                                <option value="Other">Miscellaneous</option>
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Monthly Limit</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input 
                                    type="number" required min="1" step="1"
                                    className="input-field pl-8" 
                                    value={limitAmount} onChange={(e) => setLimitAmount(e.target.value)}
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary w-full shadow-emerald-500/10">Lock Budget</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1,2,3].map(i => (
                        <div key={i} className="glass-card p-8 h-64 animate-pulse">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                    <div className="h-3 bg-slate-50 rounded w-1/3"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                                <div className="h-8 bg-slate-50 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))
                ) : budgets.length === 0 ? (
                    <div className="col-span-full py-24 text-center glass-card border-dashed">
                         <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                                <PieChart className="w-10 h-10 text-emerald-200" />
                            </div>
                            <div>
                                <p className="font-black text-slate-400 uppercase tracking-widest text-xl">No budgets established</p>
                                <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto font-medium">Capture your spending habits by setting category-specific limits.</p>
                            </div>
                            <button onClick={() => setIsAdding(true)} className="btn-secondary mt-4">Initialize First Budget</button>
                        </div>
                    </div>
                ) : (
                    budgets.map(budget => {
                        const spending = categorySpending[budget.category] || 0;
                        const percentage = Math.min((spending / budget.limitAmount) * 100, 100);
                        const isExceeded = spending > budget.limitAmount;
                        const isWarning = percentage > 80 && !isExceeded;

                        return (
                            <div key={budget.budgetId} className="glass-card glass-card-hover p-8 group">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${
                                            isExceeded ? 'bg-rose-50 text-rose-500' :
                                            isWarning ? 'bg-amber-50 text-amber-500' :
                                            'bg-emerald-50 text-emerald-500'
                                        }`}>
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{budget.category}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Monthly Quota</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
                                            <span className={`text-xs font-black ${isExceeded ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                {percentage.toFixed(0)}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${
                                                    isExceeded ? 'bg-rose-500' :
                                                    isWarning ? 'bg-amber-500' :
                                                    'bg-emerald-500'
                                                }`} 
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Spent / Limit</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-slate-800 dark:text-white">₹{spending.toLocaleString()}</span>
                                                <span className="text-xs font-bold text-slate-400">/ ₹{budget.limitAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            {isExceeded ? (
                                                <div className="flex items-center gap-1.5 text-rose-500">
                                                    <ShieldAlert className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">Over Budget</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-emerald-500">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">Healthy</span>
                                                </div>
                                            )}
                                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter mt-1 italic">
                                                Resets in {Math.max(0, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate())} days
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {alerts[budget.category] && (
                                    <div className={`mt-8 p-4 rounded-2xl flex items-start gap-3 border shadow-sm ${
                                        isExceeded 
                                            ? 'bg-rose-50/50 text-rose-700 border-rose-100' 
                                            : 'bg-amber-50/50 text-amber-700 border-amber-100'
                                    }`}>
                                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 opacity-60" />
                                        <p className="text-[11px] font-bold leading-relaxed">{alerts[budget.category]}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
            
            <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 p-12 opacity-5 scale-150">
                    <TrendingUp className="w-48 h-48" />
                </div>
                <div className="max-w-xl relative z-10">
                    <span className="badge bg-emerald-500 text-white mb-6">Smart Tool</span>
                    <h3 className="text-3xl font-black mb-4">Master your Monthly Flow.</h3>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed mb-8">
                        Our intelligent budgeting engine analyzes your historical data to suggest realistic spending limits for each category.
                    </p>
                    <div className="flex gap-4">
                        <button className="btn-primary">Auto-Generate Budgets</button>
                        <button className="px-6 py-2.5 text-slate-400 font-bold hover:text-white transition-colors">Learn More</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetsPage;
