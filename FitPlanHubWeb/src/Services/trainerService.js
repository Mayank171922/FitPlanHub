import api from './api';

const trainerService = {
    followTrainer: async (trainerId) => {
        const response = await api.post(`/trainers/${trainerId}/follow`);
        return response.data;
    },

    unfollowTrainer: async (trainerId) => {
        const response = await api.delete(`/trainers/${trainerId}/unfollow`);
        return response.data;
    },

    getFollowedTrainers: async () => {
        const response = await api.get('/trainers/following');
        return response.data;
    },

    checkIfFollowing: async (trainerId) => {
        const response = await api.get(`/trainers/check/${trainerId}`);
        return response.data;
    },

    getAllTrainers: async () => {
        const response = await api.get('/trainers/all');
        return response.data;
    },

    getTrainerProfile: async (trainerId) => {
        const response = await api.get(`/trainers/${trainerId}`);
        return response.data;
    }
};

export default trainerService;
