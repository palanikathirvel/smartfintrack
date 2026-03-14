import api from './api';

const getExpenses = () => {
    return api.get('/expenses');
};

const addExpense = (expense) => {
    return api.post('/expenses', expense);
};

const updateExpense = (id, expense) => {
    return api.put(`/expenses/${id}`, expense);
};

const deleteExpense = (id) => {
    return api.delete(`/expenses/${id}`);
};

const expenseService = {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense
};

export default expenseService;
