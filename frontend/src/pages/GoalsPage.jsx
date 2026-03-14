import React, { useState, useEffect } from 'react';
import goalService from '../services/goalService';
import { Target, Plus, Trash2, TrendingUp, Calendar, ChevronRight, MoreVertical, Wallet, CheckCircle2, Star } from 'lucide-react';

const GoalsPage = () => {
    const [goals, setGoals] = useState([]);
    const [requiredSavings, setRequiredSavings] = useState({});
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [currentSavings, setCurrentSavings] = useState('');

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const res = await goalService.getGoals();
            setGoals(res.data);
            
            const reqs = {};
            for (let g of res.data) {
                const reqRes = await goalService.getRequiredMonthly(g.goalId);
                reqs[g.goalId] = reqRes.data.requiredMonthlySavings;
            }
            setRequiredSavings(reqs);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await goalService.addGoal({
                goalName,
                targetAmount: parseFloat(targetAmount),
                deadline,
                currentSavings: currentSavings ? parseFloat(currentSavings) : 0
            });
            setIsAdding(false);
            setGoalName('');
            setTargetAmount('');
            setDeadline('');
            setCurrentSavings('');
            fetchGoals();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await goalService.deleteGoal(id);
            setGoals(goals.filter(g => g.goalId !== id));
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Savings Goals</h2>
                    <p className="text-slate-500 font-medium mt-1">Plan your future by tracking milestones and big purchases.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className={`btn-primary flex items-center gap-2 ${isAdding ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : ''}`}
                    >
                        {isAdding ? <><Plus className="w-4 h-4 rotate-45" /> Cancel</> : <><Plus className="w-4 h-4" /> New Goal</>}
                    </button>
                </div>
            </header>

            {isAdding && (
                <div className="glass-card p-8 border border-emerald-500/20 bg-emerald-50/10 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 mb-6">
                        <Star className="text-emerald-500 w-5 h-5 fill-emerald-500/20" />
                        <h3 className="text-xl font-bold">Declare a New Milestone</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Goal Identifier</label>
                            <input 
                                type="text" required
                                className="input-field" 
                                value={goalName} onChange={(e) => setGoalName(e.target.value)}
                                placeholder="e.g. Tesla Model 3, Tokyo Trip"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Target Capital (₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input 
                                    type="number" required min="1" step="0.01"
                                    className="input-field pl-8" 
                                    value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Initial Reserve (₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input 
                                    type="number" min="0" step="0.01"
                                    className="input-field pl-8" 
                                    value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)}
                                    placeholder="Amount already saved"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Target Deadline</label>
                            <input 
                                type="date" required
                                className="input-field" 
                                value={deadline} onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end mt-4">
                            <button type="submit" className="btn-primary px-12 shadow-emerald-500/10">Initialize Goal</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {loading ? (
                    [1,2].map(i => (
                        <div key={i} className="glass-card p-8 h-64 animate-pulse bg-slate-50/50"></div>
                    ))
                ) : goals.length === 0 ? (
                    <div className="col-span-full py-24 text-center glass-card border-dashed">
                         <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                                <Target className="w-10 h-10 text-emerald-200" />
                            </div>
                            <div>
                                <p className="font-black text-slate-400 uppercase tracking-widest text-xl">The Horizon is Clear</p>
                                <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto font-medium">You haven't defined any targets yet. Start planning for your next big win.</p>
                            </div>
                            <button onClick={() => setIsAdding(true)} className="btn-secondary mt-4">Create Your First Goal</button>
                        </div>
                    </div>
                ) : (
                    goals.map(goal => {
                        const progress = Math.min((goal.currentSavings / goal.targetAmount) * 100, 100);
                        const required = requiredSavings[goal.goalId];
                        const isDone = progress >= 100;
                        
                        return (
                        <div key={goal.goalId} className={`glass-card glass-card-hover p-8 relative group overflow-hidden ${isDone ? 'border-emerald-500/20 bg-emerald-50/5' : ''}`}>
                            <div className="absolute top-6 right-6 flex items-center gap-2">
                                <button 
                                    onClick={() => handleDelete(goal.goalId)}
                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-4 rounded-2xl shadow-lg shadow-indigo-500/10 bg-gradient-to-tr ${isDone ? 'from-emerald-400 to-emerald-600' : 'from-indigo-400 to-indigo-600'} text-white`}>
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-slate-800 dark:text-white uppercase tracking-tight leading-tight">{goal.goalName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End Date: {goal.deadline}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acquisition Progress</span>
                                    <span className={`text-sm font-black ${isDone ? 'text-emerald-500' : 'text-indigo-600'}`}>
                                        {progress.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                    <div 
                                        className={`h-full transition-all duration-1000 bg-gradient-to-r ${isDone ? 'from-emerald-400 to-emerald-600 shadow-emerald-500/30' : 'from-indigo-400 to-indigo-600 shadow-indigo-500/30 shadow-lg'}`} 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8 border-t border-slate-50 dark:border-slate-800 pt-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Capital Required</p>
                                    <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">₹{goal.targetAmount.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Assets Allocated</p>
                                    <p className={`text-2xl font-black leading-none ${isDone ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>₹{goal.currentSavings.toLocaleString()}</p>
                                </div>
                            </div>

                            {required !== undefined && required > 0 && !isDone && (
                                <div className="mt-8 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl flex items-center justify-between group-hover:bg-indigo-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter mb-0.5">Required Velocity</p>
                                            <p className="text-sm font-black text-indigo-700 dark:text-indigo-300 tracking-tight">
                                                ₹{required.toLocaleString(undefined, { maximumFractionDigits: 0 })} / <span className="text-[10px] opacity-60">MONTH</span>
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}

                            {isDone && (
                                <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">Goal Achieved! You have successfully secured the required capital.</span>
                                </div>
                            )}
                        </div>
                    )})
                )}
            </div>

            <div className="glass-card p-12 bg-gradient-to-tr from-slate-50 to-white dark:from-slate-900 border border-slate-100 flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 bg-emerald-50 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/10">
                    <Star className="w-16 h-16 md:w-24 md:h-24 text-emerald-500 fill-emerald-500/10" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-4xl font-black text-slate-800 mb-4 leading-tight">Empower your Ambitions.</h3>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed mb-8 max-w-2xl">
                        SmartFinance doesn't just track your goals—it optimizes them. Our algorithm calculates the exact savings velocity you need to maintain to hit your deadlines without compromising your lifestyle.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button className="btn-primary">Connect External Accounts</button>
                        <button className="btn-secondary">Export Projection Model</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalsPage;
