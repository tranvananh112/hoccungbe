/* ========================================
   MOBILE SCROLL ULTIMATE FIX - JavaScript
   Fix cuối cùng - ĐƠN GIẢN NHẤT có thể
   ======================================== */

(function () {
    'use strict';

    console.log('🔧 ULTIMATE SCROLL FIX: Loading...');

    // Check if mobile
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
        console.log('⚠️ Not mobile, skipping');
        return;
    }

    // ========== FORCE ENABLE SCROLL ==========
    function forceScroll() {
        console.log('🔧 Forcing scroll...');

        // HTML
        var html = document.documentElement;
        html.style.overflow = 'visible';
        html.style.overflowY = 'visible';
        html.style.overflowX = 'hidden';
        html.style.height = 'auto';
        html.style.position = 'static';

        // Body
        var body = document.body;
        body.style.overflow = 'visible';
        body.style.overflowY = 'visible';
        body.style.overflowX = 'hidden';
        body.style.height = 'auto';
        body.style.minHeight = '100vh';
        body.style.position = 'static';
        body.style.touchAction = 'pan-y pinch-zoom';

        // Main content
        var main = document.querySelector('.main-content');
        if (main) {
            main.style.overflow = 'visible';
            main.style.overflowY = 'visible';
            main.style.height = 'auto';
            main.style.touchAction = 'pan-y pinch-zoom';
        }

        // All pages
        var pages = document.querySelectorAll('.page');
        pages.forEach(function (page) {
            page.style.overflow = 'visible';
            page.style.overflowY = 'visible';
            page.style.height = 'auto';
            page.style.touchAction = 'pan-y pinch-zoom';
        });

        console.log('✅ Scroll enabled on', pages.length, 'pages');
    }

    // ========== INIT ==========
    function init() {
        console.log('🔧 ULTIMATE SCROLL FIX: Init...');

        // Force immediately
        forceScroll();

        // Force after delays
        setTimeout(forceScroll, 100);
        setTimeout(forceScroll, 500);
        setTimeout(forceScroll, 1000);
        setTimeout(forceScroll, 2000);

        // Monitor every 1 second
        setInterval(function () {
            var bodyOverflow = getComputedStyle(document.body).overflowY;
            if (bodyOverflow === 'hidden') {
                console.warn('⚠️ Scroll disabled! Re-enabling...');
                forceScroll();
            }
        }, 1000);

        // Watch for page changes
        var observer = new MutationObserver(function () {
            setTimeout(forceScroll, 100);
        });

        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['class', 'style']
        });

        console.log('✅ ULTIMATE SCROLL FIX: Ready!');
    }

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for manual use
    window.FORCE_SCROLL = forceScroll;

})();
