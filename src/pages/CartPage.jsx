import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Loader2, LogIn } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';
import { useCart } from '../context/CartContext';
import { mockCartApi } from '../api/mockCartApi';
import MainLayout from '../components/layout/MainLayout';

/**
 * CartPage 購物車頁面
 * 整合課程清單與結帳摘要，負責資料邏輯與 API 互動
 * 需登入後才能使用
 */
const CartPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, removeFromCart, clearCart, requiresAuth } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // 移除項目
    const handleRemoveItem = (id) => {
        removeFromCart(id);
    };

    // 結帳流程
    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const itemIds = cartItems.map(item => item.id);

            // 1. 建立訂單
            const orderRes = await mockCartApi.createOrder(itemIds);
            if (orderRes.status !== 'success') throw new Error("建單失敗");

            const { order_id } = orderRes.data;

            // 2. 進行付款
            const paymentRes = await mockCartApi.processPayment(order_id);
            if (paymentRes.status !== 'success') throw new Error("付款初始化失敗");

            // 3. 模擬跳轉 (實際專案會 window.location.href = paymentRes.payment_url)
            alert(`訂單建立成功！\nOrder ID: ${order_id}\n即將前往付款頁面...`);
            console.log("導向付款:", paymentRes.payment_url);

            // 模擬成功後清空購物車回首頁，或導向訂單完成頁
            clearCart();
            navigate('/');

        } catch (error) {
            alert(`結帳失敗: ${error.message}`);
        } finally {
            setIsCheckingOut(false);
        }
    };

    // 未登入時顯示登入提示
    if (requiresAuth) {
        return (
            <MainLayout>
                <div className="bg-[var(--color-background)] min-h-screen pb-20">
                    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
                        <div className="flex items-center gap-4 mb-8">
                            <Link to="/courses" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft size={24} className="text-gray-600" />
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 font-heading">
                                我的購物車
                            </h1>
                        </div>

                        {/* 需要登入提示 */}
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                                <LogIn size={48} className="text-[var(--color-primary)]" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                請先登入
                            </h2>
                            <p className="text-gray-500 mb-8 max-w-sm">
                                登入您的帳號以使用購物車功能，購物車內容將會自動儲存。
                            </p>
                            <div className="flex gap-4">
                                <Link to="/login" state={{ from: location }}>
                                    <button className="px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold rounded-xl transition-all hover:shadow-lg transform hover:-translate-y-1">
                                        立即登入
                                    </button>
                                </Link>
                                <Link to="/register" state={{ from: location }}>
                                    <button className="px-8 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold rounded-xl transition-all hover:bg-[var(--color-primary)] hover:text-white">
                                        註冊帳號
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="bg-[var(--color-background)] min-h-screen pb-20">
                <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/courses" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-gray-600" />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 font-heading">
                            我的購物車
                            <span className="ml-3 text-lg font-normal text-gray-500 font-body">
                                ({cartItems.length} 課程)
                            </span>
                        </h1>
                    </div>

                    {cartItems.length > 0 ? (
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* 左側：課程清單 */}
                            <div className="w-full lg:w-2/3 space-y-4">
                                {cartItems.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemoveItem}
                                    />
                                ))}
                            </div>

                            {/* 右側：結帳摘要 (Sticky) */}
                            <div className="w-full lg:w-1/3">
                                <OrderSummary
                                    items={cartItems}
                                    onCheckout={handleCheckout}
                                    isCheckingOut={isCheckingOut}
                                />
                            </div>
                        </div>
                    ) : (
                        // 空購物車狀態
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag size={48} className="text-gray-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                購物車是空的
                            </h2>
                            <p className="text-gray-500 mb-8 max-w-sm">
                                看起來你還沒加入任何課程。探索我們的精選課程，開始你的資料科學之旅吧！
                            </p>
                            <Link to="/courses">
                                <button className="px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold rounded-xl transition-all hover:shadow-lg transform hover:-translate-y-1">
                                    去逛逛課程
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Sticky Checkout Bar (當內容超過螢幕時，這是一個額外的底部浮動欄位，這裡選擇直接用 OrderSummary 反應式處理，但為了符合規格書"結帳欄位固定在底部"，我們可以在 Mobile 視圖隱藏原本的 OrderSummary 結帳按鈕，改在這裡顯示，或者直接讓 OrderSummary 在 mobile 為 static，這裡採用簡化策略：在 Mobile，OrderSummary 放在底部，若太長則考慮 fixed bottom bar。但基於目前實作，OrderSummary 放在最下方是標準流。若要 Fixed Bottom，需要額外元件。為了符合規格書 "行動端時，結帳摘要區置於底部，並使用 sticky 定位 (或是 fixed)"，這裡假設規格書意指 sticky 在頁面底部或視窗底部。通常電商是 Fixed 在視窗底部。讓我們增加一個 Fixed Bottom Bar 僅在 Mobile 顯示) */}

                {/* Mobile Fixed Bottom Bar (僅在有商品時顯示) */}
                {cartItems.length > 0 && (
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">總計</span>
                            <span className="text-xl font-bold text-[var(--color-primary)]">
                                NT$ {cartItems.reduce((acc, item) => acc + item.price, 0).toLocaleString()}
                            </span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="px-8 py-3 bg-[var(--color-cta)] text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                        >
                            {isCheckingOut ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>處理中</span>
                                </div>
                            ) : (
                                "前往結帳"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default CartPage;
