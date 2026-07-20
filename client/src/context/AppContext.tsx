import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { type AxiosInstance } from 'axios';

interface User {
    id: string; name: string; email: string; plan: string; analysisCount: number;
}
interface AppContextType {
    user: User | null; token: string | null; loading: boolean; api: AxiosInstance;
    login: (e: string, p: string) => Promise<{ success: boolean; message: string }>;
    register: (n: string, e: string, p: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const api = axios.create({ baseURL: backendURL });

    api.interceptors.request.use((config) => {
        const tok = localStorage.getItem('token');
        if (tok) { config.headers.authorization = `Bearer ${tok}`; }
        return config;
    });

    const loadUser = async () => {
        if (!token) { setLoading(false); return; }
        try {
            const res = await api.get('/api/auth/user');
            if (res.data.success) { setUser(res.data.user); }
        } catch (e) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally { setLoading(false); }
    };

    useEffect(() => { loadUser(); }, [token]);

    const login = async (email: string, password: string) => {
        try {
            const res = await axios.post(`${backendURL}/api/auth/login`, { email, password });
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                localStorage.setItem('token', res.data.token);
                return { success: true, message: '' };
            }
            return { success: false, message: res.data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await axios.post(`${backendURL}/api/auth/register`, { name, email, password });
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                localStorage.setItem('token', res.data.token);
                return { success: true, message: '' };
            }
            return { success: false, message: res.data.message };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setToken(null); setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AppContext.Provider value={{ user, token, loading, api, login, register, logout }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}