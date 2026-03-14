import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';

export const useAuth = () => {
    return useContext(AuthContext);
};

export const useExpenses = () => {
    return useContext(ExpenseContext);
};
