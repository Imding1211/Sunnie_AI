import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight, Loader2 } from 'lucide-react';
import StudentLayout from '../../components/student/StudentLayout';
import { mockStudentApi } from '../../api/mockStudentApi';
import './MyCoursesPage.css';

/**
 * MyCoursesPage 我的課程頁面
 * 顯示學生已購買的課程列表與學習進度
 */
const MyCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await mockStudentApi.getMyCourses();
                if (response.status === 'success') {
                    setCourses(response.data);
                } else {
                    setError(response.error);
                }
            } catch (err) {
                setError('載入課程時發生錯誤');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // 取得進度文字
    const getProgressText = (progress) => {
        if (progress === 100) return '已完成';
        if (progress === 0) return '尚未開始';
        return `已完成 ${progress}%`;
    };

    // 取得進度顏色
    const getProgressColor = (progress) => {
        if (progress === 100) return 'text-green-600';
        if (progress >= 50) return 'text-blue-600';
        return 'text-orange-600';
    };

    return (
        <StudentLayout>
            <div className="my-courses-page">
                {/* Page Header */}
                <div className="student-page-header">
                    <h1 className="student-page-title">我的課程</h1>
                    <p className="student-page-subtitle">
                        管理您的學習進度，繼續您的學習之旅
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="student-card">
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
                            <span className="ml-3 text-gray-500">載入中...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="student-card">
                        <div className="text-center py-12 text-red-500">
                            {error}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && courses.length === 0 && (
                    <div className="student-card">
                        <div className="student-empty-state">
                            <div className="student-empty-icon">
                                <BookOpen size={40} />
                            </div>
                            <h3 className="student-empty-title">尚未購買任何課程</h3>
                            <p className="student-empty-description">
                                探索我們的精選課程，開始您的學習之旅吧！
                            </p>
                            <Link
                                to="/courses"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                            >
                                瀏覽課程
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Course Grid */}
                {!loading && !error && courses.length > 0 && (
                    <div className="my-courses-grid">
                        {courses.map((course) => (
                            <Link
                                key={course.id}
                                to={`/student/course/${course.id}`}
                                className="my-course-card group"
                            >
                                {/* Thumbnail */}
                                <div className="my-course-thumbnail">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {course.progress === 100 && (
                                        <div className="my-course-badge completed">
                                            已完成
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="my-course-content">
                                    <h3 className="my-course-title">{course.title}</h3>
                                    <p className="my-course-instructor">{course.instructor}</p>

                                    {/* Progress */}
                                    <div className="my-course-progress">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-sm font-medium ${getProgressColor(course.progress)}`}>
                                                {getProgressText(course.progress)}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {course.completedLessons}/{course.totalLessons} 單元
                                            </span>
                                        </div>
                                        <div className="course-progress-bar">
                                            <div
                                                className="course-progress-fill"
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Last Accessed */}
                                    <div className="my-course-meta">
                                        <Clock size={14} className="text-gray-400" />
                                        <span className="text-xs text-gray-400">
                                            上次學習：{course.lastAccessed}
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Arrow */}
                                <div className="my-course-arrow">
                                    <ChevronRight size={20} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default MyCoursesPage;
