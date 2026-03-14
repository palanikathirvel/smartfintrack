import api from './api';

const getAnomalies = () => {
    return api.get('/anomalies');
};

const markAsRead = (id) => {
    return api.put(`/anomalies/${id}/read`);
};

const anomalyService = {
    getAnomalies,
    markAsRead
};

export default anomalyService;
