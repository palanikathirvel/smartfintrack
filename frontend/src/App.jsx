import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import BudgetsPage from './pages/BudgetsPage';
import GoalsPage from './pages/GoalsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import DebtPage from './pages/DebtPage';
import ImpulseVaultPage from './pages/ImpulseVaultPage';
import Last30DaysPage from './pages/Last30DaysPage';

function App() {
  return (
    <AuthProvider>
        <ExpenseProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        
                        <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
                        <Route path="/expenses" element={<ProtectedRoute><MainLayout><ExpensesPage /></MainLayout></ProtectedRoute>} />
                        <Route path="/add-expense" element={<ProtectedRoute><MainLayout><ExpensesPage forceAdd={true} /></MainLayout></ProtectedRoute>} />
                        <Route path="/last-30-days" element={<ProtectedRoute><MainLayout><Last30DaysPage /></MainLayout></ProtectedRoute>} />
                        <Route path="/budgets" element={<ProtectedRoute><MainLayout><BudgetsPage /></MainLayout></ProtectedRoute>} />
                        <Route path="/goals" element={<ProtectedRoute><MainLayout><GoalsPage /></MainLayout></ProtectedRoute>} />
                        <Route path="/debts" element={<ProtectedRoute><MainLayout><DebtPage /></MainLayout></ProtectedRoute>} />
                        <Route path="/impulse-vault" element={<ProtectedRoute><MainLayout><ImpulseVaultPage /></MainLayout></ProtectedRoute>} />
                        <Route path="/analytics" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
                        <Route path="/reports" element={<ProtectedRoute><MainLayout><ReportsPage /></MainLayout></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
                        
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;
