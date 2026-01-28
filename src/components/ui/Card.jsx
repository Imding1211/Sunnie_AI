import React from 'react';
import './Card.css';

/**
 * Card 卡片元件
 * 用於課程卡片、服務卡片、見證卡片等
 * 支援圖片、標題、描述、行動按鈕
 */
const Card = ({
    image,
    imageAlt = '',
    title,
    description,
    footer,
    onClick,
    hoverable = true,
    className = '',
    children
}) => {
    const cardClass = `card ${hoverable ? 'card-hoverable' : ''} ${className}`.trim();

    return (
        <div className={cardClass} onClick={onClick}>
            {image && (
                <div className="card-image">
                    <img src={image} alt={imageAlt} />
                </div>
            )}

            <div className="card-content">
                {title && <h3 className="card-title">{title}</h3>}
                {description && <p className="card-description">{description}</p>}
                {children}
            </div>

            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
