import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useGlobalState';
import { User, Mail, Shield, Key, Target, TrendingUp, Wallet, Settings, Camera, LogOut, Hexagon, Award, Fingerprint, Bell, ShieldCheck, Zap } from 'lucide-react';
import analyticsService from '../services/analyticsService';
import advancedAnalyticsService from '../services/advancedAnalyticsService';
import SpendingHeatmap from '../components/SpendingHeatmap';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [healthScore, setHealthScore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [summaryRes, healthRes] = await Promise.all([
                    analyticsService.getSummary(),
                    advancedAnalyticsService.getHealthScore()
                ]);
                setStats(summaryRes.data);
                setHealthScore(healthRes.data.score);
            } catch (err) {
                console.error("Failed to load profile stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) {
        return (
           <div className="flex h-96 items-center justify-center">
               <div className="flex flex-col items-center gap-4">
                   <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                   <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Authenticating Identity...</p>
               </div>
           </div>
       );
   }

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Account Intelligence</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage your identity and monitor your behavioral financial metrics.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Config
                    </button>
                    <button onClick={logout} className="btn-primary flex items-center gap-2 bg-rose-500 hover:bg-rose-600 shadow-rose-500/20">
                        <LogOut className="w-4 h-4" /> Sig Out
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Profile Identity Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden bg-white/40 dark:bg-slate-900/40">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-tr from-emerald-400/10 to-indigo-500/10"></div>
                        <div className="relative">
                            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-emerald-400 to-indigo-600 p-1 shadow-2xl shadow-emerald-500/20 rotate-3">
                                <div className="w-full h-full rounded-[38px] bg-white dark:bg-slate-900 flex items-center justify-center text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-emerald-500 to-indigo-600 -rotate-3">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-emerald-500 transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="mt-8">
                            <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{user?.name || 'Authorized User'}</h3>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <Mail className="w-3.5 h-3.5 text-slate-300" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user?.email}</span>
                            </div>
                        </div>

                        <div className="mt-10 w-full pt-10 border-t border-slate-50 dark:border-slate-800">
                             <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resilience Tier</span>
                                <span className="badge bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 flex items-center gap-1.5">
                                    <Award className="w-3 h-3" /> 
                                    {healthScore > 800 ? 'Platinum Savant' : healthScore > 500 ? 'Gold Analyst' : 'Emerging Strategist'}
                                </span>
                             </div>
                             <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Status</span>
                                <span className="text-[10px] font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                                    <ShieldCheck className={`w-3 h-3 ${healthScore > 700 ? 'text-emerald-500' : 'text-indigo-500'}`} /> 
                                    {healthScore > 700 ? 'Fortified' : 'Active'}
                                </span>
                             </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 bg-slate-900 text-white border-none relative overflow-hidden group">
                         <div className="absolute right-0 top-0 p-8 opacity-5 scale-125 group-hover:scale-150 transition-transform duration-1000">
                            <Fingerprint className="w-32 h-32" />
                        </div>
                        <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-400" /> Secure Terminal
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Your biometric and session data are stored locally. Only encrypted ledgers sync with our core server.
                        </p>
                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95">Rotate Auth Keys</button>
                    </div>
                </div>

                {/* Statistics & Insights */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-8 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Flow</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none">₹{stats?.monthlyIncome?.toLocaleString('en-IN') || '0'}</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-3 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-emerald-500" /> Dynamic Ledger Active
                            </p>
                        </div>
                        
                        <div className="glass-card p-8 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl">
                                    <Target className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Reserve</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none">₹{stats?.savings?.toLocaleString('en-IN') || '0'}</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-3">Calculated Asset Reserve</p>
                        </div>

                        <div className="glass-card p-8 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Score</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none">{healthScore || '0'}</h3>
                                <span className="text-xs font-bold text-slate-400">/ 1000</span>
                            </div>
                            <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(healthScore / 10) || 0}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 border-none shadow-2xl shadow-slate-200/60 bg-white dark:bg-slate-900">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Spending Magnitude Map</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Behavioral heat over the last 30 deployment cycles.</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-emerald-100 rounded"></div>
                                    <span className="text-[9px] font-black text-slate-400">LOW</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-rose-600 rounded"></div>
                                    <span className="text-[9px] font-black text-slate-400">HIGH</span>
                                </div>
                            </div>
                        </div>
                        <div className="py-4">
                            <SpendingHeatmap />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="glass-card p-8 border-l-8 border-l-indigo-500 flex flex-col justify-between h-full bg-white dark:bg-slate-900">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-4">Identity Guard</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                    You are currently monitoring 3 financial nodes. Upgrade to Enterprise to unlock multi-entity management and legislative fiscal reporting.
                                </p>
                            </div>
                            <button className="btn-primary w-full py-3 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 active:scale-95">Upgrade Protocol</button>
                        </div>

                         <div className="glass-card p-8 bg-slate-50/50 dark:bg-slate-800/50 border-none flex flex-col justify-between h-full">
                            <div>
                                <h4 className="text-lg font-black text-slate-700 dark:text-white uppercase tracking-tight mb-2 flex items-center gap-2">
                                    <Bell className="w-4 h-4" /> System Alerts
                                </h4>
                                <div className="space-y-4 py-4">
                                     <div className="flex items-start gap-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                                        <p className="text-xs font-bold text-slate-500 leading-tight uppercase tracking-tight">Vault resilience test passed successfully on March 14.</p>
                                     </div>
                                     <div className="flex items-start gap-4">
                                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></div>
                                        <p className="text-xs font-bold text-slate-500 leading-tight uppercase tracking-tight italic">Low reserve detected in "Shopping" budget category.</p>
                                     </div>
                                </div>
                            </div>
                            <button className="px-6 py-2.5 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Clear Notification Stack</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
