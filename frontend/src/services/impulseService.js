import api from './api';

const getImpulses = (userId) => api.get(`/impulses/user/${userId}`);
const createImpulse = (item) => api.post('/impulses', item);
const resistImpulse = (id) => api.post(`/impulses/${id}/resist`);
const buyImpulse = (id) => api.post(`/impulses/${id}/buy`);

const impulseService = {
    getImpulses,
    createImpulse,
    resistImpulse,
    buyImpulse
};

export default impulseService;
