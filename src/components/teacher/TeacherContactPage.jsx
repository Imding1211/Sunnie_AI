import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    MessageSquare,
    FileText,
    CheckCircle,
    Clock,
    Loader2,
    ChevronRight,
    Filter
} from 'lucide-react';
import StudentLayout from '../student/StudentLayout';
import { mockTeacherApi } from '../../api/mockTeacherApi';
import './TeacherContactPage.css';

/**
 * TeacherContactPage 老師聯絡簿頁面
 * 管理學生提交的作業、問題與測驗
 */
const TeacherContactPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const response = await mockTeacherApi.getStudentSubmissions(filter);
                if (response.status === 'success') {
                    setSubmissions(response.data);
                } else {
                    setError(response.error);
                }
            } catch (err) {
                setError('載入資料時發生錯誤');
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, [filter]);

    // 篩選選項
    const filters = [
        { value: 'all', label: '全部' },
        { value: 'pending', label: '待處理' },
        { value: 'graded', label: '已批改' }
    ];

    // 類型圖示
    const getTypeIcon = (type) => {
        switch (type) {
            case 'assignment':
                return <FileText size={18} className="text-blue-500" />;
            case 'question':
                return <MessageSquare size={18} className="text-purple-500" />;
            case 'quiz':
                return <ClipboardList size={18} className="text-orange-500" />;
            default:
                return <FileText size={18} />;
        }
    };

    // 類型標籤
    const getTypeLabel = (type) => {
        switch (type) {
            case 'assignment': return '作業';
            case 'question': return '問題';
            case 'quiz': return '測驗';
            default: return type;
        }
    };

    // 狀態標籤
    const getStatusBadge = (status, score) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="contact-status pending">
                        <Clock size={14} />
                        待處理
                    </span>
                );
            case 'graded':
                return (
                    <span className="contact-status graded">
                        <CheckCircle size={14} />
                        已批改 {score ? `(${score}分)` : ''}
                    </span>
                );
            case 'responded':
                return (
                    <span className="contact-status responded">
                        <CheckCircle size={14} />
                        已回覆
                    </span>
                );
            default:
                return <span className="contact-status">{status}</span>;
        }
    };

    // 格式化時間
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <StudentLayout>
            <div className="teacher-contact-page">
                {/* Page Header */}
                <div className="student-page-header">
                    <h1 className="student-page-title">老師聯絡簿</h1>
                    <p className="student-page-subtitle">
                        批改作業、回覆學生問題與管理測驗
                    </p>
                </div>

                {/* Filter */}
                <div className="student-card compact">
                    <div className="filter-section">
                        <Filter size={18} className="text-gray-400" />
                        <div className="filter-buttons">
                            {filters.map((f) => (
                                <button
                                    key={f.value}
                                    className={`filter-btn ${filter === f.value ? 'active' : ''}`}
                                    onClick={() => setFilter(f.value)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submissions List */}
                <div className="student-card">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">{error}</div>
                    ) : submissions.length === 0 ? (
                        <div className="student-empty-state">
                            <div className="student-empty-icon">
                                <ClipboardList size={40} />
                            </div>
                            <h3 className="student-empty-title">沒有待處理項目</h3>
                            <p className="student-empty-description">
                                目前沒有符合條件的學生提交
                            </p>
                        </div>
                    ) : (
                        <div className="submissions-list">
                            {submissions.map((item) => (
                                <div key={item.id} className="submission-item">
                                    {/* Avatar */}
                                    <img
                                        src={item.studentAvatar}
                                        alt={item.studentName}
                                        className="submission-avatar"
                                    />

                                    {/* Content */}
                                    <div className="submission-content">
                                        <div className="submission-header">
                                            <span className="submission-student">
                                                {item.studentName}
                                            </span>
                                            <span className="submission-type">
                                                {getTypeIcon(item.type)}
                                                {getTypeLabel(item.type)}
                                            </span>
                                        </div>
                                        <p className="submission-title">{item.lessonTitle}</p>
                                        <p className="submission-course">{item.courseTitle}</p>
                                        <div className="submission-footer">
                                            <span className="submission-time">
                                                {formatDate(item.submittedAt)}
                                            </span>
                                            {getStatusBadge(item.status, item.score)}
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <button className="submission-action">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
};

export default TeacherContactPage;
