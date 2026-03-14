import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useGlobalState';
import { 
    Bell, 
    User, 
    Menu, 
    Sun, 
    Moon, 
    AlertTriangle, 
    ShieldCheck, 
    Shield, 
    Search,
    ChevronDown,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import anomalyService from '../services/anomalyService';

const Navbar = ({ toggleMobileMenu }) => {
    const { user } = useAuth();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [anomalies, setAnomalies] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        if (user) {
            fetchAnomalies();
        }
    }, [user]);

    const fetchAnomalies = async () => {
        try {
            const res = await anomalyService.getAnomalies();
            setAnomalies(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleRead = async (id) => {
        await anomalyService.markAsRead(id);
        fetchAnomalies();
    };

    const unreadCount = anomalies.filter(a => !a.read).length;

    return (
        <header className="sticky top-0 z-30 h-20 flex items-center justify-between px-4 md:px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4 flex-1">
                <button onClick={toggleMobileMenu} className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <Menu className="w-6 h-6" />
                </button>
                
                <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 w-96 group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search transactions, goals..." 
                        className="bg-transparent border-none outline-none ml-3 text-sm w-full dark:text-white"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase leading-none">Safe Balance</span>
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">₹45,280.00</span>
                    </div>
                </div>

                <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all active:scale-95">
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all relative active:scale-95"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center px-4 pb-2 border-b border-slate-50 dark:border-slate-800">
                                <h4 className="font-bold text-slate-800 dark:text-white">Recent Alerts</h4>
                                <span className="badge bg-blue-50 text-blue-600">{unreadCount} New</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {anomalies.length === 0 ? (
                                    <div className="px-6 py-8 text-center text-sm text-slate-500">
                                        <ShieldCheck className="w-10 h-10 text-emerald-500/30 mx-auto mb-3"/>
                                        <p>Everything looks perfect.</p>
                                    </div>
                                ) : (
                                    anomalies.map(a => (
                                        <div key={a.anomalyId} className={`px-4 py-4 border-b border-slate-50 dark:border-slate-800 last:border-0 ${!a.read ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`badge ${
                                                    a.type === 'SPIKE' ? 'bg-orange-50 text-orange-600' : 
                                                    a.type === 'VAULT_UNLOCKED' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                    {a.type.replace('_', ' ')}
                                                </span>
                                                {!a.read && (
                                                    <button onClick={() => handleRead(a.anomalyId)} className="text-[10px] font-bold text-emerald-500 hover:text-emerald-600 uppercase tracking-wider">Mark read</button>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-snug">{a.message}</p>
                                            {a.type === 'VAULT_UNLOCKED' && (
                                                <button 
                                                    onClick={() => {
                                                        navigate('/impulse-vault');
                                                        setShowNotifications(false);
                                                    }}
                                                    className="w-full py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 shadow-md shadow-indigo-500/20 transition-all transition-colors"
                                                >
                                                    Go to Vault
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 py-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 cursor-pointer transition-colors group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                        {user?.name?.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                    <div className="hidden lg:flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                            {user?.name || 'Smart User'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">Free Member</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
