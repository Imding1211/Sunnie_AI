import React from 'react';
import './Badge.css';

/**
 * Badge 徽章元件
 * 用於信任徽章條，顯示圖示 + 文字
 */
const Badge = ({
    icon,
    text,
    className = ''
}) => {
    return (
        <div className={`badge ${className}`.trim()}>
            {icon && <span className="badge-icon">{icon}</span>}
            <span className="badge-text">{text}</span>
        </div>
    );
};

export default Badge;
