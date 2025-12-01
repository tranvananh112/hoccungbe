/* ========================================
   SNOW EFFECT PREMIUM - Tuyết rơi mượt mà 60fps
   Nâng cấp với performance optimization
   ======================================== */

(function () {
    'use strict';

    console.log('❄️ Loading premium snow effect...');

    // Kiểm tra xem user có prefer reduced motion không
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        console.log('⚠️ Reduced motion preferred, skipping snow effect');
        return;
    }

    // Config
    const config = {
        desktop: {
            count: 50,
            snowChars: ['❄', '❅', '❆', '✻', '✼', '❉', '✺', '⁕', '✲', '✱']
        },
        tablet: {
            count: 35,
            snowChars: ['❄', '❅', '❆', '✻', '✼']
        },
        mobile: {
            count: 25,
            snowChars: ['❄', '❅', '❆']
        }
    };

    // Detect device type
    function getDeviceType() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }

    // Tạo container cho tuyết
    function createSnowContainer() {
        let container = document.getElementById('snowContainer');

        if (!container) {
            container = document.createElement('div');
            container.className = 'snow-container';
            container.id = 'snowContainer';
            document.body.appendChild(container);
        }

        return container;
    }

    // Tạo bông tuyết với optimization
    function createSnowflake(index, deviceConfig) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.setAttribute('data-index', index);

        // Chọn ký tự tuyết ngẫu nhiên
        const snowChar = deviceConfig.snowChars[Math.floor(Math.random() * deviceConfig.snowChars.length)];
        snowflake.textContent = snowChar;

        // Vị trí ngang ngẫu nhiên
        const leftPos = Math.random() * 100;
        snowflake.style.left = leftPos + '%';

        // Kích thước ngẫu nhiên (0.7em - 1.5em)
        const size = Math.random() * 0.8 + 0.7;
        snowflake.style.fontSize = size + 'em';

        // Thời gian rơi ngẫu nhiên (15-25s)
        const fallDuration = Math.random() * 10 + 15;
        const swingDuration = Math.random() * 2 + 4;
        const rotateDuration = Math.random() * 10 + 20;

        snowflake.style.animationDuration = `${fallDuration}s, ${swingDuration}s, ${rotateDuration}s, ${fallDuration}s`;

        // Độ trễ ngẫu nhiên (0-12s)
        const delay = Math.random() * 12;
        snowflake.style.animationDelay = `${delay}s, ${delay * 0.5}s, ${delay * 0.3}s, ${delay}s`;

        // Độ mờ ngẫu nhiên (0.5 - 0.9)
        const opacity = Math.random() * 0.4 + 0.5;
        snowflake.style.opacity = opacity;

        return snowflake;
    }

    // Khởi tạo hiệu ứng tuyết với performance optimization
    function initSnowEffect() {
        console.log('❄️ Initializing premium snow effect...');

        const container = createSnowContainer();
        const deviceType = getDeviceType();
        const deviceConfig = config[deviceType];

        // Clear existing snowflakes
        container.innerHTML = '';

        // Tạo các bông tuyết với requestAnimationFrame để tránh lag
        let created = 0;

        function createBatch() {
            const batchSize = 5;
            const end = Math.min(created + batchSize, deviceConfig.count);

            for (let i = created; i < end; i++) {
                const snowflake = createSnowflake(i, deviceConfig);
                container.appendChild(snowflake);
            }

            created = end;

            if (created < deviceConfig.count) {
                requestAnimationFrame(createBatch);
            } else {
                console.log(`✅ Snow effect created with ${deviceConfig.count} snowflakes (${deviceType})`);
            }
        }

        requestAnimationFrame(createBatch);
    }

    // Bật/tắt hiệu ứng tuyết
    function toggleSnow(enable) {
        const container = document.getElementById('snowContainer');
        if (container) {
            container.style.display = enable ? 'block' : 'none';
            console.log(`❄️ Snow effect ${enable ? 'enabled' : 'disabled'}`);
        }
    }

    // Pause/Resume animation (để tiết kiệm pin khi tab không active)
    function pauseSnow() {
        const container = document.getElementById('snowContainer');
        if (container) {
            container.style.animationPlayState = 'paused';
            const snowflakes = container.querySelectorAll('.snowflake');
            snowflakes.forEach(flake => {
                flake.style.animationPlayState = 'paused';
            });
        }
    }

    function resumeSnow() {
        const container = document.getElementById('snowContainer');
        if (container) {
            container.style.animationPlayState = 'running';
            const snowflakes = container.querySelectorAll('.snowflake');
            snowflakes.forEach(flake => {
                flake.style.animationPlayState = 'running';
            });
        }
    }

    // Tự động pause khi tab không active để tiết kiệm pin
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            pauseSnow();
        } else {
            resumeSnow();
        }
    });

    // Re-init khi resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            const newDeviceType = getDeviceType();
            console.log('❄️ Window resized, re-initializing for', newDeviceType);
            initSnowEffect();
        }, 500);
    });

    // Export functions
    window.SnowEffect = {
        init: initSnowEffect,
        toggle: toggleSnow,
        pause: pauseSnow,
        resume: resumeSnow
    };

    // Auto init khi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSnowEffect);
    } else {
        initSnowEffect();
    }

    // Thêm controls vào console để dễ debug
    console.log('❄️ Snow effect ready!');
    console.log('💡 Controls: SnowEffect.toggle(true/false), SnowEffect.pause(), SnowEffect.resume()');

})();
