import api from './api';

const feedService = {
    getPersonalizedFeed: async () => {
        const response = await api.get('/feed');
        return response.data;
    }
};

export default feedService;
