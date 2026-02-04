/**
 * 一對一諮詢 Mock API
 * 模擬諮詢預約相關功能
 */

// 模擬延遲
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模擬導師資料
const CONSULTANTS = [
    {
        id: 'c001',
        name: '桑尼老師',
        title: '資料科學顧問',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunnie',
        specialties: ['職涯規劃', '資料科學', 'Python', '機器學習'],
        stats: {
            totalSessions: 128,
            avgRating: 4.9,
            responseTime: '2小時內'
        },
        bio: '擁有 10 年資料科學經驗，曾任職於 Google、Microsoft 等科技公司。專精於資料分析、機器學習模型建置與生產環境部署。已幫助超過 100 位學員成功轉職資料領域。',
        experience: [
            '前 Google 資深資料科學家',
            '台灣大學資訊工程碩士',
            '多項資料競賽冠軍得主'
        ],
        services: [
            {
                id: 's001',
                duration: 30,
                price: 800,
                description: '快速諮詢，適合單一問題解答'
            },
            {
                id: 's002',
                duration: 60,
                price: 1500,
                description: '深度諮詢，適合職涯規劃或技術探討'
            },
            {
                id: 's003',
                duration: 90,
                price: 2100,
                description: '完整諮詢，含履歷審核與模擬面試'
            }
        ],
        meetingPlatform: 'Google Meet',
        isAvailable: true
    },
    {
        id: 'c002',
        name: '李老師',
        title: '前端開發專家',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
        specialties: ['前端開發', 'React', 'Vue.js', '面試技巧'],
        stats: {
            totalSessions: 86,
            avgRating: 4.8,
            responseTime: '4小時內'
        },
        bio: '8 年前端開發經驗，專精於 React 與 Vue.js 框架。曾主導多個大型電商與金融科技專案，熟悉敏捷開發流程與團隊協作。',
        experience: [
            '前台積電前端架構師',
            '開源專案貢獻者',
            '技術部落格作者'
        ],
        services: [
            {
                id: 's004',
                duration: 30,
                price: 600,
                description: '程式碼審核或技術問題解答'
            },
            {
                id: 's005',
                duration: 60,
                price: 1200,
                description: '深度技術諮詢或專案規劃'
            }
        ],
        meetingPlatform: 'Google Meet',
        isAvailable: true
    }
];

// 生成可預約時段
const generateAvailability = (consultantId, startDate, endDate) => {
    const slots = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        // 跳過週末
        if (d.getDay() === 0 || d.getDay() === 6) continue;

        // 每天生成幾個時段
        const timeSlots = ['09:00', '10:00', '14:00', '15:00', '16:00', '19:00', '20:00'];

        timeSlots.forEach((time, index) => {
            // 隨機設定部分時段為已預約
            const isBooked = Math.random() < 0.3;
            const dateStr = d.toISOString().split('T')[0];

            slots.push({
                id: `slot-${dateStr}-${index}`,
                date: dateStr,
                time: time,
                datetime: `${dateStr}T${time}:00`,
                isAvailable: !isBooked,
                isBooked: isBooked
            });
        });
    }

    return slots;
};

// 模擬預約記錄（存在 localStorage）
const getBookings = () => {
    const stored = localStorage.getItem('sunnie_bookings');
    return stored ? JSON.parse(stored) : [];
};

const saveBooking = (booking) => {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('sunnie_bookings', JSON.stringify(bookings));
    return booking;
};

export const mockConsultApi = {
    /**
     * 獲取所有導師列表
     */
    getConsultants: async () => {
        await delay(300);
        return {
            status: 'success',
            data: CONSULTANTS.map(c => ({
                id: c.id,
                name: c.name,
                title: c.title,
                avatar: c.avatar,
                specialties: c.specialties,
                stats: c.stats,
                minPrice: Math.min(...c.services.map(s => s.price)),
                isAvailable: c.isAvailable
            }))
        };
    },

    /**
     * 獲取單一導師詳細資料
     */
    getConsultant: async (consultantId) => {
        await delay(300);
        const consultant = CONSULTANTS.find(c => c.id === consultantId);

        if (!consultant) {
            return { status: 'error', error: '找不到該導師' };
        }

        return { status: 'success', data: consultant };
    },

    /**
     * 獲取導師可預約時段
     */
    getAvailability: async (consultantId, startDate, endDate) => {
        await delay(400);
        const consultant = CONSULTANTS.find(c => c.id === consultantId);

        if (!consultant) {
            return { status: 'error', error: '找不到該導師' };
        }

        if (!consultant.isAvailable) {
            return { status: 'success', data: [] };
        }

        const slots = generateAvailability(consultantId, startDate, endDate);
        return { status: 'success', data: slots };
    },

    /**
     * 預約諮詢
     */
    bookConsultation: async (bookingData) => {
        await delay(800);

        const { consultantId, serviceId, slotId, topic, description, attachmentUrl } = bookingData;

        // 驗證
        const consultant = CONSULTANTS.find(c => c.id === consultantId);
        if (!consultant) {
            return { status: 'error', error: '找不到該導師' };
        }

        const service = consultant.services.find(s => s.id === serviceId);
        if (!service) {
            return { status: 'error', error: '找不到該方案' };
        }

        // 模擬建立預約
        const booking = {
            id: `booking-${Date.now()}`,
            orderId: `order-${Date.now()}`,
            consultantId,
            consultantName: consultant.name,
            consultantAvatar: consultant.avatar,
            serviceId,
            duration: service.duration,
            price: service.price,
            slotId,
            topic,
            description,
            attachmentUrl,
            meetingLink: `https://meet.google.com/abc-${Date.now().toString(36)}-xyz`,
            status: 'pending_payment',
            createdAt: new Date().toISOString()
        };

        saveBooking(booking);

        return {
            status: 'success',
            data: booking
        };
    },

    /**
     * 完成付款
     */
    payBooking: async (orderId) => {
        await delay(500);

        const bookings = getBookings();
        const bookingIndex = bookings.findIndex(b => b.orderId === orderId);

        if (bookingIndex === -1) {
            return { status: 'error', error: '找不到該訂單' };
        }

        bookings[bookingIndex].status = 'confirmed';
        bookings[bookingIndex].paidAt = new Date().toISOString();
        localStorage.setItem('sunnie_bookings', JSON.stringify(bookings));

        return {
            status: 'success',
            data: bookings[bookingIndex]
        };
    },

    /**
     * 取得我的預約
     */
    getMyBookings: async () => {
        await delay(300);
        return {
            status: 'success',
            data: getBookings()
        };
    },

    /**
     * 取消預約
     */
    cancelBooking: async (bookingId) => {
        await delay(500);

        const bookings = getBookings();
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);

        if (bookingIndex === -1) {
            return { status: 'error', error: '找不到該預約' };
        }

        bookings[bookingIndex].status = 'cancelled';
        bookings[bookingIndex].cancelledAt = new Date().toISOString();
        localStorage.setItem('sunnie_bookings', JSON.stringify(bookings));

        return {
            status: 'success',
            message: '預約已取消'
        };
    }
};
