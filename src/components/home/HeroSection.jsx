import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../ui/SearchBar';
import Button from '../ui/Button';
import './HeroSection.css';

/**
 * Hero 區塊元件
 * 首頁的主視覺區域，包含標題、副標題、搜尋列、雙 CTA 按鈕
 */
const HeroSection = () => {
    const navigate = useNavigate();

    const handleSearch = (query) => {
        navigate(`/courses?q=${encodeURIComponent(query)}`);
    };

    const handleLeadMagnet = () => {
        // 導向 Lead Magnet 頁面（待實作）
        alert('即將開放：免費轉職戰略手冊下載');
    };

    const handleViewCourses = () => {
        navigate('/courses');
    };

    return (
        <section className="hero-section">
            <div className="hero-background">
                <div className="hero-gradient"></div>
                <div className="hero-pattern"></div>
            </div>

            <div className="container">
                <div className="hero-content">
                    <h1 className="hero-title slide-down">
                        掌握 Python & AI，<br />開啟你的資料科學職涯。
                    </h1>

                    <p className="hero-subtitle fade-in">
                        從零基礎到實戰，由業界專家帶你進入數據的殿堂。
                    </p>

                    <div className="hero-search fade-in">
                        <SearchBar
                            placeholder="搜尋課程關鍵字..."
                            onSearch={handleSearch}
                        />
                    </div>

                    <div className="hero-cta-group slide-up">
                        <Button
                            variant="primary"
                            size="large"
                            onClick={handleLeadMagnet}
                        >
                            免費領取轉職戰略手冊
                        </Button>
                        <Button
                            variant="secondary"
                            size="large"
                            onClick={handleViewCourses}
                        >
                            瀏覽課程
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
