import React from 'react';
import { ShoppingCart, Play, Check, Clock, Download, Smartphone, Award } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

/**
 * CoursePurchaseCard 側邊購買懸浮欄
 * Desktop: Sticky 右側 / Mobile: 固定底部
 */
const CoursePurchaseCard = ({ course, isMobile = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart, cartItems, requiresAuth } = useCart();

    const isInCart = cartItems.some(item => item.id === course.id);
    const isFree = course.price === 0;
    const hasDiscount = course.original_price > course.price && course.original_price > 0;
    const discountPercent = hasDiscount
        ? Math.round((1 - course.price / course.original_price) * 100)
        : 0;

    const handleAddToCart = () => {
        if (isInCart) {
            navigate('/cart');
        } else if (requiresAuth) {
            // 未登入：導向登入頁，並記錄來源位置
            navigate('/login', { state: { from: location } });
        } else {
            addToCart({
                id: course.id,
                title: course.title,
                price: course.price,
                original_price: course.original_price,
                thumbnail: course.thumbnail,
                instructor: course.instructor
            });
        }
    };

    // Mobile Version - Sticky Bottom Bar
    if (isMobile) {
        return (
            <div className="bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-shrink-0">
                        {isFree ? (
                            <span className="text-xl font-bold text-green-600">免費</span>
                        ) : (
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-gray-900">
                                    NT$ {course.price.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <span className="text-sm text-gray-400 line-through">
                                        NT$ {course.original_price.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 flex-1 max-w-xs">
                        <button
                            onClick={handleAddToCart}
                            disabled={isInCart}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${isInCart
                                ? 'bg-gray-100 text-gray-500 cursor-default'
                                : 'bg-[var(--color-primary)] text-white hover:opacity-90'
                                }`}
                        >
                            {isInCart ? (
                                <>
                                    <Check size={18} />
                                    已加入
                                </>
                            ) : (
                                <>
                                    <ShoppingCart size={18} />
                                    加入購物車
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Version - Sticky Sidebar Card
    return (
        <div className="course-purchase-card sticky top-24">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Price Section */}
                <div className="p-6 border-b border-gray-100">
                    {isFree ? (
                        <div className="text-center">
                            <span className="text-3xl font-bold text-green-600">免費課程</span>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="flex items-baseline justify-center gap-3">
                                <span className="text-3xl font-bold text-gray-900">
                                    NT$ {course.price.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <span className="text-lg text-gray-400 line-through">
                                        NT$ {course.original_price.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            {hasDiscount && (
                                <div className="mt-2 inline-block px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-full">
                                    限時 {discountPercent}% 優惠
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* CTA Buttons */}
                <div className="p-6 space-y-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={isInCart}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isInCart
                            ? 'bg-gray-100 text-gray-500 cursor-default'
                            : 'bg-[var(--color-primary)] text-white hover:opacity-90 shadow-lg shadow-blue-500/20'
                            }`}
                    >
                        {isInCart ? (
                            <>
                                <Check size={20} />
                                已加入購物車
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={20} />
                                加入購物車
                            </>
                        )}
                    </button>

                    {isFree ? (
                        <button className="w-full py-3 px-4 rounded-xl font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                            <Play size={20} />
                            立即開始學習
                        </button>
                    ) : (
                        <button className="w-full py-3 px-4 rounded-xl font-medium border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                            立即購買
                        </button>
                    )}
                </div>

                {/* Course Features */}
                <div className="px-6 pb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">課程包含</h4>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-center gap-3">
                            <Clock size={18} className="text-gray-400" />
                            <span>{course.total_duration} 影片教學</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Download size={18} className="text-gray-400" />
                            <span>練習檔案下載</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Play size={18} className="text-gray-400" />
                            <span>永久觀看權限</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Smartphone size={18} className="text-gray-400" />
                            <span>行動裝置支援</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Award size={18} className="text-gray-400" />
                            <span>結業證書</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CoursePurchaseCard;
