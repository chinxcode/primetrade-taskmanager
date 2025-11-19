"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "@/lib/api";
import { handleError } from "@/lib/utils";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const response = await authAPI.getCurrentUser();
                setUser(response.data.data);
            }
        } catch (err) {
            console.error("Auth check failed:", err);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await authAPI.login(credentials);
            const { user, accessToken, refreshToken } = response.data.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            setUser(user);

            return { success: true };
        } catch (err) {
            const errorMessage = handleError(err);
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            await authAPI.register(userData);
            return { success: true };
        } catch (err) {
            const errorMessage = handleError(err);
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
