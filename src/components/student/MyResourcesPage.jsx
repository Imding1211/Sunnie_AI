import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    FileText,
    FileCode,
    FileArchive,
    Upload,
    X,
    Loader2,
    Search
} from 'lucide-react';
import Header from '../layout/Header';
import StudentSidebar from '../student/StudentSidebar';
import { useAuth } from '../../context/AuthContext';
import { mockResourceApi } from '../../api/mockResourceApi';
import './MyResourcesPage.css';

/**
 * MyResourcesPage 資源管理頁面
 * 學生/老師共用，可新增、編輯、上架/下架、刪除資源
 */
const MyResourcesPage = () => {
    const { user, isTeacher } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // 表單狀態
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'ebook',
        fileType: 'pdf',
        fileSize: '',
        level: 'beginner',
        tags: '',
        access: 'public'
    });

    // 分類選項
    const categories = [
        { id: 'source-code', label: '專案源碼' },
        { id: 'ebook', label: '電子書/講義' },
        { id: 'tools', label: '工具軟體' },
        { id: 'interview', label: '面試題庫' }
    ];

    // 載入我的資源
    useEffect(() => {
        const loadResources = async () => {
            setLoading(true);
            const res = await mockResourceApi.getMyResources(user?.id || 'user-1');
            if (res.status === 'success') {
                setResources(res.data);
            }
            setLoading(false);
        };

        loadResources();
    }, [user]);

    // 開啟新增/編輯 Modal
    const openModal = (resource = null) => {
        if (resource) {
            setEditingResource(resource);
            setFormData({
                title: resource.title,
                description: resource.description,
                category: resource.category,
                fileType: resource.fileType,
                fileSize: resource.fileSize,
                level: resource.level,
                tags: resource.tags?.join(', ') || '',
                access: resource.access
            });
        } else {
            setEditingResource(null);
            setFormData({
                title: '',
                description: '',
                category: 'ebook',
                fileType: 'pdf',
                fileSize: '',
                level: 'beginner',
                tags: '',
                access: 'public'
            });
        }
        setShowModal(true);
    };

    // 關閉 Modal
    const closeModal = () => {
        setShowModal(false);
        setEditingResource(null);
    };

    // 提交表單
    const handleSubmit = async (e) => {
        e.preventDefault();

        const resourceData = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            authorId: user?.id || 'user-1',
            author: user?.name || '匿名用戶'
        };

        if (editingResource) {
            // 更新
            const res = await mockResourceApi.updateResource(editingResource.id, resourceData);
            if (res.status === 'success') {
                setResources(prev =>
                    prev.map(r => r.id === editingResource.id ? res.data : r)
                );
            }
        } else {
            // 新增
            const res = await mockResourceApi.createResource(resourceData);
            if (res.status === 'success') {
                setResources(prev => [res.data, ...prev]);
            }
        }

        closeModal();
    };

    // 切換上架/下架
    const handleToggleStatus = async (resourceId) => {
        const res = await mockResourceApi.toggleResourceStatus(resourceId);
        if (res.status === 'success') {
            setResources(prev =>
                prev.map(r => r.id === resourceId ? { ...r, status: res.data.status } : r)
            );
        }
    };

    // 刪除資源
    const handleDelete = async (resourceId) => {
        if (!window.confirm('確定要刪除此資源嗎？此操作無法復原。')) return;

        const res = await mockResourceApi.deleteResource(resourceId);
        if (res.status === 'success') {
            setResources(prev => prev.filter(r => r.id !== resourceId));
        }
    };

    // 搜尋篩選
    const filteredResources = resources.filter(r =>
        r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 檔案類型圖示
    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf':
                return <FileText className="icon-pdf" />;
            case 'zip':
                return <FileArchive className="icon-zip" />;
            default:
                return <FileCode />;
        }
    };

    return (
        <>
            <Header />
            <div className="student-page">
                <StudentSidebar />

                <main className="student-main">
                    <div className="page-header">
                        <h1>資源管理</h1>
                        <button className="btn-primary" onClick={() => openModal()}>
                            <Plus size={18} />
                            新增資源
                        </button>
                    </div>

                    {/* 搜尋列 */}
                    <div className="search-wrapper">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="搜尋我的資源..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* 資源列表 */}
                    {loading ? (
                        <div className="loading-state">
                            <Loader2 className="animate-spin" size={32} />
                            <p>載入中...</p>
                        </div>
                    ) : filteredResources.length === 0 ? (
                        <div className="empty-state">
                            <Upload size={48} />
                            <h3>尚無上傳的資源</h3>
                            <p>點擊「新增資源」開始分享您的學習資源</p>
                            <button className="btn-primary" onClick={() => openModal()}>
                                <Plus size={18} />
                                新增資源
                            </button>
                        </div>
                    ) : (
                        <div className="resources-table-wrapper">
                            <table className="resources-table">
                                <thead>
                                    <tr>
                                        <th>資源</th>
                                        <th>分類</th>
                                        <th>狀態</th>
                                        <th>下載次數</th>
                                        <th>更新時間</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResources.map(resource => (
                                        <tr key={resource.id}>
                                            <td className="resource-cell">
                                                <div className="resource-icon-small">
                                                    {getFileIcon(resource.fileType)}
                                                </div>
                                                <div className="resource-info">
                                                    <span className="resource-title">{resource.title}</span>
                                                    <span className="resource-size">{resource.fileSize}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="category-badge">
                                                    {categories.find(c => c.id === resource.category)?.label || resource.category}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${resource.status === 'published' ? 'status-confirmed' : 'status-pending'}`}>
                                                    {resource.status === 'published' ? '已上架' : '已下架'}
                                                </span>
                                            </td>
                                            <td>{resource.downloadCount || 0}</td>
                                            <td>{resource.updatedDate}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="icon-btn"
                                                        title={resource.status === 'published' ? '下架' : '上架'}
                                                        onClick={() => handleToggleStatus(resource.id)}
                                                    >
                                                        {resource.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    <button
                                                        className="icon-btn"
                                                        title="編輯"
                                                        onClick={() => openModal(resource)}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="icon-btn danger"
                                                        title="刪除"
                                                        onClick={() => handleDelete(resource.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 新增/編輯 Modal */}
                    {showModal && (
                        <div className="modal-overlay" onClick={closeModal}>
                            <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
                                <button className="modal-close" onClick={closeModal}>
                                    <X size={20} />
                                </button>
                                <h2>{editingResource ? '編輯資源' : '新增資源'}</h2>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>資源標題 *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="輸入資源標題"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>描述</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="簡要描述資源內容"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>分類</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>檔案類型</label>
                                            <select
                                                value={formData.fileType}
                                                onChange={e => setFormData({ ...formData, fileType: e.target.value })}
                                            >
                                                <option value="pdf">PDF</option>
                                                <option value="zip">ZIP</option>
                                                <option value="link">連結</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>檔案大小</label>
                                            <input
                                                type="text"
                                                value={formData.fileSize}
                                                onChange={e => setFormData({ ...formData, fileSize: e.target.value })}
                                                placeholder="例：2.5 MB"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>難易度</label>
                                            <select
                                                value={formData.level}
                                                onChange={e => setFormData({ ...formData, level: e.target.value })}
                                            >
                                                <option value="beginner">入門</option>
                                                <option value="intermediate">進階</option>
                                                <option value="advanced">專業</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>標籤（逗號分隔）</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="Python, 資料分析, 機器學習"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>存取權限</label>
                                        <div className="radio-group">
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="access"
                                                    value="public"
                                                    checked={formData.access === 'public'}
                                                    onChange={e => setFormData({ ...formData, access: e.target.value })}
                                                />
                                                <span>公開</span>
                                            </label>
                                            <label className="radio-label">
                                                <input
                                                    type="radio"
                                                    name="access"
                                                    value="premium"
                                                    checked={formData.access === 'premium'}
                                                    onChange={e => setFormData({ ...formData, access: e.target.value })}
                                                />
                                                <span>僅學員</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="modal-actions">
                                        <button type="button" className="btn-secondary" onClick={closeModal}>
                                            取消
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            {editingResource ? '儲存變更' : '新增資源'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default MyResourcesPage;
