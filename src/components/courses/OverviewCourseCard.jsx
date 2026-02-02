import React from 'react';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

/**
 * OverviewCourseCard 課程總覽專用卡片
 * 包含評分星星與加入購物車功能
 */
const OverviewCourseCard = ({ course }) => {
    const { addToCart, isInCart } = useCart();
    const navigate = useNavigate();
    const alreadyInCart = isInCart(course.id);

    const handleAddToCart = (e) => {
        e.preventDefault(); // 防止跳轉詳情頁
        e.stopPropagation();

        if (alreadyInCart) {
            navigate('/cart');
        } else {
            addToCart(course);
        }
    };

    return (
        <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
            {/* Thumbnail */}
            <Link to={`/courses/${course.id}`} className="relative aspect-video overflow-hidden bg-gray-100 block">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badge (Optional) */}
                {course.level === 'beginner' && (
                    <span className="absolute top-2 left-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                        入門首選
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                    <Link to={`/courses/${course.id}`} className="hover:text-[var(--color-primary)] transition-colors">
                        {course.title}
                    </Link>
                </h3>

                <p className="text-sm text-gray-500 mb-3">
                    講師：{course.instructor}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-900">{course.rating}</span>
                    <span className="text-xs text-gray-400">({course.reviews} 評價)</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    {/* Price */}
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-[var(--color-cta)]">
                            {course.price === 0 ? '免費' : `NT$ ${course.price.toLocaleString()}`}
                        </span>
                        {course.original_price > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                                NT$ {course.original_price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
              ${alreadyInCart
                                ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
                                : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-md hover:shadow-lg'
                            }
            `}
                    >
                        {alreadyInCart ? (
                            <>
                                <Check size={16} />
                                <span>已加入</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={16} />
                                <span>加入</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OverviewCourseCard;
