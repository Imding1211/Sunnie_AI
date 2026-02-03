/**
 * 身份驗證 Mock API
 * 模擬後端登入、註冊、Token 管理等功能
 * 支援學生(student)與老師(teacher)角色
 */

// 模擬使用者資料庫
const USERS_DB = [
    {
        id: 'u001',
        name: '測試使用者',
        email: 'test@example.com',
        password: 'Test1234',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
        role: 'student', // 學生角色
        created_at: '2024-01-01'
    },
    {
        id: 'u002',
        name: '王小明',
        email: 'wang@example.com',
        password: 'Wang1234',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
        role: 'student',
        created_at: '2024-02-15'
    },
    {
        id: 't001',
        name: '桑尼老師',
        email: 'sunnie@example.com',
        password: 'Sunnie1234',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunnie',
        role: 'teacher', // 老師角色
        title: '資料科學講師',
        bio: '擁有 10 年資料科學經驗，曾任職於多家科技公司',
        created_at: '2023-06-01'
    },
    {
        id: 't002',
        name: '李老師',
        email: 'teacher@example.com',
        password: 'Teacher1234',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
        role: 'teacher',
        title: '機器學習專家',
        bio: 'AI 領域資深工程師，專注於深度學習與 NLP',
        created_at: '2023-08-15'
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
        await delay(800);

        if (!email || !password) {
            return { status: 'error', code: 400, error: '請填寫所有欄位' };
        }

        if (!isValidEmail(email)) {
            return { status: 'error', code: 400, error: 'Email 格式不正確' };
        }

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
     * @param {string} role - 角色：'student' 或 'teacher'
     */
    register: async (name, email, password, confirmPassword, role = 'student') => {
        await delay(1000);

        if (!name || !email || !password || !confirmPassword) {
            return { status: 'error', code: 400, error: '請填寫所有欄位' };
        }

        if (!isValidEmail(email)) {
            return { status: 'error', code: 400, error: 'Email 格式不正確' };
        }

        const existingUser = USERS_DB.find(
            u => u.email.toLowerCase() === email.toLowerCase()
        );
        if (existingUser) {
            return { status: 'error', code: 409, error: '此 Email 已被註冊' };
        }

        if (!isStrongPassword(password)) {
            return {
                status: 'error',
                code: 400,
                error: '密碼須至少 8 個字元，包含大小寫字母及數字'
            };
        }

        if (password !== confirmPassword) {
            return { status: 'error', code: 400, error: '兩次輸入的密碼不一致' };
        }

        // 建立新使用者
        const prefix = role === 'teacher' ? 't' : 'u';
        const newUser = {
            id: `${prefix}${String(USERS_DB.length + 1).padStart(3, '0')}`,
            name,
            email,
            password,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
            role: role || 'student',
            created_at: new Date().toISOString().split('T')[0]
        };

        USERS_DB.push(newUser);

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
