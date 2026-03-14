import api from './api';

const getSubscriptions = () => {
    return api.get('/subscriptions');
};

const triggerDetection = () => {
    return api.post('/subscriptions/detect');
};

const subscriptionService = {
    getSubscriptions,
    triggerDetection
};

export default subscriptionService;
