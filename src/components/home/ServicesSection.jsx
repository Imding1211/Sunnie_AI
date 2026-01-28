import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Video, UserCheck } from 'lucide-react';
import Button from '../ui/Button';
import './ServicesSection.css';

/**
 * ServicesSection 主要服務區塊元件
 * 顯示一對一諮詢與模擬面試服務
 */
const ServicesSection = () => {
    const navigate = useNavigate();

    const services = [
        {
            id: 'consult',
            icon: <UserCheck size={32} />,
            title: '轉職戰略諮詢',
            description: '60分鐘深度對談，畫出你的90天轉職藍圖，從技能評估到求職策略全方位規劃',
            cta: '了解更多',
            link: '/consult'
        },
        {
            id: 'mock-interview',
            icon: <Video size={32} />,
            title: '資料職缺模擬面試',
            description: '實戰演練，提前熟悉面試流程與常見問題，由業界專家提供專業回饋與改善建議',
            cta: '了解更多',
            link: '/consult'
        }
    ];

    const handleServiceClick = (link) => {
        navigate(link);
    };

    const handleConsult = () => {
        navigate('/consult');
    };

    return (
        <section className="services-section section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">不只是課程，更是你的學習夥伴</h2>
                    <p className="section-subtitle">
                        除了優質課程內容，我們還提供一對一的專業服務，讓你的學習之路不再孤單
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className="service-card">
                            <div className="service-icon">{service.icon}</div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                            <Button
                                variant="ghost"
                                size="small"
                                onClick={() => handleServiceClick(service.link)}
                            >
                                {service.cta} <ArrowRight size={16} />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="section-cta">
                    <Button
                        variant="primary"
                        size="large"
                        onClick={handleConsult}
                    >
                        立即預約諮詢 <ArrowRight size={18} />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
