import React from 'react';
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import './Header.css';

/**
 * Header 全域頁首元件
 * 包含 Logo、導航選單、CTA 按鈕、購物車
 */
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { cartCount } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-wrapper">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <span className="logo-text">桑尼資料科學</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="nav">
                        <Link to="/courses" className="nav-link">課程總覽</Link>
                        <Link to="/consult" className="nav-link nav-link-cta">一對一諮詢</Link>
                        <Link to="/resources" className="nav-link">資源分享</Link>
                    </nav>

                    {/* Actions */}
                    <div className="header-actions">
                        {isAuthenticated ? (
                            <div className="user-menu">
                                <Link to="/student/my-courses" className="nav-link user-link">
                                    <img
                                        src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                                        alt={user?.name}
                                        className="user-avatar"
                                    />
                                    <span className="user-name">{user?.name}</span>
                                </Link>
                                <button onClick={handleLogout} className="logout-btn" title="登出">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button variant="secondary" size="small">
                                    註冊/登入
                                </Button>
                            </Link>
                        )}

                        <Link to="/cart" className="cart-icon-wrapper" aria-label="購物車">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="menu-toggle"
                        onClick={toggleMenu}
                        aria-label="選單"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="nav mobile-nav">
                        <Link to="/courses" className="nav-link" onClick={toggleMenu}>課程總覽</Link>
                        <Link to="/consult" className="nav-link nav-link-cta" onClick={toggleMenu}>一對一諮詢</Link>
                        <Link to="/resources" className="nav-link" onClick={toggleMenu}>資源分享</Link>
                        <div className="mobile-actions">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/student/my-courses" className="nav-link" onClick={toggleMenu}>
                                        學習中心 ({user?.name})
                                    </Link>
                                    <button onClick={handleLogout} className="nav-link logout-link">
                                        登出
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={toggleMenu}>
                                    <Button variant="secondary" size="medium">
                                        註冊/登入
                                    </Button>
                                </Link>
                            )}
                            <Link to="/cart" className="nav-link" onClick={toggleMenu}>
                                購物車 {cartCount > 0 && `(${cartCount})`}
                            </Link>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
