import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await authService.getCurrentUser();
                    setUser(response.data);
                } catch (error) {
                    console.error('Error initializing auth:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const decoded = jwt_decode(token);
            return decoded.exp > Date.now() / 1000;
        } catch (error) {
            return false;
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 