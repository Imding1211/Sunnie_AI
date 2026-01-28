import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './App.css';

/**
 * App 主應用元件
 * 設置路由與頁面導航
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* 首頁 */}
        <Route path="/" element={<HomePage />} />

        {/* 其他頁面路由（暫時顯示佔位頁面） */}
        <Route path="/courses" element={<PlaceholderPage title="課程總覽" />} />
        <Route path="/courses/:id" element={<PlaceholderPage title="課程詳情" />} />
        <Route path="/consult" element={<PlaceholderPage title="一對一諮詢" />} />
        <Route path="/resources" element={<PlaceholderPage title="資源分享" />} />
        <Route path="/cart" element={<PlaceholderPage title="購物車" />} />
        <Route path="/profile" element={<PlaceholderPage title="會員中心" />} />
        <Route path="/privacy" element={<PlaceholderPage title="隱私權政策" />} />
        <Route path="/refund" element={<PlaceholderPage title="退費政策" />} />
        <Route path="/terms" element={<PlaceholderPage title="服務條款" />} />
      </Routes>
    </Router>
  );
}

/**
 * 佔位頁面元件（用於尚未實作的頁面）
 */
const PlaceholderPage = ({ title }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h1>{title}</h1>
      <p>此頁面尚未實作</p>
      <a href="/" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
        返回首頁
      </a>
    </div>
  );
};

export default App;

