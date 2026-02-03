import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ChevronRight } from 'lucide-react';
import StudentLayout from './StudentLayout';

/**
 * PlaceholderPage 佔位頁面
 * 用於尚未開發的功能
 */
const PlaceholderPage = ({ title = '功能開發中', description }) => {
    return (
        <StudentLayout>
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-6">
                    <Construction size={48} className="text-orange-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {title}
                </h1>
                <p className="text-gray-500 mb-8 max-w-md">
                    {description || '此功能正在開發中，敬請期待！我們會盡快推出。'}
                </p>
                <Link
                    to="/student/my-courses"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                    返回我的課程
                    <ChevronRight size={18} />
                </Link>
            </div>
        </StudentLayout>
    );
};

export default PlaceholderPage;
