<<<<<<< HEAD
/* ========================================
   ANIMAL SOUNDS - Tiếng động vật
   ======================================== */

(function () {
    'use strict';

    console.log('🐾 Loading animal sounds...');

    // Tạo tiếng động vật bằng Web Audio API
    function createAnimalSound(type) {
        try {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            var ctx = new AudioContext();

            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            switch (type) {
                case 'dog':
                    createDogSound(ctx);
                    break;
                case 'cat':
                    createCatSound(ctx);
                    break;
                case 'bird':
                    createBirdSound(ctx);
                    break;
                case 'cow':
                    createCowSound(ctx);
                    break;
                case 'sheep':
                    createSheepSound(ctx);
                    break;
                default:
                    createGenericSound(ctx);
            }
        } catch (e) {
            console.warn('Animal sound error:', e);
        }
    }

    function createDogSound(ctx) {
        // Tiếng chó sủa: "Woof!"
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }

    function createCatSound(ctx) {
        // Tiếng mèo kêu: "Meow"
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    }

    function createBirdSound(ctx) {
        // Tiếng chim hót
        for (var i = 0; i < 3; i++) {
            setTimeout(function (index) {
                return function () {
                    var osc = ctx.createOscillator();
                    var gain = ctx.createGain();

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.frequency.setValueAtTime(1000 + index * 200, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(1500 + index * 200, ctx.currentTime + 0.05);

                    gain.gain.setValueAtTime(0.2, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

                    osc.start();
                    osc.stop(ctx.currentTime + 0.08);
                };
            }(i), i * 100);
        }
    }

    function createCowSound(ctx) {
        // Tiếng bò kêu: "Moo"
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    }

    function createSheepSound(ctx) {
        // Tiếng cừu kêu: "Baa"
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    }

    function createGenericSound(ctx) {
        // Tiếng động vật chung
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }

    // Phát tiếng động vật ngẫu nhiên
    function playRandomAnimalSounds() {
        var sounds = ['dog', 'cat', 'bird', 'cow', 'sheep'];
        var delays = [0, 200, 400, 600, 800];

        delays.forEach(function (delay, index) {
            setTimeout(function () {
                var randomSound = sounds[Math.floor(Math.random() * sounds.length)];
                createAnimalSound(randomSound);
            }, delay);
        });
    }

    // Export
    window.AnimalSounds = {
        play: createAnimalSound,
        playRandom: playRandomAnimalSounds,
        dog: function () { createAnimalSound('dog'); },
        cat: function () { createAnimalSound('cat'); },
        bird: function () { createAnimalSound('bird'); },
        cow: function () { createAnimalSound('cow'); },
        sheep: function () { createAnimalSound('sheep'); }
    };

    console.log('✅ Animal sounds ready!');

})();
=======
/* ========================================
   ANIMAL SOUNDS - Tiếng động vật
   ======================================== */

(function () {
    'use strict';

    console.log('🐾 Loading animal sounds...');

    // Tạo tiếng động vật bằng Web Audio API
    function createAnimalSound(type) {
        try {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            var ctx = new AudioContext();

            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            switch (type) {
                case 'dog':
                    createDogSound(ctx);
                    break;
                case 'cat':
                    createCatSound(ctx);
                    break;
                case 'bird':
                    createBirdSound(ctx);
                    break;
                case 'cow':
                    createCowSound(ctx);
                    break;
                case 'sheep':
                    createSheepSound(ctx);
                    break;
                default:
                    createGenericSound(ctx);
            }
        } catch (e) {
            console.warn('Animal sound error:', e);
        }
    }

    function createDogSound(ctx) {
        // Tiếng chó sủa: "Woof!"
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }

    function createCatSound(ctx) {
        // Tiếng mèo kêu: "Meow"
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    }

    function createBirdSound(ctx) {
        // Tiếng chim hót
        for (var i = 0; i < 3; i++) {
            setTimeout(function (index) {
                return function () {
                    var osc = ctx.createOscillator();
                    var gain = ctx.createGain();

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.frequency.setValueAtTime(1000 + index * 200, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(1500 + index * 200, ctx.currentTime + 0.05);

                    gain.gain.setValueAtTime(0.2, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

                    osc.start();
                    osc.stop(ctx.currentTime + 0.08);
                };
            }(i), i * 100);
        }
    }

    function createCowSound(ctx) {
        // Tiếng bò kêu: "Moo"
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    }

    function createSheepSound(ctx) {
        // Tiếng cừu kêu: "Baa"
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    }

    function createGenericSound(ctx) {
        // Tiếng động vật chung
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }

    // Phát tiếng động vật ngẫu nhiên
    function playRandomAnimalSounds() {
        var sounds = ['dog', 'cat', 'bird', 'cow', 'sheep'];
        var delays = [0, 200, 400, 600, 800];

        delays.forEach(function (delay, index) {
            setTimeout(function () {
                var randomSound = sounds[Math.floor(Math.random() * sounds.length)];
                createAnimalSound(randomSound);
            }, delay);
        });
    }

    // Export
    window.AnimalSounds = {
        play: createAnimalSound,
        playRandom: playRandomAnimalSounds,
        dog: function () { createAnimalSound('dog'); },
        cat: function () { createAnimalSound('cat'); },
        bird: function () { createAnimalSound('bird'); },
        cow: function () { createAnimalSound('cow'); },
        sheep: function () { createAnimalSound('sheep'); }
    };

    console.log('✅ Animal sounds ready!');

})();
>>>>>>> 24c03eda35bab541d2f3fd43d47c2f7b5555ba3f
