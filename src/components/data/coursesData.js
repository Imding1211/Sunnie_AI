/**
 * 課程資料
 * 從 mockCoursesApi 同步熱門課程，確保首頁與課程總覽資料一致
 */

// 直接從 COURSES_DB 引用熱門課程 (按 reviews 排序前 3 名)
export const courses = [
    {
        id: "c003",
        title: "Python 資料科學特訓班：從數據分析到機器學習",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        description: "零基礎入門，完整學習 Python 資料處理與機器學習實戰。課程涵蓋 Pandas、NumPy、Matplotlib 與 Scikit-learn。",
        price: 0,
        original_price: 0,
        instructor: "王小美",
        rating: 4.9,
        reviews: 350
    },
    {
        id: "c009",
        title: "JavaScript 核心觀念全解",
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
        description: "深入理解 JavaScript 原理，掌握閉包、原型鏈、非同步處理等核心觀念，成為前端專家。",
        price: 2200,
        original_price: 3000,
        instructor: "Code Master",
        rating: 4.7,
        reviews: 320
    },
    {
        id: "c006",
        title: "UI/UX 設計思考與 Figma 實戰",
        thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
        description: "從設計思維到 Figma 工具實作，學習打造優質使用者體驗的完整流程。",
        price: 1800,
        original_price: 2500,
        instructor: "吳雅婷",
        rating: 4.8,
        reviews: 210
    }
];
