import { createContext, useState, useCallback, useMemo } from 'react';
import * as authService from '../services/authService';
import { getStoredUser, getToken, isTokenExpired, clearToken } from '../utils/tokenUtils';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = getToken();
        if (!token || isTokenExpired(token)) {
            clearToken();
            return null;
        }
        return getStoredUser();
    });
    const [authLoading, setAuthLoading] = useState(false);

    const login = useCallback(async (username, password) => {
        setAuthLoading(true);
        try {
            const loggedInUser = await authService.login(username, password);
            setUser(loggedInUser);
            return loggedInUser;
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const register = useCallback(async (payload) => {
        setAuthLoading(true);
        try {
            const newUser = await authService.register(payload);
            setUser(newUser);
            return newUser;
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            role: user?.role || null,
            authLoading,
            login,
            register,
            logout,
        }),
        [user, authLoading, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};