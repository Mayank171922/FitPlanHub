import api from './api';

const planService = {
    getAllPlansPreview: async () => {
        const response = await api.get('/plans/preview');
        return response.data;
    },

    getPlanDetails: async (planId) => {
        const response = await api.get(`/plans/${planId}`);
        return response.data;
    },

    getPlansByTrainer: async (trainerId) => {
        const response = await api.get(`/plans/trainer/${trainerId}`);
        return response.data;
    },

    createPlan: async (planData) => {
        const response = await api.post('/trainer/plans', planData);
        return response.data;
    },

    updatePlan: async (planId, planData) => {
        const response = await api.put(`/trainer/plans/${planId}`, planData);
        return response.data;
    },

    deletePlan: async (planId) => {
        const response = await api.delete(`/trainer/plans/${planId}`);
        return response.data;
    },

    getTrainerPlans: async () => {
        const response = await api.get('/trainer/plans');
        return response.data;
    },

    getTrainerStats: async () => {
        const response = await api.get('/trainer/dashboard/stats');
        return response.data;
    }
};

export default planService;