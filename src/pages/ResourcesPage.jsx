import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Grid,
    List,
    Download,
    Heart,
    Eye,
    FileText,
    FileCode,
    FileArchive,
    Link as LinkIcon,
    Video,
    Image,
    Filter,
    ChevronDown,
    Star,
    Clock,
    TrendingUp,
    Lock,
    Loader2,
    X,
    BookOpen,
    Briefcase,
    Wrench
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { mockResourceApi } from '../api/mockResourceApi';
import './ResourcesPage.css';

/**
 * ResourcesPage 資源分享頁面
 * 提供資源搜尋、篩選、下載、收藏功能
 */
const ResourcesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // 狀態
    const [resources, setResources] = useState([]);
    const [categoryStats, setCategoryStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    // 篩選狀態
    const [filters, setFilters] = useState({
        query: searchParams.get('q') || '',
        category: searchParams.get('category') || 'all',
        type: searchParams.get('type') || '',
        level: searchParams.get('level') || '',
        sort: searchParams.get('sort') || 'newest'
    });

    // 分頁
    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
        totalPages: 0
    });

    // 分類配置
    const categories = [
        { id: 'all', label: '全部資源', icon: Grid },
        { id: 'source-code', label: '專案源碼', icon: FileCode },
        { id: 'ebook', label: '電子書/講義', icon: BookOpen },
        { id: 'tools', label: '工具軟體', icon: Wrench },
        { id: 'interview', label: '面試題庫', icon: Briefcase }
    ];

    // 檔案類型
    const fileTypes = [
        { id: '', label: '所有類型' },
        { id: 'pdf', label: 'PDF' },
        { id: 'zip', label: 'ZIP' },
        { id: 'link', label: '連結' },
        { id: 'video', label: '影片' }
    ];

    // 難易度
    const levels = [
        { id: '', label: '所有等級' },
        { id: 'beginner', label: '入門' },
        { id: 'intermediate', label: '進階' },
        { id: 'advanced', label: '專業' }
    ];

    // 排序選項
    const sortOptions = [
        { id: 'newest', label: '最新上架', icon: Clock },
        { id: 'downloads', label: '最多下載', icon: TrendingUp },
        { id: 'rating', label: '最高評分', icon: Star }
    ];

    // 載入資源
    const loadResources = useCallback(async () => {
        setLoading(true);
        try {
            const res = await mockResourceApi.getResources({
                query: filters.query,
                category: filters.category === 'all' ? '' : filters.category,
                type: filters.type,
                level: filters.level,
                sort: filters.sort,
                page: pagination.page
            });

            if (res.status === 'success') {
                setResources(res.data.resources);
                setPagination(prev => ({
                    ...prev,
                    total: res.data.pagination.total,
                    totalPages: res.data.pagination.totalPages
                }));
            }
        } catch (err) {
            console.error('載入資源錯誤', err);
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.page]);

    // 載入分類統計
    useEffect(() => {
        const loadStats = async () => {
            const res = await mockResourceApi.getCategoryStats();
            if (res.status === 'success') {
                setCategoryStats(res.data);
            }
        };
        loadStats();
    }, []);

    // 載入資源
    useEffect(() => {
        loadResources();
    }, [loadResources]);

    // 更新 URL 參數
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.query) params.set('q', filters.query);
        if (filters.category !== 'all') params.set('category', filters.category);
        if (filters.type) params.set('type', filters.type);
        if (filters.level) params.set('level', filters.level);
        if (filters.sort !== 'newest') params.set('sort', filters.sort);

        setSearchParams(params, { replace: true });
    }, [filters, setSearchParams]);

    // 處理搜尋
    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // 處理篩選變更
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // 處理收藏
    const handleFavorite = async (resourceId) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/resources' } } });
            return;
        }

        const res = await mockResourceApi.toggleFavorite(resourceId);
        if (res.status === 'success') {
            setResources(prev =>
                prev.map(r =>
                    r.id === resourceId ? { ...r, isFavorited: res.data.isFavorited } : r
                )
            );
        }
    };

    // 處理下載
    const handleDownload = async (resource) => {
        if (resource.access === 'premium' && !isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/resources' } } });
            return;
        }

        // 模擬下載
        alert(`開始下載：${resource.title}`);
    };

    return (
        <div className="resources-page">
            <Header />

            <main className="resources-main">
                <div className="resources-container">
                    {/* 頂部搜尋區 */}
                    <div className="resources-header">
                        <div className="header-content">
                            <h1>資源分享</h1>
                            <p>豐富的學習資源，助您精進技能</p>
                        </div>

                        <form className="resources-search-bar" onSubmit={handleSearch}>
                            <Search size={20} />
                            <input
                                type="text"
                                value={filters.query}
                                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                                placeholder="搜尋資源名稱、標籤..."
                            />
                            {filters.query && (
                                <button
                                    type="button"
                                    className="clear-btn"
                                    onClick={() => handleFilterChange('query', '')}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </form>

                        {/* 快捷分類 */}
                        <div className="quick-categories">
                            {categories.map(cat => {
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={cat.id}
                                        className={`category-btn ${filters.category === cat.id ? 'active' : ''}`}
                                        onClick={() => handleFilterChange('category', cat.id)}
                                    >
                                        <Icon size={16} />
                                        <span>{cat.label}</span>
                                        <span className="count">{categoryStats[cat.id] || 0}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="resources-layout">
                        {/* 側邊篩選 */}
                        <aside className={`filter-sidebar ${showFilters ? 'show' : ''}`}>
                            <div className="filter-header">
                                <h3><Filter size={18} /> 篩選條件</h3>
                                <button className="close-filters" onClick={() => setShowFilters(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            {/* 檔案類型 */}
                            <div className="filter-group">
                                <h4>檔案類型</h4>
                                <div className="filter-options">
                                    {fileTypes.map(type => (
                                        <label key={type.id} className="filter-option">
                                            <input
                                                type="radio"
                                                name="type"
                                                checked={filters.type === type.id}
                                                onChange={() => handleFilterChange('type', type.id)}
                                            />
                                            <span>{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 難易度 */}
                            <div className="filter-group">
                                <h4>難易度</h4>
                                <div className="filter-options">
                                    {levels.map(level => (
                                        <label key={level.id} className="filter-option">
                                            <input
                                                type="radio"
                                                name="level"
                                                checked={filters.level === level.id}
                                                onChange={() => handleFilterChange('level', level.id)}
                                            />
                                            <span>{level.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 清除篩選 */}
                            <button
                                className="clear-filters-btn"
                                onClick={() => setFilters({
                                    query: '',
                                    category: 'all',
                                    type: '',
                                    level: '',
                                    sort: 'newest'
                                })}
                            >
                                清除所有篩選
                            </button>
                        </aside>

                        {/* 資源列表 */}
                        <section className="resources-content">
                            {/* 工具列 */}
                            <div className="resources-toolbar">
                                <button
                                    className="filter-toggle"
                                    onClick={() => setShowFilters(true)}
                                >
                                    <Filter size={18} />
                                    篩選
                                </button>

                                <div className="toolbar-right">
                                    {/* 排序 */}
                                    <div className="sort-select">
                                        <select
                                            value={filters.sort}
                                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                                        >
                                            {sortOptions.map(opt => (
                                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} />
                                    </div>

                                    {/* 視圖切換 */}
                                    <div className="view-toggle">
                                        <button
                                            className={viewMode === 'grid' ? 'active' : ''}
                                            onClick={() => setViewMode('grid')}
                                        >
                                            <Grid size={18} />
                                        </button>
                                        <button
                                            className={viewMode === 'list' ? 'active' : ''}
                                            onClick={() => setViewMode('list')}
                                        >
                                            <List size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 結果統計 */}
                            <p className="results-count">
                                共找到 <strong>{pagination.total}</strong> 個資源
                            </p>

                            {/* 資源列表 */}
                            {loading ? (
                                <div className="resources-loading">
                                    <Loader2 className="animate-spin" size={32} />
                                    <p>載入中...</p>
                                </div>
                            ) : resources.length === 0 ? (
                                <div className="no-results">
                                    <FileText size={48} />
                                    <h3>找不到相關資源</h3>
                                    <p>試試調整搜尋條件或瀏覽其他分類</p>
                                </div>
                            ) : (
                                <div className={`resources-grid ${viewMode}`}>
                                    {resources.map(resource => (
                                        <ResourceCard
                                            key={resource.id}
                                            resource={resource}
                                            viewMode={viewMode}
                                            onFavorite={handleFavorite}
                                            onDownload={handleDownload}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

/**
 * 資源卡片元件
 */
const ResourceCard = ({ resource, viewMode, onFavorite, onDownload }) => {
    // 檔案類型圖示
    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FileText className="icon-pdf" />;
            case 'zip':
                return <FileArchive className="icon-zip" />;
            case 'link':
                return <LinkIcon className="icon-link" />;
            case 'video':
                return <Video className="icon-video" />;
            case 'image':
                return <Image className="icon-image" />;
            default:
                return <FileText />;
        }
    };

    // 難易度標籤
    const getLevelLabel = (level) => {
        switch (level) {
            case 'beginner':
                return { text: '入門', className: 'level-beginner' };
            case 'intermediate':
                return { text: '進階', className: 'level-intermediate' };
            case 'advanced':
                return { text: '專業', className: 'level-advanced' };
            default:
                return { text: '', className: '' };
        }
    };

    const levelInfo = getLevelLabel(resource.level);

    return (
        <div className={`resource-card ${viewMode}`}>
            {/* 檔案圖示 */}
            <div className="resource-icon">
                {getFileIcon(resource.fileType)}
                {resource.access === 'premium' && (
                    <span className="access-badge premium">
                        <Lock size={10} />
                    </span>
                )}
            </div>

            {/* 內容 */}
            <div className="resource-content">
                <div className="resource-header">
                    <h3 className="resource-title">{resource.title}</h3>
                    <span className={`level-badge ${levelInfo.className}`}>
                        {levelInfo.text}
                    </span>
                </div>

                <p className="resource-desc">{resource.description}</p>

                <div className="resource-tags">
                    {resource.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="tag">#{tag}</span>
                    ))}
                </div>

                <div className="resource-meta">
                    <span className="meta-item">
                        <FileArchive size={14} />
                        {resource.fileSize}
                    </span>
                    <span className="meta-item">
                        <Download size={14} />
                        {resource.downloadCount.toLocaleString()}
                    </span>
                    <span className="meta-item">
                        <Star size={14} />
                        {resource.rating}
                    </span>
                </div>

                {resource.courseName && (
                    <Link to={`/courses/${resource.courseId}`} className="resource-course">
                        <BookOpen size={14} />
                        {resource.courseName}
                    </Link>
                )}
            </div>

            {/* 操作按鈕 */}
            <div className="resource-actions">
                {resource.previewUrl && (
                    <button className="action-btn preview">
                        <Eye size={16} />
                        <span>預覽</span>
                    </button>
                )}
                <button
                    className="action-btn download"
                    onClick={() => onDownload(resource)}
                >
                    <Download size={16} />
                    <span>下載</span>
                </button>
                <button
                    className={`action-btn favorite ${resource.isFavorited ? 'active' : ''}`}
                    onClick={() => onFavorite(resource.id)}
                >
                    <Heart size={16} fill={resource.isFavorited ? 'currentColor' : 'none'} />
                </button>
            </div>
        </div>
    );
};

export default ResourcesPage;
