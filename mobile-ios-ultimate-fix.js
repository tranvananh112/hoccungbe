/* ========================================
   MOBILE iOS ULTIMATE FIX - JavaScript
   Fix toàn diện cho iPhone/iPad + Android
   ======================================== */

(function () {
    'use strict';

    console.log('📱 iOS ULTIMATE FIX: Loading...');

    // ========== 1. DETECT DEVICE ==========
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isAndroid = /Android/.test(navigator.userAgent);
    var isMobile = isIOS || isAndroid;

    if (!isMobile) {
        console.log('⚠️ Not mobile device, skipping');
        return;
    }

    console.log('📱 Device:', isIOS ? 'iOS' : 'Android');

    // ========== 2. FIX VIEWPORT HEIGHT (iOS 100vh bug) ==========
    function fixViewportHeight() {
        // Fix iOS 100vh bug
        var vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }

    // ========== 3. FORCE ENABLE SCROLL ==========
    function forceEnableScroll() {
        console.log('🔓 Forcing scroll enabled...');

        var html = document.documentElement;
        var body = document.body;

        // HTML
        html.style.overflow = 'visible';
        html.style.overflowY = 'auto';
        html.style.overflowX = 'hidden';
        html.style.height = 'auto';
        html.style.position = 'relative';
        html.style.webkitOverflowScrolling = 'touch';

        // Body
        body.style.overflow = 'visible';
        body.style.overflowY = 'auto';
        body.style.overflowX = 'hidden';
        body.style.height = 'auto';
        body.style.minHeight = '100vh';
        body.style.position = 'relative';
        body.style.touchAction = 'pan-y pinch-zoom';
        body.style.webkitOverflowScrolling = 'touch';

        // Remove any scroll-blocking classes
        body.classList.remove('modal-open', 'popup-open', 'no-scroll');

        // Main content
        var mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.overflow = 'visible';
            mainContent.style.overflowY = 'visible';
            mainContent.style.height = 'auto';
            mainContent.style.touchAction = 'pan-y pinch-zoom';
        }

        // All pages
        var pages = document.querySelectorAll('.page');
        pages.forEach(function (page) {
            page.style.overflow = 'visible';
            page.style.overflowY = 'visible';
            page.style.height = 'auto';
            page.style.touchAction = 'pan-y pinch-zoom';
        });

        console.log('✅ Scroll enabled');
    }

    // ========== 4. FIX MODAL SCROLL BLOCKING ==========
    function fixModalScrollBlocking() {
        console.log('🔧 Fixing modal scroll blocking...');

        // Tìm tất cả modal overlays
        var modals = document.querySelectorAll(
            '.audio-welcome-modal, .success-popup, .treasure-modal, .celebration-overlay'
        );

        modals.forEach(function (modal) {
            // Modal overlay KHÔNG chặn scroll
            modal.style.pointerEvents = 'none';

            // Tìm modal content bên trong
            var content = modal.querySelector(
                '.audio-welcome-box, .popup-content, .treasure-box, .celebration-content'
            );

            if (content) {
                // CHỈ content mới có pointer events
                content.style.pointerEvents = 'auto';
            }
        });

        console.log('✅ Fixed', modals.length, 'modals');
    }

    // ========== 5. PREVENT SCROLL LOCK ==========
    function preventScrollLock() {
        // Theo dõi body class changes
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                    var body = document.body;
                    var bodyOverflow = getComputedStyle(body).overflowY;

                    // Nếu body bị lock scroll
                    if (bodyOverflow === 'hidden' || body.style.overflow === 'hidden') {
                        console.warn('⚠️ Body scroll locked! Re-enabling...');
                        forceEnableScroll();
                    }
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        console.log('✅ Scroll lock prevention active');
    }

    // ========== 6. FIX iOS SAFARI BOUNCE ==========
    function fixIOSBounce() {
        if (!isIOS) return;

        // Prevent overscroll bounce on body
        document.body.addEventListener('touchmove', function (e) {
            // Chỉ prevent nếu đang ở đầu/cuối trang
            var target = e.target;

            // Nếu là draggable letter, cho phép
            if (target.classList.contains('draggable-letter')) {
                return;
            }

            // Nếu là letters pool, cho phép
            if (target.classList.contains('letters-pool') || target.closest('.letters-pool')) {
                return;
            }

            // Các trường hợp khác, cho phép scroll bình thường
        }, { passive: true });

        console.log('✅ iOS bounce fixed');
    }

    // ========== 7. FIX INPUT ZOOM (iOS) ==========
    function fixInputZoom() {
        if (!isIOS) return;

        // Prevent iOS zoom on input focus
        var inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(function (input) {
            // Set font-size to 16px to prevent zoom
            if (parseFloat(getComputedStyle(input).fontSize) < 16) {
                input.style.fontSize = '16px';
            }
        });

        console.log('✅ Input zoom fixed');
    }

    // ========== 8. MONITOR & AUTO-FIX ==========
    function startMonitoring() {
        // Check every 2 seconds
        setInterval(function () {
            var bodyOverflow = getComputedStyle(document.body).overflowY;

            if (bodyOverflow === 'hidden') {
                console.warn('⚠️ Scroll disabled detected! Re-enabling...');
                forceEnableScroll();
            }
        }, 2000);

        console.log('✅ Monitoring started');
    }

    // ========== 9. HANDLE PAGE NAVIGATION ==========
    function handlePageNavigation() {
        // Watch for page changes
        var navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(function (item) {
            item.addEventListener('click', function () {
                // Delay để đợi page render
                setTimeout(function () {
                    forceEnableScroll();
                    fixModalScrollBlocking();
                }, 100);
            });
        });

        console.log('✅ Page navigation handler ready');
    }

    // ========== 10. INIT ==========
    function init() {
        console.log('📱 iOS ULTIMATE FIX: Initializing...');

        // Fix viewport height
        fixViewportHeight();
        window.addEventListener('resize', fixViewportHeight);
        window.addEventListener('orientationchange', function () {
            setTimeout(fixViewportHeight, 100);
        });

        // Force enable scroll immediately
        forceEnableScroll();

        // Fix modal scroll blocking
        setTimeout(fixModalScrollBlocking, 100);

        // Prevent scroll lock
        preventScrollLock();

        // iOS specific fixes
        if (isIOS) {
            fixIOSBounce();
            fixInputZoom();
        }

        // Start monitoring
        startMonitoring();

        // Handle page navigation
        setTimeout(handlePageNavigation, 500);

        // Re-apply fixes after delays
        setTimeout(forceEnableScroll, 500);
        setTimeout(forceEnableScroll, 1000);
        setTimeout(forceEnableScroll, 2000);
        setTimeout(fixModalScrollBlocking, 1000);

        console.log('✅ iOS ULTIMATE FIX: Ready!');
    }

    // ========== 11. AUTO START ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========== 12. EXPORT FOR MANUAL USE ==========
    window.MOBILE_FIX = {
        forceScroll: forceEnableScroll,
        fixModals: fixModalScrollBlocking,
        fixViewport: fixViewportHeight,
        isIOS: isIOS,
        isAndroid: isAndroid
    };

    console.log('📱 iOS ULTIMATE FIX: Loaded!');

})();
