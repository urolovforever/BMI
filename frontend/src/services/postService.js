import api from './api';

const postService = {
  // Barcha postlar
  getAll: async () => {
    const response = await api.get('/posts/');
    return response.data;
  },

  // Bitta post
  getById: async (id) => {
    const response = await api.get(`/posts/${id}/`);
    return response.data;
  },

  // Feed (obuna bo'lgan konfessiyalar postlari)
  getFeed: async () => {
    const response = await api.get('/posts/feed/');
    return response.data;
  },

  // Yangi post yaratish
  create: async (postData) => {
    const response = await api.post('/posts/', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Like qo'yish
  like: async (id) => {
    const response = await api.post(`/posts/${id}/like/`);
    return response.data;
  },

  // Like ni olib tashlash
  unlike: async (id) => {
    const response = await api.post(`/posts/${id}/unlike/`);
    return response.data;
  },

  // Komment qo'shish
  addComment: async (commentData) => {
    const response = await api.post('/comments/', commentData);
    return response.data;
  },

  // Kommentni o'chirish
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}/`);
    return response.data;
  },
};

export default postService;
