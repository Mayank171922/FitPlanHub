import api from './api';

const subscriptionService = {
    subscribe: async (planId) => {
        const response = await api.post(`/subscriptions/${planId}`);
        return response.data;
    },

    getMySubscriptions: async () => {
        const response = await api.get('/subscriptions/my');
        return response.data;
    },

    checkSubscription: async (planId) => {
        const response = await api.get(`/subscriptions/check/${planId}`);
        return response.data;
    },

    cancelSubscription: async (subscriptionId) => {
        const response = await api.delete(`/subscriptions/${subscriptionId}`);
        return response.data;
    }
};

export default subscriptionService;