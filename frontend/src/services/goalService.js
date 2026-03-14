import api from './api';

const getGoals = () => {
    return api.get('/goals');
};

const addGoal = (goal) => {
    return api.post('/goals', goal);
};

const getRequiredMonthly = (id) => {
    return api.get(`/goals/${id}/monthly-required`);
};

const goalService = {
    getGoals,
    addGoal,
    getRequiredMonthly
};

export default goalService;
