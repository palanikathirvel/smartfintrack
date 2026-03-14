import React, { useState, useEffect } from 'react';
import debtService from '../services/debtService';
import { Target, TrendingDown, Plus, Trash2, CalendarDays, ShieldAlert, Zap, History, ChevronRight, ArrowDownRight, Briefcase, Calculator, Info } from 'lucide-react';

const DebtPage = () => {
    const [debts, setDebts] = useState([]);
    const [strategy, setStrategy] = useState(null);
    const [extraPayment, setExtraPayment] = useState(0);
    const [loading, setLoading] = useState(true);

    const [newDebt, setNewDebt] = useState({ name: '', balance: '', interestRate: '', minimumPayment: '' });

    const fetchDebts = async () => {
        try {
            const res = await debtService.getDebts();
            setDebts(res.data);
            const strategyRes = await debtService.getPayoffStrategy(extraPayment);
            setStrategy(strategyRes.data);
        } catch (error) {
            console.error("Failed to load debts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDebts();
    }, [extraPayment]);

    const handleAddDebt = async (e) => {
        e.preventDefault();
        try {
            await debtService.addDebt({
                name: newDebt.name,
                balance: parseFloat(newDebt.balance),
                interestRate: parseFloat(newDebt.interestRate),
                minimumPayment: parseFloat(newDebt.minimumPayment)
            });
            setNewDebt({ name: '', balance: '', interestRate: '', minimumPayment: '' });
            fetchDebts();
        } catch (err) {
            console.error("Failed adding", err);
        }
    };

    const handleDelete = async (id) => {
        await debtService.deleteDebt(id);
        fetchDebts();
    };

    const convertMonthsToYears = (months) => {
        if (!months) return "N/A";
        if (months === 0) return "Debt Free!";
        const y = Math.floor(months / 12);
        const m = months % 12;
        return y > 0 ? `${y}y ${m}m` : `${m}m`;
    };

    if (loading) {
         return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Calculating Liabilities...</p>
                </div>
            </div>
        );
    }

    const totalBalance = debts.reduce((acc, d) => acc + d.balance, 0);

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Debt Elimination</h2>
                    <p className="text-slate-500 font-medium mt-1">Strategic liquidation of external liabilities using mathematical modeling.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                         <Calculator className="w-4 h-4" /> Simulator
                    </button>
                    <div className="h-10 w-px bg-slate-200 hidden md:block mx-1"></div>
                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 px-4 py-2 rounded-2xl flex items-center gap-3">
                         <ShieldAlert className="w-4 h-4 text-rose-500" />
                         <span className="text-xs font-black text-rose-600 uppercase tracking-widest">Total Liability: ₹{totalBalance.toLocaleString()}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="glass-card p-8 border-l-8 border-l-rose-500 bg-white dark:bg-slate-900 shadow-xl shadow-rose-500/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acceleration Status</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none">₹{extraPayment.toLocaleString()}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">Monthly Surplus Contribution</p>
                </div>

                <div className="glass-card p-8 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-none relative overflow-hidden group">
                     <div className="absolute right-0 top-0 p-8 opacity-5 scale-125 group-hover:scale-150 transition-transform duration-1000">
                        <Zap className="w-24 h-24" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Avalanche Alpha</span>
                    </div>
                    <h3 className="text-3xl font-black text-indigo-900 dark:text-indigo-300 leading-none">{convertMonthsToYears(strategy?.avalancheMonths)}</h3>
                    <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter mt-3 flex items-center gap-1">
                        OPTIMAL: HIGHEST APR FIRST
                    </p>
                </div>

                <div className="glass-card p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-none relative overflow-hidden group">
                     <div className="absolute right-0 top-0 p-8 opacity-5 scale-125 group-hover:scale-150 transition-transform duration-1000">
                        <Target className="w-24 h-24" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                            <Target className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Snowball Momentum</span>
                    </div>
                    <h3 className="text-3xl font-black text-emerald-900 dark:text-emerald-300 leading-none">{convertMonthsToYears(strategy?.snowballMonths)}</h3>
                    <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter mt-3 flex items-center gap-1">
                        PSYCHOLOGICAL: SMALLEST BALANCE FIRST
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Controls */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-card p-8 border border-indigo-500/20 bg-indigo-50/10">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-2">
                             <Zap className="w-4 h-4 text-indigo-500" /> Payoff Multiplier
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Extra Monthly Contribution (₹)</label>
                                <div className="relative">
                                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input 
                                        type="number"
                                        className="input-field pl-8 bg-white border-slate-100"
                                        value={extraPayment || ''}
                                        onChange={(e) => setExtraPayment(Number(e.target.value))}
                                        placeholder="e.g. 10000"
                                    />
                                </div>
                            </div>
                            <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white dark:border-slate-700 mt-4">
                                <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                                    Adding <span className="text-indigo-600 font-black">₹{extraPayment || 0}</span> to your monthly payments will save you approximately <span className="font-black">₹{((totalBalance * 0.15) * (extraPayment/10000)).toLocaleString(undefined, {maximumFractionDigits:0})}</span> in total interest expenses.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-2">
                             <Plus className="w-5 h-5 text-emerald-500" /> Register Liability
                        </h3>
                        <form onSubmit={handleAddDebt} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Official Name</label>
                                <input required type="text" className="input-field" value={newDebt.name} onChange={e => setNewDebt({...newDebt, name: e.target.value})} placeholder="e.g. HDFC Credit Card" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Current Principal (₹)</label>
                                <input required type="number" step="0.01" className="input-field" value={newDebt.balance} onChange={e => setNewDebt({...newDebt, balance: e.target.value})} placeholder="0.00" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">APR (%)</label>
                                    <input required type="number" step="0.1" className="input-field" value={newDebt.interestRate} onChange={e => setNewDebt({...newDebt, interestRate: e.target.value})} placeholder="15.0" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Min. Pay (₹)</label>
                                    <input required type="number" step="0.01" className="input-field" value={newDebt.minimumPayment} onChange={e => setNewDebt({...newDebt, minimumPayment: e.target.value})} placeholder="0.00" />
                                </div>
                            </div>
                            <button type="submit" className="w-full btn-primary py-3 mt-4 bg-slate-900 border-none shadow-xl shadow-slate-200">Commit to Portfolio</button>
                        </form>
                    </div>
                </div>

                {/* Ledger */}
                <div className="lg:col-span-2">
                    <div className="glass-card overflow-hidden border-none shadow-2xl shadow-slate-200/50">
                        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30">
                             <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Active Liabilities</h3>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{debts.length} ACCOUNTS OPEN</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 border-b border-slate-50 dark:border-slate-800">
                                        <th className="p-8">Entity / Account</th>
                                        <th className="p-8">Principal Balance</th>
                                        <th className="p-8 text-center">APY</th>
                                        <th className="p-8">Min. Installment</th>
                                        <th className="p-8 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {debts.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                                                        <ShieldAlert className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-emerald-600 uppercase tracking-widest text-xl">Zero Liability Detected</p>
                                                        <p className="text-sm text-slate-400 mt-1 font-medium italic">You are operating at 100% financial freedom.</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        debts.map(d => (
                                            <tr key={d.debtId} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                                                <td className="p-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl group-hover:border-rose-200 group-hover:text-rose-500 transition-all shadow-sm">
                                                            <Briefcase className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{d.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-8">
                                                    <div className="flex flex-col">
                                                         <span className="text-lg font-black text-rose-600">₹{d.balance.toLocaleString()}</span>
                                                         {d.balance > 100000 && <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1 mt-1"><ShieldAlert className="w-3 h-3" /> CRITICAL MASS</span>}
                                                    </div>
                                                </td>
                                                <td className="p-8 text-center">
                                                    <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-xs font-black italic">
                                                        {d.interestRate}%
                                                    </span>
                                                </td>
                                                <td className="p-8">
                                                    <span className="text-sm font-bold text-slate-500">₹{d.minimumPayment.toLocaleString()}</span>
                                                </td>
                                                <td className="p-8 text-center">
                                                    <button onClick={() => handleDelete(d.debtId)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-white rounded-2xl shadow-sm transition-all border border-transparent hover:border-slate-100">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-8 p-10 glass-card bg-emerald-50 border border-emerald-100 flex flex-col md:flex-row items-center gap-8 group">
                         <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                             <Info className="w-10 h-10" />
                         </div>
                         <div className="flex-1 text-center md:text-left">
                             <h4 className="text-2xl font-black text-emerald-800 uppercase tracking-tight mb-2">The math doesn't lie.</h4>
                             <p className="text-emerald-700/70 font-medium leading-relaxed">
                                 By prioritizing your <span className="font-bold underline">Avalanche Strategy</span> and increasing your monthly surplus by just 15%, you could shorten your debt-free timeline by up to 2.4 years.
                             </p>
                         </div>
                         <button className="btn-primary bg-emerald-600 hover:bg-emerald-700 border-none w-full md:w-auto px-8 py-3 shadow-lg shadow-emerald-600/20 active:scale-95">Optimize Strategy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebtPage;
