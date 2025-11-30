/* ========================================
   MOBILE PERFORMANCE - Tối ưu hiệu suất 60fps
   Lazy loading, virtual scrolling, memory management
   ======================================== */

(function () {
    'use strict';

    console.log('⚡ Loading mobile performance optimizer...');

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var isLowEndDevice = false;

    // ========== DETECT DEVICE PERFORMANCE ==========
    function detectDevicePerformance() {
        // Check hardware concurrency (CPU cores)
        var cores = navigator.hardwareConcurrency || 2;

        // Check memory (if available)
        var memory = navigator.deviceMemory || 4;

        // Low-end device: < 4 cores or < 2GB RAM
        isLowEndDevice = cores < 4 || memory < 2;

        console.log('📱 Device:', cores, 'cores,', memory, 'GB RAM');
        console.log('⚡ Performance mode:', isLowEndDevice ? 'Low-end' : 'High-end');

        if (isLowEndDevice) {
            document.body.classList.add('low-end-device');
        }

        return {
            cores: cores,
            memory: memory,
            isLowEnd: isLowEndDevice
        };
    }

    // ========== REQUESTANIMATIONFRAME THROTTLE ==========
    function rafThrottle(callback) {
        var requestId = null;
        var lastArgs = null;

        var later = function () {
            requestId = null;
            callback.apply(null, lastArgs);
        };

        var throttled = function () {
            lastArgs = arguments;
            if (requestId === null) {
                requestId = requestAnimationFrame(later);
            }
        };

        throttled.cancel = function () {
            if (requestId !== null) {
                cancelAnimationFrame(requestId);
                requestId = null;
            }
        };

        return throttled;
    }

    // ========== DEBOUNCE ==========
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

    // ========== LAZY LOAD IMAGES ==========
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            var imageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            // Observe all images with data-src
            var lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(function (img) {
                imageObserver.observe(img);
            });

            console.log('✅ Lazy loading enabled for', lazyImages.length, 'images');
        }
    }

    // ========== REDUCE ANIMATIONS ON LOW-END DEVICES ==========
    function optimizeAnimations() {
        if (!isLowEndDevice) return;

        console.log('⚡ Reducing animations for low-end device');

        // Reduce confetti
        if (window.createConfetti) {
            var originalCreateConfetti = window.createConfetti;
            window.createConfetti = function () {
                var container = document.getElementById('confettiContainer');
                if (!container) return;

                // Only 20 confetti instead of 60
                var colors = ['#FFB6C1', '#98D8C8', '#FFE66D', '#FF9F43'];
                for (var i = 0; i < 20; i++) {
                    var c = document.createElement('div');
                    c.className = 'confetti';
                    c.style.left = Math.random() * 100 + '%';
                    c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    c.style.animationDelay = Math.random() * 0.5 + 's';
                    container.appendChild(c);
                }
                setTimeout(function () {
                    container.innerHTML = '';
                }, 3000);
            };
        }

        // Disable some floating animations
        var style = document.createElement('style');
        style.textContent = `
            .low-end-device .icon-float,
            .low-end-device .theme-icon-home,
            .low-end-device .level-badge {
                animation: none !important;
            }
            .low-end-device .word-image {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ========== VIRTUAL SCROLLING FOR LONG LISTS ==========
    function setupVirtualScrolling(container, items, itemHeight, renderItem) {
        if (!container || !items || items.length === 0) return;

        var visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;
        var totalHeight = items.length * itemHeight;
        var scrollTop = 0;

        // Create viewport
        var viewport = document.createElement('div');
        viewport.style.height = totalHeight + 'px';
        viewport.style.position = 'relative';

        // Create content container
        var content = document.createElement('div');
        content.style.position = 'absolute';
        content.style.top = '0';
        content.style.left = '0';
        content.style.right = '0';

        viewport.appendChild(content);
        container.innerHTML = '';
        container.appendChild(viewport);

        function render() {
            var startIndex = Math.floor(scrollTop / itemHeight);
            var endIndex = Math.min(startIndex + visibleCount, items.length);

            content.style.transform = 'translateY(' + (startIndex * itemHeight) + 'px)';
            content.innerHTML = '';

            for (var i = startIndex; i < endIndex; i++) {
                var itemElement = renderItem(items[i], i);
                itemElement.style.height = itemHeight + 'px';
                content.appendChild(itemElement);
            }
        }

        var throttledRender = rafThrottle(render);

        container.addEventListener('scroll', function () {
            scrollTop = container.scrollTop;
            throttledRender();
        });

        render();

        console.log('✅ Virtual scrolling enabled for', items.length, 'items');
    }

    // ========== MEMORY MANAGEMENT ==========
    function setupMemoryManagement() {
        // Clear unused audio cache periodically
        setInterval(function () {
            if (window.audioCache) {
                var keys = Object.keys(window.audioCache);
                if (keys.length > 50) {
                    console.log('🧹 Cleaning audio cache...');
                    // Keep only last 20 items
                    var toKeep = keys.slice(-20);
                    var newCache = {};
                    toKeep.forEach(function (key) {
                        newCache[key] = window.audioCache[key];
                    });
                    window.audioCache = newCache;
                }
            }
        }, 60000); // Every minute

        // Clear old localStorage data
        try {
            var gameData = localStorage.getItem('gamestva');
            if (gameData) {
                var data = JSON.parse(gameData);
                var now = Date.now();
                var DAY_MS = 24 * 60 * 60 * 1000;

                // Clean old completions
                if (data.sentencesCompleted) {
                    for (var key in data.sentencesCompleted) {
                        if (now - data.sentencesCompleted[key] > DAY_MS * 7) {
                            delete data.sentencesCompleted[key];
                        }
                    }
                }

                if (data.wordsCompleted) {
                    for (var key in data.wordsCompleted) {
                        if (now - data.wordsCompleted[key] > DAY_MS * 7) {
                            delete data.wordsCompleted[key];
                        }
                    }
                }

                localStorage.setItem('gamestva', JSON.stringify(data));
                console.log('🧹 Cleaned old game data');
            }
        } catch (e) {
            console.warn('Failed to clean localStorage:', e);
        }
    }

    // ========== PRELOAD CRITICAL RESOURCES ==========
    function preloadCriticalResources() {
        // Preload fonts
        if (document.fonts && document.fonts.load) {
            document.fonts.load('1em Nunito').then(function () {
                console.log('✅ Font preloaded: Nunito');
            });
        }

        // Preconnect to external resources
        var preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = 'https://fonts.googleapis.com';
        document.head.appendChild(preconnect);
    }

    // ========== OPTIMIZE TOUCH EVENTS ==========
    function optimizeTouchEvents() {
        // Use passive listeners for better scroll performance
        var passiveSupported = false;
        try {
            var options = {
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            window.addEventListener('test', null, options);
            window.removeEventListener('test', null, options);
        } catch (err) {
            passiveSupported = false;
        }

        if (passiveSupported) {
            // Add passive listeners to scrollable elements
            var scrollables = document.querySelectorAll('.page, .words-learned-list, .icon-picker, .shop-items-grid');
            scrollables.forEach(function (el) {
                el.addEventListener('touchstart', function () { }, { passive: true });
                el.addEventListener('touchmove', function () { }, { passive: true });
            });

            console.log('✅ Passive touch events enabled');
        }
    }

    // ========== FPS MONITOR (DEBUG) ==========
    function setupFPSMonitor() {
        if (!window.location.search.includes('debug')) return;

        var fps = 0;
        var lastTime = performance.now();
        var frames = 0;

        var fpsDisplay = document.createElement('div');
        fpsDisplay.style.cssText = 'position:fixed;top:70px;right:10px;background:rgba(0,0,0,0.7);' +
            'color:#0f0;padding:5px 10px;border-radius:5px;font-family:monospace;z-index:10000;';
        document.body.appendChild(fpsDisplay);

        function updateFPS() {
            frames++;
            var now = performance.now();
            if (now >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (now - lastTime));
                fpsDisplay.textContent = 'FPS: ' + fps;
                frames = 0;
                lastTime = now;

                // Warn if FPS drops below 30
                if (fps < 30) {
                    fpsDisplay.style.color = '#f00';
                } else if (fps < 50) {
                    fpsDisplay.style.color = '#ff0';
                } else {
                    fpsDisplay.style.color = '#0f0';
                }
            }
            requestAnimationFrame(updateFPS);
        }

        updateFPS();
        console.log('📊 FPS monitor enabled');
    }

    // ========== BATTERY OPTIMIZATION ==========
    function setupBatteryOptimization() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(function (battery) {
                console.log('🔋 Battery:', Math.round(battery.level * 100) + '%');

                // Reduce animations when battery is low
                if (battery.level < 0.2 && !battery.charging) {
                    console.log('⚡ Low battery mode activated');
                    document.body.classList.add('low-battery-mode');

                    var style = document.createElement('style');
                    style.textContent = `
                        .low-battery-mode * {
                            animation-duration: 0.5s !important;
                        }
                        .low-battery-mode .confetti,
                        .low-battery-mode .confetti-advanced {
                            display: none !important;
                        }
                    `;
                    document.head.appendChild(style);
                }

                battery.addEventListener('levelchange', function () {
                    console.log('🔋 Battery level changed:', Math.round(battery.level * 100) + '%');
                });
            });
        }
    }

    // ========== NETWORK OPTIMIZATION ==========
    function setupNetworkOptimization() {
        if ('connection' in navigator) {
            var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) {
                console.log('📡 Network:', connection.effectiveType);

                // Reduce quality on slow connections
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    console.log('⚡ Slow network mode activated');
                    document.body.classList.add('slow-network');
                }

                connection.addEventListener('change', function () {
                    console.log('📡 Network changed:', connection.effectiveType);
                });
            }
        }
    }

    // ========== EXPORT API ==========
    window.MobilePerformance = {
        rafThrottle: rafThrottle,
        debounce: debounce,
        setupVirtualScrolling: setupVirtualScrolling,
        isLowEndDevice: function () { return isLowEndDevice; },
        detectDevicePerformance: detectDevicePerformance
    };

    // ========== INIT ==========
    function init() {
        if (!isMobile) {
            console.log('⚠️ Not mobile, skipping performance optimizations');
            return;
        }

        console.log('⚡ Initializing mobile performance optimizer...');

        detectDevicePerformance();
        setupLazyLoading();
        optimizeAnimations();
        setupMemoryManagement();
        preloadCriticalResources();
        optimizeTouchEvents();
        setupFPSMonitor();
        setupBatteryOptimization();
        setupNetworkOptimization();

        console.log('✅ Mobile performance optimizer ready!');
    }

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
