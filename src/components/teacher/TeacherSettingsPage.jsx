import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Settings,
    Calendar,
    Bell,
    Lock,
    User,
    ChevronRight,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import StudentLayout from '../student/StudentLayout';
import './TeacherSettingsPage.css';

/**
 * TeacherSettingsPage 老師設定頁面
 * 管理諮詢服務與帳號設定
 */
const TeacherSettingsPage = () => {
    const [consultEnabled, setConsultEnabled] = useState(true);

    const settingsGroups = [
        {
            title: '諮詢服務',
            items: [
                {
                    icon: Calendar,
                    label: '一對一諮詢',
                    description: consultEnabled ? '已開啟，學生可預約您的諮詢服務' : '已關閉',
                    toggle: true,
                    toggleValue: consultEnabled,
                    onToggle: () => setConsultEnabled(!consultEnabled)
                }
            ]
        },
        {
            title: '帳號設定',
            items: [
                {
                    icon: User,
                    label: '個人簡介',
                    description: '編輯您的公開檔案',
                    to: '/teacher/profile'
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
            <div className="teacher-settings-page">
                {/* Page Header */}
                <div className="student-page-header">
                    <h1 className="student-page-title">設定</h1>
                    <p className="student-page-subtitle">
                        管理您的諮詢服務與帳號偏好
                    </p>
                </div>

                {/* Settings Groups */}
                {settingsGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="settings-group">
                        <h3 className="settings-group-title">{group.title}</h3>
                        <div className="settings-list">
                            {group.items.map((item, itemIndex) => {
                                const Icon = item.icon;

                                if (item.toggle) {
                                    return (
                                        <div
                                            key={itemIndex}
                                            className="settings-item toggle-item"
                                            onClick={item.onToggle}
                                        >
                                            <div className="settings-item-icon">
                                                <Icon size={20} />
                                            </div>
                                            <div className="settings-item-content">
                                                <span className="settings-item-label">{item.label}</span>
                                                <span className="settings-item-desc">{item.description}</span>
                                            </div>
                                            <button className={`toggle-switch ${item.toggleValue ? 'on' : 'off'}`}>
                                                {item.toggleValue ? (
                                                    <ToggleRight size={32} />
                                                ) : (
                                                    <ToggleLeft size={32} />
                                                )}
                                            </button>
                                        </div>
                                    );
                                }

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
                                <span className="settings-item-desc">永久刪除您的帳號與所有課程資料</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default TeacherSettingsPage;
