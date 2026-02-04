import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    User,
    Video,
    Star,
    X,
    MessageSquare,
    RefreshCw,
    ChevronRight,
    Loader2,
    AlertCircle
} from 'lucide-react';
import Header from '../layout/Header';
import StudentSidebar from './StudentSidebar';
import { useAuth } from '../../context/AuthContext';
import { mockConsultApi } from '../../api/mockConsultApi';
import './StudentConsultPage.css';

/**
 * StudentConsultPage 學生諮詢紀錄頁面
 * 顯示所有預約紀錄，可查看詳情、取消或再次預約
 */
const StudentConsultPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');

    // 狀態標籤配置
    const statusConfig = {
        pending_payment: { label: '待付款', className: 'status-pending', canCancel: true },
        confirmed: { label: '已確認', className: 'status-confirmed', canCancel: true },
        completed: { label: '已完成', className: 'status-completed', canRate: true },
        cancelled: { label: '已取消', className: 'status-cancelled' }
    };

    // 載入預約紀錄
    useEffect(() => {
        const loadBookings = async () => {
            if (!isAuthenticated) {
                navigate('/login', { state: { from: { pathname: '/student/consult' } } });
                return;
            }

            setLoading(true);
            const res = await mockConsultApi.getMyBookings();
            if (res.status === 'success') {
                setBookings(res.data);
            }
            setLoading(false);
        };

        loadBookings();
    }, [isAuthenticated, navigate]);

    // 取消預約
    const handleCancel = async (bookingId) => {
        if (!window.confirm('確定要取消此預約嗎？')) return;

        const res = await mockConsultApi.cancelBooking(bookingId);
        if (res.status === 'success') {
            setBookings(prev =>
                prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
            );
        }
    };

    // 提交評價
    const handleSubmitRating = async () => {
        if (!selectedBooking) return;

        const res = await mockConsultApi.rateBooking(selectedBooking.id, rating, review);
        if (res.status === 'success') {
            setBookings(prev =>
                prev.map(b => b.id === selectedBooking.id ? { ...b, rating, review } : b)
            );
            setShowRatingModal(false);
            setSelectedBooking(null);
            setRating(5);
            setReview('');
        }
    };

    // 篩選預約
    const filteredBookings = bookings.filter(b => {
        if (filter === 'all') return true;
        if (filter === 'upcoming') return ['pending_payment', 'confirmed'].includes(b.status);
        if (filter === 'completed') return b.status === 'completed';
        if (filter === 'cancelled') return b.status === 'cancelled';
        return true;
    });

    return (
        <>
            <Header />
            <div className="student-page">
                <StudentSidebar />

                <main className="student-main">
                    <div className="page-header">
                        <h1>諮詢紀錄</h1>
                        <Link to="/consult" className="btn-primary">
                            預約新諮詢
                        </Link>
                    </div>

                    {/* 篩選標籤 */}
                    <div className="filter-tabs">
                        {[
                            { id: 'all', label: '全部' },
                            { id: 'upcoming', label: '即將到來' },
                            { id: 'completed', label: '已完成' },
                            { id: 'cancelled', label: '已取消' }
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
                            <h3>尚無諮詢紀錄</h3>
                            <p>預約一對一諮詢，與專家面對面交流</p>
                            <Link to="/consult" className="btn-primary">
                                立即預約
                            </Link>
                        </div>
                    ) : (
                        <div className="bookings-list">
                            {filteredBookings.map(booking => {
                                const config = statusConfig[booking.status] || {};
                                return (
                                    <div key={booking.id} className="booking-card">
                                        <div className="booking-header">
                                            <img
                                                src={booking.consultantAvatar}
                                                alt={booking.consultantName}
                                                className="consultant-avatar"
                                            />
                                            <div className="consultant-info">
                                                <h3>{booking.consultantName}</h3>
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
                                                <Video size={16} />
                                                <span>Google Meet</span>
                                            </div>
                                        </div>

                                        {booking.description && (
                                            <p className="booking-desc">{booking.description}</p>
                                        )}

                                        {/* 已評價 */}
                                        {booking.rating && (
                                            <div className="booking-rating">
                                                <div className="rating-stars">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            fill={i <= booking.rating ? '#f59e0b' : 'none'}
                                                            stroke={i <= booking.rating ? '#f59e0b' : '#d1d5db'}
                                                        />
                                                    ))}
                                                </div>
                                                {booking.review && (
                                                    <p className="review-text">{booking.review}</p>
                                                )}
                                            </div>
                                        )}

                                        <div className="booking-actions">
                                            {config.canCancel && (
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() => handleCancel(booking.id)}
                                                >
                                                    <X size={16} />
                                                    取消預約
                                                </button>
                                            )}
                                            {config.canRate && !booking.rating && (
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setShowRatingModal(true);
                                                    }}
                                                >
                                                    <Star size={16} />
                                                    評價
                                                </button>
                                            )}
                                            {booking.status === 'confirmed' && booking.meetingLink && (
                                                <a
                                                    href={booking.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-primary"
                                                >
                                                    <Video size={16} />
                                                    加入會議
                                                </a>
                                            )}
                                            <Link
                                                to={`/consult/${booking.consultantId}`}
                                                className="btn-outline"
                                            >
                                                <RefreshCw size={16} />
                                                再次預約
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 評價 Modal */}
                    {showRatingModal && selectedBooking && (
                        <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
                            <div className="modal-content" onClick={e => e.stopPropagation()}>
                                <button className="modal-close" onClick={() => setShowRatingModal(false)}>
                                    <X size={20} />
                                </button>
                                <h2>評價諮詢</h2>
                                <p className="modal-subtitle">
                                    與 {selectedBooking.consultantName} 的諮詢
                                </p>

                                <div className="rating-input">
                                    <label>評分</label>
                                    <div className="rating-stars-input">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setRating(i)}
                                            >
                                                <Star
                                                    size={28}
                                                    fill={i <= rating ? '#f59e0b' : 'none'}
                                                    stroke={i <= rating ? '#f59e0b' : '#d1d5db'}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="review-input">
                                    <label>評語（選填）</label>
                                    <textarea
                                        value={review}
                                        onChange={e => setReview(e.target.value)}
                                        placeholder="分享您的諮詢體驗..."
                                        rows={4}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button className="btn-secondary" onClick={() => setShowRatingModal(false)}>
                                        取消
                                    </button>
                                    <button className="btn-primary" onClick={handleSubmitRating}>
                                        提交評價
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

export default StudentConsultPage;
