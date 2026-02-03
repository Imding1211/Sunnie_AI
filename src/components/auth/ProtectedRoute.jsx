import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute 保護路由元件
 * 需登入才能訪問的頁面使用此元件包裝
 * 未登入時自動重導向至登入頁，並記錄來源位置
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // 未登入：導向登入頁，並將當前位置作為 state 傳遞
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
