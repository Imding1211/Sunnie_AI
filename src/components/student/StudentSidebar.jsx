import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    BookOpen,
    Receipt,
    MessageSquare,
    Settings,
    User,
    Share2,
    ChevronLeft,
    Menu,
    Upload,
    BarChart3,
    ClipboardList
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './StudentSidebar.css';

/**
 * StudentSidebar 會員中心側邊導航
 * 依角色動態顯示不同導航項目
 * - 學生：我的課程、購課記錄、一對一諮詢、個人簡介、資源分享、設定
 * - 老師：課程上架、統計分析、老師聯絡簿 + 部分共用項目
 */
const StudentSidebar = () => {
    const location = useLocation();
    const { isTeacher } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // 學生專屬項目
    const studentItems = [
        {
            path: '/student/my-courses',
            icon: BookOpen,
            label: '我的課程',
            description: '學習主頁'
        },
        {
            path: '/student/history',
            icon: Receipt,
            label: '購課記錄',
            description: '消費記錄'
        }
    ];

    // 老師專屬項目
    const teacherItems = [
        {
            path: '/teacher/courses',
            icon: Upload,
            label: '課程上架',
            description: '管理課程'
        },
        {
            path: '/teacher/statistics',
            icon: BarChart3,
            label: '統計分析',
            description: '數據報表'
        },
        {
            path: '/teacher/contact',
            icon: ClipboardList,
            label: '老師聯絡簿',
            description: '作業與回覆'
        }
    ];

    // 共用項目
    const sharedItems = [
        {
            path: isTeacher ? '/teacher/consult' : '/student/consult',
            icon: MessageSquare,
            label: '諮詢紀錄',
            description: isTeacher ? '管理諮詢' : '我的預約'
        },
        {
            path: isTeacher ? '/teacher/profile' : '/student/profile',
            icon: User,
            label: '個人簡介',
            description: isTeacher ? '公開檔案' : '學習檔案'
        },
        {
            path: isTeacher ? '/teacher/resources' : '/student/resources',
            icon: Share2,
            label: '資源管理',
            description: '我的資源'
        },
        {
            path: isTeacher ? '/teacher/settings' : '/student/settings',
            icon: Settings,
            label: '設定',
            description: '帳號設定'
        }
    ];

    // 根據角色組合導航項目
    const navItems = isTeacher
        ? [...teacherItems, ...sharedItems]
        : [...studentItems, ...sharedItems];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <aside className={`student-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Role Badge */}
            {!isCollapsed && (
                <div className={`sidebar-role-badge ${isTeacher ? 'teacher' : 'student'}`}>
                    {isTeacher ? '老師身份' : '學生身份'}
                </div>
            )}

            {/* Toggle Button */}
            <button
                className="sidebar-toggle"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? '展開側邊欄' : '收合側邊欄'}
            >
                {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${active ? 'active' : ''}`}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <span className="sidebar-icon">
                                <Icon size={20} />
                            </span>
                            {!isCollapsed && (
                                <span className="sidebar-label">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="sidebar-footer">
                    <p className="sidebar-hint">需要幫助？</p>
                    <Link to="/consult" className="sidebar-help-link">
                        聯繫客服
                    </Link>
                </div>
            )}
        </aside>
    );
};

export default StudentSidebar;
