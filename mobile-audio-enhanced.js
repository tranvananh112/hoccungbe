<<<<<<< HEAD
/* ========================================
   MOBILE AUDIO ENHANCED - Âm thanh tối ưu cho mobile
   Hỗ trợ đầy đủ iOS, Android, giọng Việt tự nhiên
   ======================================== */

(function () {
    'use strict';

    console.log('🎵 Loading mobile audio enhanced...');

    var audioContext = null;
    var isAudioUnlocked = false;
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    var preferredVoice = null;
    var voicesLoaded = false;

    // ========== AUDIO CONTEXT SETUP ==========
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
            if (isAudioUnlocked) {
                resolve();
                return;
            }

            // Khởi tạo audio context
            initAudioContext();

            // Resume nếu bị suspended
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume().then(function () {
                    console.log('✅ Audio Context resumed');
                    isAudioUnlocked = true;

                    // Phát âm thanh im lặng để unlock hoàn toàn (iOS trick)
                    playSilentSound();

                    resolve();
                }).catch(function (err) {
                    console.error('❌ Failed to resume audio:', err);
                    resolve(); // Vẫn resolve để không block
                });
            } else {
                isAudioUnlocked = true;
                playSilentSound();
                resolve();
            }
        });
    }

    // Phát âm thanh im lặng để unlock audio trên iOS
    function playSilentSound() {
        if (!audioContext) return;

        try {
            var oscillator = audioContext.createOscillator();
            var gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.value = 0.001; // Rất nhỏ
            oscillator.frequency.value = 20; // Tần số thấp

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);

            console.log('🔇 Silent sound played for unlock');
        } catch (e) {
            console.warn('Silent sound failed:', e);
        }
    }

    // ========== LOAD VIETNAMESE VOICES ==========
    function loadVietnameseVoices() {
        return new Promise(function (resolve) {
            if (voicesLoaded && preferredVoice) {
                resolve(preferredVoice);
                return;
            }

            if (!window.speechSynthesis) {
                console.error('❌ Speech Synthesis not supported');
                resolve(null);
                return;
            }

            var loadVoices = function () {
                var voices = window.speechSynthesis.getVoices();

                if (voices.length === 0) {
                    console.warn('⚠️ No voices loaded yet');
                    return;
                }

                console.log('📢 Available voices:', voices.length);

                // ✅ ƯU TIÊN 1: Microsoft Hoa (giọng nữ Việt Nam tốt nhất)
                preferredVoice = voices.find(function (v) {
                    return (v.name.includes('Microsoft Hoa') || v.name.includes('Hoa')) &&
                        v.lang.startsWith('vi');
                });

                if (preferredVoice) {
                    console.log('✅ Giọng chính (Microsoft Hoa):', preferredVoice.name);
                } else {
                    // ✅ ƯU TIÊN 2: Bất kỳ giọng Microsoft tiếng Việt
                    preferredVoice = voices.find(function (v) {
                        return v.name.includes('Microsoft') && v.lang.startsWith('vi');
                    });

                    if (preferredVoice) {
                        console.log('✅ Giọng Microsoft:', preferredVoice.name);
                    } else {
                        // ✅ ƯU TIÊN 3: Google tiếng Việt
                        preferredVoice = voices.find(function (v) {
                            return v.name.includes('Google') && v.lang.startsWith('vi');
                        });

                        if (preferredVoice) {
                            console.log('⚠️ Giọng Google:', preferredVoice.name);
                        } else {
                            // ✅ FALLBACK: Bất kỳ giọng Việt nào
                            preferredVoice = voices.find(function (v) {
                                return v.lang.startsWith('vi');
                            });

                            if (preferredVoice) {
                                console.log('⚠️ Giọng Việt:', preferredVoice.name);
                            } else {
                                console.error('❌ KHÔNG TÌM THẤY GIỌNG VIỆT!');
                            }
                        }
                    }
                }

                voicesLoaded = true;
                resolve(preferredVoice);
            };

            // Load voices
            loadVoices();

            // iOS cần thời gian để load voices
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }

            // Retry sau 500ms nếu chưa load được
            setTimeout(function () {
                if (!voicesLoaded) {
                    loadVoices();
                }
            }, 500);

            // Timeout sau 2s
            setTimeout(function () {
                if (!voicesLoaded) {
                    console.warn('⚠️ Voice loading timeout');
                    voicesLoaded = true;
                    resolve(preferredVoice);
                }
            }, 2000);
        });
    }

    // ========== SPEAK VIETNAMESE WITH ENHANCED QUALITY ==========
    function speakVietnamese(text, options) {
        options = options || {};

        return new Promise(function (resolve, reject) {
            if (!text) {
                reject('No text provided');
                return;
            }

            if (!window.speechSynthesis) {
                console.error('❌ Speech Synthesis not supported');
                reject('Speech not supported');
                return;
            }

            // Unlock audio trước
            unlockAudio().then(function () {
                return loadVietnameseVoices();
            }).then(function (voice) {
                // Cancel speech hiện tại nếu priority = true
                if (options.priority) {
                    window.speechSynthesis.cancel();
                }

                var utterance = new SpeechSynthesisUtterance(text);

                // Cấu hình giọng
                utterance.lang = 'vi-VN';
                utterance.rate = options.rate || 0.95; // Chậm hơn một chút để rõ ràng
                utterance.pitch = options.pitch || 1.4; // Giọng nữ cao hơn
                utterance.volume = options.volume || 1.0; // Âm lượng tối đa

                // Sử dụng giọng đã chọn
                if (voice) {
                    utterance.voice = voice;
                }

                // Callbacks
                utterance.onstart = function () {
                    console.log('🔊 Bắt đầu đọc:', text);
                    if (options.onStart) options.onStart();
                };

                utterance.onend = function () {
                    console.log('✅ Đọc xong:', text);
                    if (options.onEnd) options.onEnd();
                    resolve();
                };

                utterance.onerror = function (e) {
                    console.error('❌ Lỗi đọc:', e);
                    if (options.onError) options.onError(e);
                    reject(e);
                };

                // Phát âm
                window.speechSynthesis.speak(utterance);

            }).catch(function (err) {
                console.error('❌ Speech error:', err);
                reject(err);
            });
        });
    }

    // ========== LETTER PRONUNCIATION ==========
    var letterPronunciationMap = {
        'A': 'a', 'Ă': 'ă', 'Â': 'â',
        'B': 'bờ', 'C': 'cờ', 'D': 'dờ', 'Đ': 'đờ',
        'E': 'e', 'Ê': 'ê',
        'G': 'gờ', 'H': 'hờ', 'I': 'i',
        'K': 'cờ', 'L': 'lờ', 'M': 'mờ', 'N': 'nờ',
        'O': 'o', 'Ô': 'ô', 'Ơ': 'ơ',
        'P': 'pờ', 'Q': 'cờ', 'R': 'rờ', 'S': 'sờ', 'T': 'tờ',
        'U': 'u', 'Ư': 'ư',
        'V': 'vờ', 'X': 'xờ', 'Y': 'i'
    };

    function getLetterPronunciation(letter) {
        var upper = letter.toUpperCase();
        return letterPronunciationMap[upper] || letter;
    }

    // ========== CONTINUOUS LETTER SOUND ==========
    var letterSoundActive = false;
    var letterSoundUtterance = null;

    function startLetterSound(letter) {
        stopLetterSound();

        var pronunciation = getLetterPronunciation(letter);
        letterSoundActive = true;

        console.log('🔊 Bắt đầu đọc liên tục:', pronunciation);

        function speakLoop() {
            if (!letterSoundActive) return;

            unlockAudio().then(function () {
                return loadVietnameseVoices();
            }).then(function (voice) {
                if (!letterSoundActive) return;

                var utterance = new SpeechSynthesisUtterance(pronunciation);
                utterance.lang = 'vi-VN';
                utterance.rate = 1.2;
                utterance.pitch = 1.4;
                utterance.volume = 1.0;

                if (voice) {
                    utterance.voice = voice;
                }

                utterance.onend = function () {
                    if (letterSoundActive) {
                        // Lặp lại ngay lập tức
                        setTimeout(speakLoop, 50);
                    }
                };

                utterance.onerror = function (e) {
                    console.error('❌ Letter sound error:', e);
                    if (letterSoundActive) {
                        setTimeout(speakLoop, 200);
                    }
                };

                letterSoundUtterance = utterance;
                window.speechSynthesis.speak(utterance);
            });
        }

        speakLoop();
    }

    function stopLetterSound() {
        console.log('⏹️ Dừng đọc chữ');

        letterSoundActive = false;

        if (letterSoundUtterance) {
            letterSoundUtterance.onend = null;
            letterSoundUtterance = null;
        }

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }

    // ========== SOUND EFFECTS ==========
    function playSound(type, volume) {
        volume = volume || 0.3;

        return unlockAudio().then(function () {
            if (!audioContext) return;

            var oscillator = audioContext.createOscillator();
            var gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            var sounds = {
                click: { freq: 800, dur: 0.1 },
                correct: { freq: 880, dur: 0.15, type: 'sine' },
                wrong: { freq: 300, dur: 0.2, type: 'sawtooth' },
                success: { freq: 1000, dur: 0.3, type: 'sine' },
                coin: { freq: 1200, dur: 0.2, type: 'sine' },
                star: { freq: 1500, dur: 0.25, type: 'sine' }
            };

            var sound = sounds[type] || sounds.click;

            oscillator.type = sound.type || 'sine';
            oscillator.frequency.value = sound.freq;

            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.dur);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + sound.dur);

            console.log('🔊 Sound:', type);
        }).catch(function (err) {
            console.warn('Sound failed:', err);
        });
    }

    // ========== HAPTIC FEEDBACK (iOS/Android) ==========
    function hapticFeedback(type) {
        type = type || 'light';

        // iOS Haptic Engine
        if (window.navigator && window.navigator.vibrate) {
            var patterns = {
                light: [10],
                medium: [20],
                heavy: [30],
                success: [10, 50, 10],
                error: [20, 100, 20]
            };
            window.navigator.vibrate(patterns[type] || patterns.light);
        }

        // Taptic Engine (iOS 10+)
        if (window.TapticEngine) {
            window.TapticEngine.impact({
                style: type === 'heavy' ? 'heavy' : type === 'medium' ? 'medium' : 'light'
            });
        }
    }

    // ========== AUTO UNLOCK ON USER INTERACTION ==========
    function setupAutoUnlock() {
        var events = ['touchstart', 'touchend', 'click', 'keydown'];
        var unlocked = false;

        var unlockHandler = function () {
            if (unlocked) return;

            console.log('🔓 Auto unlocking audio...');

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

    // ========== PRELOAD VOICES ==========
    function preloadVoices() {
        console.log('📢 Preloading voices...');
        loadVietnameseVoices().then(function (voice) {
            if (voice) {
                console.log('✅ Voice preloaded:', voice.name);
            }
        });
    }

    // ========== EXPORT API ==========
    window.MobileAudioEnhanced = {
        unlock: unlockAudio,
        speak: speakVietnamese,
        startLetterSound: startLetterSound,
        stopLetterSound: stopLetterSound,
        playSound: playSound,
        haptic: hapticFeedback,
        isUnlocked: function () { return isAudioUnlocked; },
        getVoice: function () { return preferredVoice; },
        isMobile: isMobile,
        isIOS: isIOS
    };

    // ========== AUTO INIT ==========
    function init() {
        console.log('🎵 Mobile Audio Enhanced initializing...');
        console.log('📱 Device:', isMobile ? 'Mobile' : 'Desktop', isIOS ? '(iOS)' : '');

        initAudioContext();
        setupAutoUnlock();
        preloadVoices();

        console.log('✅ Mobile Audio Enhanced ready!');
    }

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
=======
/* ========================================
   MOBILE AUDIO ENHANCED - Âm thanh tối ưu cho mobile
   Hỗ trợ đầy đủ iOS, Android, giọng Việt tự nhiên
   ======================================== */

(function () {
    'use strict';

    console.log('🎵 Loading mobile audio enhanced...');

    var audioContext = null;
    var isAudioUnlocked = false;
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    var preferredVoice = null;
    var voicesLoaded = false;

    // ========== AUDIO CONTEXT SETUP ==========
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
            if (isAudioUnlocked) {
                resolve();
                return;
            }

            // Khởi tạo audio context
            initAudioContext();

            // Resume nếu bị suspended
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume().then(function () {
                    console.log('✅ Audio Context resumed');
                    isAudioUnlocked = true;

                    // Phát âm thanh im lặng để unlock hoàn toàn (iOS trick)
                    playSilentSound();

                    resolve();
                }).catch(function (err) {
                    console.error('❌ Failed to resume audio:', err);
                    resolve(); // Vẫn resolve để không block
                });
            } else {
                isAudioUnlocked = true;
                playSilentSound();
                resolve();
            }
        });
    }

    // Phát âm thanh im lặng để unlock audio trên iOS
    function playSilentSound() {
        if (!audioContext) return;

        try {
            var oscillator = audioContext.createOscillator();
            var gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.value = 0.001; // Rất nhỏ
            oscillator.frequency.value = 20; // Tần số thấp

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);

            console.log('🔇 Silent sound played for unlock');
        } catch (e) {
            console.warn('Silent sound failed:', e);
        }
    }

    // ========== LOAD VIETNAMESE VOICES ==========
    function loadVietnameseVoices() {
        return new Promise(function (resolve) {
            if (voicesLoaded && preferredVoice) {
                resolve(preferredVoice);
                return;
            }

            if (!window.speechSynthesis) {
                console.error('❌ Speech Synthesis not supported');
                resolve(null);
                return;
            }

            var loadVoices = function () {
                var voices = window.speechSynthesis.getVoices();

                if (voices.length === 0) {
                    console.warn('⚠️ No voices loaded yet');
                    return;
                }

                console.log('📢 Available voices:', voices.length);

                // ✅ ƯU TIÊN 1: Microsoft Hoa (giọng nữ Việt Nam tốt nhất)
                preferredVoice = voices.find(function (v) {
                    return (v.name.includes('Microsoft Hoa') || v.name.includes('Hoa')) &&
                        v.lang.startsWith('vi');
                });

                if (preferredVoice) {
                    console.log('✅ Giọng chính (Microsoft Hoa):', preferredVoice.name);
                } else {
                    // ✅ ƯU TIÊN 2: Bất kỳ giọng Microsoft tiếng Việt
                    preferredVoice = voices.find(function (v) {
                        return v.name.includes('Microsoft') && v.lang.startsWith('vi');
                    });

                    if (preferredVoice) {
                        console.log('✅ Giọng Microsoft:', preferredVoice.name);
                    } else {
                        // ✅ ƯU TIÊN 3: Google tiếng Việt
                        preferredVoice = voices.find(function (v) {
                            return v.name.includes('Google') && v.lang.startsWith('vi');
                        });

                        if (preferredVoice) {
                            console.log('⚠️ Giọng Google:', preferredVoice.name);
                        } else {
                            // ✅ FALLBACK: Bất kỳ giọng Việt nào
                            preferredVoice = voices.find(function (v) {
                                return v.lang.startsWith('vi');
                            });

                            if (preferredVoice) {
                                console.log('⚠️ Giọng Việt:', preferredVoice.name);
                            } else {
                                console.error('❌ KHÔNG TÌM THẤY GIỌNG VIỆT!');
                            }
                        }
                    }
                }

                voicesLoaded = true;
                resolve(preferredVoice);
            };

            // Load voices
            loadVoices();

            // iOS cần thời gian để load voices
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }

            // Retry sau 500ms nếu chưa load được
            setTimeout(function () {
                if (!voicesLoaded) {
                    loadVoices();
                }
            }, 500);

            // Timeout sau 2s
            setTimeout(function () {
                if (!voicesLoaded) {
                    console.warn('⚠️ Voice loading timeout');
                    voicesLoaded = true;
                    resolve(preferredVoice);
                }
            }, 2000);
        });
    }

    // ========== SPEAK VIETNAMESE WITH ENHANCED QUALITY ==========
    function speakVietnamese(text, options) {
        options = options || {};

        return new Promise(function (resolve, reject) {
            if (!text) {
                reject('No text provided');
                return;
            }

            if (!window.speechSynthesis) {
                console.error('❌ Speech Synthesis not supported');
                reject('Speech not supported');
                return;
            }

            // Unlock audio trước
            unlockAudio().then(function () {
                return loadVietnameseVoices();
            }).then(function (voice) {
                // Cancel speech hiện tại nếu priority = true
                if (options.priority) {
                    window.speechSynthesis.cancel();
                }

                var utterance = new SpeechSynthesisUtterance(text);

                // Cấu hình giọng
                utterance.lang = 'vi-VN';
                utterance.rate = options.rate || 0.95; // Chậm hơn một chút để rõ ràng
                utterance.pitch = options.pitch || 1.4; // Giọng nữ cao hơn
                utterance.volume = options.volume || 1.0; // Âm lượng tối đa

                // Sử dụng giọng đã chọn
                if (voice) {
                    utterance.voice = voice;
                }

                // Callbacks
                utterance.onstart = function () {
                    console.log('🔊 Bắt đầu đọc:', text);
                    if (options.onStart) options.onStart();
                };

                utterance.onend = function () {
                    console.log('✅ Đọc xong:', text);
                    if (options.onEnd) options.onEnd();
                    resolve();
                };

                utterance.onerror = function (e) {
                    console.error('❌ Lỗi đọc:', e);
                    if (options.onError) options.onError(e);
                    reject(e);
                };

                // Phát âm
                window.speechSynthesis.speak(utterance);

            }).catch(function (err) {
                console.error('❌ Speech error:', err);
                reject(err);
            });
        });
    }

    // ========== LETTER PRONUNCIATION ==========
    var letterPronunciationMap = {
        'A': 'a', 'Ă': 'ă', 'Â': 'â',
        'B': 'bờ', 'C': 'cờ', 'D': 'dờ', 'Đ': 'đờ',
        'E': 'e', 'Ê': 'ê',
        'G': 'gờ', 'H': 'hờ', 'I': 'i',
        'K': 'cờ', 'L': 'lờ', 'M': 'mờ', 'N': 'nờ',
        'O': 'o', 'Ô': 'ô', 'Ơ': 'ơ',
        'P': 'pờ', 'Q': 'cờ', 'R': 'rờ', 'S': 'sờ', 'T': 'tờ',
        'U': 'u', 'Ư': 'ư',
        'V': 'vờ', 'X': 'xờ', 'Y': 'i'
    };

    function getLetterPronunciation(letter) {
        var upper = letter.toUpperCase();
        return letterPronunciationMap[upper] || letter;
    }

    // ========== CONTINUOUS LETTER SOUND ==========
    var letterSoundActive = false;
    var letterSoundUtterance = null;

    function startLetterSound(letter) {
        stopLetterSound();

        var pronunciation = getLetterPronunciation(letter);
        letterSoundActive = true;

        console.log('🔊 Bắt đầu đọc liên tục:', pronunciation);

        function speakLoop() {
            if (!letterSoundActive) return;

            unlockAudio().then(function () {
                return loadVietnameseVoices();
            }).then(function (voice) {
                if (!letterSoundActive) return;

                var utterance = new SpeechSynthesisUtterance(pronunciation);
                utterance.lang = 'vi-VN';
                utterance.rate = 1.2;
                utterance.pitch = 1.4;
                utterance.volume = 1.0;

                if (voice) {
                    utterance.voice = voice;
                }

                utterance.onend = function () {
                    if (letterSoundActive) {
                        // Lặp lại ngay lập tức
                        setTimeout(speakLoop, 50);
                    }
                };

                utterance.onerror = function (e) {
                    console.error('❌ Letter sound error:', e);
                    if (letterSoundActive) {
                        setTimeout(speakLoop, 200);
                    }
                };

                letterSoundUtterance = utterance;
                window.speechSynthesis.speak(utterance);
            });
        }

        speakLoop();
    }

    function stopLetterSound() {
        console.log('⏹️ Dừng đọc chữ');

        letterSoundActive = false;

        if (letterSoundUtterance) {
            letterSoundUtterance.onend = null;
            letterSoundUtterance = null;
        }

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }

    // ========== SOUND EFFECTS ==========
    function playSound(type, volume) {
        volume = volume || 0.3;

        return unlockAudio().then(function () {
            if (!audioContext) return;

            var oscillator = audioContext.createOscillator();
            var gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            var sounds = {
                click: { freq: 800, dur: 0.1 },
                correct: { freq: 880, dur: 0.15, type: 'sine' },
                wrong: { freq: 300, dur: 0.2, type: 'sawtooth' },
                success: { freq: 1000, dur: 0.3, type: 'sine' },
                coin: { freq: 1200, dur: 0.2, type: 'sine' },
                star: { freq: 1500, dur: 0.25, type: 'sine' }
            };

            var sound = sounds[type] || sounds.click;

            oscillator.type = sound.type || 'sine';
            oscillator.frequency.value = sound.freq;

            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.dur);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + sound.dur);

            console.log('🔊 Sound:', type);
        }).catch(function (err) {
            console.warn('Sound failed:', err);
        });
    }

    // ========== HAPTIC FEEDBACK (iOS/Android) ==========
    function hapticFeedback(type) {
        type = type || 'light';

        // iOS Haptic Engine
        if (window.navigator && window.navigator.vibrate) {
            var patterns = {
                light: [10],
                medium: [20],
                heavy: [30],
                success: [10, 50, 10],
                error: [20, 100, 20]
            };
            window.navigator.vibrate(patterns[type] || patterns.light);
        }

        // Taptic Engine (iOS 10+)
        if (window.TapticEngine) {
            window.TapticEngine.impact({
                style: type === 'heavy' ? 'heavy' : type === 'medium' ? 'medium' : 'light'
            });
        }
    }

    // ========== AUTO UNLOCK ON USER INTERACTION ==========
    function setupAutoUnlock() {
        var events = ['touchstart', 'touchend', 'click', 'keydown'];
        var unlocked = false;

        var unlockHandler = function () {
            if (unlocked) return;

            console.log('🔓 Auto unlocking audio...');

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

    // ========== PRELOAD VOICES ==========
    function preloadVoices() {
        console.log('📢 Preloading voices...');
        loadVietnameseVoices().then(function (voice) {
            if (voice) {
                console.log('✅ Voice preloaded:', voice.name);
            }
        });
    }

    // ========== EXPORT API ==========
    window.MobileAudioEnhanced = {
        unlock: unlockAudio,
        speak: speakVietnamese,
        startLetterSound: startLetterSound,
        stopLetterSound: stopLetterSound,
        playSound: playSound,
        haptic: hapticFeedback,
        isUnlocked: function () { return isAudioUnlocked; },
        getVoice: function () { return preferredVoice; },
        isMobile: isMobile,
        isIOS: isIOS
    };

    // ========== AUTO INIT ==========
    function init() {
        console.log('🎵 Mobile Audio Enhanced initializing...');
        console.log('📱 Device:', isMobile ? 'Mobile' : 'Desktop', isIOS ? '(iOS)' : '');

        initAudioContext();
        setupAutoUnlock();
        preloadVoices();

        console.log('✅ Mobile Audio Enhanced ready!');
    }

    // Auto init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
>>>>>>> 24c03eda35bab541d2f3fd43d47c2f7b5555ba3f
