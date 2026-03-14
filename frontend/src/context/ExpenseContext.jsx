import React, { createContext, useState, useEffect, useContext } from 'react';
import expenseService from '../services/expenseService';
import { AuthContext } from './AuthContext';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchExpenses = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await expenseService.getExpenses();
            setExpenses(response.data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchExpenses();
        } else {
            setExpenses([]);
        }
    }, [user]);

    const addExpense = async (expense) => {
        const response = await expenseService.addExpense(expense);
        setExpenses([response.data, ...expenses]);
        return response.data;
    };

    const updateExpense = async (id, updatedExpense) => {
        const response = await expenseService.updateExpense(id, updatedExpense);
        setExpenses(expenses.map(e => e.expenseId === id ? response.data : e));
        return response.data;
    };

    const deleteExpense = async (id) => {
        await expenseService.deleteExpense(id);
        setExpenses(expenses.filter(e => e.expenseId !== id));
    };

    return (
        <ExpenseContext.Provider value={{ expenses, loading, fetchExpenses, addExpense, updateExpense, deleteExpense }}>
            {children}
        </ExpenseContext.Provider>
    );
};
