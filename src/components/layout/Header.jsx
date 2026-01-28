import React from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import './Header.css';

/**
 * Header 全域頁首元件
 * 包含 Logo、導航選單、CTA 按鈕、購物車
 */
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // 模擬資料（實際應從全域狀態或 Context 取得）
    const isLoggedIn = false;
    const cartCount = 0;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
                    <nav className="nav desktop-only">
                        <Link to="/courses" className="nav-link">課程總覽</Link>
                        <Link to="/consult" className="nav-link nav-link-cta">一對一諮詢</Link>
                        <Link to="/resources" className="nav-link">資源分享</Link>
                    </nav>

                    {/* Actions */}
                    <div className="header-actions desktop-only">
                        {isLoggedIn ? (
                            <Link to="/profile" className="nav-link">會員中心</Link>
                        ) : (
                            <Button variant="secondary" size="small">
                                註冊/登入
                            </Button>
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
                        className="menu-toggle mobile-only"
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
                            {isLoggedIn ? (
                                <Link to="/profile" className="nav-link" onClick={toggleMenu}>會員中心</Link>
                            ) : (
                                <Button variant="secondary" size="medium">
                                    註冊/登入
                                </Button>
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
