/* ========================================
   DEBUG CELEBRATION - Kiểm tra hiệu ứng chuyển câu
   ======================================== */

(function () {
    'use strict';

    console.log('🔍 Debug Celebration loading...');

    // Kiểm tra sau 2 giây
    setTimeout(function () {
        console.log('=== CELEBRATION DEBUG ===');

        // 1. Kiểm tra overlay element
        var overlay = document.getElementById('celebrationOverlay');
        if (overlay) {
            console.log('✅ Overlay element exists');
            console.log('   - Classes:', overlay.className);
            console.log('   - Display:', window.getComputedStyle(overlay).display);
            console.log('   - Opacity:', window.getComputedStyle(overlay).opacity);
        } else {
            console.error('❌ Overlay element NOT FOUND!');
        }

        // 2. Kiểm tra hàm showCelebrationTransition
        if (typeof showCelebrationTransition !== 'undefined') {
            console.log('✅ showCelebrationTransition function exists');
        } else {
            console.error('❌ showCelebrationTransition function NOT FOUND!');
        }

        // 3. Kiểm tra CelebrationSounds
        if (window.CelebrationSounds) {
            console.log('✅ CelebrationSounds loaded');
            console.log('   - Methods:', Object.keys(window.CelebrationSounds));
        } else {
            console.warn('⚠️ CelebrationSounds not loaded');
        }

        // 4. Kiểm tra CSS
        var styles = document.styleSheets;
        var hasCelebrationCSS = false;
        for (var i = 0; i < styles.length; i++) {
            try {
                var rules = styles[i].cssRules || styles[i].rules;
                for (var j = 0; j < rules.length; j++) {
                    if (rules[j].selectorText && rules[j].selectorText.includes('celebration-overlay')) {
                        hasCelebrationCSS = true;
                        break;
                    }
                }
            } catch (e) {
                // Skip CORS errors
            }
        }

        if (hasCelebrationCSS) {
            console.log('✅ Celebration CSS loaded');
        } else {
            console.warn('⚠️ Celebration CSS might not be loaded');
        }

        console.log('=== END DEBUG ===');

    }, 2000);

    // Thêm nút test vào UI
    setTimeout(function () {
        var testBtn = document.createElement('button');
        testBtn.textContent = '🧪 Test Overlay';
        testBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 99999; background: #ff6b6b; color: white; border: none; padding: 15px 25px; border-radius: 10px; cursor: pointer; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);';

        testBtn.onclick = function () {
            console.log('🧪 Manual test triggered');

            var overlay = document.getElementById('celebrationOverlay');
            if (!overlay) {
                alert('❌ Overlay không tồn tại!');
                return;
            }

            // Hiển thị overlay
            overlay.classList.add('show');
            overlay.style.display = 'flex';

            console.log('✅ Overlay shown manually');
            console.log('   - Classes:', overlay.className);
            console.log('   - Display:', window.getComputedStyle(overlay).display);

            // Tự động ẩn sau 3 giây
            setTimeout(function () {
                overlay.classList.remove('show');
                overlay.style.display = 'none';
                console.log('✅ Overlay hidden after 3s');
            }, 3000);
        };

        document.body.appendChild(testBtn);
        console.log('✅ Test button added to page');

    }, 3000);

    // Hook vào showCelebrationTransition để log
    var originalShowCelebration = window.showCelebrationTransition;
    if (originalShowCelebration) {
        window.showCelebrationTransition = function () {
            console.log('🎉 showCelebrationTransition CALLED!');
            console.log('   - currentWord:', window.currentWord);
            console.log('   - gameState:', window.gameState);

            try {
                originalShowCelebration.apply(this, arguments);
                console.log('✅ showCelebrationTransition executed successfully');
            } catch (e) {
                console.error('❌ Error in showCelebrationTransition:', e);
            }
        };
        console.log('✅ Hooked into showCelebrationTransition');
    }

    console.log('✅ Debug Celebration ready!');

})();
