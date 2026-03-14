import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { PieChart, User, Lock, Mail, DollarSign } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        monthlyIncome: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.register(
                formData.name, 
                formData.email, 
                formData.password, 
                formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : 0
            );
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="glass-card w-full max-w-md p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mt-10 -ml-10"></div>
                
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                        <PieChart className="w-6 h-6" />
                        SmartFinance
                    </div>
                </div>

                <h2 className="text-xl font-bold text-center mb-6">Create your account</h2>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-200">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                        <div className="relative">
                            <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" name="name" required
                                value={formData.name} onChange={handleChange}
                                className="input-field pl-10" placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                className="input-field pl-10" placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Initial Monthly Income (Optional)</label>
                        <div className="relative">
                            <DollarSign className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="number" name="monthlyIncome" min="0" step="0.01"
                                value={formData.monthlyIncome} onChange={handleChange}
                                className="input-field pl-10" placeholder="5000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="password" name="password" required minLength="6"
                                value={formData.password} onChange={handleChange}
                                className="input-field pl-10" placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="btn-primary w-full py-3 mt-2 disabled:opacity-70 flex justify-center"
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                    Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
