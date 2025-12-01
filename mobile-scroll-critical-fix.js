/* ========================================
   MOBILE SCROLL CRITICAL FIX - JavaScript
   Override mọi JS đang chặn scroll - VERSION 2
   Load file này SAU TẤT CẢ các file JS khác
   ======================================== */

(function () {
    'use strict';

    console.log('🔧 CRITICAL SCROLL FIX V2: Loading...');

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
        console.log('⚠️ Not mobile device, skipping scroll fix');
        return;
    }

    // ========== FORCE ENABLE SCROLL - AGGRESSIVE ==========
    function forceEnableScroll() {
        console.log('🔧 Forcing scroll enable...');

        // Force scroll on html and body - VISIBLE not AUTO
        document.documentElement.style.setProperty('overflow-y', 'visible', 'important');
        document.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
        document.documentElement.style.setProperty('height', 'auto', 'important');
        document.documentElement.style.setProperty('position', 'relative', 'important');
        document.documentElement.style.webkitOverflowScrolling = 'touch';

        document.body.style.setProperty('overflow-y', 'visible', 'important');
        document.body.style.setProperty('overflow-x', 'hidden', 'important');
        document.body.style.setProperty('height', 'auto', 'important');
        document.body.style.setProperty('min-height', '100vh', 'important');
        document.body.style.setProperty('position', 'relative', 'important');
        document.body.style.setProperty('touch-action', 'pan-y pinch-zoom', 'important');
        document.body.style.webkitOverflowScrolling = 'touch';

        // Fix main content
        var mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.setProperty('overflow-y', 'visible', 'important');
            mainContent.style.setProperty('overflow-x', 'hidden', 'important');
            mainContent.style.setProperty('height', 'auto', 'important');
            mainContent.style.setProperty('min-height', 'calc(100vh - 60px)', 'important');
            mainContent.style.setProperty('position', 'relative', 'important');
            mainContent.style.setProperty('touch-action', 'pan-y pinch-zoom', 'important');
            mainContent.style.webkitOverflowScrolling = 'touch';
        }

        // Fix all pages
        var pages = document.querySelectorAll('.page');
        pages.forEach(function (page) {
            page.style.setProperty('overflow-y', 'visible', 'important');
            page.style.setProperty('overflow-x', 'hidden', 'important');
            page.style.setProperty('height', 'auto', 'important');
            page.style.setProperty('min-height', '100%', 'important');
            page.style.setProperty('position', 'relative', 'important');
            page.style.setProperty('touch-action', 'pan-y pinch-zoom', 'important');
            page.style.webkitOverflowScrolling = 'touch';
        });

        // Fix all scrollable containers
        var scrollables = document.querySelectorAll('.theme-selection, .level-selection, .shop-items-grid, .words-learned-list, .profile-sections, .parent-tab-content, .themes-grid, .themes-grid-home, .level-grid, .home-hero');
        scrollables.forEach(function (el) {
            el.style.setProperty('overflow-y', 'visible', 'important');
            el.style.setProperty('touch-action', 'pan-y pinch-zoom', 'important');
            el.style.webkitOverflowScrolling = 'touch';
        });

        console.log('✅ Scroll forced enabled on', pages.length, 'pages and', scrollables.length, 'containers');
    }

    // ========== DISABLE PROBLEMATIC TOUCH HANDLERS ==========
    function disableProblematicHandlers() {
        // Tắt mobile-gestures nếu nó đang chặn scroll
        if (window.MobileGestures) {
            console.warn('⚠️ Disabling MobileGestures to allow scroll');
            window.MobileGestures = null;
        }

        // Override preventDefault trên touch events (trừ draggable letters)
        var originalPreventDefault = Event.prototype.preventDefault;
        Event.prototype.preventDefault = function () {
            // Chỉ cho phép preventDefault trên draggable letters
            if (this.type === 'touchstart' || this.type === 'touchmove') {
                var target = this.target;
                if (target && target.classList && target.classList.contains('draggable-letter')) {
                    originalPreventDefault.call(this);
                } else {
                    console.warn('⚠️ Blocked preventDefault on', this.type, 'to allow scroll');
                }
            } else {
                originalPreventDefault.call(this);
            }
        };

        console.log('✅ Problematic handlers disabled');
    }

    // ========== MONITOR AND FIX ==========
    function monitorAndFix() {
        // Check mỗi 500ms nếu scroll vẫn enabled
        setInterval(function () {
            var bodyOverflow = getComputedStyle(document.body).overflowY;
            var htmlOverflow = getComputedStyle(document.documentElement).overflowY;

            if (bodyOverflow === 'hidden' || htmlOverflow === 'hidden') {
                console.warn('⚠️ Scroll was disabled! Re-enabling...');
                forceEnableScroll();
            }
        }, 500);
    }

    // ========== REMOVE CONFLICTING EVENT LISTENERS ==========
    function removeConflictingListeners() {
        // Tìm và remove tất cả touch event listeners trên document
        var events = ['touchstart', 'touchmove', 'touchend'];

        events.forEach(function (eventType) {
            // Clone document để remove tất cả listeners
            // (Không thể remove trực tiếp vì không có reference)
            // Thay vào đó, chúng ta sẽ add listener mới với capture: true
            // để nó chạy trước và stopImmediatePropagation nếu cần

            document.addEventListener(eventType, function (e) {
                var target = e.target;

                // CHỈ cho phép preventDefault trên draggable letters
                if (!target.classList.contains('draggable-letter')) {
                    // Không làm gì, để scroll hoạt động bình thường
                    // console.log('✅ Allowing', eventType, 'on', target);
                }
            }, { capture: true, passive: true });
        });

        console.log('✅ Conflicting listeners handled');
    }

    // ========== INIT ==========
    function init() {
        console.log('🔧 CRITICAL SCROLL FIX V2: Initializing...');

        // Force enable immediately
        forceEnableScroll();

        // Disable problematic handlers
        // disableProblematicHandlers(); // COMMENTED OUT - có thể break drag & drop

        // Remove conflicting listeners
        removeConflictingListeners();

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

        // Also observe body for class changes
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });

        console.log('✅ CRITICAL SCROLL FIX V2: Ready!');
    }

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also init after delays to ensure all other scripts loaded
    setTimeout(init, 100);
    setTimeout(init, 500);
    setTimeout(init, 1500);
    setTimeout(init, 3000);

    // Export for debugging
    window.SCROLL_FIX = {
        forceEnable: forceEnableScroll,
        version: 2
    };

})();
