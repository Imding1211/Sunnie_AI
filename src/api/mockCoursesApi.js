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
    }
};
