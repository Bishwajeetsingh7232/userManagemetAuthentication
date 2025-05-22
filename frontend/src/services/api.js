import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
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

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getCurrentUser: () => api.get('/auth/me')
};

export const userService = {
    getAllUsers: () => api.get('/users'),
    getDepartmentUsers: (department) => api.get(`/users/department/${department}`),
    updateUserRole: (userId, role) => api.patch(`/users/${userId}/role`, { role }),
    updateUserStatus: (userId, isActive) => api.patch(`/users/${userId}/status`, { isActive }),
    updateProfile: (data) => api.patch('/users/profile', data),
    changePassword: (data) => api.patch('/users/change-password', data)
};

export const softwareService = {
    getAllSoftware: () => api.get('/software'),
    getSoftwareById: (id) => api.get(`/software/${id}`),
    createSoftware: (data) => api.post('/software', data),
    updateSoftware: (id, data) => api.put(`/software/${id}`, data),
    deleteSoftware: (id) => api.delete(`/software/${id}`)
};

export const requestService = {
    getAllRequests: () => api.get('/requests'),
    getDepartmentRequests: (department) => api.get(`/requests/department/${department}`),
    getUserRequests: () => api.get('/requests/my-requests'),
    getPendingApprovals: () => api.get('/requests/pending-approvals'),
    createRequest: (data) => api.post('/requests', data),
    updateRequestStatus: (requestId, data) => api.patch(`/requests/${requestId}/status`, data)
};

export default api; 