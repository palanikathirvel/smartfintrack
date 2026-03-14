import React, { useState, useEffect } from 'react';
import subscriptionService from '../services/subscriptionService';
import reportService from '../services/reportService';
import advancedAnalyticsService from '../services/advancedAnalyticsService';
import { FileText, Download, ScanSearch, CheckCircle2, Zap, BarChart3, ShieldCheck, ArrowRight, Layers, Activity, CalendarDays, ExternalLink, Filter } from 'lucide-react';

const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [detecting, setDetecting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reportRes, subRes] = await Promise.all([
                reportService.getReports(),
                subscriptionService.getSubscriptions()
            ]);
            setReports(reportRes.data);
            setSubscriptions(subRes.data);
        } catch (error) {
            console.error("Failed fetching reports data", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGenerateReport = async () => {
        setGenerating(true);
        try {
            await reportService.generateReport();
            await fetchData();
        } catch (error) {
            console.error(error);
        }
        setGenerating(false);
    };

    const handleDetectSubscriptions = async () => {
        setDetecting(true);
        try {
            await subscriptionService.triggerDetection();
            const res = await subscriptionService.getSubscriptions();
            setSubscriptions(res.data);
        } catch (error) {
            console.error(error);
        }
        setDetecting(false);
    };

    const handleExport = async () => {
        try {
            const response = await reportService.exportCsv();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `smartfinance_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error("Failed to download CSV", err);
        }
    };

    const handleExportPdf = async () => {
        try {
            const response = await advancedAnalyticsService.exportPdfReport();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Tax_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error("Failed to download PDF", err);
        }
    };

    if (loading) {
         return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Aggregating Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Intelligence Ledger</h2>
                    <p className="text-slate-500 font-medium mt-1">Advanced financial reporting and automated subscription detection.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button onClick={handleExportPdf} className="btn-secondary flex items-center gap-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-50">
                        <FileText className="w-4 h-4" /> Audit PDF
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Reports Generation Section */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="glass-card p-10 bg-white dark:bg-slate-900 border-none shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                             <Activity className="w-48 h-48 text-indigo-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-[20px] shadow-sm">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Analytics Engine</h3>
                            </div>
                            
                            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10 max-w-xl">
                                Execute our proprietary AI Spending Model to synthesize your transaction history into actionable financial strategy.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <button 
                                    onClick={handleGenerateReport} disabled={generating}
                                    className={`btn-primary px-10 py-3 shadow-indigo-500/20 active:scale-95 ${generating ? 'bg-indigo-300 pointer-events-none' : 'bg-indigo-600'}`}
                                >
                                    {generating ? 'Processing Data...' : 'Run Analytics Engine'}
                                </button>
                            </div>

                            {reports.length > 0 && (
                                <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-4 duration-500">
                                    <h4 className="font-black text-slate-800 dark:text-white flex items-center gap-3 mb-6 uppercase tracking-widest text-xs">
                                        <ShieldCheck className="text-emerald-500 w-5 h-5"/>
                                        Synthesis Outcome: {reports[reports.length-1].month}
                                    </h4>
                                    <div className="space-y-4">
                                        {reports[reports.length-1].insights.map((insight, idx) => (
                                            <div key={idx} className="flex items-start gap-4 group">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                                                <p className="text-sm font-bold text-slate-500 leading-relaxed uppercase tracking-tight">{insight}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="mt-8 flex items-center gap-2 text-[10px] font-black text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-[0.2em]">
                                        View Full Mathematical Breakdown <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="glass-card p-10 bg-slate-900 text-white border-none">
                             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                <Download className="w-6 h-6 text-emerald-400" />
                             </div>
                             <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Structured Export</h4>
                             <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                Access your raw ledger data in sanitized CSV format for external processing or backup.
                             </p>
                             <button onClick={handleExport} className="text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors flex items-center gap-2">
                                Download Ledger <ExternalLink className="w-3 h-3" />
                             </button>
                         </div>
                         <div className="glass-card p-10 bg-emerald-600 text-white border-none">
                             <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                <FileText className="w-6 h-6 text-white" />
                             </div>
                             <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Tax Compliant PDF</h4>
                             <p className="text-white/80 text-sm font-medium leading-relaxed mb-6">
                                Generate a cryptographic PDF report optimized for audit and fiscal compliance requirements.
                             </p>
                             <button onClick={handleExportPdf} className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors flex items-center gap-2">
                                Generate Audit <ExternalLink className="w-3 h-3" />
                             </button>
                         </div>
                    </div>
                </div>

                {/* Subscriptions Detection Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 bg-white dark:bg-slate-900 border-none shadow-2xl shadow-slate-200/50 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                                    <ScanSearch className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Subscription Radar</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Pattern Recognition Engine</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleDetectSubscriptions} disabled={detecting}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all ${
                                    detecting 
                                    ? 'bg-purple-100 text-purple-400 pointer-events-none' 
                                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                                }`}
                            >
                                {detecting ? 'Scanning...' : 'Initiate Scan'}
                            </button>
                        </div>

                        <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/30 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 min-h-[400px]">
                            {subscriptions.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-6 shadow-sm">
                                        <Layers className="w-10 h-10" />
                                    </div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest max-w-[200px] leading-relaxed">
                                        No recurring liabilities detected in current data stream. 
                                    </p>
                                    <button onClick={handleDetectSubscriptions} className="mt-6 btn-secondary text-[10px] px-6 py-2">Deep Scan Ledger</button>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <div className="p-6 bg-white/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Identity</span>
                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Monthly Burn</span>
                                    </div>
                                    {subscriptions.map(sub => (
                                        <div key={sub.subscriptionId} className="p-6 flex justify-between items-center group hover:bg-white transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-500 transition-all">
                                                    <CalendarDays className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-700 dark:text-white uppercase tracking-tight leading-none mb-1 group-hover:text-purple-600 transition-colors">{sub.serviceName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub.billingCycle}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-black text-slate-800 dark:text-white leading-none">₹{sub.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter mt-1">RECURRING</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-8 bg-slate-900 text-white mt-auto">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Total Subscription Burn</span>
                                            <span className="text-xl font-black">₹{subscriptions.reduce((acc, s) => acc + s.amount, 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-card p-10 flex flex-col items-center justify-center text-center gap-4 border-dashed bg-slate-50/30">
                         <Filter className="w-10 h-10 text-slate-200" />
                         <div>
                             <h4 className="font-black text-slate-400 uppercase tracking-widest text-sm">Advanced Filters</h4>
                             <p className="text-xs font-bold text-slate-300 uppercase tracking-tighter mt-1">Configure automated reporting rules</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
