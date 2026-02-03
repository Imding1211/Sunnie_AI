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
    Menu
} from 'lucide-react';
import './StudentSidebar.css';

/**
 * StudentSidebar 學生中心側邊導航
 * 提供學生相關功能的直接入口
 */
const StudentSidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
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
        },
        {
            path: '/student/consult',
            icon: MessageSquare,
            label: '一對一諮詢',
            description: '預約諮詢'
        },
        {
            path: '/student/profile',
            icon: User,
            label: '個人簡介',
            description: '學習檔案'
        },
        {
            path: '/student/resources',
            icon: Share2,
            label: '資源分享',
            description: '筆記與文章'
        },
        {
            path: '/student/settings',
            icon: Settings,
            label: '設定',
            description: '帳號設定'
        }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className={`student-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
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
