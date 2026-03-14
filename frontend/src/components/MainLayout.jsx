import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-['Inter',sans-serif]">
            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:flex fixed z-20" />

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col min-w-0 transition-all duration-300">
                <Navbar toggleMobileMenu={() => setMobileMenuOpen(true)} />
                <main className="flex-1 p-4 md:p-10 lg:p-12 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            
            {/* Mobile Sidebar Actual */}
            <div className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col pt-2">
                    <button 
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 text-slate-400"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <Sidebar className="flex" onItemClick={() => setMobileMenuOpen(false)} />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
