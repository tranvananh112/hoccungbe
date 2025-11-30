/* ========================================
   MOBILE OPTIMIZER - Tối ưu cho mobile
   ======================================== */

(function () {
    'use strict';

    console.log('📱 Loading mobile optimizer...');

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Detect mobile
    function detectMobile() {
        if (isMobile || isTouch) {
            document.body.classList.add('is-mobile');
            document.body.classList.add('is-touch');
        }
    }

    // Optimize animations for mobile
    function optimizeAnimations() {
        if (!isMobile) return;

        // Giảm số floating icons
        var floatingIcons = document.querySelectorAll('.floating-icon');
        if (floatingIcons.length > 8) {
            for (var i = 8; i < floatingIcons.length; i++) {
                floatingIcons[i].remove();
            }
        }

        // Add mobile class để CSS tự động tối ưu
        document.body.classList.add('mobile-optimized');

        console.log('📱 Mobile animations optimized via CSS');
    }

    // Prevent zoom on double tap
    function preventZoom() {
        var lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            var now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // Prevent pinch zoom
        document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
        });
    }

    // Optimize scroll performance
    function optimizeScroll() {
        var scrollElements = document.querySelectorAll('.words-learned-list, .icon-picker, .shop-items-grid');
        scrollElements.forEach(function (el) {
            el.style.webkitOverflowScrolling = 'touch';
        });
    }

    // Debounce function
    function debounce(func, wait) {
        var timeout;
        return function executedFunction() {
            var context = this;
            var args = arguments;
            var later = function () {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimize resize events
    function optimizeResize() {
        var resizeHandler = debounce(function () {
            // Update viewport height for mobile browsers
            var vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px');
        }, 250);

        window.addEventListener('resize', resizeHandler);
        resizeHandler(); // Initial call
    }

    // Improve touch targets
    function improveTouchTargets() {
        if (!isTouch) return;

        var style = document.createElement('style');
        style.textContent = `
      .nav-item,
      .game-btn,
      .draggable-letter,
      .letter-slot,
      .avatar-btn,
      .level-box,
      .theme-card,
      .shop-item,
      .icon-option,
      .parent-tab {
        min-width: 44px !important;
        min-height: 44px !important;
      }
    `;
        document.head.appendChild(style);
    }

    // Reduce confetti on mobile
    function optimizeConfetti() {
        if (!window.createConfetti) return;

        var originalCreateConfetti = window.createConfetti;
        window.createConfetti = function () {
            if (isMobile) {
                // Giảm số confetti xuống 30 thay vì 100
                var container = document.getElementById('confettiContainer');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'confettiContainer';
                    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
                    document.body.appendChild(container);
                }

                for (var i = 0; i < 30; i++) {
                    var confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.animationDelay = Math.random() * 3 + 's';
                    confetti.style.backgroundColor = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'][Math.floor(Math.random() * 4)];
                    container.appendChild(confetti);

                    setTimeout(function (el) {
                        return function () { el.remove(); };
                    }(confetti), 4000);
                }
            } else {
                originalCreateConfetti();
            }
        };
    }

    // Prevent overscroll
    function preventOverscroll() {
        document.body.addEventListener('touchmove', function (e) {
            if (e.target.closest('.page.active')) {
                // Allow scroll in scrollable containers
                var scrollable = e.target.closest('.words-learned-list, .icon-picker, .shop-items-grid, .custom-words-list');
                if (!scrollable) {
                    var page = e.target.closest('.page.active');
                    if (page.scrollHeight <= page.clientHeight) {
                        e.preventDefault();
                    }
                }
            }
        }, { passive: false });
    }

    // Initialize
    function init() {
        detectMobile();
        optimizeAnimations();
        preventZoom();
        optimizeScroll();
        optimizeResize();
        improveTouchTargets();
        optimizeConfetti();
        preventOverscroll();

        console.log('✅ Mobile optimizer ready');
    }

    // Export
    window.MobileOptimizer = {
        isMobile: isMobile,
        isTouch: isTouch,
        debounce: debounce
    };

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
