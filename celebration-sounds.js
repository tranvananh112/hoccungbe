/* ========================================
   CELEBRATION SOUNDS - Âm thanh chúc mừng thật
   Tiếng vỗ tay và hò reo của trẻ em
   ======================================== */

(function () {
    'use strict';

    console.log('🎉 Loading celebration sounds...');

    // ========== DANH SÁCH ÂM THANH ==========
    var soundFiles = {
        // ⭐ ÂM THANH CÓ SẴN (file thực tế tồn tại)
        mainCelebration: 'sounds/celebration.wav',    // Âm thanh chúc mừng
        correct: 'sounds/chinhxac.wav',               // Âm thanh đúng
        wrong: 'sounds/saidapan.wav'                  // Âm thanh sai
    };

    // Cache âm thanh đã load
    var audioCache = {};
    var isEnabled = true;

    // ⭐ Track các âm thanh đang phát để có thể dừng
    var activeSounds = [];

    // ========== PRELOAD ÂM THANH ==========
    function preloadSounds() {
        console.log('📥 Preloading celebration sounds...');

        // ⭐ Preload tất cả âm thanh có sẵn
        preloadSound(soundFiles.mainCelebration);
        preloadSound(soundFiles.correct);
        preloadSound(soundFiles.wrong);
    }

    function preloadSound(url) {
        if (audioCache[url]) return;

        var audio = new Audio();
        audio.preload = 'auto';
        audio.src = url;

        // Xử lý lỗi 404 - không log ra console
        audio.addEventListener('error', function () {
            // Âm thanh không tồn tại, bỏ qua im lặng
            audioCache[url] = null;
        });

        audioCache[url] = audio;

        // Load âm thanh
        audio.load();
    }

    // ========== PHÁT ÂM THANH ==========
    function playSound(url, volume) {
        if (!isEnabled) return;

        volume = volume || 0.7;

        // ⭐ SỬ DỤNG MOBILE AUDIO PLAYER NẾU CÓ
        if (window.MobileAudioPlayer) {
            window.MobileAudioPlayer.play(url, {
                volume: volume,
                onEnd: function () {
                    console.log('✅ Sound finished:', url);
                },
                onError: function (err) {
                    console.warn('⚠️ Sound error, using fallback:', url);
                    useFallbackSound(url);
                }
            }).catch(function () {
                useFallbackSound(url);
            });
            return;
        }

        // ⭐ FALLBACK: Phương pháp cũ
        try {
            var audio = audioCache[url];

            // Nếu file không tồn tại (null), dùng fallback ngay
            if (audio === null) {
                useFallbackSound(url);
                return;
            }

            if (!audio) {
                audio = new Audio(url);
                audio.addEventListener('error', function () {
                    audioCache[url] = null;
                });
                audioCache[url] = audio;
            }

            // Clone để có thể phát nhiều lần đồng thời
            var sound = audio.cloneNode();
            sound.volume = volume;

            // ⭐ Track âm thanh này để có thể dừng sau
            activeSounds.push(sound);

            // Unlock audio context nếu cần
            if (window.AudioManager) {
                window.AudioManager.unlock();
            }

            sound.play().catch(function (e) {
                // Không log lỗi 404 nữa, chỉ dùng fallback
                useFallbackSound(url);
            });

            // Cleanup sau khi phát xong
            sound.addEventListener('ended', function () {
                // Xóa khỏi danh sách active
                var index = activeSounds.indexOf(sound);
                if (index > -1) {
                    activeSounds.splice(index, 1);
                }
                sound.remove();
            });

        } catch (e) {
            console.warn('Error playing sound:', e);
            useFallbackSound(url);
        }
    }

    // ========== FALLBACK: DÙNG ÂM THANH TỔNG HỢP ==========
    function useFallbackSound(url) {
        if (!window.SoundEffects) return;

        if (url.includes('clapping')) {
            window.SoundEffects.applause(0.5);
        } else if (url.includes('cheering') || url.includes('yay') || url.includes('hooray')) {
            window.SoundEffects.cheer(0.4);
        } else if (url.includes('laughing')) {
            window.SoundEffects.cheer(0.3);
        }
    }

    // ========== PHÁT ÂM THANH ĐÚNG/SAI ==========
    function playCorrectSound(volume) {
        playSound(soundFiles.correct, volume || 0.7);
    }

    function playWrongSound(volume) {
        playSound(soundFiles.wrong, volume || 0.7);
    }

    // ========== PHÁT COMBO CHÚC MỪNG ==========
    function playCelebrationCombo() {
        console.log('🎊 Playing celebration combo!');

        // ⭐ Phát âm thanh chúc mừng chính
        playSound(soundFiles.mainCelebration, 0.8);

        // Thêm hiệu ứng âm thanh tổng hợp (không cần file)
        if (window.SoundEffects) {
            setTimeout(function () {
                window.SoundEffects.sparkle(0.3);
            }, 300);
        }
    }

    // ========== BẬT/TẮT ÂM THANH ==========
    function enable() {
        isEnabled = true;
        console.log('✅ Celebration sounds enabled');
    }

    function disable() {
        isEnabled = false;
        console.log('🔇 Celebration sounds disabled');
    }

    // ========== DỪNG TẤT CẢ ÂM THANH ==========
    function stopAll() {
        console.log('⏹️ Stopping all celebration sounds...');

        // Dừng và xóa tất cả âm thanh đang phát
        activeSounds.forEach(function (sound) {
            try {
                sound.pause();
                sound.currentTime = 0;
                sound.remove();
            } catch (e) {
                // Bỏ qua lỗi
            }
        });

        // Xóa danh sách
        activeSounds = [];

        console.log('✅ All celebration sounds stopped');
    }

    // ========== KIỂM TRA FILE TỒN TẠI ==========
    function checkSoundsExist() {
        console.log('🔍 Checking celebration sounds...');

        var soundsToCheck = [
            { name: 'Celebration', file: soundFiles.mainCelebration },
            { name: 'Correct', file: soundFiles.correct },
            { name: 'Wrong', file: soundFiles.wrong }
        ];

        soundsToCheck.forEach(function (item) {
            var audio = new Audio(item.file);

            audio.addEventListener('error', function () {
                console.warn('⚠️', item.name, 'sound not found:', item.file);
            });

            audio.addEventListener('canplaythrough', function () {
                console.log('✅', item.name, 'sound ready!');
            });

            audio.load();
        });
    }

    // ========== EXPORT ==========
    window.CelebrationSounds = {
        // ⭐ Phát âm thanh chính
        playMainCelebration: function (vol) {
            playSound(soundFiles.mainCelebration, vol || 0.8);
        },

        // Phát âm thanh đúng/sai
        playCorrect: playCorrectSound,
        playWrong: playWrongSound,

        // Phát combo (bao gồm âm thanh chính + hiệu ứng)
        playCombo: playCelebrationCombo,

        // Quản lý
        enable: enable,
        disable: disable,
        preload: preloadSounds,

        // ⭐ Dừng tất cả âm thanh (khi chuyển câu)
        stopAll: stopAll,

        // Phát file cụ thể
        play: playSound
    };

    // ========== INIT ==========
    // Kiểm tra file tồn tại
    setTimeout(checkSoundsExist, 1000);

    // Preload một số âm thanh
    setTimeout(preloadSounds, 2000);

    console.log('✅ Celebration sounds ready!');

})();

