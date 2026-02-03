/**
 * 學生專屬 Mock API
 * 模擬學生中心相關的後端功能
 */

// Helper: 模擬延遲
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模擬已購課程資料
const MY_COURSES = [
    {
        id: 'course-001',
        title: 'Python 資料科學特訓班',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop',
        instructor: '桑尼老師',
        progress: 75,
        totalLessons: 48,
        completedLessons: 36,
        lastAccessed: '2026-02-01',
        category: 'data-science'
    },
    {
        id: 'course-002',
        title: '機器學習實戰工作坊',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop',
        instructor: '桑尼老師',
        progress: 30,
        totalLessons: 36,
        completedLessons: 11,
        lastAccessed: '2026-01-28',
        category: 'machine-learning'
    },
    {
        id: 'course-003',
        title: 'SQL 資料庫從零開始',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop',
        instructor: '桑尼老師',
        progress: 100,
        totalLessons: 24,
        completedLessons: 24,
        lastAccessed: '2026-01-15',
        category: 'database'
    }
];

// 模擬購課記錄
const PURCHASE_HISTORY = [
    {
        id: 'order-001',
        date: '2026-01-05',
        courseName: 'Python 資料科學特訓班',
        courseId: 'course-001',
        amount: 2980,
        status: 'completed',
        paymentMethod: '信用卡'
    },
    {
        id: 'order-002',
        date: '2026-01-10',
        courseName: '機器學習實戰工作坊',
        courseId: 'course-002',
        amount: 3500,
        status: 'completed',
        paymentMethod: '信用卡'
    },
    {
        id: 'order-003',
        date: '2026-01-12',
        courseName: 'SQL 資料庫從零開始',
        courseId: 'course-003',
        amount: 0,
        status: 'completed',
        paymentMethod: '免費課程'
    },
    {
        id: 'refund-001',
        date: '2026-01-08',
        courseName: 'Excel 進階資料分析',
        courseId: 'course-004',
        amount: -1500,
        status: 'refunded',
        paymentMethod: '退款'
    }
];

// 模擬證書
const MY_CERTIFICATES = [
    {
        id: 'cert-001',
        courseId: 'course-003',
        courseName: 'SQL 資料庫從零開始',
        issueDate: '2026-01-15',
        certificateUrl: '#'
    }
];

export const mockStudentApi = {
    /**
     * 取得已購課程列表
     */
    getMyCourses: async () => {
        await delay(500);
        return {
            status: 'success',
            data: MY_COURSES
        };
    },

    /**
     * 取得單一課程詳情（學習用）
     */
    getCourseForLearning: async (courseId) => {
        await delay(400);
        const course = MY_COURSES.find(c => c.id === courseId);
        if (!course) {
            return { status: 'error', error: '課程不存在或尚未購買' };
        }
        return {
            status: 'success',
            data: {
                ...course,
                // 模擬章節資料
                chapters: [
                    {
                        id: 'ch-1',
                        title: '課程介紹',
                        lessons: [
                            { id: 'l-1-1', title: '歡迎加入課程', duration: '05:30', completed: true },
                            { id: 'l-1-2', title: '課程大綱說明', duration: '08:15', completed: true }
                        ]
                    },
                    {
                        id: 'ch-2',
                        title: '基礎概念',
                        lessons: [
                            { id: 'l-2-1', title: '環境安裝與設定', duration: '15:00', completed: true },
                            { id: 'l-2-2', title: '第一個程式', duration: '12:30', completed: false }
                        ]
                    }
                ]
            }
        };
    },

    /**
     * 更新課程進度
     */
    updateCourseProgress: async (courseId, lessonId, completed) => {
        await delay(300);
        return { status: 'success' };
    },

    /**
     * 取得購課記錄
     */
    getPurchaseHistory: async (filter = 'all') => {
        await delay(500);
        let records = [...PURCHASE_HISTORY];

        if (filter === 'purchase') {
            records = records.filter(r => r.status === 'completed' && r.amount >= 0);
        } else if (filter === 'refund') {
            records = records.filter(r => r.status === 'refunded');
        }

        return {
            status: 'success',
            data: records
        };
    },

    /**
     * 取得個人資料
     */
    getProfile: async () => {
        await delay(400);
        return {
            status: 'success',
            data: {
                name: '測試使用者',
                email: 'test@example.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
                bio: '熱愛學習資料科學的初學者',
                joinDate: '2024-01-01',
                coursesCount: MY_COURSES.length,
                certificatesCount: MY_CERTIFICATES.length
            }
        };
    },

    /**
     * 更新個人資料
     */
    updateProfile: async (profileData) => {
        await delay(600);
        return {
            status: 'success',
            message: '個人資料已更新'
        };
    },

    /**
     * 取得證書列表
     */
    getMyCertificates: async () => {
        await delay(400);
        return {
            status: 'success',
            data: MY_CERTIFICATES
        };
    }
};
