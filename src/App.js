import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ScrollRestoration from './components/layout/ScrollRestoration';
import './App.css';

import CartPage from './components/cart/CartPage';
import CoursesPage from './components/courses/CoursesPage';
import CourseDetailPage from './components/courses/CourseDetailPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';

/**
 * App 主應用元件
 * 設置路由與頁面導航
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollRestoration />
          <Routes>
            {/* 首頁 */}
            <Route path="/" element={<HomePage />} />

            {/* 身份驗證頁面 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 購物車頁面 */}
            <Route path="/cart" element={<CartPage />} />

            {/* 課程頁面 */}
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/consult" element={<PlaceholderPage title="一對一諮詢" />} />
            <Route path="/resources" element={<PlaceholderPage title="資源分享" />} />
            <Route path="/profile" element={<PlaceholderPage title="會員中心" />} />
            <Route path="/privacy" element={<PlaceholderPage title="隱私權政策" />} />
            <Route path="/refund" element={<PlaceholderPage title="退費政策" />} />
            <Route path="/terms" element={<PlaceholderPage title="服務條款" />} />
            <Route path="/forgot-password" element={<PlaceholderPage title="忘記密碼" />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
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
      <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
        返回首頁
      </Link>
    </div>
  );
};

export default App;

