import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const BASE_URL = isDevelopment 
    ? 'http://localhost:8000'
    : 'https://project11-10.onrender.com';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Export the API endpoints for existing code
export const setAvatarAPI = `${BASE_URL}/api/auth/setAvatar`;
export const loginAPI = `${BASE_URL}/api/auth/login`;
export const addTransaction = `${BASE_URL}/api/v1/addTransaction`;
export const getTransactions = `${BASE_URL}/api/v1/getTransaction`;
export const editTransactions = `${BASE_URL}/api/v1/updateTransaction`;
export const deleteTransactions = `${BASE_URL}/api/v1/deleteTransaction`;

// New API methods using axios instance
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await api.post('/api/auth/login', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Transaction API methods
export const addTransactionApi = async (transactionData) => {
    try {
        const response = await api.post('/api/v1/addTransaction', transactionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getTransactionsApi = async () => {
    try {
        const response = await api.get('/api/v1/getTransaction');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const editTransactionApi = async (id, transactionData) => {
    try {
        const response = await api.put(`/api/v1/updateTransaction/${id}`, transactionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteTransactionApi = async (id) => {
    try {
        const response = await api.delete(`/api/v1/deleteTransaction/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default api;
