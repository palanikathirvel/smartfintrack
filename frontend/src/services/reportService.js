import api from './api';

const getReports = () => {
    return api.get('/reports');
};

const generateReport = () => {
    return api.post('/reports/generate');
};

const exportCsv = () => {
    return api.get('/reports/export/csv', { responseType: 'blob' });
};

const reportService = {
    getReports,
    generateReport,
    exportCsv
};

export default reportService;
