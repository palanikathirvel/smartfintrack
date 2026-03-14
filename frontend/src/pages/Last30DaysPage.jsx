import React, { useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useGlobalState';
import { Calendar, ArrowDownRight, ArrowUpRight, History, Filter, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import reportService from '../services/reportService';

const Last30DaysPage = () => {
    const { expenses, loading } = useExpenses();
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [stats, setStats] = useState({ total: 0, count: 0, highSpends: 0 });

    useEffect(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const filtered = expenses.filter(exp => new Date(exp.date) >= thirtyDaysAgo);
        const total = filtered.reduce((acc, exp) => acc + exp.amount, 0);
        const highSpends = filtered.filter(exp => exp.amount > 5000).length;

        setFilteredExpenses(filtered.sort((a,b) => new Date(b.date) - new Date(a.date)));
        setStats({ total, count: filtered.length, highSpends });
    }, [expenses]);

    const handleExport = async () => {
        try {
            const response = await reportService.exportCsv();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Expenditure_Report_Last_30_Days_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error("Failed to download CSV", err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                 <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight italic">30-Day Snapshot</h2>
                        <p className="text-slate-500 font-medium">Detailed audit of the last 720 hours of expenditure.</p>
                    </div>
                </div>
                <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export Slice
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rolling Total</p>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white">₹{stats.total.toLocaleString()}</h3>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-indigo-500">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction Count</p>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.count} Items</h3>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-rose-500">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">High Intensity Events</p>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.highSpends} Flags</h3>
                </div>
            </div>

            <div className="glass-card overflow-hidden border-none shadow-xl">
                 <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <History className="w-4 h-4 text-emerald-500" />
                        Temporal Ledger: Last 30 Days
                    </h4>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {filteredExpenses.length === 0 ? (
                        <div className="p-20 text-center opacity-40">
                            <Calendar className="w-12 h-12 mx-auto mb-4" />
                            <p className="font-bold">No activity detected in the 30-day window.</p>
                        </div>
                    ) : (
                        filteredExpenses.map(exp => (
                            <div key={exp.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-tight">{exp.description}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exp.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-base font-black ${exp.amount > 5000 ? 'text-rose-600' : 'text-slate-800 dark:text-white'}`}>
                                        ₹{exp.amount.toLocaleString()}
                                    </p>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase">{exp.category}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Last30DaysPage;
