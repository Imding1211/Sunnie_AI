import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar,
    Clock,
    User,
    Video,
    Check,
    X,
    MessageSquare,
    Loader2,
    Eye,
    FileText
} from 'lucide-react';
import Header from '../../components/layout/Header';
import StudentSidebar from '../../components/student/StudentSidebar';
import { useAuth } from '../../context/AuthContext';
import { mockConsultApi } from '../../api/mockConsultApi';
import '../student/StudentConsultPage.css';

/**
 * TeacherConsultPage 老師諮詢管理頁面
 * 顯示學生預約請求，可接受/拒絕/完成
 */
const TeacherConsultPage = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);

    // 狀態標籤配置
    const statusConfig = {
        pending_payment: { label: '待付款', className: 'status-pending' },
        confirmed: { label: '已確認', className: 'status-confirmed', canComplete: true },
        completed: { label: '已完成', className: 'status-completed' },
        cancelled: { label: '已取消', className: 'status-cancelled' },
        rejected: { label: '已拒絕', className: 'status-cancelled' }
    };

    // 載入預約紀錄
    useEffect(() => {
        const loadBookings = async () => {
            setLoading(true);
            // 使用老師的 consultantId（這裡假設為 c001）
            const res = await mockConsultApi.getTeacherBookings('c001');
            if (res.status === 'success') {
                setBookings(res.data);
            }
            setLoading(false);
        };

        loadBookings();
    }, []);

    // 更新預約狀態
    const handleUpdateStatus = async (bookingId, newStatus) => {
        const statusLabels = {
            confirmed: '確認',
            rejected: '拒絕',
            completed: '完成'
        };

        if (!window.confirm(`確定要${statusLabels[newStatus]}此預約嗎？`)) return;

        const res = await mockConsultApi.updateBookingStatus(bookingId, newStatus);
        if (res.status === 'success') {
            setBookings(prev =>
                prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
            );
        }
    };

    // 篩選預約
    const filteredBookings = bookings.filter(b => {
        if (filter === 'all') return true;
        if (filter === 'pending') return b.status === 'pending_payment';
        if (filter === 'confirmed') return b.status === 'confirmed';
        if (filter === 'completed') return b.status === 'completed';
        return true;
    });

    return (
        <>
            <Header />
            <div className="student-page">
                <StudentSidebar />

                <main className="student-main">
                    <div className="page-header">
                        <h1>諮詢管理</h1>
                        <span className="header-subtitle">管理學生的諮詢預約</span>
                    </div>

                    {/* 篩選標籤 */}
                    <div className="filter-tabs">
                        {[
                            { id: 'all', label: '全部' },
                            { id: 'pending', label: '待處理' },
                            { id: 'confirmed', label: '已確認' },
                            { id: 'completed', label: '已完成' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                className={`tab ${filter === tab.id ? 'active' : ''}`}
                                onClick={() => setFilter(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* 預約列表 */}
                    {loading ? (
                        <div className="loading-state">
                            <Loader2 className="animate-spin" size={32} />
                            <p>載入中...</p>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="empty-state">
                            <MessageSquare size={48} />
                            <h3>尚無諮詢預約</h3>
                            <p>目前沒有學生的諮詢請求</p>
                        </div>
                    ) : (
                        <div className="bookings-list">
                            {filteredBookings.map(booking => {
                                const config = statusConfig[booking.status] || {};
                                return (
                                    <div key={booking.id} className="booking-card teacher-card">
                                        <div className="booking-header">
                                            <div className="student-icon">
                                                <User size={24} />
                                            </div>
                                            <div className="consultant-info">
                                                <h3>學生預約</h3>
                                                <p>{booking.topic}</p>
                                            </div>
                                            <span className={`status-badge ${config.className}`}>
                                                {config.label}
                                            </span>
                                        </div>

                                        <div className="booking-details">
                                            <div className="detail-item">
                                                <Calendar size={16} />
                                                <span>{booking.slotId?.split('-').slice(1, 4).join('-') || '待定'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <Clock size={16} />
                                                <span>{booking.duration} 分鐘</span>
                                            </div>
                                            <div className="detail-item">
                                                <FileText size={16} />
                                                <span>NT$ {booking.price?.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {booking.description && (
                                            <div className="student-request">
                                                <h4>學生需求描述</h4>
                                                <p>{booking.description}</p>
                                            </div>
                                        )}

                                        {/* 已評價 */}
                                        {booking.rating && (
                                            <div className="booking-rating">
                                                <strong>學生評價: </strong>
                                                {'⭐'.repeat(booking.rating)}
                                                {booking.review && <span> - {booking.review}</span>}
                                            </div>
                                        )}

                                        <div className="booking-actions">
                                            {booking.status === 'pending_payment' && (
                                                <>
                                                    <button
                                                        className="btn-primary"
                                                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                                    >
                                                        <Check size={16} />
                                                        確認預約
                                                    </button>
                                                    <button
                                                        className="btn-secondary"
                                                        onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                                                    >
                                                        <X size={16} />
                                                        拒絕
                                                    </button>
                                                </>
                                            )}
                                            {config.canComplete && (
                                                <>
                                                    <a
                                                        href={booking.meetingLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-primary"
                                                    >
                                                        <Video size={16} />
                                                        加入會議
                                                    </a>
                                                    <button
                                                        className="btn-outline"
                                                        onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                                    >
                                                        <Check size={16} />
                                                        標記完成
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setSelectedBooking(booking)}
                                            >
                                                <Eye size={16} />
                                                查看詳情
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 詳情 Modal */}
                    {selectedBooking && (
                        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
                            <div className="modal-content" onClick={e => e.stopPropagation()}>
                                <button className="modal-close" onClick={() => setSelectedBooking(null)}>
                                    <X size={20} />
                                </button>
                                <h2>預約詳情</h2>

                                <div className="detail-section">
                                    <h4>諮詢主題</h4>
                                    <p>{selectedBooking.topic}</p>
                                </div>

                                <div className="detail-section">
                                    <h4>時間安排</h4>
                                    <p>{selectedBooking.slotId?.split('-').slice(1, 4).join('-')} • {selectedBooking.duration} 分鐘</p>
                                </div>

                                <div className="detail-section">
                                    <h4>費用</h4>
                                    <p>NT$ {selectedBooking.price?.toLocaleString()}</p>
                                </div>

                                {selectedBooking.description && (
                                    <div className="detail-section">
                                        <h4>需求描述</h4>
                                        <p>{selectedBooking.description}</p>
                                    </div>
                                )}

                                {selectedBooking.attachmentUrl && (
                                    <div className="detail-section">
                                        <h4>附件</h4>
                                        <a href={selectedBooking.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                            查看附件
                                        </a>
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button className="btn-secondary" onClick={() => setSelectedBooking(null)}>
                                        關閉
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default TeacherConsultPage;
