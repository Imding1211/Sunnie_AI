import React, { useState, useEffect } from 'react';
import { Receipt, Filter, Loader2, CheckCircle, XCircle } from 'lucide-react';
import StudentLayout from '../../components/student/StudentLayout';
import { mockStudentApi } from '../../api/mockStudentApi';
import './PurchaseHistoryPage.css';

/**
 * PurchaseHistoryPage 購課記錄頁面
 * 顯示消費及退款交易明細
 */
const PurchaseHistoryPage = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            setLoading(true);
            try {
                const response = await mockStudentApi.getPurchaseHistory(filter);
                if (response.status === 'success') {
                    setRecords(response.data);
                } else {
                    setError(response.error);
                }
            } catch (err) {
                setError('載入記錄時發生錯誤');
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, [filter]);

    // 篩選選項
    const filters = [
        { value: 'all', label: '全部' },
        { value: 'purchase', label: '消費記錄' },
        { value: 'refund', label: '退款記錄' }
    ];

    // 訂單狀態標籤
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="status-badge completed">
                        <CheckCircle size={14} />
                        已完成
                    </span>
                );
            case 'refunded':
                return (
                    <span className="status-badge refunded">
                        <XCircle size={14} />
                        已退款
                    </span>
                );
            default:
                return <span className="status-badge">{status}</span>;
        }
    };

    return (
        <StudentLayout>
            <div className="purchase-history-page">
                {/* Page Header */}
                <div className="student-page-header">
                    <h1 className="student-page-title">購課記錄</h1>
                    <p className="student-page-subtitle">
                        查看您的消費與退款交易明細
                    </p>
                </div>

                {/* Filter Section */}
                <div className="student-card">
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

                {/* Records Table */}
                <div className="student-card">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
                            <span className="ml-3 text-gray-500">載入中...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">{error}</div>
                    ) : records.length === 0 ? (
                        <div className="student-empty-state">
                            <div className="student-empty-icon">
                                <Receipt size={40} />
                            </div>
                            <h3 className="student-empty-title">沒有交易記錄</h3>
                            <p className="student-empty-description">
                                目前沒有符合條件的交易記錄
                            </p>
                        </div>
                    ) : (
                        <div className="records-table-wrapper">
                            <table className="records-table">
                                <thead>
                                    <tr>
                                        <th>日期</th>
                                        <th>課程名稱</th>
                                        <th>付款方式</th>
                                        <th className="text-right">金額</th>
                                        <th className="text-center">狀態</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record) => (
                                        <tr key={record.id}>
                                            <td className="whitespace-nowrap">{record.date}</td>
                                            <td>
                                                <span className="course-name-cell">
                                                    {record.courseName}
                                                </span>
                                            </td>
                                            <td className="text-gray-500">{record.paymentMethod}</td>
                                            <td className={`text-right font-medium ${record.amount < 0 ? 'text-red-500' : 'text-gray-900'}`}>
                                                {record.amount < 0 ? '-' : ''}NT$ {Math.abs(record.amount).toLocaleString()}
                                            </td>
                                            <td className="text-center">
                                                {getStatusBadge(record.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Summary */}
                {!loading && !error && records.length > 0 && (
                    <div className="purchase-summary">
                        <div className="summary-item">
                            <span className="summary-label">總消費</span>
                            <span className="summary-value text-[var(--color-primary)]">
                                NT$ {records.filter(r => r.amount > 0).reduce((acc, r) => acc + r.amount, 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">總退款</span>
                            <span className="summary-value text-red-500">
                                NT$ {Math.abs(records.filter(r => r.amount < 0).reduce((acc, r) => acc + r.amount, 0)).toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default PurchaseHistoryPage;
