import axios from 'axios';

/** In Vite dev, prefer same-origin `/api` (see vite.config.js proxy) to avoid CORS and localhost vs 127.0.0.1 issues. */
export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
