import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Authentication failed. Check VITE_NOTEHUB_TOKEN.');
    }
    return Promise.reject(error);
  },
);
