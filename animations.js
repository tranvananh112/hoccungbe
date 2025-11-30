/* ========================================
   ANIMATIONS.JS - Hiệu ứng động chuyên nghiệp
   ======================================== */

(function () {
    'use strict';

    console.log('🎨 Animations loading...');

    // ========== ANIMATION DEFINITIONS ==========
    var characterAnimations = {
        // Động vật
        '🐘': { type: 'walk', sound: 'Voi đi bộ nặng nề!' },
        '🐱': { type: 'jump', sound: 'Mèo nhảy nhót!' },
        '🐕': { type: 'run', sound: 'Chó chạy nhanh!' },
        '🐔': { type: 'peck', sound: 'Gà mổ thóc!' },
        '🦆': { type: 'waddle', sound: 'Vịt lắc lư!' },
        '🐄': { type: 'walk', sound: 'Bò đi chậm rãi!' },
        '🐟': { type: 'swim', sound: 'Cá bơi lội!' },
        '🐝': { type: 'fly', sound: 'Ong bay vù vù!' },
        '🦋': { type: 'flutter', sound: 'Bướm bay lượn!' },

        // Người
        '👨': { type: 'wave', sound: 'Ba vẫy tay!' },
        '👩': { type: 'wave', sound: 'Mẹ vẫy tay!' },
        '👴': { type: 'wave', sound: 'Ông vẫy tay!' },
        '👵': { type: 'wave', sound: 'Bà vẫy tay!' },

        // Đồ vật
        '🚗': { type: 'drive', sound: 'Xe chạy nhanh!' },
        '⚽': { type: 'bounce', sound: 'Bóng nảy!' },
        '🌸': { type: 'bloom', sound: 'Hoa nở!' },
        '🌳': { type: 'sway', sound: 'Cây đung đưa!' },
        '🏠': { type: 'shake', sound: 'Nhà rung lắc!' },

        // Thiên nhiên
        '☀️': { type: 'spin', sound: 'Mặt trời quay!' },
        '⭐': { type: 'twinkle', sound: 'Sao lấp lánh!' },
        '🌤️': { type: 'float', sound: 'Mây trôi!' },

        // Thức ăn
        '🍎': { type: 'spin', sound: 'Táo quay tròn!' },
        '🍊': { type: 'bounce', sound: 'Cam nảy!' },
        '🍚': { type: 'steam', sound: 'Cơm bốc khói!' },
        '🥛': { type: 'shake', sound: 'Sữa lắc!' },
        '🍰': { type: 'bounce', sound: 'Bánh nảy!' }
    };

    // ========== CHARACTER ANIMATION PLAYER ==========
    function playCharacterAnimation(emoji, label) {
        var container = document.getElementById('characterAnimationContainer');
        if (!container) return;

        var animData = characterAnimations[emoji] || { type: 'bounce', sound: 'Tuyệt vời!' };

        // Tạo nhân vật động
        container.innerHTML = '<div class="animated-character">' +
            '<div class="character-emoji anim-' + animData.type + '">' + emoji + '</div>' +
            '<div class="character-label">' + label + '</div>' +
            '<div class="character-speech">' + animData.sound + '</div>' +
            '</div>';

        container.classList.add('show');

        // Tạo hiệu ứng đặc biệt theo loại
        createSpecialEffect(emoji, animData.type);

        // Ẩn sau 3 giây
        setTimeout(function () {
            container.classList.remove('show');
        }, 3000);
    }

    // ========== SPECIAL EFFECTS ==========
    function createSpecialEffect(emoji, type) {
        var container = document.getElementById('characterAnimationContainer');
        if (!container) return;

        switch (type) {
            case 'fly':
            case 'flutter':
                createFlyingPath(container);
                break;
            case 'swim':
                createWaves(container);
                break;
            case 'walk':
            case 'run':
                createFootprints(container);
                break;
            case 'bounce':
                createBounceTrail(container);
                break;
        }
    }

    function createFlyingPath(container) {
        for (var i = 0; i < 5; i++) {
            setTimeout(function (index) {
                return function () {
                    var trail = document.createElement('div');
                    trail.className = 'flying-trail';
                    trail.textContent = '✨';
                    trail.style.cssText = 'position:absolute;left:' + (Math.random() * 80 + 10) + '%;top:' +
                        (Math.random() * 80 + 10) + '%;font-size:30px;animation:fadeOut 1s forwards;';
                    container.appendChild(trail);
                    setTimeout(function () { trail.remove(); }, 1000);
                };
            }(i), i * 200);
        }
    }

    function createWaves(container) {
        for (var i = 0; i < 3; i++) {
            var wave = document.createElement('div');
            wave.className = 'wave-effect';
            wave.style.cssText = 'position:absolute;bottom:20%;left:' + (i * 30 + 10) + '%;width:100px;height:20px;' +
                'border-radius:50%;background:rgba(100,200,255,0.3);animation:waveMove 2s infinite;' +
                'animation-delay:' + (i * 0.3) + 's;';
            container.appendChild(wave);
            setTimeout(function (w) { return function () { w.remove(); }; }(wave), 3000);
        }
    }

    function createFootprints(container) {
        for (var i = 0; i < 4; i++) {
            setTimeout(function (index) {
                return function () {
                    var foot = document.createElement('div');
                    foot.textContent = '👣';
                    foot.style.cssText = 'position:absolute;left:' + (index * 20 + 20) + '%;bottom:30%;' +
                        'font-size:25px;opacity:0;animation:footprintAppear 0.5s forwards;';
                    container.appendChild(foot);
                    setTimeout(function () { foot.remove(); }, 2000);
                };
            }(i), i * 300);
        }
    }

    function createBounceTrail(container) {
        for (var i = 0; i < 3; i++) {
            setTimeout(function (index) {
                return function () {
                    var circle = document.createElement('div');
                    circle.style.cssText = 'position:absolute;left:50%;top:50%;width:50px;height:50px;' +
                        'border-radius:50%;border:3px solid rgba(255,200,0,0.5);' +
                        'animation:expandFade 1s forwards;transform:translate(-50%,-50%);';
                    container.appendChild(circle);
                    setTimeout(function () { circle.remove(); }, 1000);
                };
            }(i), i * 300);
        }
    }

    // ========== CONFETTI NÂNG CAO ==========
    function createAdvancedConfetti() {
        var container = document.getElementById('confettiContainer');
        if (!container) return;

        var colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FF9FF3', '#54A0FF'];
        var shapes = ['▮', '●', '■', '★', '♥', '◆'];

        for (var i = 0; i < 100; i++) {
            var confetti = document.createElement('div');
            confetti.className = 'confetti-advanced';
            confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.style.cssText = 'position:absolute;left:' + (Math.random() * 100) + '%;' +
                'top:-50px;color:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
                'font-size:' + (Math.random() * 20 + 15) + 'px;' +
                'animation:confettiFall ' + (Math.random() * 2 + 2) + 's linear forwards;' +
                'animation-delay:' + (Math.random() * 0.5) + 's;' +
                'transform:rotate(' + (Math.random() * 360) + 'deg);';
            container.appendChild(confetti);
        }

        setTimeout(function () {
            var items = container.querySelectorAll('.confetti-advanced');
            for (var i = 0; i < items.length; i++) {
                items[i].remove();
            }
        }, 4000);
    }

    // ========== FLYING STARS ==========
    function createFlyingStars(fromX, fromY, toX, toY, count) {
        count = count || 3;
        for (var i = 0; i < count; i++) {
            setTimeout(function (index) {
                return function () {
                    var star = document.createElement('div');
                    star.className = 'flying-star';
                    star.textContent = '⭐';
                    star.style.cssText = 'position:fixed;left:' + fromX + 'px;top:' + fromY + 'px;' +
                        'font-size:30px;z-index:9999;transition:all 0.8s ease-out;pointer-events:none;';
                    document.body.appendChild(star);

                    setTimeout(function () {
                        star.style.left = toX + 'px';
                        star.style.top = toY + 'px';
                        star.style.transform = 'scale(0.3) rotate(720deg)';
                        star.style.opacity = '0';
                    }, 50);

                    setTimeout(function () { star.remove(); }, 1000);
                };
            }(i), i * 200);
        }
    }

    // ========== PARTICLE BURST ==========
    function createParticleBurst(x, y, color) {
        color = color || '#FFD700';
        for (var i = 0; i < 12; i++) {
            var angle = (i * 30) * Math.PI / 180;
            var particle = document.createElement('div');
            particle.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
                'width:8px;height:8px;border-radius:50%;background:' + color + ';' +
                'z-index:9999;pointer-events:none;';
            document.body.appendChild(particle);

            var distance = 100;
            var endX = x + Math.cos(angle) * distance;
            var endY = y + Math.sin(angle) * distance;

            setTimeout(function (p, ex, ey) {
                return function () {
                    p.style.transition = 'all 0.6s ease-out';
                    p.style.left = ex + 'px';
                    p.style.top = ey + 'px';
                    p.style.opacity = '0';
                    p.style.transform = 'scale(0)';
                };
            }(particle, endX, endY), 50);

            setTimeout(function (p) {
                return function () { p.remove(); };
            }(particle), 700);
        }
    }

    // ========== SHAKE EFFECT ==========
    function shakeElement(element, duration) {
        duration = duration || 500;
        element.style.animation = 'shake 0.5s';
        setTimeout(function () {
            element.style.animation = '';
        }, duration);
    }

    // Export to global
    window.GameAnimations = {
        playCharacterAnimation: playCharacterAnimation,
        createAdvancedConfetti: createAdvancedConfetti,
        createFlyingStars: createFlyingStars,
        createParticleBurst: createParticleBurst,
        shakeElement: shakeElement
    };

    console.log('✅ Animations ready!');

})();
