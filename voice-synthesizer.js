/* ========================================
   VOICE SYNTHESIZER - Tổng hợp giọng nói
   Tạo giọng đọc nữ bằng Web Audio API
   ======================================== */

(function () {
    'use strict';

    console.log('🎤 Loading voice synthesizer...');

    var audioContext = null;
    var isEnabled = true;

    // ========== INIT AUDIO CONTEXT ==========
    function initAudioContext() {
        if (audioContext) return audioContext;

        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioContext = new AudioContext();
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        }
        return audioContext;
    }

    // ========== BẢNG PHÁT ÂM TIẾNG VIỆT ==========
    // Mỗi âm có tần số (Hz) và thời gian (giây)
    var vietnamesePhonemes = {
        // Nguyên âm đơn
        'a': { freq: 800, duration: 0.15 },
        'ă': { freq: 750, duration: 0.12 },
        'â': { freq: 700, duration: 0.15 },
        'e': { freq: 600, duration: 0.15 },
        'ê': { freq: 550, duration: 0.15 },
        'i': { freq: 400, duration: 0.15 },
        'o': { freq: 500, duration: 0.15 },
        'ô': { freq: 450, duration: 0.15 },
        'ơ': { freq: 480, duration: 0.15 },
        'u': { freq: 350, duration: 0.15 },
        'ư': { freq: 380, duration: 0.15 },
        'y': { freq: 400, duration: 0.15 },

        // Phụ âm
        'b': { freq: 200, duration: 0.08, type: 'noise' },
        'c': { freq: 2000, duration: 0.08, type: 'noise' },
        'd': { freq: 250, duration: 0.08, type: 'noise' },
        'đ': { freq: 280, duration: 0.08, type: 'noise' },
        'g': { freq: 300, duration: 0.08, type: 'noise' },
        'h': { freq: 1500, duration: 0.1, type: 'noise' },
        'k': { freq: 2000, duration: 0.08, type: 'noise' },
        'l': { freq: 400, duration: 0.1 },
        'm': { freq: 250, duration: 0.12 },
        'n': { freq: 300, duration: 0.12 },
        'p': { freq: 200, duration: 0.08, type: 'noise' },
        'q': { freq: 2000, duration: 0.08, type: 'noise' },
        'r': { freq: 350, duration: 0.1, vibrato: true },
        's': { freq: 3000, duration: 0.12, type: 'noise' },
        't': { freq: 2500, duration: 0.08, type: 'noise' },
        'v': { freq: 300, duration: 0.1, vibrato: true },
        'x': { freq: 3500, duration: 0.12, type: 'noise' }
    };

    // ========== TẠO ÂM THANH CHO 1 ÂM TIẾT ==========
    function createPhonemeSound(phoneme, startTime, pitch, volume) {
        if (!audioContext) return startTime;

        var config = vietnamesePhonemes[phoneme.toLowerCase()];
        if (!config) {
            // Nếu không có trong bảng, dùng mặc định
            config = { freq: 500, duration: 0.1 };
        }

        var duration = config.duration;
        var frequency = config.freq * pitch;

        if (config.type === 'noise') {
            // Tạo tiếng ồn cho phụ âm (s, t, k, c...)
            createNoiseSound(frequency, duration, startTime, volume);
        } else {
            // Tạo âm thanh cho nguyên âm
            var oscillator = audioContext.createOscillator();
            var gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, startTime);

            // Vibrato cho r, v
            if (config.vibrato) {
                var lfo = audioContext.createOscillator();
                var lfoGain = audioContext.createGain();
                lfo.frequency.value = 5; // 5Hz vibrato
                lfoGain.gain.value = 10; // Độ rung
                lfo.connect(lfoGain);
                lfoGain.connect(oscillator.frequency);
                lfo.start(startTime);
                lfo.stop(startTime + duration);
            }

            // Envelope (ADSR)
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02); // Attack
            gainNode.gain.linearRampToValueAtTime(volume * 0.8, startTime + duration * 0.3); // Decay
            gainNode.gain.setValueAtTime(volume * 0.8, startTime + duration * 0.7); // Sustain
            gainNode.gain.linearRampToValueAtTime(0, startTime + duration); // Release

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        }

        return startTime + duration;
    }

    // ========== TẠO TIẾNG ỒN (CHO PHỤ ÂM) ==========
    function createNoiseSound(frequency, duration, startTime, volume) {
        if (!audioContext) return;

        // Tạo white noise
        var bufferSize = audioContext.sampleRate * duration;
        var buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        var data = buffer.getChannelData(0);

        for (var i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        var noise = audioContext.createBufferSource();
        noise.buffer = buffer;

        // Filter để tạo âm thanh giống phụ âm
        var filter = audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = frequency;
        filter.Q.value = 5;

        var gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        noise.start(startTime);
    }

    // ========== PHÂN TÍCH VÀ ĐỌC TỪ ==========
    function speakWord(text, options) {
        if (!isEnabled) return;

        options = options || {};
        var pitch = options.pitch || 1.2; // Giọng nữ cao hơn
        var volume = options.volume || 0.3;
        var speed = options.speed || 1.0;

        initAudioContext();
        if (!audioContext) {
            console.error('❌ Audio Context not available');
            return;
        }

        // Unlock audio nếu cần
        if (window.AudioManager) {
            window.AudioManager.unlock();
        }

        var currentTime = audioContext.currentTime + 0.1;

        // Phân tích từng ký tự
        var chars = text.toLowerCase().split('');

        chars.forEach(function (char) {
            if (char === ' ') {
                currentTime += 0.1 / speed; // Khoảng trống
            } else {
                currentTime = createPhonemeSound(char, currentTime, pitch, volume);
                currentTime += 0.02 / speed; // Khoảng cách giữa các âm
            }
        });

        console.log('🎤 Synthesized:', text);

        // Callback
        if (options.onEnd) {
            var totalDuration = (currentTime - audioContext.currentTime) * 1000;
            setTimeout(options.onEnd, totalDuration);
        }
    }

    // ========== ĐỌC CÂU (NHIỀU TỪ) ==========
    function speakSentence(text, options) {
        if (!isEnabled) return;

        options = options || {};

        // Tách thành các từ
        var words = text.split(/\s+/);
        var currentDelay = 0;

        words.forEach(function (word, index) {
            setTimeout(function () {
                speakWord(word, {
                    pitch: options.pitch,
                    volume: options.volume,
                    speed: options.speed,
                    onEnd: function () {
                        if (index === words.length - 1 && options.onEnd) {
                            options.onEnd();
                        }
                    }
                });
            }, currentDelay);

            // Delay giữa các từ
            currentDelay += (word.length * 150) / (options.speed || 1.0);
        });
    }

    // ========== ĐỌC CHỮ CÁI (THEO CÁCH PHÁT ÂM VIỆT) ==========
    var letterPronunciation = {
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

    function speakLetter(letter, options) {
        var pronunciation = letterPronunciation[letter.toUpperCase()] || letter;
        speakWord(pronunciation, options);
    }

    // ========== GIỌNG NỮ CHÚC MỪNG ==========
    function speakCelebration(options) {
        options = options || {};

        // Tạo âm thanh vui vẻ, cao hơn
        var phrases = [
            { text: 'giỏi', pitch: 1.4, volume: 0.4 },
            { text: 'lắm', pitch: 1.5, volume: 0.4 }
        ];

        var delay = 0;
        phrases.forEach(function (phrase, index) {
            setTimeout(function () {
                speakWord(phrase.text, {
                    pitch: phrase.pitch,
                    volume: phrase.volume,
                    speed: 0.9,
                    onEnd: function () {
                        if (index === phrases.length - 1 && options.onEnd) {
                            options.onEnd();
                        }
                    }
                });
            }, delay);
            delay += 300;
        });
    }

    // ========== GIỌNG NỮ ĐỘNG VIÊN ==========
    function speakEncouragement(options) {
        var phrases = ['cố', 'lên'];
        var delay = 0;

        phrases.forEach(function (text, index) {
            setTimeout(function () {
                speakWord(text, {
                    pitch: 1.3,
                    volume: 0.35,
                    speed: 0.95,
                    onEnd: function () {
                        if (index === phrases.length - 1 && options.onEnd) {
                            options.onEnd();
                        }
                    }
                });
            }, delay);
            delay += 250;
        });
    }

    // ========== BẬT/TẮT ==========
    function enable() {
        isEnabled = true;
        console.log('✅ Voice synthesizer enabled');
    }

    function disable() {
        isEnabled = false;
        console.log('🔇 Voice synthesizer disabled');
    }

    // ========== EXPORT ==========
    window.VoiceSynthesizer = {
        // Đọc từ/câu
        speak: speakWord,
        speakWord: speakWord,
        speakSentence: speakSentence,
        speakLetter: speakLetter,

        // Giọng đặc biệt
        speakCelebration: speakCelebration,
        speakEncouragement: speakEncouragement,

        // Quản lý
        enable: enable,
        disable: disable,
        isEnabled: function () { return isEnabled; }
    };

    console.log('✅ Voice synthesizer ready!');

})();
