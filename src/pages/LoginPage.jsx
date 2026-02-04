import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAuthApi } from '../api/mockAuthApi';
import './AuthPages.css';

/**
 * LoginPage 登入頁面
 * 包含 Email/密碼登入與第三方登入選項
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    // 表單狀態
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 取得重導向來源（如果有的話）
    const from = location.state?.from?.pathname || '/';

    // 如果已登入，導向首頁
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    // 自動聚焦第一個欄位
    useEffect(() => {
        document.getElementById('email')?.focus();
    }, []);

    // 表單提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await mockAuthApi.login(email, password);

            if (response.status === 'success') {
                login(response.data);
                navigate(from, { replace: true });
            } else {
                setError(response.error || '登入失敗，請稍後再試');
            }
        } catch (err) {
            setError('登入時發生錯誤，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    // 第三方登入（模擬）
    const handleOAuthLogin = (provider) => {
        alert(`${provider} 登入功能尚在開發中`);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Logo */}
                <Link to="/" className="auth-logo">
                    <span className="logo-text">桑尼資料科學</span>
                </Link>

                {/* Login Card */}
                <div className="auth-card">
                    <h1 className="auth-title">歡迎回來</h1>
                    <p className="auth-subtitle">登入您的帳號以繼續學習之旅</p>

                    {/* Error Message */}
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">電子郵件</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="form-input"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <div className="form-label-row">
                                <label htmlFor="password" className="form-label">密碼</label>
                                <Link to="/forgot-password" className="form-link">忘記密碼？</Link>
                            </div>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="輸入您的密碼"
                                    className="form-input has-toggle"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="input-toggle"
                                    aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="form-checkbox-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="checkbox-input"
                                />
                                <span>記住我</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-submit-btn"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    登入中...
                                </>
                            ) : (
                                '登入'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span>或使用以下方式登入</span>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="oauth-buttons">
                        <button
                            type="button"
                            onClick={() => handleOAuthLogin('Google')}
                            className="oauth-btn oauth-google"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Google 登入</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleOAuthLogin('Facebook')}
                            className="oauth-btn oauth-facebook"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span>Facebook 登入</span>
                        </button>
                    </div>

                    {/* Switch to Register */}
                    <p className="auth-switch">
                        還沒有帳號？
                        <Link to="/register" className="auth-switch-link">立即註冊</Link>
                    </p>
                </div>

                {/* Test Account Hint */}
                <div className="auth-hint">
                    <p>測試帳號：test@example.com / Test1234</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
