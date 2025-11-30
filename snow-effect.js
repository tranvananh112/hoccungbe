/* ========================================
   SNOW EFFECT JS - Tạo hiệu ứng tuyết rơi
   ======================================== */

(function () {
    'use strict';

    console.log('❄️ Loading snow effect...');

    // Kiểm tra xem user có prefer reduced motion không
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        console.log('⚠️ Reduced motion preferred, skipping snow effect');
        return;
    }

    // Tạo container cho tuyết
    function createSnowContainer() {
        const container = document.createElement('div');
        container.className = 'snow-container';
        container.id = 'snowContainer';
        document.body.appendChild(container);
        return container;
    }

    // Tạo bông tuyết
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';

        // Các ký tự tuyết khác nhau
        const snowChars = ['❄', '❅', '❆', '✻', '✼', '❉', '✺'];
        snowflake.textContent = snowChars[Math.floor(Math.random() * snowChars.length)];

        // Vị trí ngẫu nhiên
        snowflake.style.left = Math.random() * 100 + '%';

        // Kích thước ngẫu nhiên
        const size = Math.random() * 0.5 + 0.8; // 0.8 - 1.3em
        snowflake.style.fontSize = size + 'em';

        // Thời gian rơi ngẫu nhiên
        const duration = Math.random() * 8 + 12; // 12-20s
        snowflake.style.animationDuration = duration + 's';

        // Độ trễ ngẫu nhiên
        const delay = Math.random() * 5;
        snowflake.style.animationDelay = delay + 's';

        // Độ mờ ngẫu nhiên
        const opacity = Math.random() * 0.3 + 0.6; // 0.6 - 0.9
        snowflake.style.opacity = opacity;

        return snowflake;
    }

    // Khởi tạo hiệu ứng tuyết
    function initSnowEffect() {
        const container = createSnowContainer();

        // Số lượng bông tuyết
        const isMobile = window.innerWidth <= 768;
        const snowflakeCount = isMobile ? 20 : 40;

        // Tạo các bông tuyết
        for (let i = 0; i < snowflakeCount; i++) {
            const snowflake = createSnowflake();
            container.appendChild(snowflake);
        }

        console.log('✅ Snow effect created with', snowflakeCount, 'snowflakes');
    }

    // Bật/tắt hiệu ứng tuyết
    function toggleSnow(enable) {
        const container = document.getElementById('snowContainer');
        if (container) {
            container.style.display = enable ? 'block' : 'none';
        }
    }

    // Export functions
    window.SnowEffect = {
        init: initSnowEffect,
        toggle: toggleSnow
    };

    // Auto init khi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSnowEffect);
    } else {
        initSnowEffect();
    }

    console.log('❄️ Snow effect ready!');

})();
