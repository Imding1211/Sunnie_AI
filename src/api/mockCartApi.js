/**
 * 購物車 Mock API
 * 模擬後端行為，包含延遲模擬
 */

// 模擬課程資料庫 (Data Source A)
const COURSE_DATABASE = [
    {
        id: "c001",
        title: "React 全攻略：從入門到實戰打造大型應用",
        instructor: "張小明",
        price: 3200,
        original_price: 4500,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
    },
    {
        id: "c002",
        title: "Node.js 後端架構師課程：API 設計與效能優化",
        instructor: "李大華",
        price: 2800,
        original_price: 3600,
        thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800"
    }
];

// 模擬延遲 helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockCartApi = {
    /**
     * 取得購物車課程列表
     * (模擬 GET /api/v1/courses/{id})
     */
    getCartCourses: async () => {
        await delay(800); // 模擬網路延遲
        // 假設用戶購物車裡有這兩個課程
        return [...COURSE_DATABASE];
    },

    /**
     * 建立訂單
     * (模擬 POST /api/v1/orders)
     * @param {Array} itemIds 課程 ID 列表
     */
    createOrder: async (itemIds) => {
        await delay(1000);

        // 計算總金額
        const totalAmount = COURSE_DATABASE
            .filter(item => itemIds.includes(item.id))
            .reduce((sum, item) => sum + item.price, 0);

        return {
            status: "success",
            data: {
                order_id: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-X${Math.floor(Math.random() * 99)}`,
                total_amount: totalAmount,
                currency: "TWD",
                items: itemIds
            }
        };
    },

    /**
     * 進行付款
     * (模擬 POST /api/v1/orders/{id}/pay)
     * @param {string} orderId 訂單 ID
     */
    processPayment: async (orderId) => {
        await delay(1500); // 模擬付款處理時間

        return {
            status: "success",
            payment_url: `https://mock-payment-gateway.com/pay/${orderId}`
        };
    }
};
