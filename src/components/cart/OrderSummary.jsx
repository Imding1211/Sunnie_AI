import React from 'react';
import { ShieldCheck, CreditCard, ArrowRight, Loader2 } from 'lucide-react';

/**
 * OrderSummary 結帳摘要元件
 * 負責顯示金額計算與結帳按鈕，Mobile 版支援 Sticky 底部
 */
const OrderSummary = ({ items, onCheckout, isCheckingOut }) => {
    // 計算總金額
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const discount = 0; // 暫定無折扣
    const total = subtotal - discount;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            {/* 標題區 */}
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">訂單摘要</h2>
            </div>

            {/* 金額細項 */}
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-gray-600">
                    <span>小計</span>
                    <span>NT$ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                    <span>折扣</span>
                    <span className="text-[var(--color-cta)]">
                        - NT$ {discount.toLocaleString()}
                    </span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">總計</span>
                    <span className="text-2xl font-bold text-[var(--color-primary)]">
                        NT$ {total.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* 結帳按鈕與保證 */}
            <div className="p-6 bg-gray-50 space-y-4">
                <button
                    onClick={onCheckout}
                    disabled={items.length === 0 || isCheckingOut}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--color-cta)] hover:opacity-90 text-white font-bold text-lg rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                    {isCheckingOut ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            處理中...
                        </>
                    ) : (
                        <>
                            前往結帳 <ArrowRight size={20} />
                        </>
                    )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <ShieldCheck size={14} />
                    <span>SSL 安全加密傳輸</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full mx-1"></span>
                    <CreditCard size={14} />
                    <span>支援信用卡/LINE Pay</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
