/**
 * 資源分享 Mock API
 * 模擬資源下載與管理功能
 */

// 模擬延遲
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模擬資源資料
const RESOURCES = [
    {
        id: 'r001',
        title: 'Python 資料分析完整專案源碼',
        description: '包含 Pandas、NumPy、Matplotlib 實戰範例，涵蓋數據清洗、視覺化等完整流程',
        category: 'source-code',
        fileType: 'zip',
        fileSize: '15.2 MB',
        version: 'v2.1',
        tags: ['Python', 'Pandas', 'NumPy', '資料分析'],
        level: 'intermediate',
        courseId: 'course-1',
        courseName: 'Python 資料科學入門',
        access: 'premium',
        downloadCount: 1256,
        rating: 4.8,
        uploadDate: '2026-01-15',
        updatedDate: '2026-01-28',
        author: '桑尼老師',
        previewUrl: null,
        isFavorited: false
    },
    {
        id: 'r002',
        title: '機器學習演算法圖解 PDF',
        description: '圖解常見 ML 演算法原理，包含決策樹、SVM、神經網路等',
        category: 'ebook',
        fileType: 'pdf',
        fileSize: '8.5 MB',
        version: 'v1.3',
        tags: ['機器學習', 'ML', '演算法', '圖解'],
        level: 'intermediate',
        courseId: 'course-2',
        courseName: '機器學習實戰班',
        access: 'premium',
        downloadCount: 2341,
        rating: 4.9,
        uploadDate: '2025-12-01',
        updatedDate: '2026-01-10',
        author: '桑尼老師',
        previewUrl: 'https://example.com/preview/ml-pdf',
        isFavorited: true
    },
    {
        id: 'r003',
        title: '前端面試題庫 100 題精選',
        description: '涵蓋 JavaScript、React、CSS 常見面試題與詳解',
        category: 'interview',
        fileType: 'pdf',
        fileSize: '3.2 MB',
        version: 'v3.0',
        tags: ['面試', 'JavaScript', 'React', '前端'],
        level: 'advanced',
        courseId: null,
        courseName: null,
        access: 'public',
        downloadCount: 5678,
        rating: 4.7,
        uploadDate: '2025-11-20',
        updatedDate: '2026-01-05',
        author: '李老師',
        previewUrl: 'https://example.com/preview/interview',
        isFavorited: false
    },
    {
        id: 'r004',
        title: 'Jupyter Notebook 開發環境配置指南',
        description: 'Windows/Mac/Linux 完整環境建置步驟',
        category: 'ebook',
        fileType: 'pdf',
        fileSize: '2.1 MB',
        version: 'v1.0',
        tags: ['Jupyter', 'Python', '環境配置'],
        level: 'beginner',
        courseId: 'course-1',
        courseName: 'Python 資料科學入門',
        access: 'public',
        downloadCount: 892,
        rating: 4.5,
        uploadDate: '2026-01-02',
        updatedDate: '2026-01-02',
        author: '桑尼老師',
        previewUrl: null,
        isFavorited: false
    },
    {
        id: 'r005',
        title: 'React 電商專案模板',
        description: '含購物車、會員系統、訂單管理的完整電商前端模板',
        category: 'source-code',
        fileType: 'zip',
        fileSize: '45.8 MB',
        version: 'v1.2',
        tags: ['React', '電商', '專案模板'],
        level: 'advanced',
        courseId: 'course-3',
        courseName: 'React 進階實戰',
        access: 'premium',
        downloadCount: 756,
        rating: 4.6,
        uploadDate: '2025-12-15',
        updatedDate: '2026-01-20',
        author: '李老師',
        previewUrl: null,
        isFavorited: false
    },
    {
        id: 'r006',
        title: 'VS Code 配置檔與快捷鍵',
        description: '高效開發必備的 VS Code 設定檔與常用快捷鍵',
        category: 'tools',
        fileType: 'zip',
        fileSize: '0.5 MB',
        version: 'v2.0',
        tags: ['VS Code', '工具', '效率'],
        level: 'beginner',
        courseId: null,
        courseName: null,
        access: 'public',
        downloadCount: 3421,
        rating: 4.4,
        uploadDate: '2025-10-10',
        updatedDate: '2025-12-20',
        author: '桑尼老師',
        previewUrl: null,
        isFavorited: true
    },
    {
        id: 'r007',
        title: 'SQL 語法速查表',
        description: '常用 SQL 語法一頁整理，方便查閱',
        category: 'ebook',
        fileType: 'pdf',
        fileSize: '0.8 MB',
        version: 'v1.5',
        tags: ['SQL', '資料庫', '速查表'],
        level: 'beginner',
        courseId: null,
        courseName: null,
        access: 'public',
        downloadCount: 4567,
        rating: 4.8,
        uploadDate: '2025-09-01',
        updatedDate: '2025-11-15',
        author: '桑尼老師',
        previewUrl: 'https://example.com/preview/sql',
        isFavorited: false
    },
    {
        id: 'r008',
        title: 'Git 工作流程圖解',
        description: '團隊協作必備的 Git 流程與指令圖解',
        category: 'ebook',
        fileType: 'pdf',
        fileSize: '1.2 MB',
        version: 'v1.0',
        tags: ['Git', '版本控制', '團隊協作'],
        level: 'beginner',
        courseId: null,
        courseName: null,
        access: 'public',
        downloadCount: 2134,
        rating: 4.6,
        uploadDate: '2025-08-15',
        updatedDate: '2025-08-15',
        author: '李老師',
        previewUrl: null,
        isFavorited: false
    }
];

// 模擬收藏（存在 localStorage）
const getFavorites = () => {
    const stored = localStorage.getItem('sunnie_favorites');
    return stored ? JSON.parse(stored) : ['r002', 'r006'];
};

const saveFavorites = (favorites) => {
    localStorage.setItem('sunnie_favorites', JSON.stringify(favorites));
};

// 模擬用戶自己的資源（存在 localStorage）
const getMyResourcesList = () => {
    const stored = localStorage.getItem('sunnie_my_resources');
    return stored ? JSON.parse(stored) : [];
};

const saveMyResourcesList = (resources) => {
    localStorage.setItem('sunnie_my_resources', JSON.stringify(resources));
};

export const mockResourceApi = {
    /**
     * 獲取資源列表
     */
    getResources: async ({ query = '', category = '', courseId = '', type = '', level = '', sort = 'newest', page = 1, limit = 12 } = {}) => {
        await delay(400);

        let filtered = [...RESOURCES];
        const favorites = getFavorites();

        // 標記收藏狀態
        filtered = filtered.map(r => ({
            ...r,
            isFavorited: favorites.includes(r.id)
        }));

        // 搜尋
        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(r =>
                r.title.toLowerCase().includes(q) ||
                r.description.toLowerCase().includes(q) ||
                r.tags.some(t => t.toLowerCase().includes(q))
            );
        }

        // 分類篩選
        if (category && category !== 'all') {
            filtered = filtered.filter(r => r.category === category);
        }

        // 課程篩選
        if (courseId) {
            filtered = filtered.filter(r => r.courseId === courseId);
        }

        // 檔案類型篩選
        if (type) {
            filtered = filtered.filter(r => r.fileType === type);
        }

        // 難易度篩選
        if (level) {
            filtered = filtered.filter(r => r.level === level);
        }

        // 排序
        switch (sort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                break;
            case 'downloads':
                filtered.sort((a, b) => b.downloadCount - a.downloadCount);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        // 分頁
        const total = filtered.length;
        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit);

        return {
            status: 'success',
            data: {
                resources: paginated,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        };
    },

    /**
     * 獲取單一資源詳情
     */
    getResource: async (resourceId) => {
        await delay(300);
        const favorites = getFavorites();
        const resource = RESOURCES.find(r => r.id === resourceId);

        if (!resource) {
            return { status: 'error', error: '找不到該資源' };
        }

        return {
            status: 'success',
            data: {
                ...resource,
                isFavorited: favorites.includes(resource.id)
            }
        };
    },

    /**
     * 下載資源
     */
    downloadResource: async (resourceId, userId = null) => {
        await delay(500);
        const resource = RESOURCES.find(r => r.id === resourceId);

        if (!resource) {
            return { status: 'error', error: '找不到該資源' };
        }

        // 模擬權限檢查
        if (resource.access === 'premium' && !userId) {
            return { status: 'error', error: '請先登入', code: 'LOGIN_REQUIRED' };
        }

        // 模擬增加下載次數
        resource.downloadCount += 1;

        return {
            status: 'success',
            data: {
                downloadUrl: `https://example.com/download/${resourceId}?token=${Date.now()}`,
                filename: `${resource.title}.${resource.fileType}`
            }
        };
    },

    /**
     * 切換收藏狀態
     */
    toggleFavorite: async (resourceId) => {
        await delay(200);
        const favorites = getFavorites();
        const index = favorites.indexOf(resourceId);

        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(resourceId);
        }

        saveFavorites(favorites);

        return {
            status: 'success',
            data: { isFavorited: index === -1 }
        };
    },

    /**
     * 獲取分類統計
     */
    getCategoryStats: async () => {
        await delay(200);
        const stats = {
            all: RESOURCES.length,
            'source-code': RESOURCES.filter(r => r.category === 'source-code').length,
            ebook: RESOURCES.filter(r => r.category === 'ebook').length,
            tools: RESOURCES.filter(r => r.category === 'tools').length,
            interview: RESOURCES.filter(r => r.category === 'interview').length
        };

        return { status: 'success', data: stats };
    },

    /**
     * 獲取熱門資源
     */
    getPopularResources: async (limit = 5) => {
        await delay(300);
        const sorted = [...RESOURCES].sort((a, b) => b.downloadCount - a.downloadCount);
        return {
            status: 'success',
            data: sorted.slice(0, limit)
        };
    },

    /**
     * 獲取我的資源列表
     */
    getMyResources: async (userId) => {
        await delay(300);
        const myResources = getMyResourcesList();
        const filtered = myResources.filter(r => r.authorId === userId);
        return {
            status: 'success',
            data: filtered
        };
    },

    /**
     * 新增資源
     */
    createResource: async (resourceData) => {
        await delay(500);
        const myResources = getMyResourcesList();

        const newResource = {
            id: `my-r${Date.now()}`,
            ...resourceData,
            status: 'published',
            downloadCount: 0,
            rating: 0,
            uploadDate: new Date().toISOString().split('T')[0],
            updatedDate: new Date().toISOString().split('T')[0]
        };

        myResources.push(newResource);
        saveMyResourcesList(myResources);

        return {
            status: 'success',
            data: newResource
        };
    },

    /**
     * 更新資源
     */
    updateResource: async (resourceId, updateData) => {
        await delay(400);
        const myResources = getMyResourcesList();
        const index = myResources.findIndex(r => r.id === resourceId);

        if (index === -1) {
            return { status: 'error', error: '找不到該資源' };
        }

        myResources[index] = {
            ...myResources[index],
            ...updateData,
            updatedDate: new Date().toISOString().split('T')[0]
        };
        saveMyResourcesList(myResources);

        return {
            status: 'success',
            data: myResources[index]
        };
    },

    /**
     * 切換資源上架/下架狀態
     */
    toggleResourceStatus: async (resourceId) => {
        await delay(300);
        const myResources = getMyResourcesList();
        const index = myResources.findIndex(r => r.id === resourceId);

        if (index === -1) {
            return { status: 'error', error: '找不到該資源' };
        }

        const newStatus = myResources[index].status === 'published' ? 'unpublished' : 'published';
        myResources[index].status = newStatus;
        myResources[index].updatedDate = new Date().toISOString().split('T')[0];
        saveMyResourcesList(myResources);

        return {
            status: 'success',
            data: { id: resourceId, status: newStatus }
        };
    },

    /**
     * 刪除資源
     */
    deleteResource: async (resourceId) => {
        await delay(400);
        const myResources = getMyResourcesList();
        const index = myResources.findIndex(r => r.id === resourceId);

        if (index === -1) {
            return { status: 'error', error: '找不到該資源' };
        }

        myResources.splice(index, 1);
        saveMyResourcesList(myResources);

        return {
            status: 'success',
            message: '資源已刪除'
        };
    }
};
