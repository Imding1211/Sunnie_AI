import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { mockCoursesApi } from '../../api/mockCoursesApi';

/**
 * FilterSidebar 側邊篩選欄
 * 支援類別、難易度、價格、評分篩選
 * Mobile 版支援收合
 */
const FilterSidebar = ({ filters, onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // Mobile toggle
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        level: true,
        price: true,
        rating: true
    });

    // 載入類別
    useEffect(() => {
        mockCoursesApi.getCategories().then(setCategories);
    }, []);

    // 切換區塊展開/收合
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // 處理 Checkbox 變更 (類別為多選)
    const handleCategoryChange = (catId) => {
        const currentCats = filters.category || [];
        let newCats;
        if (currentCats.includes(catId)) {
            newCats = currentCats.filter(id => id !== catId);
        } else {
            newCats = [...currentCats, catId];
        }
        onFilterChange('category', newCats);
    };

    // 處理 Radio 變更 (單選)
    const handleRadioChange = (key, value) => {
        // 若點擊已選中的，則取消選擇
        const newValue = filters[key] === value ? '' : value;
        onFilterChange(key, newValue);
    };

    return (
        <>
            {/* Mobile Filter Toggle Button */}
            <button
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium mb-4 w-full justify-center"
                onClick={() => setIsOpen(true)}
            >
                <Filter size={20} />
                篩選課程
            </button>

            {/* Sidebar Container (Desktop: Always visible, Mobile: Slide-over) */}
            <aside className={`
        fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:z-0 lg:w-64 lg:block overflow-y-auto lg:overflow-visible p-6 lg:p-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Mobile Header */}
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h2 className="text-xl font-bold text-gray-900">篩選條件</h2>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* 1. Category Filter */}
                <div className="mb-8 border-b border-gray-100 pb-6 lg:border-0 lg:pb-0">
                    <SectionHeader
                        title="課程類別"
                        isExpanded={expandedSections.category}
                        onToggle={() => toggleSection('category')}
                    />
                    {expandedSections.category && (
                        <div className="space-y-3 mt-4">
                            {categories.map(cat => (
                                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer h-5 w-5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                                            checked={filters.category?.includes(cat.id) || false}
                                            onChange={() => handleCategoryChange(cat.id)}
                                        />
                                    </div>
                                    <span className="text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">
                                        {cat.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Level Filter */}
                <div className="mb-8 border-b border-gray-100 pb-6 lg:border-0 lg:pb-0">
                    <SectionHeader
                        title="難易度"
                        isExpanded={expandedSections.level}
                        onToggle={() => toggleSection('level')}
                    />
                    {expandedSections.level && (
                        <div className="space-y-3 mt-4">
                            {[
                                { id: "beginner", name: "初級 (Beginner)" },
                                { id: "intermediate", name: "中級 (Intermediate)" },
                                { id: "advanced", name: "高級 (Advanced)" }
                            ].map(level => (
                                <label key={level.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="level"
                                        className="h-5 w-5 border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                                        checked={filters.level === level.id}
                                        onClick={() => handleRadioChange('level', level.id)}
                                        readOnly
                                    />
                                    <span className="text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">
                                        {level.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Price Filter */}
                <div className="mb-8 border-b border-gray-100 pb-6 lg:border-0 lg:pb-0">
                    <SectionHeader
                        title="價格區間"
                        isExpanded={expandedSections.price}
                        onToggle={() => toggleSection('price')}
                    />
                    {expandedSections.price && (
                        <div className="space-y-3 mt-4">
                            {[
                                { id: "free", name: "免費課程" },
                                { id: "paid", name: "付費課程" }
                            ].map(p => (
                                <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="priceRange"
                                        className="h-5 w-5 border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                                        checked={filters.priceRange === p.id}
                                        onClick={() => handleRadioChange('priceRange', p.id)}
                                        readOnly
                                    />
                                    <span className="text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">
                                        {p.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. Rating Filter */}
                <div className="mb-8 lg:mb-0">
                    <SectionHeader
                        title="使用者評分"
                        isExpanded={expandedSections.rating}
                        onToggle={() => toggleSection('rating')}
                    />
                    {expandedSections.rating && (
                        <div className="space-y-3 mt-4">
                            {[
                                { id: "4.5", name: "4.5 顆星以上" },
                                { id: "4.0", name: "4.0 顆星以上" },
                                { id: "3.5", name: "3.5 顆星以上" }
                            ].map(r => (
                                <label key={r.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="rating"
                                        className="h-5 w-5 border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                                        checked={filters.rating === r.id}
                                        onClick={() => handleRadioChange('rating', r.id)}
                                        readOnly
                                    />
                                    <span className="text-gray-600 group-hover:text-[var(--color-primary)] transition-colors">
                                        {r.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Clear/Apply Buttons */}
                <div className="lg:hidden mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-lg"
                    >
                        查看結果
                    </button>
                </div>
            </aside>

            {/* Backdrop for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

// Helper: Section Header
const SectionHeader = ({ title, isExpanded, onToggle }) => (
    <button
        className="flex items-center justify-between w-full text-left group"
        onClick={onToggle}
    >
        <span className="font-bold text-gray-900 text-lg group-hover:text-[var(--color-primary)] transition-colors">
            {title}
        </span>
        {isExpanded ? (
            <ChevronUp size={20} className="text-gray-400 group-hover:text-[var(--color-primary)]" />
        ) : (
            <ChevronDown size={20} className="text-gray-400 group-hover:text-[var(--color-primary)]" />
        )}
    </button>
);

export default FilterSidebar;
