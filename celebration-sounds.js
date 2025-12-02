/* ========================================
   CELEBRATION SOUNDS - Âm thanh chúc mừng thật
   Tiếng vỗ tay và hò reo của trẻ em
   ======================================== */

(function () {
    'use strict';

    console.log('🎉 Loading celebration sounds...');

    // ========== DANH SÁCH ÂM THANH ==========
    var soundFiles = {
        // ⭐ ÂM THANH CHÚC MỪNG CHÍNH (file của bạn)
        mainCelebration: 'sounds/celebration.wav',

        // Tiếng vỗ tay của trẻ em
        clapping: [
            'sounds/kids-clapping-1.mp3',
            'sounds/kids-clapping-2.mp3',
            'sounds/kids-clapping-3.mp3'
        ],

        // Tiếng hò reo của trẻ em
        cheering: [
            'sounds/kids-cheering-1.mp3',
            'sounds/kids-cheering-2.mp3',
            'sounds/kids-cheering-3.mp3',
            'sounds/kids-yay.mp3',
            'sounds/kids-hooray.mp3'
        ],

        // Tiếng cười vui vẻ
        laughing: [
            'sounds/kids-laughing-1.mp3',
            'sounds/kids-laughing-2.mp3'
        ],

        // Tiếng "Giỏi lắm!"
        praise: [
            'sounds/gioi-lam.mp3',
            'sounds/tuyet-voi.mp3',
            'sounds/hay-qua.mp3'
        ]
    };

    // Cache âm thanh đã load
    var audioCache = {};
    var isEnabled = true;

    // ⭐ Track các âm thanh đang phát để có thể dừng
    var activeSounds = [];

    // ========== PRELOAD ÂM THANH ==========
    function preloadSounds() {
        console.log('📥 Preloading celebration sounds...');

        // ⭐ CHỈ preload âm thanh chúc mừng chính (file tồn tại)
        preloadSound(soundFiles.mainCelebration);

        // KHÔNG preload các file phụ (tránh lỗi 404)
        // preloadSound(soundFiles.clapping[0]);
        // preloadSound(soundFiles.cheering[0]);
        // preloadSound(soundFiles.praise[0]);
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

    // ========== PHÁT NGẪU NHIÊN ==========
    function playRandom(category, volume) {
        var files = soundFiles[category];
        if (!files || files.length === 0) return;

        var randomFile = files[Math.floor(Math.random() * files.length)];
        playSound(randomFile, volume);
    }

    // ========== PHÁT COMBO CHÚC MỪNG ==========
    function playCelebrationCombo() {
        console.log('🎊 Playing celebration combo!');

        // ⭐ CHỈ PHÁT ÂM THANH CHÚC MỪNG CHÍNH (không phát file phụ để tránh lỗi 404)
        playSound(soundFiles.mainCelebration, 0.8);

        // TẮT hiệu ứng phụ để tránh lỗi 404
        // setTimeout(function () {
        //     playRandom('clapping', 0.3);
        // }, 500);
        // setTimeout(function () {
        //     playRandom('cheering', 0.3);
        // }, 1000);
    }

    // ========== PHÁT LIÊN TỤC ==========
    function playContinuousClapping(duration) {
        duration = duration || 3000; // 3 giây
        var interval = 300; // Vỗ tay mỗi 300ms
        var count = Math.floor(duration / interval);

        for (var i = 0; i < count; i++) {
            setTimeout(function (index) {
                return function () {
                    playRandom('clapping', 0.4 + Math.random() * 0.2);
                };
            }(i), i * interval);
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

        // Kiểm tra file chính (celebration.wav)
        var mainAudio = new Audio(soundFiles.mainCelebration);

        mainAudio.addEventListener('error', function () {
            console.warn('⚠️ Main celebration sound not found:', soundFiles.mainCelebration);
            console.log('💡 Add file: sounds/celebration.wav');
        });

        mainAudio.addEventListener('canplaythrough', function () {
            console.log('✅ Main celebration sound ready!');
        });

        mainAudio.load();

        // Kiểm tra file phụ (không log lỗi 404 nữa)
        var testFile = soundFiles.clapping[0];
        var audio = new Audio(testFile);

        audio.addEventListener('error', function () {
            // Im lặng - không log lỗi 404 cho file phụ
        });

        audio.addEventListener('canplaythrough', function () {
            console.log('✅ Additional sound effects available');
        });

        audio.load();
    }

    // ========== EXPORT ==========
    window.CelebrationSounds = {
        // ⭐ Phát âm thanh chúc mừng chính (file của bạn)
        playMainCelebration: function (vol) {
            playSound(soundFiles.mainCelebration, vol || 0.8);
        },

        // Phát âm thanh cụ thể
        playClapping: function (vol) { playRandom('clapping', vol); },
        playCheering: function (vol) { playRandom('cheering', vol); },
        playLaughing: function (vol) { playRandom('laughing', vol); },
        playPraise: function (vol) { playRandom('praise', vol); },

        // Phát combo (bao gồm âm thanh chính + hiệu ứng phụ)
        playCombo: playCelebrationCombo,
        playContinuousClapping: playContinuousClapping,

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

