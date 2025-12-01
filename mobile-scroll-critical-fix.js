/* ========================================
   MOBILE SCROLL CRITICAL FIX - JavaScript
   Override mọi JS đang chặn scroll
   Load file này SAU TẤT CẢ các file JS khác
   ======================================== */

(function () {
    'use strict';

    console.log('🔧 CRITICAL SCROLL FIX: Loading...');

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
        console.log('⚠️ Not mobile device, skipping scroll fix');
        return;
    }

    // ========== FORCE ENABLE SCROLL ==========
    function forceEnableScroll() {
        // Force scroll on html and body
        document.documentElement.style.overflowY = 'auto';
        document.documentElement.style.height = '100%';
        document.documentElement.style.webkitOverflowScrolling = 'touch';

        document.body.style.overflowY = 'auto';
        document.body.style.height = '100%';
        document.body.style.minHeight = '100vh';
        document.body.style.touchAction = 'pan-y pinch-zoom';
        document.body.style.webkitOverflowScrolling = 'touch';

        // Fix main content
        var mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.overflowY = 'auto';
            mainContent.style.height = 'auto';
            mainContent.style.minHeight = 'calc(100vh - 60px)';
            mainContent.style.touchAction = 'pan-y pinch-zoom';
            mainContent.style.webkitOverflowScrolling = 'touch';
        }

        // Fix all pages
        var pages = document.querySelectorAll('.page');
        pages.forEach(function (page) {
            page.style.overflowY = 'auto';
            page.style.height = 'auto';
            page.style.minHeight = '100%';
            page.style.touchAction = 'pan-y pinch-zoom';
            page.style.webkitOverflowScrolling = 'touch';
        });

        console.log('✅ Scroll forced enabled on', pages.length, 'pages');
    }

    // ========== PREVENT SCROLL BLOCKING ==========
    function preventScrollBlocking() {
        // Override addEventListener để không chặn scroll
        var originalAddEventListener = EventTarget.prototype.addEventListener;

        EventTarget.prototype.addEventListener = function (type, listener, options) {
            // Chỉ can thiệp với touch events
            if (type === 'touchstart' || type === 'touchmove') {
                var wrappedListener = function (e) {
                    var target = e.target;

                    // CHỈ preventDefault trên draggable letters
                    if (target && target.classList && target.classList.contains('draggable-letter')) {
                        // Let original listener handle it
                        return listener.call(this, e);
                    }

                    // Với tất cả element khác, KHÔNG preventDefault
                    // Gọi listener nhưng không cho phép nó chặn scroll
                    var originalPreventDefault = e.preventDefault;
                    e.preventDefault = function () {
                        // Chỉ cho phép preventDefault trên draggable letters
                        if (target && target.classList && target.classList.contains('draggable-letter')) {
                            originalPreventDefault.call(e);
                        } else {
                            console.warn('⚠️ Prevented scroll blocking on:', target);
                        }
                    };

                    return listener.call(this, e);
                };

                // Set passive: true để browser biết không có preventDefault
                if (typeof options === 'object') {
                    options.passive = true;
                } else {
                    options = { passive: true };
                }

                return originalAddEventListener.call(this, type, wrappedListener, options);
            }

            // Các event khác giữ nguyên
            return originalAddEventListener.call(this, type, listener, options);
        };

        console.log('✅ Scroll blocking prevention enabled');
    }

    // ========== MONITOR AND FIX ==========
    function monitorAndFix() {
        // Check mỗi 1 giây nếu scroll vẫn enabled
        setInterval(function () {
            var bodyOverflow = getComputedStyle(document.body).overflowY;

            if (bodyOverflow === 'hidden') {
                console.warn('⚠️ Scroll was disabled! Re-enabling...');
                forceEnableScroll();
            }
        }, 1000);
    }

    // ========== INIT ==========
    function init() {
        console.log('🔧 CRITICAL SCROLL FIX: Initializing...');

        // Force enable immediately
        forceEnableScroll();

        // Prevent scroll blocking (COMMENTED OUT vì có thể break drag & drop)
        // preventScrollBlocking();

        // Monitor and fix
        monitorAndFix();

        // Re-apply on page change
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    var target = mutation.target;
                    if (target.classList && target.classList.contains('page') && target.classList.contains('active')) {
                        setTimeout(function () {
                            forceEnableScroll();
                        }, 100);
                    }
                }
            });
        });

        document.querySelectorAll('.page').forEach(function (page) {
            observer.observe(page, { attributes: true });
        });

        console.log('✅ CRITICAL SCROLL FIX: Ready!');
    }

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also init after a delay
    setTimeout(init, 500);
    setTimeout(init, 1500);

})();
