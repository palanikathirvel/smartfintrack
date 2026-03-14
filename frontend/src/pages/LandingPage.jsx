import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useGlobalState';
import { PieChart, TrendingUp, PiggyBank, ShieldCheck } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="glass-card p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const LandingPage = () => {
    const { user, loading } = useAuth();

    if (loading) return null; // Or a loading spinner

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar Placeholder */}
            <nav className="p-6 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <PieChart /> 
                    <span>SmartFinance</span>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="px-4 py-2 font-medium hover:text-primary transition-colors">Login</Link>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Master Your Money with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Smart Insights</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Track expenses, manage budgets, detect subscriptions, and achieve your financial goals with our intelligent dashboard.
                    </p>
                    <div className="flex justify-center gap-4 pt-8">
                        <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Start Tracking Free</Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-8 px-4 w-full">
                    <FeatureCard 
                        icon={TrendingUp} 
                        title="Dynamic Analytics" 
                        description="Visualize your spending with beautiful charts updating in real-time."
                    />
                    <FeatureCard 
                        icon={PiggyBank} 
                        title="Smart Budgets" 
                        description="Set limits and receive automatic alerts before you overspend."
                    />
                    <FeatureCard 
                        icon={ShieldCheck} 
                        title="Subscription Detection" 
                        description="Automatically discover hidden recurring payments draining your account."
                    />
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
