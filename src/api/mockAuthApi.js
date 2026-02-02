/**
 * 身份驗證 Mock API
 * 模擬後端登入、註冊、Token 管理等功能
 */

// 模擬使用者資料庫
const USERS_DB = [
    {
        id: 'u001',
        name: '測試使用者',
        email: 'test@example.com',
        password: 'Test1234', // 實際應用中密碼應該加密
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
        created_at: '2024-01-01'
    },
    {
        id: 'u002',
        name: '王小明',
        email: 'wang@example.com',
        password: 'Wang1234',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
        created_at: '2024-02-15'
    }
];

// Helper: 模擬延遲
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: 生成模擬 Token
const generateToken = () => {
    return 'mock_token_' + Math.random().toString(36).substring(2, 15);
};

// Helper: Email 格式驗證
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Helper: 密碼強度驗證（至少 8 字元，包含大小寫字母及數字）
const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};

export const mockAuthApi = {
    /**
     * 登入 API
     * @param {string} email
     * @param {string} password
     */
    login: async (email, password) => {
        await delay(800); // 模擬網路延遲

        // 驗證格式
        if (!email || !password) {
            return { status: 'error', code: 400, error: '請填寫所有欄位' };
        }

        if (!isValidEmail(email)) {
            return { status: 'error', code: 400, error: 'Email 格式不正確' };
        }

        // 查找使用者
        const user = USERS_DB.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!user) {
            return { status: 'error', code: 401, error: '帳號或密碼錯誤' };
        }

        // 回傳使用者資料（不包含密碼）
        const { password: _, ...userWithoutPassword } = user;
        return {
            status: 'success',
            data: {
                ...userWithoutPassword,
                token: generateToken(),
                refreshToken: generateToken()
            }
        };
    },

    /**
     * 註冊 API
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @param {string} confirmPassword
     */
    register: async (name, email, password, confirmPassword) => {
        await delay(1000);

        // 驗證必填欄位
        if (!name || !email || !password || !confirmPassword) {
            return { status: 'error', code: 400, error: '請填寫所有欄位' };
        }

        // 驗證 Email 格式
        if (!isValidEmail(email)) {
            return { status: 'error', code: 400, error: 'Email 格式不正確' };
        }

        // 檢查 Email 是否已被註冊
        const existingUser = USERS_DB.find(
            u => u.email.toLowerCase() === email.toLowerCase()
        );
        if (existingUser) {
            return { status: 'error', code: 409, error: '此 Email 已被註冊' };
        }

        // 驗證密碼強度
        if (!isStrongPassword(password)) {
            return {
                status: 'error',
                code: 400,
                error: '密碼須至少 8 個字元，包含大小寫字母及數字'
            };
        }

        // 驗證密碼一致
        if (password !== confirmPassword) {
            return { status: 'error', code: 400, error: '兩次輸入的密碼不一致' };
        }

        // 建立新使用者
        const newUser = {
            id: `u${String(USERS_DB.length + 1).padStart(3, '0')}`,
            name,
            email,
            password,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
            created_at: new Date().toISOString().split('T')[0]
        };

        USERS_DB.push(newUser);

        // 回傳使用者資料（自動登入）
        const { password: _, ...userWithoutPassword } = newUser;
        return {
            status: 'success',
            data: {
                ...userWithoutPassword,
                token: generateToken(),
                refreshToken: generateToken()
            }
        };
    },

    /**
     * 刷新 Token
     * @param {string} refreshToken
     */
    refreshToken: async (refreshToken) => {
        await delay(300);

        if (!refreshToken) {
            return { status: 'error', code: 401, error: 'Token 無效' };
        }

        return {
            status: 'success',
            data: {
                token: generateToken(),
                refreshToken: generateToken()
            }
        };
    },

    /**
     * 登出
     */
    logout: async () => {
        await delay(200);
        return { status: 'success' };
    }
};
