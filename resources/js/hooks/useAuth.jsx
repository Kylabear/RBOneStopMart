import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get('/api/me')
                .then(response => {
                    setUser(response.data);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Attempting login with:', { email, password });
            
            // Fetch CSRF cookie first
            await axios.get('/sanctum/csrf-cookie');
            
            const response = await axios.post('/api/login', { email, password });
            console.log('Login response:', response.data);
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            setUser(response.data.user);
            return { success: true, user: response.data.user };
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response?.data);
            if (error.response?.data?.errors) {
                console.error('Validation errors:', error.response.data.errors);
                const firstError = Object.values(error.response.data.errors)[0][0];
                return { success: false, message: firstError };
            }
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (formData) => {
        try {
            // Fetch CSRF cookie first
            await axios.get('/sanctum/csrf-cookie');
            
            const response = await axios.post('/api/register', formData);
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            setUser(response.data.user);
            return { success: true, user: response.data.user };
        } catch (error) {
            if (error.response?.data?.errors) {
                const firstError = Object.values(error.response.data.errors)[0][0];
                return { success: false, message: firstError };
            }
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
            // Continue with logout even if API call fails
        } finally {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};