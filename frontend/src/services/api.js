import axios from 'axios';

const api = axios.create({
  baseURL: '', // Relative paths, mapped to localhost:8080 by Vite proxy configurations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token in request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (name) => api.put('/api/auth/profile/update', { name }),
  changePassword: (payload) => api.put('/api/auth/profile/password', payload),
};

export default api;
