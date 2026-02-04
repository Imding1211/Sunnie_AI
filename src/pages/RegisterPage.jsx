import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockAuthApi } from '../api/mockAuthApi';
import './AuthPages.css';

/**
 * RegisterPage 註冊頁面
 * 包含姓名、Email、密碼輸入與驗證
 */
const RegisterPage = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // 表單狀態
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 如果已登入，導向首頁
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // 自動聚焦第一個欄位
    useEffect(() => {
        document.getElementById('name')?.focus();
    }, []);

    // 密碼強度檢查
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password)
    };

    const isPasswordStrong = Object.values(passwordChecks).every(Boolean);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    // 表單提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 前端驗證
        if (!agreeTerms) {
            setError('請先同意服務條款與隱私權政策');
            return;
        }

        if (!isPasswordStrong) {
            setError('密碼強度不足');
            return;
        }

        if (!passwordsMatch) {
            setError('兩次輸入的密碼不一致');
            return;
        }

        setLoading(true);

        try {
            const response = await mockAuthApi.register(name, email, password, confirmPassword);

            if (response.status === 'success') {
                login(response.data);
                navigate('/', { replace: true });
            } else {
                setError(response.error || '註冊失敗，請稍後再試');
            }
        } catch (err) {
            setError('註冊時發生錯誤，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Logo */}
                <Link to="/" className="auth-logo">
                    <span className="logo-text">桑尼資料科學</span>
                </Link>

                {/* Register Card */}
                <div className="auth-card">
                    <h1 className="auth-title">建立帳號</h1>
                    <p className="auth-subtitle">加入我們，開始您的學習旅程</p>

                    {/* Error Message */}
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Name Field */}
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">姓名</label>
                            <div className="input-wrapper">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="您的姓名"
                                    className="form-input"
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        </div>

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
                            <label htmlFor="password" className="form-label">密碼</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="設定您的密碼"
                                    className="form-input has-toggle"
                                    required
                                    autoComplete="new-password"
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

                            {/* Password Strength Indicators */}
                            {password.length > 0 && (
                                <div className="password-strength">
                                    <div className={`strength-item ${passwordChecks.length ? 'valid' : 'invalid'}`}>
                                        {passwordChecks.length ? <Check size={14} /> : <X size={14} />}
                                        <span>至少 8 個字元</span>
                                    </div>
                                    <div className={`strength-item ${passwordChecks.uppercase ? 'valid' : 'invalid'}`}>
                                        {passwordChecks.uppercase ? <Check size={14} /> : <X size={14} />}
                                        <span>包含大寫字母</span>
                                    </div>
                                    <div className={`strength-item ${passwordChecks.lowercase ? 'valid' : 'invalid'}`}>
                                        {passwordChecks.lowercase ? <Check size={14} /> : <X size={14} />}
                                        <span>包含小寫字母</span>
                                    </div>
                                    <div className={`strength-item ${passwordChecks.number ? 'valid' : 'invalid'}`}>
                                        {passwordChecks.number ? <Check size={14} /> : <X size={14} />}
                                        <span>包含數字</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">確認密碼</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="再次輸入密碼"
                                    className={`form-input has-toggle ${confirmPassword.length > 0 ? (passwordsMatch ? 'input-valid' : 'input-invalid') : ''}`}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="input-toggle"
                                    aria-label={showConfirmPassword ? '隱藏密碼' : '顯示密碼'}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && !passwordsMatch && (
                                <p className="form-error-text">兩次輸入的密碼不一致</p>
                            )}
                        </div>

                        {/* Terms Agreement */}
                        <div className="form-checkbox-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="checkbox-input"
                                    required
                                />
                                <span>
                                    我已閱讀並同意
                                    <Link to="/terms" className="form-link">服務條款</Link>
                                    與
                                    <Link to="/privacy" className="form-link">隱私權政策</Link>
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !agreeTerms}
                            className="auth-submit-btn"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    註冊中...
                                </>
                            ) : (
                                '建立帳號'
                            )}
                        </button>
                    </form>

                    {/* Switch to Login */}
                    <p className="auth-switch">
                        已有帳號？
                        <Link to="/login" className="auth-switch-link">立即登入</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
