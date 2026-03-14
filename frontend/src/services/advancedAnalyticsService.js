import api from './api';

const getHealthScore = () => {
    return api.get('/advanced/health-score');
};

const getForecast = () => {
    return api.get('/advanced/forecast');
};

const exportPdfReport = () => {
    return api.get('/advanced/pdf-report', { responseType: 'blob' });
};

const advancedAnalyticsService = {
    getHealthScore,
    getForecast,
    exportPdfReport
};

export default advancedAnalyticsService;
