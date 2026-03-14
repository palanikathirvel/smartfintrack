import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import analyticsService from '../services/analyticsService';
import advancedAnalyticsService from '../services/advancedAnalyticsService';
import { 
    Wallet, 
    ArrowDownCircle, 
    ArrowUpCircle, 
    Activity,
    TrendingUp,
    CreditCard,
    PieChart as PieIcon,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Target,
    PlusCircle
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler);

const StatCard = ({ title, amount, icon: Icon, trend, percentChange, moreInfo }) => (
    <div className="glass-card glass-card-hover p-6 flex flex-col justify-between group">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl ${
                trend === 'positive' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                trend === 'negative' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' :
                'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
            }`}>
                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
            {percentChange && (
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                    trend === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                    {trend === 'positive' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {percentChange}%
                </div>
            )}
        </div>
        <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2">₹{amount.toLocaleString('en-IN')}</h3>
            {moreInfo && <p className="text-[10px] text-slate-400 font-medium">{moreInfo}</p>}
        </div>
    </div>
);

const DashboardPage = () => {
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState(null);
    const [monthly, setMonthly] = useState(null);
    const [healthScore, setHealthScore] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [summaryRes, categoryRes, monthlyRes, healthRes, forecastRes] = await Promise.all([
                    analyticsService.getSummary(),
                    analyticsService.getCategories(),
                    analyticsService.getMonthly(),
                    advancedAnalyticsService.getHealthScore(),
                    advancedAnalyticsService.getForecast()
                ]);
                
                setSummary(summaryRes.data);
                setCategories(categoryRes.data);
                setMonthly(monthlyRes.data);
                setHealthScore(healthRes.data.score);
                setForecast(forecastRes.data.forecastedSpend);
            } catch (error) {
                console.error("Dashboard data error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading || !summary) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Constructing Dashboard...</p>
                </div>
            </div>
        );
    }

    const categoryData = {
        labels: Object.keys(categories || {}),
        datasets: [{
            data: Object.values(categories || {}),
            backgroundColor: [
                '#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#0ea5e9', '#8b5cf6'
            ],
            hoverOffset: 20,
            borderWidth: 4,
            borderColor: 'white',
        }]
    };

    const labels = Object.keys(monthly || {}).sort();
    const dataPoints = labels.map(k => monthly[k]);
    
    // Create forecast dataset
    const forecastDataPoints = Array(labels.length).fill(null);
    if (labels.length > 0 && forecast) {
        forecastDataPoints[labels.length - 1] = dataPoints[labels.length - 1]; 
        labels.push("Month End (Est)");
        forecastDataPoints.push(forecast);
        dataPoints.push(null);
    }

    const monthlyData = {
        labels: labels,
        datasets: [
            {
                label: 'Actual Spending',
                data: dataPoints,
                borderColor: '#10b981',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
            {
                label: 'Projected Projection',
                data: forecastDataPoints,
                borderColor: '#6366f1',
                borderDash: [5, 5],
                fill: false,
                tension: 0,
                pointRadius: 0,
            }
        ]
    };

    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { family: 'Poppins', size: 14 },
                bodyFont: { family: 'Inter', size: 13 },
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
            }
        },
        scales: {
            y: { 
                grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false },
                ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' }
            },
            x: { 
                grid: { display: false },
                ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' }
            }
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Overview</h2>
                    <p className="text-slate-500 font-medium mt-1">Welcome back. Here's a snapshot of your financial performance.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/last-30-days" className="btn-secondary flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Last 30 Days
                    </Link>
                    <Link to="/add-expense" className="btn-primary flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" /> New Expenditure
                    </Link>
                </div>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard 
                    title="Monthly Income" 
                    amount={summary.monthlyIncome || 0} 
                    icon={ArrowUpCircle} 
                    trend="positive"
                    percentChange={summary.monthlyIncome > 0 ? "Active" : "0"}
                />
                <StatCard 
                    title="Total Spending" 
                    amount={summary.totalExpensesThisMonth || 0} 
                    icon={CreditCard} 
                    trend="negative"
                    percentChange={summary.totalExpensesThisMonth > 0 ? "Tracking" : "0"}
                />
                <StatCard 
                    title="Current Savings" 
                    amount={summary.savings || 0} 
                    icon={Wallet} 
                    trend="neutral"
                    moreInfo="Accumulated Asset Reserve"
                />
                <StatCard 
                    title="Savings Rate" 
                    amount={summary.savingsRate || 0}
                    icon={TrendingUp} 
                    trend={summary.savingsRate > 20 ? 'positive' : 'negative'}
                    moreInfo={summary.savingsRate > 20 ? 'Above Benchmark' : 'Below Benchmark'}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="glass-card p-8 xl:col-span-2">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Cash Flow Trends</h3>
                            <p className="text-sm text-slate-400 font-medium">Actual vs. Projected Spending</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Actual</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full border-2 border-dashed border-indigo-500"></span>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Projected</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80">
                        {monthly && Object.keys(monthly).length > 0 ? (
                            <Line data={monthlyData} options={chartOptions} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                <Activity className="w-12 h-12 mb-2 opacity-20" />
                                <p className="font-bold">No trending data yet</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="glass-card p-8">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Expenses by Category</h3>
                    <p className="text-sm text-slate-400 font-medium mb-8">Monthly distribution</p>
                    <div className="h-64 flex justify-center relative">
                        {categories && Object.keys(categories).length > 0 ? (
                            <>
                                <Pie 
                                    data={categoryData} 
                                    options={{ 
                                        maintainAspectRatio: false, 
                                        plugins: { legend: { display: false } },
                                        cutout: '70%'
                                    }} 
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <PieIcon className="w-6 h-6 text-slate-300 mb-1" />
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{Object.keys(categories).length} Categories</span>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                <PieIcon className="w-12 h-12 mb-2 opacity-20" />
                                <p className="font-bold">No categories detected</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-8 space-y-3">
                        {Object.entries(categories || {}).slice(0, 4).map(([cat, val], idx) => (
                            <div key={cat} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryData.datasets[0].backgroundColor[idx] }}></span>
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{cat}</span>
                                </div>
                                <span className="text-sm font-black text-slate-800 dark:text-white">₹{val.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-none shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 font-bold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 uppercase tracking-[0.2em] text-xs">Financial AI Insights</span>
                    </div>
                    <h3 className="text-2xl font-black mb-4 leading-tight relative z-10">Intelligent fiscal analysis active.</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm relative z-10">
                        {summary.totalExpensesThisMonth > summary.monthlyIncome 
                            ? "Warning: Spending exceeds current revenue flow. Review your budget allocations."
                            : "Financial health is optimal. Consider allocating surplus to high-yield savings goals."}
                    </p>
                    <button className="px-6 py-2.5 bg-white text-slate-900 font-black rounded-xl hover:bg-emerald-400 transition-all relative z-10 active:scale-95">Deep Audit</button>
                </div>
                
                <div className="glass-card p-8 bg-white border border-slate-100 flex items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 text-slate-50">
                        <Target className="w-48 h-48" />
                    </div>
                    <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Performance</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-1">Financial Health Score</h3>
                        <p className="text-sm text-slate-400 font-medium mb-6">Aggregate stability index</p>
                        <div className="flex items-end gap-3">
                            <span className="text-7xl font-black text-emerald-500 leading-none">{healthScore}</span>
                            <div className="mb-2">
                                <span className="text-slate-300 font-bold text-xl leading-none">/ 1000</span>
                                <div className="mt-1 flex items-center gap-1 text-emerald-600">
                                    <ArrowUpRight className="w-3 h-3" />
                                    <span className="text-[10px] font-black underline">Behavioral Index</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 flex flex-col gap-2">
                        <div className="h-24 w-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 w-full transition-all duration-1000" style={{ height: `${healthScore/10}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
