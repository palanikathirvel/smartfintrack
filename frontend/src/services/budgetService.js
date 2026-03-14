import api from './api';

const getBudgets = () => {
    return api.get('/budgets');
};

const addBudget = (budget) => {
    return api.post('/budgets', budget);
};

const checkAlerts = (category) => {
    return api.get(`/budgets/alerts/${category}`);
};

const budgetService = {
    getBudgets,
    addBudget,
    checkAlerts
};

export default budgetService;
