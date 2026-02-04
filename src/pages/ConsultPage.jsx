import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Star,
    Clock,
    MessageCircle,
    Video,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Check,
    Upload,
    Loader2,
    AlertCircle,
    ExternalLink,
    User,
    Award,
    Briefcase
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { mockConsultApi } from '../api/mockConsultApi';
import './ConsultPage.css';

/**
 * ConsultPage 一對一諮詢頁面
 * 顯示導師資訊、方案選擇、時段預約
 */
const ConsultPage = () => {
    const { consultantId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // 狀態
    const [consultant, setConsultant] = useState(null);
    const [consultants, setConsultants] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 預約表單狀態
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [formData, setFormData] = useState({
        topic: '',
        description: '',
        attachmentUrl: ''
    });
    const [booking, setBooking] = useState(false);
    const [bookingResult, setBookingResult] = useState(null);

    // 載入導師資料
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (consultantId) {
                    // 載入單一導師
                    const res = await mockConsultApi.getConsultant(consultantId);
                    if (res.status === 'success') {
                        setConsultant(res.data);
                        if (res.data.services.length > 0) {
                            setSelectedService(res.data.services[0]);
                        }
                    } else {
                        setError(res.error);
                    }
                } else {
                    // 載入導師列表
                    const res = await mockConsultApi.getConsultants();
                    if (res.status === 'success') {
                        setConsultants(res.data);
                    }
                }
            } catch (err) {
                setError('載入資料時發生錯誤');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [consultantId]);

    // 載入可預約時段
    useEffect(() => {
        const loadAvailability = async () => {
            if (!consultant) return;

            const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

            try {
                const res = await mockConsultApi.getAvailability(
                    consultant.id,
                    startDate.toISOString().split('T')[0],
                    endDate.toISOString().split('T')[0]
                );
                if (res.status === 'success') {
                    setAvailability(res.data);
                }
            } catch (err) {
                console.error('載入時段錯誤', err);
            }
        };

        loadAvailability();
    }, [consultant, currentMonth]);

    // 處理預約提交
    const handleBooking = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/consult/${consultantId}` } } });
            return;
        }

        if (!selectedService || !selectedSlot || !formData.topic) {
            setError('請填寫完整預約資訊');
            return;
        }

        setBooking(true);
        setError('');

        try {
            const res = await mockConsultApi.bookConsultation({
                consultantId: consultant.id,
                serviceId: selectedService.id,
                slotId: selectedSlot.id,
                topic: formData.topic,
                description: formData.description,
                attachmentUrl: formData.attachmentUrl
            });

            if (res.status === 'success') {
                // 模擬付款
                const payRes = await mockConsultApi.payBooking(res.data.orderId);
                if (payRes.status === 'success') {
                    setBookingResult(payRes.data);
                }
            } else {
                setError(res.error);
            }
        } catch (err) {
            setError('預約時發生錯誤');
        } finally {
            setBooking(false);
        }
    };

    // 如果沒有指定導師，顯示列表
    if (!consultantId) {
        return (
            <div className="consult-page">
                <Header />
                <main className="consult-main">
                    <div className="consult-container">
                        <div className="consult-list-header">
                            <h1>一對一諮詢</h1>
                            <p>與業界專家進行深度交流，獲得個人化的職涯建議與技術指導</p>
                        </div>

                        {loading ? (
                            <div className="consult-loading">
                                <Loader2 className="animate-spin" size={32} />
                                <p>載入中...</p>
                            </div>
                        ) : (
                            <div className="consultant-grid">
                                {consultants.map(c => (
                                    <ConsultantCard key={c.id} consultant={c} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // 預約成功畫面
    if (bookingResult) {
        return (
            <div className="consult-page">
                <Header />
                <main className="consult-main">
                    <div className="booking-success">
                        <div className="success-icon">
                            <Check size={48} />
                        </div>
                        <h1>預約成功！</h1>
                        <p>您的諮詢已確認，我們已將詳細資訊發送至您的信箱。</p>

                        <div className="booking-details">
                            <div className="detail-row">
                                <span className="label">導師</span>
                                <span className="value">{bookingResult.consultantName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">時長</span>
                                <span className="value">{bookingResult.duration} 分鐘</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">費用</span>
                                <span className="value">NT$ {bookingResult.price.toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">會議連結</span>
                                <a href={bookingResult.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                                    加入 Google Meet
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>

                        <div className="success-actions">
                            <Link to="/student/consult" className="btn-primary">
                                查看我的預約
                            </Link>
                            <Link to="/consult" className="btn-secondary">
                                返回諮詢列表
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="consult-page">
            <Header />

            <main className="consult-main">
                {loading ? (
                    <div className="consult-loading">
                        <Loader2 className="animate-spin" size={32} />
                        <p>載入中...</p>
                    </div>
                ) : error && !consultant ? (
                    <div className="consult-error">
                        <AlertCircle size={32} />
                        <p>{error}</p>
                        <Link to="/consult" className="btn-primary">返回列表</Link>
                    </div>
                ) : consultant && (
                    <div className="consult-detail-container">
                        {/* 左側：導師資訊 */}
                        <div className="consult-content">
                            {/* 導師檔案 */}
                            <section className="consultant-profile">
                                <div className="profile-header">
                                    <img
                                        src={consultant.avatar}
                                        alt={consultant.name}
                                        className="profile-avatar"
                                    />
                                    <div className="profile-info">
                                        <h1>{consultant.name}</h1>
                                        <p className="profile-title">{consultant.title}</p>
                                        <div className="profile-tags">
                                            {consultant.specialties.map((tag, i) => (
                                                <span key={i} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-stats">
                                    <div className="stat">
                                        <MessageCircle size={18} />
                                        <span className="stat-value">{consultant.stats.totalSessions}</span>
                                        <span className="stat-label">諮詢次數</span>
                                    </div>
                                    <div className="stat">
                                        <Star size={18} />
                                        <span className="stat-value">{consultant.stats.avgRating}</span>
                                        <span className="stat-label">平均評分</span>
                                    </div>
                                    <div className="stat">
                                        <Clock size={18} />
                                        <span className="stat-value">{consultant.stats.responseTime}</span>
                                        <span className="stat-label">平均回覆</span>
                                    </div>
                                </div>

                                <div className="profile-bio">
                                    <h3><User size={18} /> 關於我</h3>
                                    <p>{consultant.bio}</p>
                                </div>

                                <div className="profile-experience">
                                    <h3><Briefcase size={18} /> 經歷背景</h3>
                                    <ul>
                                        {consultant.experience.map((exp, i) => (
                                            <li key={i}>
                                                <Award size={14} />
                                                {exp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* 方案選擇 */}
                            <section className="service-selection">
                                <h2>選擇方案</h2>
                                <div className="service-list">
                                    {consultant.services.map(service => (
                                        <div
                                            key={service.id}
                                            className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedService(service)}
                                        >
                                            <div className="service-header">
                                                <span className="service-duration">
                                                    <Clock size={16} />
                                                    {service.duration} 分鐘
                                                </span>
                                                <span className="service-price">
                                                    NT$ {service.price.toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="service-desc">{service.description}</p>
                                            <div className="service-platform">
                                                <Video size={14} />
                                                {consultant.meetingPlatform}
                                            </div>
                                            {selectedService?.id === service.id && (
                                                <div className="selected-badge">
                                                    <Check size={16} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* 時段選擇 */}
                            <section className="time-selection">
                                <h2>選擇時段</h2>
                                <TimeSlotPicker
                                    currentMonth={currentMonth}
                                    setCurrentMonth={setCurrentMonth}
                                    availability={availability}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    selectedSlot={selectedSlot}
                                    setSelectedSlot={setSelectedSlot}
                                />
                            </section>

                            {/* 諮詢需求表單 */}
                            <section className="requirement-form">
                                <h2>諮詢需求</h2>
                                <div className="form-group">
                                    <label htmlFor="topic">諮詢主題 *</label>
                                    <input
                                        type="text"
                                        id="topic"
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        placeholder="例如：Python 資料科學職涯轉換"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">具體問題描述</label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="請詳細描述您想諮詢的問題或預期達成的目標..."
                                        rows={4}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="attachment">相關資料連結（選填）</label>
                                    <div className="attachment-input">
                                        <Upload size={18} />
                                        <input
                                            type="text"
                                            id="attachment"
                                            value={formData.attachmentUrl}
                                            onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                                            placeholder="請貼上您的履歷、作品集或相關文件連結"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* 右側：預約摘要 (Sticky) */}
                        <aside className="booking-sidebar">
                            <div className="booking-summary">
                                <h3>預約摘要</h3>

                                <div className="summary-item">
                                    <span className="label">導師</span>
                                    <span className="value">{consultant.name}</span>
                                </div>

                                {selectedService && (
                                    <div className="summary-item">
                                        <span className="label">方案</span>
                                        <span className="value">{selectedService.duration} 分鐘諮詢</span>
                                    </div>
                                )}

                                {selectedSlot && (
                                    <div className="summary-item">
                                        <span className="label">時段</span>
                                        <span className="value">
                                            {selectedSlot.date} {selectedSlot.time}
                                        </span>
                                    </div>
                                )}

                                <div className="summary-divider"></div>

                                <div className="summary-total">
                                    <span className="label">總計</span>
                                    <span className="value">
                                        NT$ {selectedService ? selectedService.price.toLocaleString() : '---'}
                                    </span>
                                </div>

                                {error && (
                                    <div className="booking-error">
                                        <AlertCircle size={16} />
                                        {error}
                                    </div>
                                )}

                                <button
                                    className="book-btn"
                                    onClick={handleBooking}
                                    disabled={booking || !selectedService || !selectedSlot || !formData.topic}
                                >
                                    {booking ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            處理中...
                                        </>
                                    ) : (
                                        '立即預約'
                                    )}
                                </button>

                                <p className="booking-note">
                                    預約成功後，您將收到 Google Meet 會議連結
                                </p>
                            </div>
                        </aside>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

/**
 * 導師卡片元件
 */
const ConsultantCard = ({ consultant }) => {
    const navigate = useNavigate();

    return (
        <div className="consultant-card" onClick={() => navigate(`/consult/${consultant.id}`)}>
            <img src={consultant.avatar} alt={consultant.name} className="card-avatar" />
            <div className="card-content">
                <h3>{consultant.name}</h3>
                <p className="card-title">{consultant.title}</p>
                <div className="card-tags">
                    {consultant.specialties.slice(0, 3).map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                    ))}
                </div>
                <div className="card-stats">
                    <span><Star size={14} /> {consultant.stats.avgRating}</span>
                    <span><MessageCircle size={14} /> {consultant.stats.totalSessions} 次諮詢</span>
                </div>
                <div className="card-footer">
                    <span className="card-price">NT$ {consultant.minPrice.toLocaleString()} 起</span>
                    <span className="card-action">預約諮詢 →</span>
                </div>
            </div>
        </div>
    );
};

/**
 * 時段選取器元件
 */
const TimeSlotPicker = ({
    currentMonth,
    setCurrentMonth,
    availability,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot
}) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 生成月份日期
    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // 補齊第一週空白
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // 填入日期
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const date = new Date(year, month, d);
            const dateStr = date.toISOString().split('T')[0];
            const hasSlots = availability.some(s => s.date === dateStr && s.isAvailable);
            const isPast = date < today;

            days.push({
                date: d,
                dateStr,
                hasSlots,
                isPast,
                isToday: date.toDateString() === today.toDateString()
            });
        }

        return days;
    };

    const days = getDaysInMonth();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

    // 取得選中日期的時段
    const slotsForDate = selectedDate
        ? availability.filter(s => s.date === selectedDate)
        : [];

    return (
        <div className="time-picker">
            <div className="calendar-section">
                <div className="calendar-header">
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="month-nav"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="month-title">
                        {currentMonth.getFullYear()} 年 {currentMonth.getMonth() + 1} 月
                    </span>
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="month-nav"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="calendar-weekdays">
                    {weekdays.map(day => (
                        <div key={day} className="weekday">{day}</div>
                    ))}
                </div>

                <div className="calendar-days">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`calendar-day ${!day ? 'empty' : ''} ${day?.isPast ? 'past' : ''} ${day?.hasSlots ? 'available' : ''} ${day?.isToday ? 'today' : ''} ${selectedDate === day?.dateStr ? 'selected' : ''}`}
                            onClick={() => day && !day.isPast && day.hasSlots && setSelectedDate(day.dateStr)}
                        >
                            {day?.date}
                        </div>
                    ))}
                </div>
            </div>

            {selectedDate && (
                <div className="slots-section">
                    <h4>
                        <Calendar size={16} />
                        {selectedDate} 可預約時段
                    </h4>
                    <div className="slots-grid">
                        {slotsForDate.map(slot => (
                            <button
                                key={slot.id}
                                className={`slot-btn ${slot.isBooked ? 'booked' : ''} ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                                onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                                disabled={slot.isBooked}
                            >
                                {slot.time}
                                {slot.isBooked && <span className="booked-label">已預約</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultPage;
