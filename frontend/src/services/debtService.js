import api from './api';

const getDebts = () => {
    return api.get('/debts');
};

const addDebt = (debt) => {
    return api.post('/debts', debt);
};

const deleteDebt = (id) => {
    return api.delete(`/debts/${id}`);
};

const getPayoffStrategy = (extraContribution = 0) => {
    return api.get(`/debts/payoff-strategy?extraContribution=${extraContribution}`);
};

const debtService = {
    getDebts,
    addDebt,
    deleteDebt,
    getPayoffStrategy
};

export default debtService;
