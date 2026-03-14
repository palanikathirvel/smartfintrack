import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    PlusCircle, 
    History, 
    PieChart, 
    FileText, 
    Settings, 
    UserCircle, 
    TrendingDown,
    Shield,
    Wallet
} from 'lucide-react';

const Sidebar = ({ className = "", onItemClick }) => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/add-expense', label: 'Add Expenditure', icon: PlusCircle },
        { path: '/expenses', label: 'Expenditure Ledger', icon: History },
        { path: '/budgets', label: 'Budgets', icon: PieChart },
        { path: '/goals', label: 'Savings Goals', icon: Wallet },
        { path: '/debts', label: 'Debt Tracker', icon: TrendingDown },
        { path: '/impulse-vault', label: 'Impulse Vault', icon: Shield },
        { path: '/analytics', label: 'Analytics', icon: PieChart },
        { path: '/reports', label: 'Reports', icon: FileText },
    ];

    return (
        <aside className={`${className} flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen transition-all duration-300 overflow-y-auto`}>
            <div className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Wallet className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">SmartFinance</span>
                </div>

                <nav className="space-y-1.5 flex-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onItemClick}
                                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? '' : 'text-slate-400'}`} />
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Link
                        to="/settings"
                        onClick={onItemClick}
                        className={`nav-item ${location.pathname === '/settings' ? 'nav-item-active' : ''} mb-2`}
                    >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </Link>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Pro Plan</p>
                        <p className="text-xs text-emerald-800/60 dark:text-emerald-300/60 mb-3 leading-tight">Unlock all advanced AI insights.</p>
                        <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">Upgrade Now</button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
