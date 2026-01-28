import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import './FinalCTA.css';

/**
 * FinalCTA 最終行動呼籲區塊元件
 * 首頁底部的轉換區塊，鼓勵使用者採取行動
 */
const FinalCTA = () => {
    const navigate = useNavigate();

    const handleLeadMagnet = () => {
        alert('即將開放：免費轉職戰略手冊下載');
    };

    const handleViewCourses = () => {
        navigate('/courses');
    };

    return (
        <section className="final-cta-section">
            <div className="final-cta-background">
                <div className="final-cta-gradient"></div>
            </div>

            <div className="container">
                <div className="final-cta-content">
                    <h2 className="final-cta-title">
                        準備好開始你的資料科學之旅了嗎？
                    </h2>

                    <p className="final-cta-subtitle">
                        加入我們，一起實現職涯夢想
                    </p>

                    <div className="final-cta-buttons">
                        <Button
                            variant="primary"
                            size="large"
                            onClick={handleLeadMagnet}
                        >
                            免費領取轉職手冊
                        </Button>
                        <Button
                            variant="secondary"
                            size="large"
                            onClick={handleViewCourses}
                        >
                            瀏覽所有課程
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
