/**
 * 課程總覽 Mock API
 * 模擬後端課程查詢、篩選、排序與分頁功能
 */

// 模擬大量課程資料庫 (Data Source B)
const COURSES_DB = [
    {
        id: "c001",
        title: "React 全攻略：從入門到實戰打造大型應用",
        category: "frontend",
        level: "intermediate",
        instructor: "張小明",
        price: 3200,
        original_price: 4500,
        rating: 4.8,
        reviews: 124,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        created_at: "2023-12-01"
    },
    {
        id: "c002",
        title: "Node.js 後端架構師課程：API 設計與效能優化",
        category: "backend",
        level: "advanced",
        instructor: "李大華",
        price: 2800,
        original_price: 3600,
        rating: 4.7,
        reviews: 89,
        thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800",
        created_at: "2024-01-15"
    },
    {
        id: "c003",
        title: "Python 資料科學特訓班：從數據分析到機器學習",
        category: "data-science",
        level: "beginner",
        instructor: "王小美",
        price: 0,
        original_price: 0,
        rating: 4.9,
        reviews: 350,
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        created_at: "2023-11-20"
    },
    {
        id: "c004",
        title: "Vue.js 3 前端開發實戰：Composition API 與 Pinia",
        category: "frontend",
        level: "beginner",
        instructor: "陳大文",
        price: 2400,
        original_price: 3000,
        rating: 4.6,
        reviews: 56,
        thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
        created_at: "2024-02-01"
    },
    {
        id: "c005",
        title: "Docker 與 Kubernetes 容器化部屬實戰",
        category: "devops",
        level: "advanced",
        instructor: "林志豪",
        price: 4200,
        original_price: 5000,
        rating: 4.9,
        reviews: 78,
        thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800",
        created_at: "2023-10-10"
    },
    {
        id: "c006",
        title: "UI/UX 設計思考與 Figma 實戰",
        category: "design",
        level: "beginner",
        instructor: "吳雅婷",
        price: 1800,
        original_price: 2500,
        rating: 4.8,
        reviews: 210,
        thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
        created_at: "2023-09-05"
    },
    {
        id: "c007",
        title: "SQL 資料庫設計與優化入門",
        category: "backend",
        level: "beginner",
        instructor: "黃國榮",
        price: 1500,
        original_price: 2000,
        rating: 4.5,
        reviews: 45,
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
        created_at: "2023-11-01"
    },
    {
        id: "c008",
        title: "ChatGPT 提示工程與 AI 應用開發",
        category: "data-science",
        level: "intermediate",
        instructor: "Tensor Tsai",
        price: 3600,
        original_price: 4800,
        rating: 5.0,
        reviews: 180,
        thumbnail: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800",
        created_at: "2024-01-20"
    },
    {
        id: "c009",
        title: "JavaScript 核心觀念全解",
        category: "frontend",
        level: "intermediate",
        instructor: "Code Master",
        price: 2200,
        original_price: 3000,
        rating: 4.7,
        reviews: 320,
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
        created_at: "2023-08-15"
    },
    {
        id: "c010",
        title: "資訊安全與滲透測試入門",
        category: "security",
        level: "advanced",
        instructor: "黑帽傑克",
        price: 5000,
        original_price: 6000,
        rating: 4.8,
        reviews: 60,
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
        created_at: "2023-12-25"
    }
];

// Helper: 模擬延遲
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockCoursesApi = {
    /**
     * 取得課程列表 (支援搜尋、篩選、排序、分頁)
     * @param {Object} params
     */
    getCourses: async ({
        search = "",
        category = [],
        level = "",
        priceRange = "",
        rating = "",
        sort = "newest",
        page = 1,
        limit = 12
    }) => {
        await delay(600); // 模擬網路與 DB 查詢時間

        let results = [...COURSES_DB];

        // 1. 搜尋 (Search)
        if (search) {
            const keyword = search.toLowerCase();
            results = results.filter(c =>
                c.title.toLowerCase().includes(keyword) ||
                c.instructor.toLowerCase().includes(keyword)
            );
        }

        // 2. 類別篩選 (Category)
        // category 可能是單一字串或陣列
        if (category && category.length > 0) {
            const categories = Array.isArray(category) ? category : [category];
            results = results.filter(c => categories.includes(c.category));
        }

        // 3. 難易度篩選 (Level)
        if (level) {
            results = results.filter(c => c.level === level);
        }

        // 4. 價格區間 (Price Range)
        if (priceRange) {
            if (priceRange === 'free') {
                results = results.filter(c => c.price === 0);
            } else if (priceRange === 'paid') {
                results = results.filter(c => c.price > 0);
            }
            // 可擴充其他區間邏輯
        }

        // 5. 評分篩選 (Rating)
        if (rating) {
            const minRating = parseFloat(rating);
            results = results.filter(c => c.rating >= minRating);
        }

        // 6. 排序 (Sort)
        switch (sort) {
            case "price-asc":
                results.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                results.sort((a, b) => b.price - a.price);
                break;
            case "popular":
                results.sort((a, b) => b.reviews - a.reviews);
                break;
            case "newest":
            default:
                results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
        }

        // 7. 分頁 (Pagination)
        const total = results.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const paginatedResults = results.slice(startIndex, startIndex + limit);

        return {
            status: "success",
            data: paginatedResults,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages
            }
        };
    },

    /**
     * 取得所有類別 (供 Sidebar 使用)
     */
    getCategories: async () => {
        return [
            { id: "frontend", name: "前端開發" },
            { id: "backend", name: "後端開發" },
            { id: "data-science", name: "資料科學" },
            { id: "devops", name: "DevOps" },
            { id: "design", name: "UI/UX 設計" },
            { id: "security", name: "資訊安全" }
        ];
    },

    /**
     * 取得單一課程詳細資料 (課程詳情頁用)
     * @param {string} id - 課程 ID
     */
    getCourseById: async (id) => {
        await delay(400);

        const course = COURSES_DB.find(c => c.id === id);
        if (!course) {
            return { status: "error", error: "課程不存在" };
        }

        // 模擬完整課程詳細資料
        const courseDetails = {
            ...course,
            subtitle: getCourseSubtitle(course.id),
            description: getCourseDescription(course.id),
            instructor_bio: getInstructorBio(course.instructor),
            instructor_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(course.instructor)}`,
            total_students: Math.floor(course.reviews * 8 + Math.random() * 500),
            total_duration: getCourseDuration(course.id),
            total_lessons: getCourseLessonCount(course.id),
            features: [
                "完整影片教學",
                "練習檔案下載",
                "永久觀看權限",
                "行動裝置支援",
                "結業證書"
            ],
            curriculum: getCourseCurriculum(course.id),
            reviews_data: getCourseReviews(course.id, course.rating)
        };

        return { status: "success", data: courseDetails };
    }
};

// ===== Helper Functions for Course Details =====

function getCourseSubtitle(id) {
    const subtitles = {
        "c001": "掌握 React 18 最新特性，從零打造企業級應用",
        "c002": "深入 Node.js 架構設計，打造高效能後端系統",
        "c003": "從 Pandas 到 Scikit-learn，完整資料科學學習路徑",
        "c004": "Vue 3 Composition API 實戰，現代前端開發必備",
        "c005": "容器化部署最佳實踐，DevOps 必修課程",
        "c006": "設計思維 + Figma 實作，打造優質使用者體驗",
        "c007": "SQL 基礎到進階，資料庫設計與效能優化",
        "c008": "AI 時代必備技能，用 ChatGPT 提升工作效率",
        "c009": "深入理解 JS 核心，成為真正的前端專家",
        "c010": "從零開始學習資安，保護你的數位資產"
    };
    return subtitles[id] || "精心設計的專業課程，助你快速成長";
}

function getCourseDescription(id) {
    return `這是一門專為想要提升專業技能的學習者設計的課程。

課程特色：
• 由業界資深講師親自授課，分享實戰經驗
• 循序漸進的學習路徑，從基礎到進階完整涵蓋
• 豐富的實作練習，邊學邊做鞏固所學
• 專屬學習社群，與同儕交流討論

適合對象：
• 想要轉換跑道進入科技業的職場人士
• 希望提升專業技能的在職工程師
• 對該領域有興趣的自學者

軟硬體需求：
• 一台可上網的電腦（Windows/Mac/Linux 皆可）
• 穩定的網路連線
• 學習熱忱與實踐精神`;
}

function getInstructorBio(name) {
    return `${name} 擁有超過 10 年的業界經驗，曾任職於多家知名科技公司。熱愛分享知識，致力於幫助學員快速掌握實用技能。在桑尼資料科學平台累計培訓超過 5,000 名學員，獲得一致好評。`;
}

function getCourseDuration(id) {
    const durations = {
        "c001": "12 小時 30 分鐘",
        "c002": "10 小時 45 分鐘",
        "c003": "15 小時 20 分鐘",
        "c004": "8 小時 15 分鐘",
        "c005": "11 小時 00 分鐘",
        "c006": "9 小時 30 分鐘",
        "c007": "7 小時 45 分鐘",
        "c008": "6 小時 00 分鐘",
        "c009": "10 小時 00 分鐘",
        "c010": "13 小時 15 分鐘"
    };
    return durations[id] || "8 小時 00 分鐘";
}

function getCourseLessonCount(id) {
    const counts = { "c001": 48, "c002": 42, "c003": 56, "c004": 35, "c005": 40, "c006": 38, "c007": 30, "c008": 25, "c009": 45, "c010": 50 };
    return counts[id] || 35;
}

function getCourseCurriculum(id) {
    // 通用課程大綱模板
    return [
        {
            id: "s1",
            title: "課程介紹與環境設置",
            lessons: [
                { id: "l1", title: "課程大綱與學習目標", duration: "5:30", isPreview: true },
                { id: "l2", title: "開發環境安裝與設定", duration: "12:45", isPreview: true },
                { id: "l3", title: "專案結構介紹", duration: "8:20", isPreview: false }
            ]
        },
        {
            id: "s2",
            title: "核心概念入門",
            lessons: [
                { id: "l4", title: "基礎概念解析", duration: "15:00", isPreview: false },
                { id: "l5", title: "核心語法與用法", duration: "18:30", isPreview: false },
                { id: "l6", title: "實戰練習 1", duration: "22:15", isPreview: false },
                { id: "l7", title: "常見問題與解決方案", duration: "10:00", isPreview: false }
            ]
        },
        {
            id: "s3",
            title: "進階技巧與最佳實踐",
            lessons: [
                { id: "l8", title: "進階模式解析", duration: "20:00", isPreview: false },
                { id: "l9", title: "效能優化技巧", duration: "16:45", isPreview: false },
                { id: "l10", title: "實戰練習 2", duration: "25:00", isPreview: false }
            ]
        },
        {
            id: "s4",
            title: "專案實作",
            lessons: [
                { id: "l11", title: "專案需求分析", duration: "10:00", isPreview: false },
                { id: "l12", title: "專案架構設計", duration: "15:00", isPreview: false },
                { id: "l13", title: "功能實作 Part 1", duration: "30:00", isPreview: false },
                { id: "l14", title: "功能實作 Part 2", duration: "28:00", isPreview: false },
                { id: "l15", title: "測試與部署", duration: "18:00", isPreview: false }
            ]
        },
        {
            id: "s5",
            title: "結語與延伸學習",
            lessons: [
                { id: "l16", title: "課程總結", duration: "8:00", isPreview: false },
                { id: "l17", title: "延伸學習資源", duration: "5:00", isPreview: false }
            ]
        }
    ];
}

function getCourseReviews(id, avgRating) {
    const reviewers = [
        { name: "陳小明", comment: "課程內容非常扎實，講師解說清晰易懂，學到很多實用技巧！" },
        { name: "王美玲", comment: "從零開始學習，現在已經能獨立完成專案了，非常感謝老師！" },
        { name: "林志豪", comment: "實戰練習很有幫助，讓我能夠將所學應用到工作中。" },
        { name: "張雅婷", comment: "課程品質很高，物超所值，已經推薦給同事了。" },
        { name: "李國華", comment: "講解深入淺出，即使是複雜的概念也能輕鬆理解。" }
    ];

    const distribution = {
        5: Math.floor(avgRating >= 4.8 ? 75 : avgRating >= 4.5 ? 65 : 55),
        4: Math.floor(avgRating >= 4.8 ? 18 : avgRating >= 4.5 ? 25 : 30),
        3: Math.floor(avgRating >= 4.8 ? 5 : avgRating >= 4.5 ? 7 : 10),
        2: Math.floor(avgRating >= 4.8 ? 1 : avgRating >= 4.5 ? 2 : 3),
        1: Math.floor(avgRating >= 4.8 ? 1 : avgRating >= 4.5 ? 1 : 2)
    };

    return {
        distribution,
        list: reviewers.map((r, i) => ({
            id: `r${i + 1}`,
            name: r.name,
            rating: 5 - (i % 2),
            date: `2024-0${Math.min(i + 1, 9)}-${10 + i * 3}`,
            comment: r.comment
        }))
    };
}
