import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Users, Clock, BookOpen, PlayCircle } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import CourseHero from '../components/courses/CourseHero';
import CoursePurchaseCard from '../components/courses/CoursePurchaseCard';
import CourseCurriculum from '../components/courses/CourseCurriculum';
import CourseReviews from '../components/courses/CourseReviews';
import { mockCoursesApi } from '../api/mockCoursesApi';
import './CourseDetailPage.css';

/**
 * CourseDetailPage 課程詳情頁面
 * 整合 Hero、購買欄、大綱、評價等區塊
 */
const CourseDetailPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('about');

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await mockCoursesApi.getCourseById(id);
                if (res.status === 'success') {
                    setCourse(res.data);
                } else {
                    setError(res.error || '課程不存在');
                }
            } catch (err) {
                setError('載入課程時發生錯誤');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    // Loading Skeleton
    if (loading) {
        return (
            <MainLayout>
                <div className="course-detail-loading">
                    <div className="container mx-auto px-4 py-8 max-w-7xl">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-64 bg-gray-200 rounded-xl mt-6"></div>
                                </div>
                                <div className="h-96 bg-gray-200 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Error State
    if (error) {
        return (
            <MainLayout>
                <div className="course-detail-error">
                    <div className="container mx-auto px-4 py-20 max-w-7xl text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
                        <p className="text-gray-500 mb-6">此課程目前已關閉，請查看其他相關課程</p>
                        <Link
                            to="/courses"
                            className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                            瀏覽所有課程
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const categoryNames = {
        frontend: '前端開發',
        backend: '後端開發',
        'data-science': '資料科學',
        devops: 'DevOps',
        design: 'UI/UX 設計',
        security: '資訊安全'
    };

    return (
        <MainLayout>
            <div className="course-detail-page bg-[var(--color-background)]">
                {/* Breadcrumbs */}
                <div className="bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4 py-4 max-w-7xl">
                        <nav className="flex items-center text-sm text-gray-500">
                            <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">首頁</Link>
                            <ChevronRight size={16} className="mx-2" />
                            <Link to="/courses" className="hover:text-[var(--color-primary)] transition-colors">課程總覽</Link>
                            <ChevronRight size={16} className="mx-2" />
                            <Link to={`/courses?category=${course.category}`} className="hover:text-[var(--color-primary)] transition-colors">
                                {categoryNames[course.category] || course.category}
                            </Link>
                            <ChevronRight size={16} className="mx-2" />
                            <span className="text-gray-900 font-medium truncate max-w-[200px]">{course.title}</span>
                        </nav>
                    </div>
                </div>

                {/* Hero Section + Purchase Card */}
                <CourseHero course={course} />

                {/* Main Content Area */}
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Content Tabs */}
                        <div className="lg:col-span-2">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                                {[
                                    { id: 'about', label: '課程簡介' },
                                    { id: 'curriculum', label: '課程大綱' },
                                    { id: 'instructor', label: '講師簡介' },
                                    { id: 'reviews', label: '學員評價' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === tab.id
                                            ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                                            : 'text-gray-500 border-transparent hover:text-gray-700'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                {/* About Tab */}
                                {activeTab === 'about' && (
                                    <div className="course-about">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">關於這門課程</h2>
                                        <div className="prose prose-gray max-w-none whitespace-pre-line text-gray-600 leading-relaxed">
                                            {course.description}
                                        </div>

                                        {/* Course Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                    <Clock size={20} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">課程時數</p>
                                                    <p className="font-semibold text-gray-900">{course.total_duration}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                                    <BookOpen size={20} className="text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">課程單元</p>
                                                    <p className="font-semibold text-gray-900">{course.total_lessons} 個</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                                    <Users size={20} className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">已報名</p>
                                                    <p className="font-semibold text-gray-900">{course.total_students?.toLocaleString()} 人</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                                                    <Star size={20} className="text-yellow-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">課程評分</p>
                                                    <p className="font-semibold text-gray-900">{course.rating} / 5</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Curriculum Tab */}
                                {activeTab === 'curriculum' && (
                                    <CourseCurriculum curriculum={course.curriculum} />
                                )}

                                {/* Instructor Tab */}
                                {activeTab === 'instructor' && (
                                    <div className="course-instructor">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6">關於講師</h2>
                                        <div className="flex items-start gap-6">
                                            <img
                                                src={course.instructor_avatar}
                                                alt={course.instructor}
                                                className="w-24 h-24 rounded-full bg-gray-100"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">{course.instructor}</h3>
                                                <p className="text-gray-600 leading-relaxed">{course.instructor_bio}</p>
                                                <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users size={16} />
                                                        {course.total_students?.toLocaleString()} 學員
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Star size={16} className="text-yellow-500" />
                                                        {course.rating} 評分
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <PlayCircle size={16} />
                                                        {course.reviews} 則評價
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Reviews Tab */}
                                {activeTab === 'reviews' && (
                                    <CourseReviews
                                        reviews={course.reviews_data}
                                        avgRating={course.rating}
                                        totalReviews={course.reviews}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Right: Sticky Purchase Card (Desktop) */}
                        <div className="hidden lg:block">
                            <CoursePurchaseCard course={course} />
                        </div>
                    </div>
                </div>

                {/* Mobile Sticky Purchase Bar */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
                    <CoursePurchaseCard course={course} isMobile={true} />
                </div>
            </div>
        </MainLayout>
    );
};

export default CourseDetailPage;
