import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Shield, Database } from 'lucide-react';

const SettingsPage = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>

            <div className="grid md:grid-cols-2 gap-6">
                
                {/* Appearance */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                        Appearance
                    </h3>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                        <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-gray-500">Toggle dark theme</p>
                        </div>
                        <button 
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full mx-1 absolute transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-red-500" />
                        Notifications
                    </h3>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                        <div>
                            <p className="font-medium">Email Alerts</p>
                            <p className="text-sm text-gray-500">Weekly anomaly & budget reports</p>
                        </div>
                        <button 
                            onClick={() => setNotifications(!notifications)}
                            className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${notifications ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full mx-1 absolute transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>

                {/* Security */}
                <div className="glass-card p-6 md:col-span-2">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-500" />
                        Privacy & Security
                    </h3>
                    <div className="py-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your password and authentication tokens are encrypted using SHA-256 and securely stored. We do not sell your data.
                        </p>
                    </div>
                </div>
                
                {/* Data */}
                <div className="glass-card p-6 md:col-span-2 border-l-4 border-l-red-500">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <Database className="w-5 h-5" />
                        Danger Zone
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Permanently delete your account and all financial data. This action cannot be reversed.
                        </p>
                        <button className="px-4 py-2 border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium whitespace-nowrap">
                            Delete Account
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsPage;
