import React from 'react';
import { Youtube, Instagram, MessageCircle, Mail, Facebook, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Footer 全域頁尾元件
 * 包含聯絡資訊、社群連結、法律資訊、版權宣告
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* 品牌資訊 */}
                    <div className="footer-section">
                        <h3 className="footer-title">桑尼資料科學</h3>
                        <p className="footer-description">
                            從零基礎到實戰，由業界專家帶你進入數據的殿堂。
                        </p>
                    </div>

                    {/* 聯絡資訊 */}
                    <div className="footer-section">
                        <h4 className="footer-heading">聯絡我們</h4>
                        <ul className="footer-list">
                            <li>
                                <a href="mailto:contact@sunnie-data.com" className="footer-link">
                                    <Mail size={16} />
                                    <span>contact@sunnie-data.com</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://line.me/R/ti/p/@055zjitb" target="_blank" rel="noopener noreferrer" className="footer-link">
                                    <MessageCircle size={16} />
                                    <span>LINE 官方帳號</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* 法律資訊 */}
                    <div className="footer-section">
                        <h4 className="footer-heading">法律資訊</h4>
                        <ul className="footer-list">
                            <li>
                                <Link to="/privacy" className="footer-link">隱私權政策</Link>
                            </li>
                            <li>
                                <Link to="/refund" className="footer-link">退費政策</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="footer-link">服務條款</Link>
                            </li>
                        </ul>
                    </div>

                    {/* 社群連結 */}
                    <div className="footer-section">
                        <h4 className="footer-heading">追蹤我們</h4>
                        <div className="social-links">
                            {/* <a
                                href="https://youtube.com/@sunnie"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                aria-label="YouTube"
                            >
                                <Youtube size={20} />
                            </a> */}
                            <a
                                href="https://www.instagram.com/datasunnie"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                aria-label="Instagram"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://www.threads.com/@datasunnie"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                aria-label="Threads"
                            >
                                <AtSign size={20} />
                            </a>
                            <a
                                href="https://www.facebook.com/p/%E6%A1%91%E5%B0%BC%E8%B3%87%E6%96%99%E7%A7%91%E5%AD%B8-61582680592562/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                aria-label="Facebook"
                            >
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* 版權宣告 */}
                <div className="footer-bottom">
                    <p className="copyright">© {currentYear} 桑尼資料科學 All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
