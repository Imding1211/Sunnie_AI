import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    Shield,
    RefreshCw,
    FileText,
    Printer,
    ChevronRight,
    ExternalLink,
    Mail
} from 'lucide-react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import './LegalPage.css';

/**
 * LegalPage 法律資訊頁面
 * 包含隱私權政策、退費政策、服務條款
 */
const LegalPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 根據 URL 決定顯示哪個頁面
    const getActiveTab = () => {
        if (location.pathname.includes('privacy')) return 'privacy';
        if (location.pathname.includes('refund')) return 'refund';
        if (location.pathname.includes('terms')) return 'terms';
        return 'privacy';
    };

    const [activeTab, setActiveTab] = useState(getActiveTab());
    const [activeSection, setActiveSection] = useState('');

    // 同步 URL 與 Tab
    useEffect(() => {
        setActiveTab(getActiveTab());
    }, [location.pathname]);

    // 監聽滾動更新目錄高亮
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('.legal-section');
            let current = '';

            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id') || '';
                }
            });

            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeTab]);

    // Tab 配置
    const tabs = [
        { id: 'privacy', label: '隱私權政策', icon: Shield, path: '/privacy' },
        { id: 'refund', label: '退費政策', icon: RefreshCw, path: '/refund' },
        { id: 'terms', label: '服務條款', icon: FileText, path: '/terms' }
    ];

    // 切換 Tab
    const handleTabChange = (tabId, path) => {
        setActiveTab(tabId);
        navigate(path);
        window.scrollTo(0, 0);
    };

    // 列印功能
    const handlePrint = () => {
        window.print();
    };

    // 跳轉至指定章節
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="legal-page">
            <Header />

            <main className="legal-main">
                <div className="legal-container">
                    {/* 側邊導航 (桌面) / 頂部 Tab (行動) */}
                    <aside className="legal-sidebar">
                        <nav className="legal-nav">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        className={`legal-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                        onClick={() => handleTabChange(tab.id, tab.path)}
                                    >
                                        <Icon size={18} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* 快速跳轉目錄 */}
                        <div className="legal-toc">
                            <h4 className="legal-toc-title">快速跳轉</h4>
                            <TableOfContents
                                activeTab={activeTab}
                                activeSection={activeSection}
                                onSectionClick={scrollToSection}
                            />
                        </div>
                    </aside>

                    {/* 內容區域 */}
                    <article className="legal-content">
                        {/* 工具列 */}
                        <div className="legal-toolbar">
                            <button className="legal-print-btn" onClick={handlePrint}>
                                <Printer size={16} />
                                列印 / 存為 PDF
                            </button>
                        </div>

                        {/* 根據 Tab 顯示不同內容 */}
                        {activeTab === 'privacy' && <PrivacyPolicy />}
                        {activeTab === 'refund' && <RefundPolicy />}
                        {activeTab === 'terms' && <TermsOfService />}

                        {/* 聯絡客服 */}
                        <div className="legal-contact">
                            <p>對條款有任何疑問？</p>
                            <Link to="/consult" className="legal-contact-link">
                                <Mail size={16} />
                                聯繫客服
                                <ExternalLink size={14} />
                            </Link>
                        </div>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
};

/**
 * 快速跳轉目錄元件
 */
const TableOfContents = ({ activeTab, activeSection, onSectionClick }) => {
    const tocItems = {
        privacy: [
            { id: 'data-collection', label: '資料收集範圍' },
            { id: 'data-usage', label: '資料使用目的' },
            { id: 'cookie-policy', label: 'Cookie 政策' },
            { id: 'third-party', label: '第三方分享' },
            { id: 'data-security', label: '資料安全與權利' }
        ],
        refund: [
            { id: 'refund-criteria', label: '退費基準' },
            { id: 'special-items', label: '特殊商品說明' },
            { id: 'refund-process', label: '退費程序' }
        ],
        terms: [
            { id: 'user-eligibility', label: '使用者資格' },
            { id: 'account-management', label: '帳戶管理' },
            { id: 'intellectual-property', label: '智慧財產權' },
            { id: 'platform-rules', label: '平台行為準則' },
            { id: 'service-interruption', label: '服務中斷與責任限制' },
            { id: 'legal-jurisdiction', label: '法律管轄' }
        ]
    };

    const items = tocItems[activeTab] || [];

    return (
        <ul className="legal-toc-list">
            {items.map((item) => (
                <li key={item.id}>
                    <button
                        className={`legal-toc-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => onSectionClick(item.id)}
                    >
                        <ChevronRight size={14} />
                        {item.label}
                    </button>
                </li>
            ))}
        </ul>
    );
};

/**
 * 隱私權政策內容
 */
const PrivacyPolicy = () => {
    const lastUpdated = '2026 年 2 月 1 日';

    return (
        <div className="legal-document">
            <header className="legal-header">
                <h1 className="legal-title">
                    <Shield size={28} />
                    隱私權政策
                </h1>
                <p className="legal-updated">最後更新日期：{lastUpdated}</p>
            </header>

            <div className="legal-intro">
                <p>
                    桑尼資料科學（以下簡稱「本平台」）非常重視您的隱私權。本隱私權政策說明我們如何收集、使用、保護及分享您的個人資料。使用本平台服務即表示您同意本政策的條款。
                </p>
            </div>

            <section id="data-collection" className="legal-section">
                <h2>1. 資料收集範圍</h2>
                <p>我們可能收集以下類型的個人資料：</p>

                <h3>1.1 註冊資訊</h3>
                <ul>
                    <li>姓名、電子郵件地址</li>
                    <li>社群帳號資訊（如透過 Google、Facebook 登入）</li>
                    <li>頭像及個人簡介</li>
                </ul>

                <h3>1.2 交易資訊</h3>
                <ul>
                    <li>付款紀錄、訂單編號</li>
                    <li>發票資訊（如統一編號、發票抬頭）</li>
                    <li className="legal-highlight">
                        <strong>重要說明：</strong>本平台不儲存完整信用卡號碼。所有付款資訊由合作金流服務商安全處理。
                    </li>
                </ul>

                <h3>1.3 學習紀錄</h3>
                <ul>
                    <li>課程進度與觀看時長</li>
                    <li>測驗結果與作業提交</li>
                    <li>筆記與討論區發言</li>
                </ul>
            </section>

            <section id="data-usage" className="legal-section">
                <h2>2. 資料使用目的</h2>
                <p>我們收集的資料將用於以下目的：</p>
                <ul>
                    <li><strong>提供服務：</strong>處理訂單、提供課程內容、追蹤學習進度</li>
                    <li><strong>身分驗證：</strong>確保帳戶安全、防止未授權存取</li>
                    <li><strong>服務通知：</strong>發送課程更新、重要公告及帳戶相關通知</li>
                    <li><strong>行銷推廣：</strong>經您明確同意後，發送優惠活動與新課程資訊</li>
                    <li><strong>服務優化：</strong>分析使用行為以改善平台體驗</li>
                </ul>
            </section>

            <section id="cookie-policy" className="legal-section">
                <h2>3. Cookie 政策</h2>
                <p>本平台使用 Cookie 及類似技術來：</p>
                <ul>
                    <li>維持您的登入狀態</li>
                    <li>記錄您的偏好設定</li>
                    <li>分析網站流量與使用模式</li>
                    <li>提供個人化的內容推薦</li>
                </ul>
                <p>
                    您可以透過瀏覽器設定管理或刪除 Cookie，但這可能影響部分功能的正常使用。
                </p>
            </section>

            <section id="third-party" className="legal-section">
                <h2>4. 第三方分享</h2>
                <p>我們可能與以下第三方分享您的資料：</p>

                <h3>4.1 金流服務商</h3>
                <ul>
                    <li>綠界科技 ECPay</li>
                    <li>藍新金流 NewebPay</li>
                </ul>
                <p>這些服務商僅在處理您的付款時接收必要的交易資訊。</p>

                <h3>4.2 數據分析工具</h3>
                <ul>
                    <li>Google Analytics（用於網站流量分析）</li>
                </ul>
                <p>這些工具收集的資料為匿名化數據，不包含可識別個人身分的資訊。</p>
            </section>

            <section id="data-security" className="legal-section">
                <h2>5. 資料安全與您的權利</h2>

                <h3>5.1 資料安全</h3>
                <p>我們採用業界標準的安全措施保護您的資料，包括：</p>
                <ul>
                    <li>SSL/TLS 加密傳輸</li>
                    <li>資料庫加密儲存</li>
                    <li>定期安全稽核</li>
                </ul>

                <h3>5.2 您的權利</h3>
                <p>根據個人資料保護法，您有權：</p>
                <ul>
                    <li>查閱您的個人資料</li>
                    <li>請求更正或補充資料</li>
                    <li>請求刪除資料（帳號刪除）</li>
                    <li>撤回行銷同意</li>
                </ul>
                <p>如需行使上述權利，請透過客服管道與我們聯繫。</p>
            </section>
        </div>
    );
};

/**
 * 退費政策內容
 */
const RefundPolicy = () => {
    const lastUpdated = '2026 年 2 月 1 日';

    return (
        <div className="legal-document">
            <header className="legal-header">
                <h1 className="legal-title">
                    <RefreshCw size={28} />
                    退費政策
                </h1>
                <p className="legal-updated">最後更新日期：{lastUpdated}</p>
            </header>

            <div className="legal-intro">
                <p>
                    本退費政策依據中華民國數位內容相關法規制定，適用於所有透過桑尼資料科學平台購買的課程與商品。
                </p>
            </div>

            <section id="refund-criteria" className="legal-section">
                <h2>1. 退費基準</h2>

                <div className="legal-table-container">
                    <table className="legal-table">
                        <thead>
                            <tr>
                                <th>條件</th>
                                <th>退費比例</th>
                                <th>說明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>購買後 7 日內，且完全未觀看</td>
                                <td className="refund-full">100%</td>
                                <td>全額退費</td>
                            </tr>
                            <tr>
                                <td>購買後 7 日內，觀看進度 ≤ 10%</td>
                                <td className="refund-partial">70%</td>
                                <td>扣除行政處理費</td>
                            </tr>
                            <tr>
                                <td>購買後 7 日內，觀看進度 11-30%</td>
                                <td className="refund-partial">50%</td>
                                <td>按比例退費</td>
                            </tr>
                            <tr>
                                <td>購買超過 7 日，或觀看進度 &gt; 30%</td>
                                <td className="refund-none">不予退費</td>
                                <td>—</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="legal-note">
                    <strong>注意：</strong>「觀看進度」以系統記錄的實際播放時長計算，非課程章節完成數。
                </div>
            </section>

            <section id="special-items" className="legal-section">
                <h2>2. 特殊商品說明</h2>

                <h3>2.1 實體教材與講義</h3>
                <ul>
                    <li>尚未寄出：可全額退費</li>
                    <li>已寄出未拆封：退費需扣除運費</li>
                    <li>已拆封：不予退費</li>
                </ul>

                <h3>2.2 直播課程</h3>
                <ul>
                    <li>開課前 3 日：可全額退費</li>
                    <li>開課前 1-3 日：退費 50%</li>
                    <li>開課當日或已開課：不予退費</li>
                </ul>

                <h3>2.3 一對一諮詢</h3>
                <ul>
                    <li>預約時段前 24 小時：可全額退費或改期</li>
                    <li>預約時段前 24 小時內：不予退費</li>
                </ul>
            </section>

            <section id="refund-process" className="legal-section">
                <h2>3. 退費程序</h2>

                <div className="legal-steps">
                    <div className="legal-step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h4>提出申請</h4>
                            <p>登入帳戶，前往「購課記錄」頁面，點擊該筆訂單的「申請退費」按鈕，或來信至客服信箱。</p>
                        </div>
                    </div>
                    <div className="legal-step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h4>審核處理</h4>
                            <p>我們將於 <strong>7 個工作天</strong> 內完成審核，並以電子郵件通知結果。</p>
                        </div>
                    </div>
                    <div className="legal-step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h4>退款入帳</h4>
                            <p>審核通過後，款項將於 <strong>14 個工作天</strong> 內退回原付款管道。</p>
                            <ul>
                                <li>信用卡：退回原信用卡帳戶</li>
                                <li>ATM 轉帳：需提供銀行帳戶資訊，轉帳手續費由平台負擔</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

/**
 * 服務條款內容
 */
const TermsOfService = () => {
    const lastUpdated = '2026 年 2 月 1 日';

    return (
        <div className="legal-document">
            <header className="legal-header">
                <h1 className="legal-title">
                    <FileText size={28} />
                    服務條款
                </h1>
                <p className="legal-updated">最後更新日期：{lastUpdated}</p>
            </header>

            <div className="legal-intro">
                <p>
                    歡迎使用桑尼資料科學平台。使用本平台服務前，請詳閱以下條款。您使用本服務即表示同意遵守本服務條款。
                </p>
            </div>

            <section id="user-eligibility" className="legal-section">
                <h2>1. 使用者資格</h2>
                <ul>
                    <li>您必須年滿 18 歲，或經法定代理人同意方可使用本服務</li>
                    <li>您須提供真實、準確的個人資訊進行註冊</li>
                    <li>若發現資訊不實，本平台有權暫停或終止您的帳戶</li>
                </ul>
            </section>

            <section id="account-management" className="legal-section">
                <h2>2. 帳戶管理</h2>
                <ul>
                    <li>每位使用者僅能註冊一個帳戶</li>
                    <li><strong>禁止轉讓帳號：</strong>您的帳戶不得轉讓、出售或借予他人使用</li>
                    <li><strong>禁止共用帳號：</strong>多人共用同一帳號將導致帳戶被停權</li>
                    <li>您有責任妥善保管帳戶密碼，並對帳戶內所有活動負責</li>
                </ul>
            </section>

            <section id="intellectual-property" className="legal-section">
                <h2>3. 智慧財產權</h2>
                <div className="legal-warning">
                    <strong>重要聲明</strong>
                </div>
                <ul>
                    <li>本平台上所有課程影片、教材、講義及其他內容之著作權歸平台或授課講師所有</li>
                    <li><strong>嚴禁以下行為：</strong>
                        <ul>
                            <li>錄製、下載、截圖課程內容</li>
                            <li>將課程內容轉載至其他平台</li>
                            <li>將課程內容用於商業目的</li>
                            <li>分享帳戶供他人觀看課程</li>
                        </ul>
                    </li>
                    <li>違反上述規定，本平台有權終止您的帳戶並保留法律追訴權</li>
                </ul>
            </section>

            <section id="platform-rules" className="legal-section">
                <h2>4. 平台行為準則</h2>
                <p>使用本平台討論區、留言功能時，您同意不發表：</p>
                <ul>
                    <li>攻擊性、侮辱性或歧視性言論</li>
                    <li>廣告、垃圾訊息或與課程無關的推銷內容</li>
                    <li>違法內容或侵犯他人權益的言論</li>
                    <li>含有惡意程式碼或連結的內容</li>
                </ul>
                <p>違反者將被警告、禁言或永久停權。</p>
            </section>

            <section id="service-interruption" className="legal-section">
                <h2>5. 服務中斷與責任限制</h2>
                <p>本平台可能因以下原因暫時中斷服務：</p>
                <ul>
                    <li>系統維護與升級（將提前公告）</li>
                    <li>不可抗力因素（如天災、網路攻擊）</li>
                    <li>第三方服務商問題</li>
                </ul>
                <p>
                    對於非本平台故意或重大過失導致的服務中斷，本平台不負賠償責任，但將盡力於合理時間內恢復服務。
                </p>
            </section>

            <section id="legal-jurisdiction" className="legal-section">
                <h2>6. 法律管轄</h2>
                <ul>
                    <li>本服務條款之解釋與適用，悉以中華民國法律為準據法</li>
                    <li>因本條款所衍生之爭議，雙方同意以 <strong>臺灣臺北地方法院</strong> 為第一審管轄法院</li>
                </ul>
            </section>
        </div>
    );
};

export default LegalPage;
