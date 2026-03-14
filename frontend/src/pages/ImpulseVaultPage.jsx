import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useGlobalState';
import impulseService from '../services/impulseService';
import { Lock, Unlock, ShieldCheck, ShoppingCart, Timer, Plus, Info, Zap, History, ChevronRight, Activity, ArrowRight, Wallet } from 'lucide-react';

const ImpulseVaultPage = () => {
    const { user } = useAuth();
    const [impulses, setImpulses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', amount: '', category: 'Entertainment' });

    const fetchImpulses = async () => {
        try {
            const res = await impulseService.getImpulses(user.userId);
            setImpulses(res.data);
        } catch (error) {
            console.error("Error fetching impulses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchImpulses();
    }, [user]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await impulseService.createImpulse({
                ...newItem,
                userId: user.userId,
                amount: parseFloat(newItem.amount)
            });
            setNewItem({ name: '', amount: '', category: 'Entertainment' });
            setShowForm(false);
            fetchImpulses();
        } catch (error) {
            console.error("Error creating impulse", error);
        }
    };

    const handleResist = async (id) => {
        try {
            await impulseService.resistImpulse(id);
            fetchImpulses();
        } catch (error) {
            console.error("Error resisting impulse", error);
        }
    };

    const handleBuy = async (id) => {
        try {
            await impulseService.buyImpulse(id);
            fetchImpulses();
        } catch (error) {
            console.error("Error buying impulse", error);
        }
    };

    const formatTimeRemaining = (unlockDate) => {
        const now = new Date();
        const unlock = new Date(unlockDate);
        const diff = unlock - now;
        if (diff <= 0) return "Ready to decide";
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        return `${hours}h ${minutes}m left`;
    };

    if (loading) {
         return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Accessing Vault...</p>
                </div>
            </div>
        );
    }

    const lockedItems = impulses.filter(i => i.status === 'LOCKED');
    const unlockedItems = impulses.filter(i => i.status === 'UNLOCKED');
    const historyItems = impulses.filter(i => i.status === 'RESISTED' || i.status === 'BOUGHT');

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-indigo-500" />
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Psychological Resilience Engine</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Impulse Vault</h2>
                    <p className="text-slate-500 font-medium mt-1">Intercept impulsive spending before it hits your ledger.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className={`btn-primary flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 ${showForm ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : ''}`}
                    >
                        {showForm ? <Plus className="w-4 h-4 rotate-45" /> : <Plus className="w-4 h-4" />}
                        {showForm ? 'Cancel Entry' : 'Log Impulse Item'}
                    </button>
                </div>
            </header>

            {showForm && (
                <div className="glass-card p-8 border border-indigo-500/20 bg-indigo-50/10 animate-in slide-in-from-top-4 duration-500">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <ShieldCheck className="text-indigo-500 w-5 h-5" />
                        Capture Potential Purchase
                    </h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Item Description</label>
                            <input 
                                required className="input-field" 
                                placeholder="What's calling for your money?" 
                                value={newItem.name}
                                onChange={e => setNewItem({...newItem, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Potential Cost</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input 
                                    required type="number" className="input-field pl-8" 
                                    value={newItem.amount}
                                    placeholder="0.00"
                                    onChange={e => setNewItem({...newItem, amount: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Category</label>
                            <select 
                                className="input-field"
                                value={newItem.category}
                                onChange={e => setNewItem({...newItem, category: e.target.value})}
                            >
                                <option>Entertainment</option>
                                <option>Shopping</option>
                                <option>Electronics</option>
                                <option>Fast Food</option>
                                <option>Luxury</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="md:col-span-4 flex justify-end">
                            <button type="submit" className="btn-primary w-full md:w-auto px-12 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/10">Initiate Cooling-Off Period</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Active Vault */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                            <Activity className="w-5 h-5 text-indigo-500" /> Currently Under Lock
                        </h3>
                        <span className="badge bg-indigo-100 text-indigo-600 border border-indigo-200">{lockedItems.length} Pending</span>
                    </div>
                    
                    {lockedItems.length === 0 && (
                        <div className="glass-card p-12 text-center border-dashed bg-slate-50/50 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-sm transition-all duration-300">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <p className="font-bold text-slate-400 uppercase tracking-widest italic">The Vault is Silent</p>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        {lockedItems.map(item => (
                            <div key={item.impulseId} className="glass-card p-6 relative group border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-start mb-4">
                                   <div>
                                        <h4 className="font-black text-lg text-slate-800 dark:text-white uppercase tracking-tight leading-tight">{item.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
                                        </div>
                                   </div>
                                   <div className="flex flex-col items-end">
                                        <span className="text-xl font-black text-rose-500 leading-none">₹{item.amount.toLocaleString()}</span>
                                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                                            <Timer className="w-3 h-3 animate-spin border-t-2 border-indigo-500 rounded-full" />
                                            {formatTimeRemaining(item.unlockDate)}
                                        </div>
                                   </div>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-indigo-500 w-1/3 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ready to Decide */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                            <Unlock className="w-5 h-5 text-emerald-500" /> Decision Threshold Reached
                        </h3>
                        <span className="badge bg-emerald-100 text-emerald-600 border border-emerald-200">{unlockedItems.length} Ready</span>
                    </div>

                    {unlockedItems.length === 0 && (
                        <div className="glass-card p-12 text-center border-dashed bg-slate-50/50 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-sm transition-all duration-300">
                                <Zap className="w-8 h-8" />
                            </div>
                            <p className="font-bold text-slate-400 uppercase tracking-widest italic">No Items Cleared for Purchase</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {unlockedItems.map(item => (
                            <div key={item.impulseId} className="glass-card p-8 border-l-8 border-l-emerald-500 shadow-xl shadow-emerald-500/5 group hover:scale-[1.02]">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="font-black text-2xl text-slate-800 dark:text-white uppercase tracking-tight">{item.name}</h4>
                                        <p className="text-sm font-bold text-slate-400 mt-1 italic">The cooling-off period has expired.</p>
                                    </div>
                                    <span className="text-3xl font-black text-rose-500">₹{item.amount.toLocaleString()}</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => handleResist(item.impulseId)}
                                        className="btn-primary bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center gap-2 shadow-emerald-500/20 active:scale-95"
                                    >
                                        <ShieldCheck className="w-5 h-5" /> I Resisted!
                                    </button>
                                    <button 
                                        onClick={() => handleBuy(item.impulseId)}
                                        className="btn-secondary border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 text-slate-500 font-bold"
                                    >
                                        <ShoppingCart className="w-4 h-4" /> Buy Anyway
                                    </button>
                                </div>
                                <div className="mt-6 flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs font-bold text-emerald-800/80 leading-relaxed">
                                        Choosing <span className="underline">Resist</span> grants +50 Resilience Points and directly boosts your Financial Health Score.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="mt-16 space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                        <History className="w-6 h-6 text-slate-400" /> Resilience Ledger
                    </h3>
                </div>
                
                <div className="glass-card overflow-hidden border-none shadow-2xl shadow-slate-200/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                                    <th className="px-8 py-4">Status & Asset</th>
                                    <th className="px-8 py-4">Economic Value</th>
                                    <th className="px-8 py-4">Resilience Outcome</th>
                                    <th className="px-8 py-4 text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {historyItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center grayscale opacity-50">
                                                    <History className="w-6 h-6" />
                                                </div>
                                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest italic">No history yet</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    [...historyItems].reverse().map(item => (
                                        <tr key={item.impulseId} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                                                        item.status === 'RESISTED' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-rose-50 border-rose-100 text-rose-500'
                                                    }`}>
                                                        {item.status === 'RESISTED' ? <ShieldCheck className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-tight leading-none block mb-1 group-hover:text-indigo-600 transition-colors">{item.name}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest uppercase">{item.category}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-base font-black text-slate-800 dark:text-white">₹{item.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                    item.status === 'RESISTED' 
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                        : 'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}>
                                                    {item.status === 'RESISTED' ? (
                                                        <>+50 SCORE BOOST</>
                                                    ) : (
                                                        <>- LOSS REALIZED</>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className="text-xs font-bold text-slate-400">
                                                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div className="glass-card p-12 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white border-none shadow-2xl shadow-indigo-500/30 overflow-hidden relative">
                 <div className="absolute right-0 top-0 p-12 opacity-5 scale-150 pointer-events-none">
                    <ShieldCheck className="w-64 h-64" />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
                            <span className="text-emerald-400 uppercase tracking-[0.3em] font-black text-xs">Behavioral Economics Integration</span>
                        </div>
                        <h3 className="text-4xl font-black mb-4 leading-tight">Master the Art of Dispassion.</h3>
                        <p className="text-indigo-200 text-lg font-medium leading-relaxed mb-8">
                            Every time you resist an impulse, your neurological "saving muscle" grows stronger. Use this vault as a psychological buffer between desire and expenditure.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-8 py-3 bg-white text-indigo-900 font-black rounded-2xl hover:bg-emerald-400 hover:text-white transition-all active:scale-95">Resilience Masterclass</button>
                            <button className="px-8 py-3 bg-indigo-800 text-indigo-200 font-black rounded-2xl border border-indigo-700 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2">
                                Shared Vaults <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 bg-white/5 rounded-[40px] backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center p-8 shadow-inner">
                        <Wallet className="w-16 h-16 md:w-24 md:h-24 text-indigo-300 opacity-20 mb-4" />
                        <span className="text-4xl font-black text-white">82%</span>
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-1">Resilience Rate</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImpulseVaultPage;
