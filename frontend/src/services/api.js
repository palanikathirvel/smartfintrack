import axios from 'axios';

// Use the environment variable, or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://smartfintrackbackend.onrender.com/api/';

const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
