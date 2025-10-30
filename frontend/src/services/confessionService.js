import api from './api';

const confessionService = {
  // Barcha konfessiyalar
  getAll: async () => {
    const response = await api.get('/confessions/');
    return response.data;
  },

  // Bitta konfessiya
  getById: async (id) => {
    const response = await api.get(`/confessions/${id}/`);
    return response.data;
  },

  // Konfessiya postlari
  getPosts: async (id) => {
    const response = await api.get(`/confessions/${id}/get_posts/`);
    return response.data;
  },

  // Obuna bo'lish
  subscribe: async (id) => {
    const response = await api.post(`/confessions/${id}/subscribe/`);
    return response.data;
  },

  // Obunani bekor qilish
  unsubscribe: async (id) => {
    const response = await api.post(`/confessions/${id}/unsubscribe/`);
    return response.data;
  },

  // Mening obunalarim
  getMySubscriptions: async () => {
    const response = await api.get('/confessions/my_subscriptions/');
    return response.data;
  },
};

export default confessionService;
