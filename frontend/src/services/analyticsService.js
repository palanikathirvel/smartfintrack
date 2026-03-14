import api from './api';

const getSummary = () => {
    return api.get('/analytics/summary');
};

const getCategories = () => {
    return api.get('/analytics/categories');
};

const getMonthly = () => {
    return api.get('/analytics/monthly');
};

const analyticsService = {
    getSummary,
    getCategories,
    getMonthly
};

export default analyticsService;
