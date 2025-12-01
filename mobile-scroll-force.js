/* ========================================
   MOBILE SCROLL FORCE - Force enable scroll
   Override any JS that blocks scrolling
   ======================================== */

(function () {
    'use strict';

    console.log('📜 Loading mobile scroll force fix...');

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
        console.log('⚠️ Not mobile, skipping scroll force');
        return;
    }

    // ========== FORCE ENABLE SCROLL ==========
    function forceEnableScroll() {
        // Remove any overflow hidden
        document.documentElement.style.overflowY = 'scroll';
        document.documentElement.style.height = 'auto';
        document.body.style.overflowY = 'scroll';
        document.body.style.height = 'auto';
        document.body.style.touchAction = 'pan-y pinch-zoom';

        // Fix main content
        var mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.overflowY = 'scroll';
            mainContent.style.height = 'auto';
            mainContent.style.touchAction = 'pan-y pinch-zoom';
        }

        // Fix all pages
        var pages = document.querySelectorAll('.page');
        pages.forEach(function (page) {
            page.style.overflowY = 'scroll';
            page.style.height = 'auto';
            page.style.touchAction = 'pan-y pinch-zoom';
        });

        console.log('✅ Scroll forced enabled');
    }

    // ========== PREVENT SCROLL BLOCKING ==========
    function preventScrollBlocking() {
        // Override touchstart to NOT preventDefault on non-draggable elements
        var originalAddEventListener = EventTarget.prototype.addEventListener;

        EventTarget.prototype.addEventListener = function (type, listener, options) {
            if (type === 'touchstart' || type === 'touchmove') {
                // Wrap listener to check if we should allow scroll
                var wrappedListener = function (e) {
                    var target = e.target;

                    // Only prevent default on draggable letters
                    if (target && target.classList && target.classList.contains('draggable-letter')) {
                        // Let the original listener handle it
                        return listener.call(this, e);
                    }

                    // For everything else, allow scroll
                    // Don't call preventDefault
                    var result = listener.call(this, e);

                    // If listener called preventDefault, we need to allow scroll anyway
                    // unless it's a draggable letter
                    if (e.defaultPrevented && !target.classList.contains('draggable-letter')) {
                        console.warn('⚠️ Scroll was blocked, re-enabling...');
                    }

                    return result;
                };

                // Call original with wrapped listener
                return originalAddEventListener.call(this, type, wrappedListener, options);
            }

            // For other events, use original
            return originalAddEventListener.call(this, type, listener, options);
        };

        console.log('✅ Scroll blocking prevention enabled');
    }

    // ========== FIX TOUCH ACTION ==========
    function fixTouchAction() {
        // Set touch-action on body
        document.body.style.touchAction = 'pan-y pinch-zoom';

        // Allow scroll on all scrollable containers
        var scrollables = document.querySelectorAll('.page, .main-content, .theme-selection, .level-selection, .shop-items-grid, .words-learned-list');
        scrollables.forEach(function (el) {
            el.style.touchAction = 'pan-y pinch-zoom';
            el.style.webkitOverflowScrolling = 'touch';
        });

        console.log('✅ Touch action fixed on', scrollables.length, 'elements');
    }

    // ========== MONITOR AND FIX ==========
    function monitorAndFix() {
        // Check every 500ms if scroll is still enabled
        setInterval(function () {
            var bodyOverflow = getComputedStyle(document.body).overflowY;
            var bodyHeight = getComputedStyle(document.body).height;

            if (bodyOverflow === 'hidden' || bodyHeight === '100vh') {
                console.warn('⚠️ Scroll was disabled, re-enabling...');
                forceEnableScroll();
            }
        }, 500);
    }

    // ========== INIT ==========
    function init() {
        console.log('📜 Initializing mobile scroll force...');

        // Force enable immediately
        forceEnableScroll();

        // Fix touch action
        fixTouchAction();

        // Prevent scroll blocking (commented out as it might break drag & drop)
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
                            fixTouchAction();
                        }, 100);
                    }
                }
            });
        });

        document.querySelectorAll('.page').forEach(function (page) {
            observer.observe(page, { attributes: true });
        });

        console.log('✅ Mobile scroll force ready!');
    }

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also init after a delay to ensure all other scripts loaded
    setTimeout(init, 1000);

})();
