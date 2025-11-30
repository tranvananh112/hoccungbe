<<<<<<< HEAD
/* ========================================
   AUDIO MANAGER - Quản lý âm thanh cho mobile
   ======================================== */

(function () {
    'use strict';

    console.log('🔊 Loading audio manager...');

    var audioContext = null;
    var isAudioUnlocked = false;
    var pendingAudios = [];

    // Unlock audio context (cần cho iOS/mobile)
    function unlockAudioContext() {
        if (isAudioUnlocked) return Promise.resolve();

        return new Promise(function (resolve) {
            // Tạo audio context
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext && !audioContext) {
                audioContext = new AudioContext();
            }

            // Resume audio context nếu bị suspend
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume().then(function () {
                    isAudioUnlocked = true;
                    console.log('✅ Audio unlocked!');
                    resolve();
                });
            } else {
                isAudioUnlocked = true;
                resolve();
            }
        });
    }

    // Play audio với retry
    function playAudioSafe(audio) {
        if (!audio) return Promise.reject('No audio');

        // Kiểm tra xem audio có source hợp lệ không
        if (!audio.src || audio.src === '' || audio.src === window.location.href) {
            console.warn('Audio has invalid source:', audio.src);
            return Promise.reject('Invalid audio source');
        }

        return unlockAudioContext().then(function () {
            return audio.play();
        }).catch(function (error) {
            // Chỉ log warning nếu không phải lỗi 404
            if (error.name !== 'NotSupportedError') {
                console.warn('Audio play failed:', error.name, error.message);
            }
            // Thêm vào queue để thử lại sau nếu chưa unlock
            if (!isAudioUnlocked && error.name === 'NotAllowedError') {
                pendingAudios.push(audio);
            }
            return Promise.reject(error);
        });
    }


    // Play pending audios
    function playPendingAudios() {
        if (pendingAudios.length > 0) {
            console.log('Playing', pendingAudios.length, 'pending audios');
            pendingAudios.forEach(function (audio) {
                playAudioSafe(audio);
            });
            pendingAudios = [];
        }
    }

    // Setup unlock listeners
    function setupUnlockListeners() {
        var events = ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'];
        var unlockHandler = function () {
            unlockAudioContext().then(function () {
                playPendingAudios();
                // Remove listeners sau khi unlock
                events.forEach(function (event) {
                    document.removeEventListener(event, unlockHandler);
                });
            });
        };

        events.forEach(function (event) {
            document.addEventListener(event, unlockHandler, { once: true, passive: true });
        });
    }

    // Export
    window.AudioManager = {
        unlock: unlockAudioContext,
        play: playAudioSafe,
        isUnlocked: function () { return isAudioUnlocked; },
        getContext: function () { return audioContext; }
    };

    // Auto setup
    setupUnlockListeners();

    console.log('✅ Audio manager loaded');

})();
=======
/* ========================================
   AUDIO MANAGER - Quản lý âm thanh cho mobile
   ======================================== */

(function () {
    'use strict';

    console.log('🔊 Loading audio manager...');

    var audioContext = null;
    var isAudioUnlocked = false;
    var pendingAudios = [];

    // Unlock audio context (cần cho iOS/mobile)
    function unlockAudioContext() {
        if (isAudioUnlocked) return Promise.resolve();

        return new Promise(function (resolve) {
            // Tạo audio context
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext && !audioContext) {
                audioContext = new AudioContext();
            }

            // Resume audio context nếu bị suspend
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume().then(function () {
                    isAudioUnlocked = true;
                    console.log('✅ Audio unlocked!');
                    resolve();
                });
            } else {
                isAudioUnlocked = true;
                resolve();
            }
        });
    }

    // Play audio với retry
    function playAudioSafe(audio) {
        if (!audio) return Promise.reject('No audio');

        // Kiểm tra xem audio có source hợp lệ không
        if (!audio.src || audio.src === '' || audio.src === window.location.href) {
            console.warn('Audio has invalid source:', audio.src);
            return Promise.reject('Invalid audio source');
        }

        return unlockAudioContext().then(function () {
            return audio.play();
        }).catch(function (error) {
            // Chỉ log warning nếu không phải lỗi 404
            if (error.name !== 'NotSupportedError') {
                console.warn('Audio play failed:', error.name, error.message);
            }
            // Thêm vào queue để thử lại sau nếu chưa unlock
            if (!isAudioUnlocked && error.name === 'NotAllowedError') {
                pendingAudios.push(audio);
            }
            return Promise.reject(error);
        });
    }


    // Play pending audios
    function playPendingAudios() {
        if (pendingAudios.length > 0) {
            console.log('Playing', pendingAudios.length, 'pending audios');
            pendingAudios.forEach(function (audio) {
                playAudioSafe(audio);
            });
            pendingAudios = [];
        }
    }

    // Setup unlock listeners
    function setupUnlockListeners() {
        var events = ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'];
        var unlockHandler = function () {
            unlockAudioContext().then(function () {
                playPendingAudios();
                // Remove listeners sau khi unlock
                events.forEach(function (event) {
                    document.removeEventListener(event, unlockHandler);
                });
            });
        };

        events.forEach(function (event) {
            document.addEventListener(event, unlockHandler, { once: true, passive: true });
        });
    }

    // Export
    window.AudioManager = {
        unlock: unlockAudioContext,
        play: playAudioSafe,
        isUnlocked: function () { return isAudioUnlocked; },
        getContext: function () { return audioContext; }
    };

    // Auto setup
    setupUnlockListeners();

    console.log('✅ Audio manager loaded');

})();
>>>>>>> 24c03eda35bab541d2f3fd43d47c2f7b5555ba3f
