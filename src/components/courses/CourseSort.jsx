import React from 'react';
import { ArrowUpDown } from 'lucide-react';

/**
 * CourseSort 排序控制器
 */
const CourseSort = ({ sort, onSortChange }) => {
    return (
        <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-gray-500">
                <ArrowUpDown size={18} />
                <span className="text-sm font-medium">排序方式</span>
            </div>
            <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                className="form-select pl-4 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm rounded-lg cursor-pointer bg-white shadow-sm hover:border-[var(--color-primary)] transition-colors"
            >
                <option value="newest">最新上架</option>
                <option value="popular">熱門程度</option>
                <option value="price-asc">價格：低到高</option>
                <option value="price-desc">價格：高到低</option>
            </select>
        </div>
    );
};

export default CourseSort;
