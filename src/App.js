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
import ProtectedRoute from './components/auth/ProtectedRoute';

// 學生中心頁面
import MyCoursesPage from './components/student/MyCoursesPage';
import PurchaseHistoryPage from './components/student/PurchaseHistoryPage';
import ProfilePage from './components/student/ProfilePage';
import SettingsPage from './components/student/SettingsPage';
import StudentPlaceholderPage from './components/student/PlaceholderPage';

// 老師中心頁面
import CourseUploadPage from './components/teacher/CourseUploadPage';
import StatisticsPage from './components/teacher/StatisticsPage';
import TeacherContactPage from './components/teacher/TeacherContactPage';
import TeacherSettingsPage from './components/teacher/TeacherSettingsPage';

// 法律資訊頁面
import LegalPage from './components/legal/LegalPage';

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

            {/* 法律資訊頁面 */}
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/refund" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />

            {/* 公開頁面 */}
            <Route path="/consult" element={<PlaceholderPage title="一對一諮詢" />} />
            <Route path="/resources" element={<PlaceholderPage title="資源分享" />} />
            <Route path="/forgot-password" element={<PlaceholderPage title="忘記密碼" />} />
            <Route path="/become-teacher" element={<PlaceholderPage title="成為老師" />} />

            {/* 學生中心 (需登入) */}
            <Route path="/student/my-courses" element={
              <ProtectedRoute><MyCoursesPage /></ProtectedRoute>
            } />
            <Route path="/student/history" element={
              <ProtectedRoute><PurchaseHistoryPage /></ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/student/settings" element={
              <ProtectedRoute><SettingsPage /></ProtectedRoute>
            } />
            <Route path="/student/consult" element={
              <ProtectedRoute>
                <StudentPlaceholderPage title="一對一諮詢" description="預約與管理個人化諮詢服務，敬請期待！" />
              </ProtectedRoute>
            } />
            <Route path="/student/resources" element={
              <ProtectedRoute>
                <StudentPlaceholderPage title="資源分享" description="分享筆記與撰寫文章，敬請期待！" />
              </ProtectedRoute>
            } />
            <Route path="/student/course/:id" element={
              <ProtectedRoute>
                <StudentPlaceholderPage title="上課頁面" description="沉浸式學習介面即將推出，敬請期待！" />
              </ProtectedRoute>
            } />

            {/* 老師中心 (需登入) */}
            <Route path="/teacher/courses" element={
              <ProtectedRoute><CourseUploadPage /></ProtectedRoute>
            } />
            <Route path="/teacher/courses/new" element={
              <ProtectedRoute>
                <StudentPlaceholderPage title="建立新課程" description="課程編輯器即將推出，敬請期待！" />
              </ProtectedRoute>
            } />
            <Route path="/teacher/courses/:id/edit" element={
              <ProtectedRoute>
                <StudentPlaceholderPage title="編輯課程" description="課程編輯器即將推出，敬請期待！" />
              </ProtectedRoute>
            } />
            <Route path="/teacher/statistics" element={
              <ProtectedRoute><StatisticsPage /></ProtectedRoute>
            } />
            <Route path="/teacher/contact" element={
              <ProtectedRoute><TeacherContactPage /></ProtectedRoute>
            } />
            <Route path="/teacher/settings" element={
              <ProtectedRoute><TeacherSettingsPage /></ProtectedRoute>
            } />
            <Route path="/teacher/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/teacher/consult" element={
              <ProtectedRoute>
                <StudentPlaceholderPage title="諮詢管理" description="管理您的諮詢時段與預約，敬請期待！" />
              </ProtectedRoute>
            } />
            <Route path="/teacher/resources" element={
              <ProtectedRoute>
                <StudentPlaceholderPage title="資源分享" description="撰寫與發布專業文章，敬請期待！" />
              </ProtectedRoute>
            } />

            {/* 舊路由重導向至學生中心 */}
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

/**
 * 佔位頁面元件（用於尚未實作的公開頁面）
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
