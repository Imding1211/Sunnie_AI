import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * CartItem 購物車項目元件
 * 顯示課程縮圖、標題、講師與價格，並提供移除功能
 */
const CartItem = ({ item, onRemove }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 mb-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
            {/* 縮圖 */}
            <div className="w-full sm:w-32 md:w-40 aspect-video rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 內容區 */}
            <div className="flex-1 w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                    {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                    講師：{item.instructor}
                </p>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-[var(--color-cta)]">
                            NT$ {item.price.toLocaleString()}
                        </span>
                        {item.original_price && (
                            <span className="text-sm text-gray-400 line-through">
                                NT$ {item.original_price.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => onRemove(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        aria-label="移除課程"
                    >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">移除</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
