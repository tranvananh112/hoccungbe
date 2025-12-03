/* ========================================
   PWA AUDIO HELPER - Hỗ trợ âm thanh cho iPhone PWA
   KHÔNG override code hiện có, chỉ cải thiện thêm
   ======================================== */

(function () {
    'use strict';

    console.log('📱 PWA Audio Helper loading...');

    // ========== PHÁT HIỆN PWA MODE ==========
    function isPWAMode() {
        // iOS PWA
        if (window.navigator.standalone === true) {
            return true;
        }

        // Android PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }

        return false;
    }

    // ========== ENHANCED UNLOCK CHO PWA ==========
    function enhancedUnlockForPWA() {
        if (!isPWAMode()) {
            console.log('ℹ️ Not PWA mode - skip enhanced unlock');
            return Promise.resolve();
        }

        console.log('🔊 Enhanced unlock for PWA mode...');

        return new Promise(function (resolve) {
            var promises = [];

            // 1. Phát âm thanh im lặng (iOS trick)
            var silentAudio = new Audio();
            silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            silentAudio.volume = 0.01;
            promises.push(silentAudio.play().catch(function () { }));

            // 2. Resume Audio Context nếu có
            if (window.AudioManager && window.AudioManager.getContext) {
                var ctx = window.AudioManager.getContext();
                if (ctx && ctx.state === 'suspended') {
                    promises.push(ctx.resume().catch(function () { }));
                }
            }

            // 3. Unlock Speech Synthesis
            if (window.speechSynthesis) {
                var utterance = new SpeechSynthesisUtterance('');
                utterance.volume = 0.01;
                window.speechSynthesis.speak(utterance);
            }

            Promise.all(promises).then(function () {
                console.log('✅ PWA enhanced unlock completed');
                resolve();
            }).catch(function () {
                resolve(); // Vẫn resolve để không block
            });
        });
    }

    // ========== SETUP ==========
    function setup() {
        if (!isPWAMode()) {
            console.log('ℹ️ Not in PWA mode');
            return;
        }

        console.log('📱 PWA mode detected - applying enhancements');

        // Chỉ thêm log, KHÔNG thay đổi UI
        var modal = document.getElementById('audioWelcomeModal');
        if (modal) {
            console.log('💡 Tip: PWA mode cần unlock audio mỗi lần mở app');
        }

        // Thêm enhanced unlock vào các sự kiện user interaction
        var events = ['touchstart', 'click'];
        var unlocked = false;

        var enhanceHandler = function () {
            if (unlocked) return;

            enhancedUnlockForPWA().then(function () {
                unlocked = true;
                console.log('✅ PWA audio enhanced');

                // Remove listeners
                events.forEach(function (event) {
                    document.removeEventListener(event, enhanceHandler);
                });
            });
        };

        events.forEach(function (event) {
            document.addEventListener(event, enhanceHandler, { once: true, passive: true });
        });
    }

    // ========== EXPORT ==========
    window.PWAAudioHelper = {
        isPWAMode: isPWAMode,
        enhancedUnlock: enhancedUnlockForPWA
    };

    // ========== AUTO INIT ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }

    console.log('✅ PWA Audio Helper ready');

})();
