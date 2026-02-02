import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

// 建立 Context
const CartContext = createContext();

/**
 * 自訂 Hook 方便使用 CartContext
 */
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

/**
 * 取得使用者專屬的 localStorage key
 */
const getCartStorageKey = (userId) => {
    return userId ? `sunnie_cart_${userId}` : null;
};

/**
 * CartProvider 購物車狀態管理元件
 * 購物車內容依使用者帳號儲存，需登入後才能使用
 */
export const CartProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    // 當使用者變更時，載入對應的購物車資料
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            const storageKey = getCartStorageKey(user.id);
            try {
                const saved = localStorage.getItem(storageKey);
                setCartItems(saved ? JSON.parse(saved) : []);
            } catch (e) {
                console.error('Failed to load cart from localStorage', e);
                setCartItems([]);
            }
        } else {
            // 未登入時清空購物車狀態
            setCartItems([]);
        }
    }, [user?.id, isAuthenticated]);

    // 當購物車改變時，寫入 localStorage（僅限已登入使用者）
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            const storageKey = getCartStorageKey(user.id);
            localStorage.setItem(storageKey, JSON.stringify(cartItems));
        }
    }, [cartItems, user?.id, isAuthenticated]);

    /**
     * 加入購物車
     * @returns {boolean} 是否成功加入（未登入時回傳 false）
     */
    const addToCart = useCallback((item) => {
        if (!isAuthenticated) {
            return false; // 回傳 false 表示需要登入
        }

        setCartItems((prev) => {
            // 避免重複加入
            if (prev.some(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
        return true;
    }, [isAuthenticated]);

    /**
     * 移除購物車項目
     */
    const removeFromCart = useCallback((itemId) => {
        if (!isAuthenticated) return;
        setCartItems((prev) => prev.filter(item => item.id !== itemId));
    }, [isAuthenticated]);

    /**
     * 清空購物車
     */
    const clearCart = useCallback(() => {
        if (!isAuthenticated) return;
        setCartItems([]);
    }, [isAuthenticated]);

    /**
     * 檢查是否已在購物車中
     */
    const isInCart = useCallback((itemId) => {
        return cartItems.some(item => item.id === itemId);
    }, [cartItems]);

    const value = {
        cartItems,
        cartCount: cartItems.length,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        // 新增：提供登入狀態讓元件決定是否導向登入頁
        requiresAuth: !isAuthenticated
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
