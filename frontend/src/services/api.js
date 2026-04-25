import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://resume-maker-4nvt.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  upgrade: () => api.post('/auth/upgrade')
};

// ==================== RESUME ====================
export const resumeAPI = {
  create: (data) => api.post('/resume', data),
  getAll: () => api.get('/resumes'),
  getOne: (id) => api.get(`/resume/${id}`),
  update: (id, data) => api.put(`/resume/${id}`, data),
  delete: (id) => api.delete(`/resume/${id}`)
};

// ==================== AI ====================
export const aiAPI = {
  enhance: (data) => api.post('/ai/enhance', data),
  score: (data) => api.post('/ai/score', data)
};

export default api;
