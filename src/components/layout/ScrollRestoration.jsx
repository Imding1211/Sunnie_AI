import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * ScrollRestoration 滾動位置恢復元件
 * - 只在「路徑」改變時（pathname）才捲動到頂部
 * - URL 參數改變（search）時保持當前位置（例如篩選）
 * - 瀏覽器返回/前進時恢復之前的滾動位置
 */
const ScrollRestoration = () => {
    const { pathname, search } = useLocation();
    const navigationType = useNavigationType();
    const prevPathnameRef = useRef(pathname);

    // 在離開頁面前儲存滾動位置
    useEffect(() => {
        const fullPath = pathname + search;

        return () => {
            sessionStorage.setItem(`scrollPos:${fullPath}`, String(window.scrollY));
        };
    }, [pathname, search]);

    // 根據導航類型和路徑變化決定滾動行為
    useEffect(() => {
        const fullPath = pathname + search;
        const pathnameChanged = prevPathnameRef.current !== pathname;
        prevPathnameRef.current = pathname;

        if (navigationType === 'POP') {
            // 返回/前進：嘗試恢復之前的滾動位置
            const savedPosition = sessionStorage.getItem(`scrollPos:${fullPath}`);
            if (savedPosition) {
                requestAnimationFrame(() => {
                    window.scrollTo(0, parseInt(savedPosition, 10));
                });
            }
        } else if (pathnameChanged) {
            // 只有在 pathname 改變時才捲動到頂部
            // URL 參數（search）改變時（如篩選）保持當前位置
            window.scrollTo(0, 0);
        }
        // 如果只是 search 參數改變，不做任何滾動操作
    }, [pathname, search, navigationType]);

    return null;
};

export default ScrollRestoration;
