import React from 'react';
import { DollarSign, BookOpen, Compass, Clock, CheckCircle } from 'lucide-react';
import './PainPointsSection.css';

/**
 * PainPointsSection 痛點與解決方案區塊元件
 * 顯示目標受眾的痛點及桑尼資料科學的解決方案
 */
const PainPointsSection = () => {
    const painPoints = [
        {
            icon: <DollarSign size={32} />,
            title: '薪水停滯不前',
            description: '傳統產業薪資天花板明顯，想突破卻不知從何開始？'
        },
        {
            icon: <BookOpen size={32} />,
            title: '自學效率低落',
            description: '網路資源多如牛毛，但缺乏系統性學習，總是半途而廢？'
        },
        {
            icon: <Compass size={32} />,
            title: '轉職方向迷茫',
            description: '想進入資料科學領域，但不知道該學什麼、怎麼準備？'
        },
        {
            icon: <Clock size={32} />,
            title: '時間不夠用',
            description: '邊工作邊學習，找不到有效率的學習節奏？'
        }
    ];

    const solutions = [
        '系統化的學習路徑，從入門到進階一步到位',
        '業界講師親授，學習最實用的技能',
        '實戰專案練習，累積作品集',
        '社群支持 + 一對一諮詢，不再孤軍奮戰'
    ];

    return (
        <section className="pain-points-section section">
            <div className="container">
                {/* 痛點呈現 */}
                <div className="pain-points-content">
                    <div className="section-header">
                        <h2 className="section-title">我們理解你的焦慮</h2>
                        <p className="section-subtitle">你也有這些困擾嗎？</p>
                    </div>

                    <div className="pain-points-grid">
                        {painPoints.map((point, index) => (
                            <div key={index} className="pain-point-card">
                                <div className="pain-point-icon">{point.icon}</div>
                                <h3 className="pain-point-title">{point.title}</h3>
                                <p className="pain-point-description">{point.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 解決方案 */}
                <div className="solutions-content">
                    <div className="section-header">
                        <h2 className="section-title text-gradient">桑尼資料科學，你的轉職最佳夥伴</h2>
                        <p className="section-subtitle">我們的解決方案</p>
                    </div>

                    <div className="solutions-list">
                        {solutions.map((solution, index) => (
                            <div key={index} className="solution-item">
                                <CheckCircle className="solution-icon" size={24} />
                                <span className="solution-text">{solution}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PainPointsSection;
