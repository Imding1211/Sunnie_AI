import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import FilterSidebar from '../components/courses/FilterSidebar';
import CourseSort from '../components/courses/CourseSort';
import Pagination from '../components/courses/Pagination';
import OverviewCourseCard from '../components/courses/OverviewCourseCard';
import { mockCoursesApi } from '../api/mockCoursesApi';

/**
 * CoursesPage 課程總覽頁面
 * 整合篩選、排序、列表與 URL 同步邏輯
 */
const CoursesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });

    // 從 URL 讀取初始篩選狀態
    const filters = {
        search: searchParams.get('search') || '',
        category: searchParams.getAll('category') || [],
        level: searchParams.get('level') || '',
        priceRange: searchParams.get('priceRange') || '',
        rating: searchParams.get('rating') || '',
        sort: searchParams.get('sort') || 'newest',
        page: parseInt(searchParams.get('page')) || 1
    };

    // 載入課程資料
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await mockCoursesApi.getCourses(filters);
                setCourses(res.data);
                setMeta(res.meta);
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search slightly
        const timer = setTimeout(fetchCourses, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // 更新篩選條件 (同步至 URL)
    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (!value || (Array.isArray(value) && value.length === 0)) {
            newParams.delete(key);
        } else if (Array.isArray(value)) {
            newParams.delete(key);
            value.forEach(v => newParams.append(key, v));
        } else {
            newParams.set(key, value);
        }

        // 篩選變更時重置頁碼
        if (key !== 'page') newParams.set('page', 1);

        setSearchParams(newParams);
    };

    // 搜尋處理
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        updateFilter('search', formData.get('search'));
    };

    return (
        <MainLayout>
            <div className="bg-[var(--color-background)] min-h-screen pb-20">

                {/* Header Section */}
                <div className="bg-white border-b border-gray-100 mb-8">
                    <div className="container mx-auto px-4 py-8 max-w-7xl">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 font-heading mb-4">
                            探索所有課程
                        </h1>
                        <p className="text-gray-500 max-w-2xl mb-6">
                            無論你是新手還是專家，這裡都有適合你的課程。透過我們的實戰導向教學，快速掌握業界所需的關鍵技能。
                        </p>

                        {/* Search Bar (Large) */}
                        <form onSubmit={handleSearch} className="relative max-w-xl">
                            <input
                                type="text"
                                name="search"
                                defaultValue={filters.search}
                                placeholder="搜尋課程關鍵字 (如：React, Python)..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </form>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Left Sidebar */}
                        <div className="w-full lg:w-64 flex-shrink-0">
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={updateFilter}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">

                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                                <p className="text-gray-500 text-sm">
                                    共找到 <span className="font-bold text-gray-900">{meta.total}</span> 門課程
                                </p>
                                <CourseSort
                                    sort={filters.sort}
                                    onSortChange={(val) => updateFilter('sort', val)}
                                />
                            </div>

                            {/* Course Grid */}
                            {loading ? (
                                // Loading Skeleton
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="bg-white rounded-xl h-96 animate-pulse">
                                            <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                                            <div className="p-5 space-y-4">
                                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                <div className="h-10 bg-gray-200 rounded mt-auto"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : courses.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {courses.map(course => (
                                            <OverviewCourseCard key={course.id} course={course} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <Pagination
                                        currentPage={meta.page}
                                        totalPages={meta.totalPages}
                                        onPageChange={(page) => updateFilter('page', page)}
                                    />
                                </>
                            ) : (
                                // Empty State
                                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <Search className="text-gray-400" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        找不到符合條件的課程
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        嘗試調整篩選條件，或使用其他關鍵字搜尋。
                                    </p>
                                    <button
                                        onClick={() => setSearchParams({})}
                                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                                    >
                                        清除所有篩選
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CoursesPage;
