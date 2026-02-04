import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ChevronRight, Bell, Lock, User } from 'lucide-react';
import StudentLayout from '../../components/student/StudentLayout';
import './SettingsPage.css';

/**
 * SettingsPage 設定頁面
 * 帳號相關設定與成為老師 CTA
 */
const SettingsPage = () => {
    const settingsGroups = [
        {
            title: '帳號設定',
            items: [
                {
                    icon: User,
                    label: '帳號資訊',
                    description: '管理您的帳號基本資訊',
                    to: '/student/profile'
                },
                {
                    icon: Lock,
                    label: '密碼與安全',
                    description: '變更密碼、兩步驟驗證',
                    to: '#'
                },
                {
                    icon: Bell,
                    label: '通知設定',
                    description: '管理電子郵件與推播通知',
                    to: '#'
                }
            ]
        }
    ];

    return (
        <StudentLayout>
            <div className="settings-page">
                {/* Page Header */}
                <div className="student-page-header">
                    <h1 className="student-page-title">設定</h1>
                    <p className="student-page-subtitle">
                        管理您的帳號與偏好設定
                    </p>
                </div>

                {/* Become Teacher CTA */}
                <div className="become-teacher-cta">
                    <div className="cta-content">
                        <div className="cta-icon">
                            <GraduationCap size={32} />
                        </div>
                        <div className="cta-text">
                            <h3 className="cta-title">想成為老師嗎？</h3>
                            <p className="cta-description">
                                分享您的專業知識，創建自己的線上課程，幫助更多人學習成長
                            </p>
                        </div>
                    </div>
                    <Link to="/become-teacher" className="cta-button">
                        了解更多
                        <ChevronRight size={18} />
                    </Link>
                </div>

                {/* Settings Groups */}
                {settingsGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="settings-group">
                        <h3 className="settings-group-title">{group.title}</h3>
                        <div className="settings-list">
                            {group.items.map((item, itemIndex) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={itemIndex}
                                        to={item.to}
                                        className="settings-item"
                                    >
                                        <div className="settings-item-icon">
                                            <Icon size={20} />
                                        </div>
                                        <div className="settings-item-content">
                                            <span className="settings-item-label">{item.label}</span>
                                            <span className="settings-item-desc">{item.description}</span>
                                        </div>
                                        <ChevronRight size={20} className="settings-item-arrow" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Danger Zone */}
                <div className="settings-group danger-zone">
                    <h3 className="settings-group-title">危險區域</h3>
                    <div className="settings-list">
                        <button className="settings-item danger">
                            <div className="settings-item-content">
                                <span className="settings-item-label">刪除帳號</span>
                                <span className="settings-item-desc">永久刪除您的帳號與所有資料</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default SettingsPage;
