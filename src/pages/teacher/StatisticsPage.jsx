import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart3,
    Users,
    DollarSign,
    BookOpen,
    TrendingUp,
    Loader2,
    ChevronRight,
    Star
} from 'lucide-react';
import StudentLayout from '../../components/student/StudentLayout';
import { mockTeacherApi } from '../../api/mockTeacherApi';
import './StatisticsPage.css';

/**
 * StatisticsPage 統計分析頁面
 * 顯示課程銷售數據與學生互動統計
 */
const StatisticsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await mockTeacherApi.getStatistics();
                if (response.status === 'success') {
                    setStats(response.data);
                } else {
                    setError(response.error);
                }
            } catch (err) {
                setError('載入統計資料時發生錯誤');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // 格式化金額
    const formatCurrency = (amount) => {
        return `NT$ ${amount.toLocaleString()}`;
    };

    return (
        <StudentLayout>
            <div className="statistics-page">
                {/* Page Header */}
                <div className="student-page-header">
                    <h1 className="student-page-title">統計分析</h1>
                    <p className="student-page-subtitle">
                        查看課程銷售與學生互動數據
                    </p>
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
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="stats-summary-grid">
                            <div className="stats-summary-card">
                                <div className="stats-icon blue">
                                    <Users size={24} />
                                </div>
                                <div className="stats-info">
                                    <span className="stats-label">總學生數</span>
                                    <span className="stats-value">{stats.totalStudents}</span>
                                </div>
                            </div>

                            <div className="stats-summary-card">
                                <div className="stats-icon green">
                                    <DollarSign size={24} />
                                </div>
                                <div className="stats-info">
                                    <span className="stats-label">總收入</span>
                                    <span className="stats-value">{formatCurrency(stats.totalRevenue)}</span>
                                </div>
                            </div>

                            <div className="stats-summary-card">
                                <div className="stats-icon purple">
                                    <BookOpen size={24} />
                                </div>
                                <div className="stats-info">
                                    <span className="stats-label">已上架課程</span>
                                    <span className="stats-value">{stats.publishedCourses} / {stats.totalCourses}</span>
                                </div>
                            </div>

                            <div className="stats-summary-card">
                                <div className="stats-icon orange">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="stats-info">
                                    <span className="stats-label">本月銷售</span>
                                    <span className="stats-value">
                                        {stats.monthlySales[stats.monthlySales.length - 1]?.sales || 0} 筆
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Sales Chart (Simplified) */}
                        <div className="student-card">
                            <div className="student-card-header">
                                <h3 className="student-card-title">
                                    <BarChart3 size={20} className="inline mr-2" />
                                    月度銷售趨勢
                                </h3>
                            </div>
                            <div className="monthly-chart">
                                {stats.monthlySales.map((item, index) => {
                                    const maxSales = Math.max(...stats.monthlySales.map(s => s.sales));
                                    const height = (item.sales / maxSales) * 100;
                                    return (
                                        <div key={index} className="chart-bar-container">
                                            <div
                                                className="chart-bar"
                                                style={{ height: `${height}%` }}
                                            >
                                                <span className="chart-bar-value">{item.sales}</span>
                                            </div>
                                            <span className="chart-bar-label">
                                                {item.month.split('-')[1]}月
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Course Stats Table */}
                        <div className="student-card">
                            <div className="student-card-header">
                                <h3 className="student-card-title">課程銷售統計</h3>
                                <Link to="/teacher/courses" className="text-sm text-[var(--color-primary)] hover:underline">
                                    管理課程 <ChevronRight size={16} className="inline" />
                                </Link>
                            </div>
                            <div className="course-stats-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>課程名稱</th>
                                            <th className="text-center">學生數</th>
                                            <th className="text-center">評分</th>
                                            <th className="text-right">收入</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.courseStats.map((course) => (
                                            <tr key={course.id}>
                                                <td className="course-title-cell">{course.title}</td>
                                                <td className="text-center">{course.students}</td>
                                                <td className="text-center">
                                                    <span className="rating-badge">
                                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                        {course.rating.toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="text-right font-medium">
                                                    {formatCurrency(course.revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </StudentLayout>
    );
};

export default StatisticsPage;
