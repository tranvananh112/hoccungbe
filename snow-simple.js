/* ========================================
   SNOW SIMPLE - Tuyết rơi đơn giản, chắc chắn hoạt động
   ======================================== */

(function () {
    'use strict';

    console.log('❄️ SIMPLE SNOW: Loading...');

    // Tạo container
    function createContainer() {
        let container = document.getElementById('snowContainer');

        if (!container) {
            container = document.createElement('div');
            container.id = 'snowContainer';
            container.className = 'snow-container';
            document.body.appendChild(container);
            console.log('✅ Container created');
        }

        return container;
    }

    // Tạo bông tuyết
    function createSnowflake(index) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';

        // Các icon tuyết
        const icons = ['❄', '❅', '❆'];
        snowflake.textContent = icons[index % icons.length];

        return snowflake;
    }

    // Khởi tạo
    function init() {
        console.log('❄️ SIMPLE SNOW: Initializing...');

        const container = createContainer();

        // Xóa tuyết cũ nếu có
        container.innerHTML = '';

        // Tạo 20 bông tuyết
        const count = window.innerWidth <= 768 ? 15 : 20;

        for (let i = 0; i < count; i++) {
            const snowflake = createSnowflake(i);
            container.appendChild(snowflake);
        }

        console.log(`✅ SIMPLE SNOW: Created ${count} snowflakes`);
        console.log('✅ SIMPLE SNOW: Tuyết đang rơi tự động!');
    }

    // Export
    window.SimpleSnow = {
        init: init
    };

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('✅ SIMPLE SNOW: Ready!');

})();
