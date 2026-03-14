import React, { useState } from 'react';
import { useExpenses } from '../hooks/useGlobalState';
import { Plus, Trash2, Edit, Search, Filter, Download, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Layers, Banknote, Calendar } from 'lucide-react';
import reportService from '../services/reportService';

const ExpensesPage = ({ forceAdd }) => {
    const { expenses, loading, addExpense, deleteExpense } = useExpenses();
    const [isAdding, setIsAdding] = useState(forceAdd || false);
    
    // Form State
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addExpense({
            amount: parseFloat(amount),
            description,
            category: category || 'General',
            paymentMethod,
            date
        });
        
        setIsAdding(false);
        setAmount('');
        setDescription('');
        setCategory('');
    };

    const getCategoryStyles = (cat) => {
        const styles = {
            'Food': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100',
            'Transport': 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-100',
            'Shopping': 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-100',
            'Bills': 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border-rose-100',
            'Entertainment': 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-100',
            'Health': 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-100',
            'Other': 'bg-slate-50 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400 border-slate-100'
        };
        return styles[cat] || styles['Other'];
    };

    const handleExport = async () => {
        try {
            const response = await reportService.exportCsv();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Expenditure_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error("Failed to download CSV", err);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Expenditure Ledger</h2>
                    <p className="text-slate-500 font-medium mt-1">Monitor and manage your daily spending flow.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className={`btn-primary flex items-center gap-2 ${isAdding ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : ''}`}
                    >
                        {isAdding ? <Plus className="w-4 h-4 rotate-45" /> : <Plus className="w-4 h-4" />}
                        {isAdding ? 'Close Form' : 'Log Expenditure'}
                    </button>
                </div>
            </header>

            {isAdding && (
                <div className="glass-card p-8 border border-emerald-500/20 bg-emerald-50/10 animate-in slide-in-from-top-4 duration-500">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="text-emerald-500 w-5 h-5" />
                        Log New Expense
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Description</label>
                            <input 
                                type="text" required
                                placeholder="What did you buy?"
                                className="input-field" 
                                value={description} onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input 
                                    type="number" required min="0" step="0.01"
                                    placeholder="0.00"
                                    className="input-field pl-8" 
                                    value={amount} onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Date</label>
                            <input 
                                type="date" required
                                className="input-field" 
                                value={date} onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'].map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                                            category === cat 
                                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                                            : 'bg-white text-slate-600 border-slate-100 hover:border-emerald-200'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Payment Method</label>
                            <div className="flex gap-2">
                                {['Credit Card', 'Debit Card', 'Cash', 'UPI'].map(method => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setPaymentMethod(method)}
                                        className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                                            paymentMethod === method 
                                            ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' 
                                            : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'
                                        }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="md:col-span-4 flex justify-end mt-4">
                            <button type="submit" className="btn-primary w-full md:w-auto px-12">Capture Expense</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-card overflow-hidden border-none shadow-2xl shadow-slate-200/50">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by description or category..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-500 transition-colors">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{expenses.length} Records</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 border-b border-slate-50 dark:border-slate-800">
                                <th className="p-6">Date</th>
                                <th className="p-6">Entity / Description</th>
                                <th className="p-6">Category</th>
                                <th className="p-6">Method</th>
                                <th className="p-6 text-right">Amount</th>
                                <th className="p-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Retrieving Flow...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                <Layers className="w-8 h-8 text-slate-200" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-400 uppercase tracking-widest">The ledger is empty</p>
                                                <p className="text-sm text-slate-300 mt-1">Start by logging your first expense.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                [...expenses].sort((a,b) => new Date(b.date) - new Date(a.date)).map((expense) => {
                                    const isHigh = expense.amount > 5000;
                                    return (
                                        <tr key={expense.expenseId} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-100 rounded-lg text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-100 transition-all shadow-sm">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-500">{expense.date}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-700 dark:text-white group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{expense.description}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">ID: {expense.expenseId.substring(0, 8)}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`badge border ${getCategoryStyles(expense.category)}`}>
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    {expense.paymentMethod === 'Cash' ? <Banknote className="w-3 h-3 opacity-50" /> : <CreditCard className="w-3 h-3 opacity-50" />}
                                                    <span className="text-[11px] font-bold uppercase tracking-wider">{expense.paymentMethod}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-base font-black ${isHigh ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                                                        ₹{expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </span>
                                                    {isHigh && (
                                                        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
                                                            <ArrowDownRight className="w-3 h-3" /> High Spend
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteExpense(expense.expenseId)}
                                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-lg hover:border-emerald-500 transition-all active:scale-95">Prev</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-lg hover:border-emerald-500 transition-all active:scale-95">Next</button>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Showing most recent activities</p>
                </div>
            </div>
        </div>
    );
};

export default ExpensesPage;
