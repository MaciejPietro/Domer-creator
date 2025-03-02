import { API_PATH, API_URL } from '@/Common/settings';
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `${API_URL}${API_PATH}`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const publicAxiosClient = axios.create({
    baseURL: `${API_URL}${API_PATH}`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem('token') || '{}');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
