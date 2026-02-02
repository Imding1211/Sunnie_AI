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
    const prevFullPathRef = useRef(pathname + search);

    // 持續追蹤滾動位置（使用 beforeunload 和 scroll 事件確保正確儲存）
    useEffect(() => {
        const fullPath = pathname + search;

        // 儲存當前滾動位置的函數
        const saveScrollPosition = () => {
            sessionStorage.setItem(`scrollPos:${fullPath}`, String(window.scrollY));
        };

        // 使用 scroll 事件持續更新滾動位置
        // 使用 passive 和 debounce 避免效能問題
        let scrollTimeout;
        const handleScroll = () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(saveScrollPosition, 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // 頁面離開前也儲存一次
        window.addEventListener('beforeunload', saveScrollPosition);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeunload', saveScrollPosition);
            if (scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, [pathname, search]);

    // 在路徑變更前儲存滾動位置（使用 ref 追蹤前一個路徑）
    useEffect(() => {
        const currentFullPath = pathname + search;

        // 當路徑變更時，儲存前一個頁面的滾動位置
        if (prevFullPathRef.current !== currentFullPath) {
            // 在路徑真正變更之前，滾動位置已經透過 scroll 事件儲存了
            prevFullPathRef.current = currentFullPath;
        }
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
                // 使用多次 requestAnimationFrame 確保 DOM 完全渲染
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        window.scrollTo(0, parseInt(savedPosition, 10));
                    });
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
