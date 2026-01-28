import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './MainLayout.css';

/**
 * MainLayout 主佈局元件
 * 包裝 Header + 內容區 + Footer
 */
const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
