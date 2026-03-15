import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smartfintrackbackend.onrender.com';
const API_URL = (BASE_URL.endsWith('/') ? BASE_URL + 'api/auth/' : BASE_URL + '/api/auth/');

const register = (name, email, password, monthlyIncome) => {
    return axios.post(API_URL + 'register', {
        name,
        email,
        password,
        monthlyIncome
    });
};

const login = (email, password) => {
    return axios.post(API_URL + 'login', {
        email,
        password
    }).then((response) => {
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser
};

export default authService;
