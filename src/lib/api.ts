import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { AUTH_LOCAL_STORAGE_KEY } from '@/auth/lib/helpers';

const API_URL = `${import.meta.env.VITE_API_URL}` || 'http://localhost:3000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const auth = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
        if (auth) {
            try {
                const { accessToken } = JSON.parse(auth);
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
            } catch (error) {
                console.error('Error parsing auth token', error);
            }
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

export default api;
