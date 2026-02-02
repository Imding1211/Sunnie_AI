import React, { createContext, useContext, useState, useEffect } from 'react';

// 建立 Context
const CartContext = createContext();

// 自訂 Hook 方便使用
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// Provider 元件
export const CartProvider = ({ children }) => {
    // 從 localStorage 讀取初始狀態 (避免重整後購物車清空)
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('sunnie_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load cart from local storage", e);
            return [];
        }
    });

    // 當購物車改變時，寫入 localStorage
    useEffect(() => {
        localStorage.setItem('sunnie_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // 加入購物車
    const addToCart = (item) => {
        setCartItems((prev) => {
            // 避免重複加入
            if (prev.some(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    // 移除購物車
    const removeFromCart = (itemId) => {
        setCartItems((prev) => prev.filter(item => item.id !== itemId));
    };

    // 清空購物車
    const clearCart = () => {
        setCartItems([]);
    };

    // 檢查是否已在購物車中
    const isInCart = (itemId) => {
        return cartItems.some(item => item.id === itemId);
    };

    const value = {
        cartItems,
        cartCount: cartItems.length,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
