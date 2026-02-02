import React, { createContext, useContext, useState, useEffect } from 'react';

// 建立 Auth Context
const AuthContext = createContext();

/**
 * 自訂 Hook 方便使用 AuthContext
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * AuthProvider 身份驗證狀態管理元件
 * 提供登入、註冊、登出功能
 */
export const AuthProvider = ({ children }) => {
    // 從 localStorage 讀取初始使用者狀態
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('sunnie_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            console.error('Failed to load user from localStorage', e);
            return null;
        }
    });

    const [loading, setLoading] = useState(false);

    // 是否已登入
    const isAuthenticated = !!user;

    // 當 user 改變時，同步到 localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('sunnie_user', JSON.stringify(user));
            localStorage.setItem('sunnie_token', user.token || 'mock_token');
        } else {
            localStorage.removeItem('sunnie_user');
            localStorage.removeItem('sunnie_token');
        }
    }, [user]);

    /**
     * 登入
     * @param {Object} userData - 使用者資料（來自 API 回應）
     */
    const login = (userData) => {
        setUser(userData);
    };

    /**
     * 登出
     */
    const logout = () => {
        setUser(null);
    };

    /**
     * 更新使用者資料
     * @param {Object} updates - 要更新的欄位
     */
    const updateUser = (updates) => {
        setUser(prev => prev ? { ...prev, ...updates } : null);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        setLoading,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
