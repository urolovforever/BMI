import api from './api';

const authService = {
  // Ro'yxatdan o'tish
  register: async (userData) => {
    const response = await api.post('/auth/users/register/', userData);
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Tizimga kirish
  login: async (credentials) => {
    const response = await api.post('/auth/users/login/', credentials);
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Chiqish
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Joriy foydalanuvchi
  getCurrentUser: async () => {
    const response = await api.get('/auth/users/me/');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  // Profilni yangilash
  updateProfile: async (userData) => {
    const response = await api.put('/auth/users/update_profile/', userData);
    return response.data;
  },

  // Parolni o'zgartirish
  changePassword: async (passwords) => {
    const response = await api.post('/auth/users/change_password/', passwords);
    return response.data;
  },
};

export default authService;
