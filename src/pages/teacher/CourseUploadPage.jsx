import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Upload,
    Plus,
    Edit3,
    Eye,
    MoreVertical,
    Loader2,
    BookOpen,
    Users,
    Star
} from 'lucide-react';
import StudentLayout from '../../components/student/StudentLayout';
import { mockTeacherApi } from '../../api/mockTeacherApi';
import './CourseUploadPage.css';

/**
 * CourseUploadPage 課程上架頁面
 * 顯示已建立課程列表與新增課程入口
 */
const CourseUploadPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await mockTeacherApi.getMyCourses();
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

    // 狀態標籤
    const getStatusBadge = (status) => {
        switch (status) {
            case 'published':
                return <span className="status-badge published">已上架</span>;
            case 'draft':
                return <span className="status-badge draft">草稿</span>;
            case 'pending':
                return <span className="status-badge pending">審核中</span>;
            default:
                return <span className="status-badge">{status}</span>;
        }
    };

    return (
        <StudentLayout>
            <div className="course-upload-page">
                {/* Page Header */}
                <div className="student-page-header">
                    <div className="page-header-content">
                        <div>
                            <h1 className="student-page-title">課程上架</h1>
                            <p className="student-page-subtitle">
                                建立、編輯並發布您的課程
                            </p>
                        </div>
                        <Link to="/teacher/courses/new" className="create-course-btn">
                            <Plus size={20} />
                            建立新課程
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="student-card">
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
                        </div>
                    </div>
                ) : error ? (
                    <div className="student-card">
                        <div className="text-center py-12 text-red-500">{error}</div>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="student-card">
                        <div className="student-empty-state">
                            <div className="student-empty-icon">
                                <Upload size={40} />
                            </div>
                            <h3 className="student-empty-title">尚未建立任何課程</h3>
                            <p className="student-empty-description">
                                開始建立您的第一門線上課程吧！
                            </p>
                            <Link to="/teacher/courses/new" className="create-course-btn">
                                <Plus size={20} />
                                建立新課程
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="course-list">
                        {courses.map((course) => (
                            <div key={course.id} className="course-card-row">
                                {/* Thumbnail */}
                                <div className="course-thumbnail">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="thumbnail-img"
                                    />
                                    {getStatusBadge(course.status)}
                                </div>

                                {/* Info */}
                                <div className="course-info">
                                    <h3 className="course-title">{course.title}</h3>
                                    <div className="course-meta">
                                        <span className="meta-item">
                                            <Users size={14} />
                                            {course.students} 學生
                                        </span>
                                        <span className="meta-item">
                                            <Star size={14} className="text-yellow-500" />
                                            {course.rating.toFixed(1)}
                                        </span>
                                        <span className="meta-item">
                                            NT$ {course.price.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="course-dates">
                                        最後更新：{course.updatedAt}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="course-actions">
                                    <Link
                                        to={`/teacher/courses/${course.id}/edit`}
                                        className="action-btn edit"
                                        title="編輯課程"
                                    >
                                        <Edit3 size={18} />
                                    </Link>
                                    <Link
                                        to={`/courses/${course.id}`}
                                        className="action-btn preview"
                                        title="預覽課程"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default CourseUploadPage;
