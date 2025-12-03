/* ========================================
   MOBILE AUDIO PLAYER - Phát âm thanh file trên mobile
   Hỗ trợ iOS, Android, PWA với unlock tự động
   ======================================== */

(function () {
    'use strict';

    console.log('📱 Loading Mobile Audio Player...');

    // ========== CONFIGURATION ==========
    var config = {
        preloadOnInit: true,
        unlockOnFirstTouch: true,
        maxRetries: 3,
        retryDelay: 500,
        defaultVolume: 0.7
    };

    // ========== STATE ==========
    var audioContext = null;
    var isUnlocked = false;
    var audioCache = {};
    var activeSounds = [];
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // ========== INIT AUDIO CONTEXT ==========
    function initAudioContext() {
        if (audioContext) return audioContext;

        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioContext = new AudioContext();
            console.log('✅ Audio Context created:', audioContext.state);
        }
        return audioContext;
    }

    // ========== UNLOCK AUDIO (iOS/Android) ==========
    function unlockAudio() {
        return new Promise(function (resolve) {
            if (isUnlocked) {
                resolve();
                return;
            }

            console.log('🔓 Unlocking audio for mobile...');

            // 1. Init Audio Context
            initAudioContext();

            if (!audioContext) {
                console.error('❌ Cannot create Audio Context');
                resolve();
                return;
            }

            // 2. Resume if suspended
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(function () {
                    console.log('✅ Audio Context resumed');
                    isUnlocked = true;
                    playSilentSound();
                    resolve();
                }).catch(function (err) {
                    console.error('❌ Failed to resume:', err);
                    resolve();
                });
            } else {
                isUnlocked = true;
                playSilentSound();
                resolve();
            }
        });
    }

    // ========== PLAY SILENT SOUND (iOS TRICK) ==========
    function playSilentSound() {
        if (!audioContext) return;

        try {
            // Method 1: Oscillator
            var oscillator = audioContext.createOscillator();
            var gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.value = 0.001;
            oscillator.frequency.value = 20;

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);

            // Method 2: Silent Audio Element
            var silentAudio = new Audio();
            silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            silentAudio.volume = 0.01;
            silentAudio.play().catch(function () { });

            console.log('🔇 Silent sound played for unlock');
        } catch (e) {
            console.warn('Silent sound failed:', e);
        }
    }

    // ========== PRELOAD AUDIO FILE ==========
    function preloadAudio(url) {
        return new Promise(function (resolve, reject) {
            if (audioCache[url]) {
                resolve(audioCache[url]);
                return;
            }

            console.log('📥 Preloading:', url);

            var audio = new Audio();
            audio.preload = 'auto';
            audio.crossOrigin = 'anonymous';

            // Success handler
            audio.addEventListener('canplaythrough', function () {
                console.log('✅ Loaded:', url);
                audioCache[url] = audio;
                resolve(audio);
            }, { once: true });

            // Error handler
            audio.addEventListener('error', function (e) {
                console.warn('⚠️ Failed to load:', url, e);
                audioCache[url] = null; // Mark as failed
                reject(e);
            }, { once: true });

            // Set source and load
            audio.src = url;
            audio.load();
        });
    }

    // ========== PLAY AUDIO FILE ==========
    function playAudio(url, options) {
        options = options || {};
        var volume = options.volume !== undefined ? options.volume : config.defaultVolume;
        var loop = options.loop || false;
        var onEnd = options.onEnd || null;
        var onError = options.onError || null;

        return new Promise(function (resolve, reject) {
            // Unlock audio first
            unlockAudio().then(function () {
                // Get from cache or create new
                var audio = audioCache[url];

                if (audio === null) {
                    // Previously failed to load
                    console.warn('⚠️ Audio file not available:', url);
                    if (onError) onError(new Error('File not found'));
                    reject(new Error('File not found'));
                    return;
                }

                if (!audio) {
                    // Not in cache, create new
                    audio = new Audio();
                    audio.crossOrigin = 'anonymous';
                    audio.src = url;
                    audioCache[url] = audio;
                }

                // Clone for concurrent playback
                var sound = audio.cloneNode();
                sound.volume = volume;
                sound.loop = loop;

                // Track active sound
                activeSounds.push(sound);

                // Event handlers
                sound.addEventListener('ended', function () {
                    // Remove from active sounds
                    var index = activeSounds.indexOf(sound);
                    if (index > -1) {
                        activeSounds.splice(index, 1);
                    }

                    if (onEnd) onEnd();
                    resolve();
                }, { once: true });

                sound.addEventListener('error', function (e) {
                    console.error('❌ Play error:', url, e);
                    audioCache[url] = null; // Mark as failed

                    // Remove from active sounds
                    var index = activeSounds.indexOf(sound);
                    if (index > -1) {
                        activeSounds.splice(index, 1);
                    }

                    if (onError) onError(e);
                    reject(e);
                }, { once: true });

                // Play
                sound.play().then(function () {
                    console.log('▶️ Playing:', url);
                }).catch(function (err) {
                    console.error('❌ Play failed:', url, err);

                    // Remove from active sounds
                    var index = activeSounds.indexOf(sound);
                    if (index > -1) {
                        activeSounds.splice(index, 1);
                    }

                    if (onError) onError(err);
                    reject(err);
                });

            }).catch(function (err) {
                if (onError) onError(err);
                reject(err);
            });
        });
    }

    // ========== PLAY WITH RETRY ==========
    function playWithRetry(url, options, retries) {
        retries = retries || 0;

        return playAudio(url, options).catch(function (err) {
            if (retries < config.maxRetries) {
                console.log('🔄 Retrying... (' + (retries + 1) + '/' + config.maxRetries + ')');
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve(playWithRetry(url, options, retries + 1));
                    }, config.retryDelay);
                });
            } else {
                console.error('❌ Max retries reached for:', url);
                throw err;
            }
        });
    }

    // ========== STOP ALL SOUNDS ==========
    function stopAll() {
        console.log('⏹️ Stopping all sounds...');

        activeSounds.forEach(function (sound) {
            try {
                sound.pause();
                sound.currentTime = 0;
            } catch (e) {
                // Ignore errors
            }
        });

        activeSounds = [];
        console.log('✅ All sounds stopped');
    }

    // ========== STOP SPECIFIC SOUND ==========
    function stopSound(url) {
        activeSounds.forEach(function (sound) {
            if (sound.src.includes(url)) {
                try {
                    sound.pause();
                    sound.currentTime = 0;
                } catch (e) {
                    // Ignore
                }
            }
        });
    }

    // ========== PRELOAD MULTIPLE FILES ==========
    function preloadMultiple(urls) {
        console.log('📥 Preloading ' + urls.length + ' files...');

        var promises = urls.map(function (url) {
            return preloadAudio(url).catch(function () {
                // Ignore individual failures
                return null;
            });
        });

        return Promise.all(promises).then(function () {
            console.log('✅ Preload complete');
        });
    }

    // ========== AUTO UNLOCK ON USER INTERACTION ==========
    function setupAutoUnlock() {
        if (!config.unlockOnFirstTouch) return;

        var events = ['touchstart', 'touchend', 'click', 'keydown'];
        var unlocked = false;

        var unlockHandler = function () {
            if (unlocked) return;

            console.log('🔓 Auto unlocking on user interaction...');

            unlockAudio().then(function () {
                unlocked = true;
                console.log('✅ Audio auto-unlocked');

                // Remove listeners
                events.forEach(function (event) {
                    document.removeEventListener(event, unlockHandler);
                });
            });
        };

        events.forEach(function (event) {
            document.addEventListener(event, unlockHandler, { once: true, passive: true });
        });
    }

    // ========== CHECK FILE EXISTS ==========
    function checkFileExists(url) {
        return new Promise(function (resolve) {
            var audio = new Audio();

            audio.addEventListener('canplaythrough', function () {
                resolve(true);
            }, { once: true });

            audio.addEventListener('error', function () {
                resolve(false);
            }, { once: true });

            audio.src = url;
            audio.load();
        });
    }

    // ========== EXPORT API ==========
    window.MobileAudioPlayer = {
        // Core functions
        play: playAudio,
        playWithRetry: playWithRetry,
        stop: stopSound,
        stopAll: stopAll,

        // Preload
        preload: preloadAudio,
        preloadMultiple: preloadMultiple,

        // Unlock
        unlock: unlockAudio,
        isUnlocked: function () { return isUnlocked; },

        // Utilities
        checkExists: checkFileExists,
        getCache: function () { return audioCache; },
        getActiveSounds: function () { return activeSounds; },

        // Device info
        isMobile: isMobile,
        isIOS: isIOS
    };

    // ========== AUTO INIT ==========
    function init() {
        console.log('📱 Mobile Audio Player initializing...');
        console.log('📱 Device:', isMobile ? 'Mobile' : 'Desktop', isIOS ? '(iOS)' : '');

        initAudioContext();
        setupAutoUnlock();

        // Preload common sounds if configured
        if (config.preloadOnInit) {
            setTimeout(function () {
                var commonSounds = [
                    'sounds/celebration.wav',
                    'sounds/chinhxac.wav',
                    'sounds/saidapan.wav'
                ];

                preloadMultiple(commonSounds).catch(function () {
                    console.warn('⚠️ Some sounds failed to preload');
                });
            }, 1000);
        }

        console.log('✅ Mobile Audio Player ready!');
    }

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
