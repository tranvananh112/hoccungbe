/* ========================================
   PWA AUDIO FIX - Sửa âm thanh cho iPhone PWA
   Xử lý đặc biệt khi app chạy ở PWA mode
   ======================================== */

(function () {
    'use strict';

    console.log('📱 Loading PWA audio fix...');

    // ========== PHÁT HIỆN PWA MODE ==========
    function isPWAMode() {
        // iOS PWA: window.navigator.standalone
        if (window.navigator.standalone === true) {
            console.log('✅ iOS PWA detected');
            return true;
        }

        // Android PWA: display-mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✅ Android PWA detected');
            return true;
        }

        // Fullscreen mode
        if (window.matchMedia('(display-mode: fullscreen)').matches) {
            console.log('✅ Fullscreen mode detected');
            return true;
        }

        return false;
    }

    // ========== UNLOCK AUDIO MẠNH MẼ CHO PWA ==========
    function unlockAudioForPWA() {
        return new Promise(function (resolve) {
            console.log('🔊 Unlocking audio for PWA...');

            var promises = [];

            // 1. Unlock Audio Manager
            if (window.AudioManager) {
                promises.push(window.AudioManager.unlock());
            }

            // 2. Unlock Mobile Audio Enhanced
            if (window.MobileAudioEnhanced) {
                promises.push(window.MobileAudioEnhanced.unlock());
            }

            // 3. Phát âm thanh im lặng (iOS trick)
            var silentAudio = new Audio();
            // Base64 của file WAV im lặng 0.1 giây
            silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            silentAudio.volume = 0.01;

            var playPromise = silentAudio.play().catch(function (err) {
                console.warn('Silent audio failed:', err);
            });

            if (playPromise) {
                promises.push(playPromise);
            }

            // 4. Resume Audio Context nếu bị suspended
            if (window.AudioManager && window.AudioManager.getContext) {
                var ctx = window.AudioManager.getContext();
                if (ctx && ctx.state === 'suspended') {
                    promises.push(ctx.resume());
                }
            }

            // 5. Unlock Speech Synthesis (iOS trick)
            if (window.speechSynthesis) {
                var utterance = new SpeechSynthesisUtterance('');
                utterance.volume = 0.01;
                window.speechSynthesis.speak(utterance);
            }

            // Đợi tất cả unlock xong
            Promise.all(promises).then(function () {
                console.log('✅ PWA audio unlocked successfully!');

                // Test âm thanh để đảm bảo hoạt động
                setTimeout(function () {
                    testAudioAfterUnlock();
                }, 500);

                resolve(true);
            }).catch(function (err) {
                console.warn('⚠️ PWA audio unlock failed:', err);
                // Vẫn resolve để không block
                resolve(false);
            });
        });
    }

    // ========== TEST ÂM THANH SAU KHI UNLOCK ==========
    function testAudioAfterUnlock() {
        console.log('🧪 Testing audio after unlock...');

        // Test 1: Âm thanh từ file
        if (window.CelebrationSounds) {
            window.CelebrationSounds.playCorrect(0.2);
            console.log('✅ File audio test played');
        }

        // Test 2: Giọng đọc
        if (window.MobileAudioEnhanced) {
            setTimeout(function () {
                window.MobileAudioEnhanced.speak('Âm thanh đã sẵn sàng', {
                    volume: 0.3,
                    rate: 1.0
                }).then(function () {
                    console.log('✅ Speech synthesis test played');
                }).catch(function (err) {
                    console.warn('⚠️ Speech test failed:', err);
                });
            }, 800);
        }
    }

    // ========== PRELOAD ÂM THANH SAU KHI UNLOCK ==========
    function preloadAudioFiles() {
        console.log('📥 Preloading audio files for PWA...');

        if (window.CelebrationSounds && window.CelebrationSounds.preload) {
            window.CelebrationSounds.preload();
        }

        // Preload giọng đọc
        if (window.MobileAudioEnhanced) {
            // Load voices
            if (window.speechSynthesis) {
                window.speechSynthesis.getVoices();
            }
        }
    }

    // ========== SETUP PWA AUDIO ==========
    function setupPWAAudio() {
        if (!isPWAMode()) {
            console.log('ℹ️ Not in PWA mode - using standard audio');
            return;
        }

        console.log('📱 PWA mode detected - applying special audio handling');

        // 1. Bắt buộc hiển thị modal unlock
        var modal = document.getElementById('audioWelcomeModal');
        if (modal) {
            // Hiển thị modal
            modal.classList.add('show');

            // Không cho skip trong PWA mode
            var btnSkip = document.getElementById('btnSkipAudio');
            if (btnSkip) {
                btnSkip.style.display = 'none';
            }

            // Cập nhật text cho rõ ràng
            var modalText = modal.querySelector('p');
            if (modalText) {
                modalText.innerHTML = '⚠️ <strong>Vì bạn đang dùng app đã cài</strong>, cần bật âm thanh trước khi chơi!<br><small>iOS yêu cầu bạn phải nhấn nút để kích hoạt âm thanh.</small>';
            }

            // Cập nhật title
            var modalTitle = modal.querySelector('h2');
            if (modalTitle) {
                modalTitle.textContent = '🔊 Bật âm thanh';
            }
        }

        // 2. Làm nổi bật nút unlock trong navbar
        var navBtn = document.getElementById('audioUnlockBtn');
        if (navBtn) {
            navBtn.style.animation = 'pulse 1s infinite';
            navBtn.style.fontSize = '24px';
            navBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            navBtn.style.color = 'white';
            navBtn.style.padding = '12px';
            navBtn.style.borderRadius = '50%';
            navBtn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        }

        // 3. Override nút enable audio
        var btnEnable = document.getElementById('btnEnableAudio');
        if (btnEnable) {
            // Lưu handler cũ
            var oldHandler = btnEnable.onclick;

            // Handler mới cho PWA
            btnEnable.onclick = function () {
                console.log('🔊 User clicked enable audio in PWA');

                unlockAudioForPWA().then(function (success) {
                    if (success) {
                        // Đóng modal
                        if (modal) {
                            modal.classList.remove('show');
                        }

                        // Preload âm thanh
                        preloadAudioFiles();

                        // Chào mừng
                        var childName = 'bé yêu';
                        if (window.gameState && window.gameState.playerName) {
                            childName = window.gameState.playerName;
                        }

                        if (window.beeSay) {
                            window.beeSay('Chào ' + childName + '! Âm thanh đã sẵn sàng! 🎵', 3000);
                        }

                        // Cập nhật nút navbar
                        if (navBtn) {
                            navBtn.textContent = '🔊';
                            navBtn.style.animation = 'none';
                            navBtn.classList.add('unlocked');
                        }

                        // Phát âm thanh success
                        if (window.playSound) {
                            setTimeout(function () {
                                window.playSound('success');
                            }, 300);
                        }
                    } else {
                        // Unlock thất bại
                        alert('⚠️ Không thể bật âm thanh. Vui lòng thử lại!');
                    }
                });
            };
        }

        // 4. Override nút unlock trong navbar
        if (navBtn) {
            navBtn.onclick = function () {
                console.log('🔊 User clicked navbar unlock button');

                unlockAudioForPWA().then(function (success) {
                    if (success) {
                        navBtn.textContent = '🔊';
                        navBtn.style.animation = 'none';
                        navBtn.classList.add('unlocked');

                        if (window.beeSay) {
                            window.beeSay('Âm thanh đã bật! 🔊', 2000);
                        }

                        if (window.MobileAudioEnhanced) {
                            window.MobileAudioEnhanced.speak('Âm thanh đã bật!');
                        }
                    }
                });
            };
        }

        // 5. Thêm CSS animation cho nút pulse
        if (!document.getElementById('pwa-audio-fix-styles')) {
            var style = document.createElement('style');
            style.id = 'pwa-audio-fix-styles';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                
                .audio-welcome-modal.show {
                    z-index: 10000 !important;
                }
                
                .audio-welcome-modal strong {
                    color: #667eea;
                }
                
                .audio-welcome-modal small {
                    display: block;
                    margin-top: 8px;
                    color: #999;
                    font-size: 12px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ========== MONITOR AUDIO STATE ==========
    function monitorAudioState() {
        if (!isPWAMode()) return;

        setInterval(function () {
            var isUnlocked = false;

            if (window.AudioManager && window.AudioManager.isUnlocked) {
                isUnlocked = window.AudioManager.isUnlocked();
            }

            if (window.MobileAudioEnhanced && window.MobileAudioEnhanced.isUnlocked) {
                isUnlocked = isUnlocked || window.MobileAudioEnhanced.isUnlocked();
            }

            // Cập nhật UI
            var navBtn = document.getElementById('audioUnlockBtn');
            if (navBtn) {
                if (isUnlocked) {
                    navBtn.textContent = '🔊';
                    navBtn.classList.add('unlocked');
                    navBtn.style.animation = 'none';
                } else {
                    navBtn.textContent = '🔇';
                    navBtn.classList.remove('unlocked');
                }
            }
        }, 2000);
    }

    // ========== EXPORT API ==========
    window.PWAAudioFix = {
        isPWAMode: isPWAMode,
        unlock: unlockAudioForPWA,
        test: testAudioAfterUnlock,
        preload: preloadAudioFiles
    };

    // ========== AUTO INIT ==========
    function init() {
        console.log('🎵 PWA Audio Fix initializing...');

        // Detect và setup
        setupPWAAudio();

        // Monitor state
        monitorAudioState();

        console.log('✅ PWA Audio Fix ready!');
    }

    // Chạy khi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
