import React, { useState, useEffect } from 'react';
import { User, Camera, Award, Briefcase, Loader2, Save, Check } from 'lucide-react';
import StudentLayout from '../../components/student/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { mockStudentApi } from '../../api/mockStudentApi';
import './ProfilePage.css';

/**
 * ProfilePage 個人簡介頁面
 * 編輯個人資料、查看證書與作品
 */
const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        bio: '',
        avatar: ''
    });
    const [certificates, setCertificates] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, certRes] = await Promise.all([
                    mockStudentApi.getProfile(),
                    mockStudentApi.getMyCertificates()
                ]);

                if (profileRes.status === 'success') {
                    setProfile({
                        name: profileRes.data.name,
                        bio: profileRes.data.bio,
                        avatar: profileRes.data.avatar
                    });
                }

                if (certRes.status === 'success') {
                    setCertificates(certRes.data);
                }
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await mockStudentApi.updateProfile(profile);
            if (response.status === 'success') {
                setSaveSuccess(true);
                // 同步更新 AuthContext
                if (updateUser) {
                    updateUser({ name: profile.name });
                }
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (err) {
            console.error('Failed to save profile', err);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: '個人資料', icon: User },
        { id: 'certificates', label: '我的證書', icon: Award },
        { id: 'works', label: '我的作品', icon: Briefcase }
    ];

    return (
        <StudentLayout>
            <div className="profile-page">
                {/* Page Header */}
                <div className="student-page-header">
                    <h1 className="student-page-title">個人簡介</h1>
                    <p className="student-page-subtitle">
                        管理您的學習檔案與成就展示
                    </p>
                </div>

                {/* Tabs */}
                <div className="profile-tabs">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="student-card">
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="student-card">
                                <div className="profile-form">
                                    {/* Avatar */}
                                    <div className="avatar-section">
                                        <div className="avatar-preview">
                                            <img
                                                src={profile.avatar || user?.avatar}
                                                alt="Avatar"
                                                className="avatar-image"
                                            />
                                            <button className="avatar-edit-btn" title="更換頭像">
                                                <Camera size={16} />
                                            </button>
                                        </div>
                                        <p className="avatar-hint">點擊更換頭像</p>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="form-fields">
                                        <div className="form-group">
                                            <label htmlFor="name" className="form-label">
                                                暱稱
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={profile.name}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                placeholder="輸入您的暱稱"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="bio" className="form-label">
                                                自我介紹
                                            </label>
                                            <textarea
                                                id="bio"
                                                name="bio"
                                                value={profile.bio}
                                                onChange={handleInputChange}
                                                className="form-textarea"
                                                rows={4}
                                                placeholder="寫一段關於自己的介紹..."
                                            />
                                        </div>

                                        <button
                                            className="save-btn"
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    儲存中...
                                                </>
                                            ) : saveSuccess ? (
                                                <>
                                                    <Check size={18} />
                                                    已儲存
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    儲存變更
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Certificates Tab */}
                        {activeTab === 'certificates' && (
                            <div className="student-card">
                                {certificates.length === 0 ? (
                                    <div className="student-empty-state">
                                        <div className="student-empty-icon">
                                            <Award size={40} />
                                        </div>
                                        <h3 className="student-empty-title">尚無證書</h3>
                                        <p className="student-empty-description">
                                            完成課程後即可獲得結業證書
                                        </p>
                                    </div>
                                ) : (
                                    <div className="certificates-grid">
                                        {certificates.map((cert) => (
                                            <div key={cert.id} className="certificate-card">
                                                <div className="certificate-icon">
                                                    <Award size={32} />
                                                </div>
                                                <div className="certificate-info">
                                                    <h4 className="certificate-title">{cert.courseName}</h4>
                                                    <p className="certificate-date">發證日期：{cert.issueDate}</p>
                                                </div>
                                                <button className="certificate-download">
                                                    查看證書
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Works Tab */}
                        {activeTab === 'works' && (
                            <div className="student-card">
                                <div className="student-empty-state">
                                    <div className="student-empty-icon">
                                        <Briefcase size={40} />
                                    </div>
                                    <h3 className="student-empty-title">尚無作品</h3>
                                    <p className="student-empty-description">
                                        上傳您的課程實作作品，展示學習成果
                                    </p>
                                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity">
                                        上傳作品
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </StudentLayout>
    );
};

export default ProfilePage;
