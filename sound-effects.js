/* ========================================
   SOUND EFFECTS - Hiệu ứng âm thanh
   ======================================== */

(function () {
    'use strict';

    console.log('🔊 Loading sound effects...');

    // ========== SOUND GENERATOR ==========
    function createSoundEffect(type, volume) {
        volume = volume || 0.3;

        // Unlock audio nếu cần
        if (window.AudioManager) {
            window.AudioManager.unlock();
        }

        try {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            var ctx = new AudioContext();

            // Resume nếu bị suspend
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            switch (type) {
                case 'applause':
                    createApplauseSound(ctx, volume);
                    break;
                case 'firework':
                    createFireworkSound(ctx, volume);
                    break;
                case 'cheer':
                    createCheerSound(ctx, volume);
                    break;
                case 'magic':
                    createMagicSound(ctx, volume);
                    break;
                case 'pop':
                    createPopSound(ctx, volume);
                    break;
                case 'sparkle':
                    createSparkleSound(ctx, volume);
                    break;
            }
        } catch (e) {
            console.warn('Sound effect error:', e);
        }
    }

    function createApplauseSound(ctx, volume) {
        // Tạo tiếng vỗ tay
        for (var i = 0; i < 20; i++) {
            setTimeout(function (index) {
                return function () {
                    var noise = ctx.createBufferSource();
                    var buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
                    var data = buffer.getChannelData(0);
                    for (var j = 0; j < data.length; j++) {
                        data[j] = Math.random() * 2 - 1;
                    }
                    noise.buffer = buffer;

                    var filter = ctx.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.value = 1000 + Math.random() * 500;

                    var gain = ctx.createGain();
                    gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);

                    noise.start();
                    noise.stop(ctx.currentTime + 0.05);
                };
            }(i), i * 50);
        }
    }

    function createFireworkSound(ctx, volume) {
        // Tiếng pháo bông
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);

        // Thêm tiếng nổ
        setTimeout(function () {
            var noise = ctx.createBufferSource();
            var buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
            var data = buffer.getChannelData(0);
            for (var i = 0; i < data.length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
            }
            noise.buffer = buffer;

            var noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(volume * 0.8, ctx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

            noise.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noise.start();
        }, 100);
    }

    function createCheerSound(ctx, volume) {
        // Tiếng reo hò
        for (var i = 0; i < 3; i++) {
            setTimeout(function (index) {
                return function () {
                    var osc = ctx.createOscillator();
                    var gain = ctx.createGain();

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.frequency.setValueAtTime(400 + index * 200, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(800 + index * 200, ctx.currentTime + 0.2);

                    gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

                    osc.start();
                    osc.stop(ctx.currentTime + 0.2);
                };
            }(i), i * 100);
        }
    }

    function createMagicSound(ctx, volume) {
        // Tiếng phép thuật
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }

    function createPopSound(ctx, volume) {
        // Tiếng bốp
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }

    function createSparkleSound(ctx, volume) {
        // Tiếng lấp lánh
        for (var i = 0; i < 5; i++) {
            setTimeout(function (index) {
                return function () {
                    var osc = ctx.createOscillator();
                    var gain = ctx.createGain();

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    var freq = 1000 + Math.random() * 1000;
                    osc.frequency.setValueAtTime(freq, ctx.currentTime);

                    gain.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

                    osc.start();
                    osc.stop(ctx.currentTime + 0.1);
                };
            }(i), i * 50);
        }
    }

    // Export to global
    window.SoundEffects = {
        play: createSoundEffect,
        applause: function (vol) { createSoundEffect('applause', vol); },
        firework: function (vol) { createSoundEffect('firework', vol); },
        cheer: function (vol) { createSoundEffect('cheer', vol); },
        magic: function (vol) { createSoundEffect('magic', vol); },
        pop: function (vol) { createSoundEffect('pop', vol); },
        sparkle: function (vol) { createSoundEffect('sparkle', vol); }
    };

    console.log('✅ Sound effects ready!');

})();
