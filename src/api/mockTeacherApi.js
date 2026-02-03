/**
 * 老師專屬 Mock API
 * 模擬老師中心相關的後端功能
 */

// Helper: 模擬延遲
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模擬老師課程資料
const TEACHER_COURSES = [
    {
        id: 'course-001',
        title: 'Python 資料科學特訓班',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop',
        status: 'published',
        price: 2980,
        students: 156,
        revenue: 465280,
        rating: 4.8,
        createdAt: '2024-06-15',
        updatedAt: '2025-12-01'
    },
    {
        id: 'course-002',
        title: '機器學習實戰工作坊',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop',
        status: 'published',
        price: 3500,
        students: 89,
        revenue: 311500,
        rating: 4.9,
        createdAt: '2025-01-10',
        updatedAt: '2025-11-20'
    },
    {
        id: 'course-003',
        title: 'SQL 資料庫從零開始',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop',
        status: 'draft',
        price: 0,
        students: 234,
        revenue: 0,
        rating: 4.7,
        createdAt: '2025-02-01',
        updatedAt: '2025-02-01'
    }
];

// 模擬月度銷售數據
const MONTHLY_SALES = [
    { month: '2025-09', sales: 45, revenue: 128500 },
    { month: '2025-10', sales: 62, revenue: 175800 },
    { month: '2025-11', sales: 58, revenue: 164200 },
    { month: '2025-12', sales: 78, revenue: 221400 },
    { month: '2026-01', sales: 92, revenue: 261200 },
    { month: '2026-02', sales: 34, revenue: 96600 }
];

// 模擬學生提交作業
const STUDENT_SUBMISSIONS = [
    {
        id: 'sub-001',
        studentName: '王小明',
        studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming',
        courseTitle: 'Python 資料科學特訓班',
        lessonTitle: '第三章作業：資料清洗練習',
        type: 'assignment',
        submittedAt: '2026-02-02T14:30:00',
        status: 'pending'
    },
    {
        id: 'sub-002',
        studentName: '李美華',
        studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meihua',
        courseTitle: '機器學習實戰工作坊',
        lessonTitle: '影片討論：模型調參問題',
        type: 'question',
        submittedAt: '2026-02-01T09:15:00',
        status: 'pending'
    },
    {
        id: 'sub-003',
        studentName: '陳大維',
        studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dawei',
        courseTitle: 'Python 資料科學特訓班',
        lessonTitle: '第二章測驗：Pandas 基礎',
        type: 'quiz',
        submittedAt: '2026-01-30T16:45:00',
        status: 'graded',
        score: 85
    }
];

export const mockTeacherApi = {
    /**
     * 取得老師的課程列表
     */
    getMyCourses: async () => {
        await delay(500);
        return {
            status: 'success',
            data: TEACHER_COURSES
        };
    },

    /**
     * 取得單一課程詳情
     */
    getCourseById: async (courseId) => {
        await delay(400);
        const course = TEACHER_COURSES.find(c => c.id === courseId);
        if (!course) {
            return { status: 'error', error: '課程不存在' };
        }
        return {
            status: 'success',
            data: course
        };
    },

    /**
     * 建立新課程
     */
    createCourse: async (courseData) => {
        await delay(800);
        const newCourse = {
            id: `course-${Date.now()}`,
            ...courseData,
            status: 'draft',
            students: 0,
            revenue: 0,
            rating: 0,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        TEACHER_COURSES.push(newCourse);
        return {
            status: 'success',
            data: newCourse
        };
    },

    /**
     * 更新課程
     */
    updateCourse: async (courseId, courseData) => {
        await delay(600);
        const index = TEACHER_COURSES.findIndex(c => c.id === courseId);
        if (index === -1) {
            return { status: 'error', error: '課程不存在' };
        }
        TEACHER_COURSES[index] = {
            ...TEACHER_COURSES[index],
            ...courseData,
            updatedAt: new Date().toISOString().split('T')[0]
        };
        return {
            status: 'success',
            data: TEACHER_COURSES[index]
        };
    },

    /**
     * 取得統計數據
     */
    getStatistics: async () => {
        await delay(500);

        const totalStudents = TEACHER_COURSES.reduce((acc, c) => acc + c.students, 0);
        const totalRevenue = TEACHER_COURSES.reduce((acc, c) => acc + c.revenue, 0);
        const publishedCourses = TEACHER_COURSES.filter(c => c.status === 'published').length;

        return {
            status: 'success',
            data: {
                totalStudents,
                totalRevenue,
                totalCourses: TEACHER_COURSES.length,
                publishedCourses,
                monthlySales: MONTHLY_SALES,
                courseStats: TEACHER_COURSES.map(c => ({
                    id: c.id,
                    title: c.title,
                    students: c.students,
                    revenue: c.revenue,
                    rating: c.rating
                }))
            }
        };
    },

    /**
     * 取得學生提交（作業、問題、測驗）
     */
    getStudentSubmissions: async (filter = 'all') => {
        await delay(500);
        let submissions = [...STUDENT_SUBMISSIONS];

        if (filter !== 'all') {
            submissions = submissions.filter(s => s.status === filter);
        }

        return {
            status: 'success',
            data: submissions
        };
    },

    /**
     * 回覆學生提交
     */
    respondToSubmission: async (submissionId, response) => {
        await delay(400);
        const index = STUDENT_SUBMISSIONS.findIndex(s => s.id === submissionId);
        if (index === -1) {
            return { status: 'error', error: '提交不存在' };
        }
        STUDENT_SUBMISSIONS[index].status = 'responded';
        STUDENT_SUBMISSIONS[index].response = response;
        return {
            status: 'success'
        };
    }
};
