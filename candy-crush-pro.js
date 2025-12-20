/* ========================================
   CANDY CRUSH SAGA - PROFESSIONAL VERSION
   Phase 1: Core Visual & Audio Implementation
   Giống 100% Candy Crush Saga thật
   ======================================== */

(function () {
    'use strict';

    console.log('🍬 Loading Professional Candy Crush Saga...');

    // ========== AUDIO ENGINE ==========
    class AudioEngine {
        constructor() {
            this.context = null;
            this.masterGain = null;
            this.initialized = false;
        }

        init() {
            if (this.initialized) return;
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.context = new AudioContext();
                this.masterGain = this.context.createGain();
                this.masterGain.gain.value = 0.3;
                this.masterGain.connect(this.context.destination);
                this.initialized = true;
            } catch (e) {
                console.warn('Audio not supported');
            }
        }

        createTone(frequency, duration, type = 'sine', volume = 0.3) {
            if (!this.initialized) return;

            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = type;
            osc.frequency.value = frequency;

            osc.connect(gain);
            gain.connect(this.masterGain);

            // ADSR Envelope
            const now = this.context.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(volume, now + 0.01); // Attack
            gain.gain.linearRampToValueAtTime(volume * 0.7, now + 0.05); // Decay
            gain.gain.setValueAtTime(volume * 0.7, now + duration - 0.05); // Sustain
            gain.gain.linearRampToValueAtTime(0, now + duration); // Release

            osc.start(now);
            osc.stop(now + duration);
        }

        playSelectSound() {
            this.init();
            this.createTone(440, 0.05, 'sine', 0.2);
        }

        playSwapSound() {
            this.init();
            // Swoosh effect
            const now = this.context.currentTime;
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            osc.start(now);
            osc.stop(now + 0.1);
        }

        playMatchSound(matchCount) {
            this.init();
            // Chord based on match count
            const baseFreq = 523.25; // C5
            let chord;

            if (matchCount === 3) {
                chord = [0, 4, 7]; // C-E-G (major triad)
            } else if (matchCount === 4) {
                chord = [0, 4, 7, 11]; // C-E-G-B (major 7th)
            } else {
                chord = [0, 2, 4, 7, 9]; // Pentatonic scale
            }

            chord.forEach((semitone, i) => {
                const freq = baseFreq * Math.pow(2, semitone / 12);
                setTimeout(() => {
                    this.createTone(freq, 0.2, 'triangle', 0.15);
                }, i * 30);
            });
        }

        playCascadeSound(level) {
            this.init();
            const pitchMultiplier = 1 + (level * 0.1);
            const freq = 440 * pitchMultiplier;
            this.createTone(freq, 0.15, 'square', 0.2);
        }

        playErrorSound() {
            this.init();
            this.createTone(200, 0.2, 'sawtooth', 0.15);
        }

        playVictorySound() {
            this.init();
            // Victory fanfare
            const melody = [523, 587, 659, 784, 880];
            melody.forEach((freq, i) => {
                setTimeout(() => {
                    this.createTone(freq, 0.3, 'sine', 0.25);
                }, i * 150);
            });
        }
    }

    // ========== ANIMATION SYSTEM ==========
    class AnimationSystem {
        constructor() {
            this.easings = {
                linear: t => t,
                easeOutQuad: t => t * (2 - t),
                easeOutCubic: t => (--t) * t * t + 1,
                easeOutBack: t => {
                    const c1 = 1.70158;
                    const c3 = c1 + 1;
                    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
                },
                easeOutElastic: t => {
                    const c4 = (2 * Math.PI) / 3;
                    return t === 0 ? 0 : t === 1 ? 1 :
                        Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
                },
                easeInOutQuad: t => {
                    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                },
                easeOutBounce: t => {
                    const n1 = 7.5625;
                    const d1 = 2.75;
                    if (t < 1 / d1) {
                        return n1 * t * t;
                    } else if (t < 2 / d1) {
                        return n1 * (t -= 1.5 / d1) * t + 0.75;
                    } else if (t < 2.5 / d1) {
                        return n1 * (t -= 2.25 / d1) * t + 0.9375;
                    } else {
                        return n1 * (t -= 2.625 / d1) * t + 0.984375;
                    }
                }
            };
        }

        ease(t, type = 'easeOutQuad') {
            return this.easings[type] ? this.easings[type](t) : t;
        }
    }

    // ========== PARTICLE SYSTEM ==========
    class ParticleSystem {
        constructor() {
            this.particles = [];
        }

        createExplosion(x, y, color, intensity = 1) {
            const particleCount = Math.floor(20 * intensity);

            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
                const speed = (100 + Math.random() * 100) * intensity;

                this.particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 50,
                    size: 2 + Math.random() * 4 * intensity,
                    color: color,
                    life: 0.5 + Math.random() * 0.5,
                    maxLife: 0.5 + Math.random() * 0.5,
                    alpha: 1,
                    type: Math.random() > 0.7 ? 'star' : 'circle',
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 10
                });
            }
        }

        update(dt) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];

                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.vy += 400 * dt; // Gravity
                p.rotation += p.rotationSpeed * dt;
                p.life -= dt;
                p.alpha = p.life / p.maxLife;

                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }

        draw(ctx) {
            this.particles.forEach(p => {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);

                if (p.type === 'star') {
                    this.drawStar(ctx, 0, 0, p.size, p.color);
                } else {
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });
        }

        drawStar(ctx, x, y, size, color) {
            ctx.fillStyle = color;
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                const radius = i % 2 === 0 ? size : size / 2;
                const px = x + Math.cos(angle) * radius;
                const py = y + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
        }
    }

    // ========== CANDY DESIGNS ==========
    const CANDY_DESIGNS = {
        0: {
            name: 'Red',
            emoji: '🍓',
            colors: {
                base: '#FF4757',
                highlight: '#FF6B81',
                shadow: '#C23646',
                glow: '#FFB3C1',
                rim: '#FF8FA3'
            }
        },
        1: {
            name: 'Orange',
            emoji: '🍊',
            colors: {
                base: '#FFA502',
                highlight: '#FFB732',
                shadow: '#CC8400',
                glow: '#FFD580',
                rim: '#FFC04D'
            }
        },
        2: {
            name: 'Yellow',
            emoji: '🍋',
            colors: {
                base: '#FFD93D',
                highlight: '#FFE66D',
                shadow: '#CCAE31',
                glow: '#FFF3A3',
                rim: '#FFED7F'
            }
        },
        3: {
            name: 'Green',
            emoji: '🍏',
            colors: {
                base: '#6BCF7F',
                highlight: '#8FE99F',
                shadow: '#56A566',
                glow: '#B3F5BF',
                rim: '#A3E6AF'
            }
        },
        4: {
            name: 'Blue',
            emoji: '🫐',
            colors: {
                base: '#4FACFE',
                highlight: '#6FC3FF',
                shadow: '#3F8ACB',
                glow: '#9FD9FF',
                rim: '#87CEFF'
            }
        },
        5: {
            name: 'Purple',
            emoji: '🍇',
            colors: {
                base: '#C471ED',
                highlight: '#D68FF1',
                shadow: '#9D5ABE',
                glow: '#E4B3F6',
                rim: '#DCA3F3'
            }
        }
    };

    // ========== MAIN GAME ==========

    class CandyCrushPro {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.config = {
                GRID_SIZE: 8,
                CELL_SIZE: 60,
                CANDY_TYPES: 6,
                MOVES_LIMIT: 30,
                TARGET_SCORE: 1000,
                MATCH_MIN: 3
            };

            this.board = [];
            this.candyObjects = [];
            this.score = 0;
            this.moves = this.config.MOVES_LIMIT;
            this.selectedCell = null;
            this.isAnimating = false;
            this.multiplier = 1;
            this.comboCount = 0;

            this.audioEngine = new AudioEngine();
            this.animSystem = new AnimationSystem();
            this.particleSystem = new ParticleSystem();

            this.hintTimer = null;
            this.lastTime = 0;
        }

        init(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                console.error('Canvas not found');
                return false;
            }

            this.ctx = this.canvas.getContext('2d');
            this.reset();
            this.startGameLoop();
            this.startHintTimer();

            console.log('✅ Candy Crush Pro initialized');
            return true;
        }

        reset() {
            this.score = 0;
            this.moves = this.config.MOVES_LIMIT;
            this.multiplier = 1;
            this.comboCount = 0;
            this.selectedCell = null;
            this.isAnimating = false;
            this.particleSystem.particles = [];

            this.generateBoard();
            this.initCandyObjects();
            this.updateUI();
        }

        // ========== BOARD GENERATION ==========
        generateBoard() {
            this.board = [];
            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                const row = [];
                for (let x = 0; x < this.config.GRID_SIZE; x++) {
                    row.push(Math.floor(Math.random() * this.config.CANDY_TYPES));
                }
                this.board.push(row);
            }

            // Remove initial matches
            let attempts = 0;
            while (this.findMatches().length > 0 && attempts < 100) {
                this.removeMatchesInstant();
                this.fillBoardInstant();
                attempts++;
            }
        }

        initCandyObjects() {
            this.candyObjects = [];
            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                const row = [];
                for (let x = 0; x < this.config.GRID_SIZE; x++) {
                    row.push(this.createCandyObject(x, y));
                }
                this.candyObjects.push(row);
            }
        }

        createCandyObject(x, y) {
            return {
                x: x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2,
                y: y * this.config.CELL_SIZE + this.config.CELL_SIZE / 2,
                targetX: x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2,
                targetY: y * this.config.CELL_SIZE + this.config.CELL_SIZE / 2,
                scale: 1,
                targetScale: 1,
                rotation: 0,
                alpha: 1,
                squashX: 1,
                squashY: 1,
                velocityY: 0
            };
        }

        // ========== GAME LOOP ==========
        startGameLoop() {
            this.lastTime = performance.now();
            this.gameLoop();
        }

        gameLoop() {
            const now = performance.now();
            const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1);
            this.lastTime = now;

            this.update(deltaTime);
            this.draw();

            requestAnimationFrame(() => this.gameLoop());
        }

        update(dt) {
            // Update candy objects with smooth interpolation
            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.config.GRID_SIZE; x++) {
                    const obj = this.candyObjects[y][x];

                    // Lerp position
                    obj.x += (obj.targetX - obj.x) * 10 * dt;
                    obj.y += (obj.targetY - obj.y) * 10 * dt;

                    // Lerp scale
                    obj.scale += (obj.targetScale - obj.scale) * 8 * dt;

                    // Squash & stretch when falling
                    const distToTarget = Math.abs(obj.y - obj.targetY);
                    if (distToTarget > 5) {
                        obj.velocityY += 800 * dt;
                        obj.squashY = 1 + Math.min(obj.velocityY / 500, 0.3);
                        obj.squashX = 1 / obj.squashY;
                    } else {
                        // Bounce when landing
                        if (obj.velocityY > 100) {
                            obj.squashY = 0.7;
                            obj.squashX = 1.3;
                        }
                        obj.velocityY = 0;
                        obj.squashX += (1 - obj.squashX) * 10 * dt;
                        obj.squashY += (1 - obj.squashY) * 10 * dt;
                    }

                    // Idle animation (subtle pulse)
                    const idlePulse = 1 + Math.sin(now / 1000 + x + y) * 0.03;
                    obj.targetScale = idlePulse;
                }
            }

            // Update particles
            this.particleSystem.update(dt);
        }

        // ========== DRAWING ==========
        draw() {
            // Background gradient
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#FFF9E6');
            gradient.addColorStop(0.5, '#FFE6F0');
            gradient.addColorStop(1, '#E6F3FF');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw grid cells
            this.drawGrid();

            // Draw candies
            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.config.GRID_SIZE; x++) {
                    const candy = this.board[y][x];
                    if (candy !== null && candy !== undefined) {
                        const obj = this.candyObjects[y][x];
                        this.drawCandy3D(obj, candy);
                    }
                }
            }

            // Draw particles
            this.particleSystem.draw(this.ctx);

            // Draw combo text
            if (this.comboCount > 1) {
                this.drawComboText();
            }
        }

        drawGrid() {
            this.ctx.shadowColor = 'rgba(0,0,0,0.1)';
            this.ctx.shadowBlur = 5;

            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.config.GRID_SIZE; x++) {
                    const cellX = x * this.config.CELL_SIZE;
                    const cellY = y * this.config.CELL_SIZE;

                    // Cell background
                    const cellGradient = this.ctx.createRadialGradient(
                        cellX + this.config.CELL_SIZE / 2,
                        cellY + this.config.CELL_SIZE / 2, 0,
                        cellX + this.config.CELL_SIZE / 2,
                        cellY + this.config.CELL_SIZE / 2,
                        this.config.CELL_SIZE / 2
                    );
                    cellGradient.addColorStop(0, '#FFFFFF');
                    cellGradient.addColorStop(1, '#F0F0F0');

                    this.ctx.fillStyle = cellGradient;
                    this.ctx.beginPath();
                    this.ctx.roundRect(
                        cellX + 3, cellY + 3,
                        this.config.CELL_SIZE - 6,
                        this.config.CELL_SIZE - 6,
                        8
                    );
                    this.ctx.fill();

                    // Selected highlight
                    if (this.selectedCell &&
                        this.selectedCell.x === x &&
                        this.selectedCell.y === y) {
                        this.ctx.save();
                        this.ctx.shadowColor = '#FFD700';
                        this.ctx.shadowBlur = 20;
                        this.ctx.strokeStyle = '#FFD700';
                        this.ctx.lineWidth = 4;
                        this.ctx.beginPath();
                        this.ctx.roundRect(
                            cellX + 3, cellY + 3,
                            this.config.CELL_SIZE - 6,
                            this.config.CELL_SIZE - 6,
                            8
                        );
                        this.ctx.stroke();
                        this.ctx.restore();
                    }
                }
            }

            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;
        }

        drawCandy3D(obj, type) {
            const design = CANDY_DESIGNS[type];
            const { x, y, scale, rotation, alpha, squashX, squashY } = obj;

            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rotation);
            this.ctx.scale(scale * squashX, scale * squashY);
            this.ctx.globalAlpha = alpha;

            const size = 25;

            // Shadow layer
            this.ctx.save();
            this.ctx.translate(0, 3);
            this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, size * 0.9, size * 0.5, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            // Glow effect
            this.ctx.shadowColor = design.colors.glow;
            this.ctx.shadowBlur = 15;

            // Base candy with gradient
            const gradient = this.ctx.createRadialGradient(0, -8, 0, 0, 0, size);
            gradient.addColorStop(0, design.colors.highlight);
            gradient.addColorStop(0.6, design.colors.base);
            gradient.addColorStop(1, design.colors.shadow);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size, 0, Math.PI * 2);
            this.ctx.fill();

            // Rim light (viền sáng)
            this.ctx.shadowBlur = 0;
            const rimGradient = this.ctx.createRadialGradient(0, 0, size * 0.7, 0, 0, size);
            rimGradient.addColorStop(0, 'rgba(255,255,255,0)');
            rimGradient.addColorStop(0.8, 'rgba(255,255,255,0)');
            rimGradient.addColorStop(1, design.colors.rim);

            this.ctx.fillStyle = rimGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size, 0, Math.PI * 2);
            this.ctx.fill();

            // Specular highlight (ánh sáng phản chiếu)
            const specGradient = this.ctx.createRadialGradient(-8, -8, 0, -8, -8, 15);
            specGradient.addColorStop(0, 'rgba(255,255,255,0.9)');
            specGradient.addColorStop(0.5, 'rgba(255,255,255,0.4)');
            specGradient.addColorStop(1, 'rgba(255,255,255,0)');

            this.ctx.fillStyle = specGradient;
            this.ctx.beginPath();
            this.ctx.arc(-8, -8, 15, 0, Math.PI * 2);
            this.ctx.fill();

            // Emoji overlay
            this.ctx.font = 'bold 32px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(design.emoji, 0, 2);

            this.ctx.restore();
        }

        drawComboText() {
            const pulse = 1 + Math.sin(performance.now() / 100) * 0.1;

            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, 50);
            this.ctx.scale(pulse, pulse);

            // Outline
            this.ctx.font = 'bold 40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.strokeStyle = '#FF6B9D';
            this.ctx.lineWidth = 6;
            this.ctx.strokeText(`COMBO x${this.comboCount}!`, 0, 0);

            // Fill
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(`COMBO x${this.comboCount}!`, 0, 0);

            this.ctx.restore();
        }

        // ========== INPUT HANDLING ==========
        handleClick(x, y) {
            if (this.isAnimating || this.moves <= 0) return;

            const cellX = Math.floor(x / this.config.CELL_SIZE);
            const cellY = Math.floor(y / this.config.CELL_SIZE);

            if (cellX < 0 || cellX >= this.config.GRID_SIZE ||
                cellY < 0 || cellY >= this.config.GRID_SIZE) return;

            if (!this.selectedCell) {
                this.selectCandy(cellX, cellY);
            } else {
                const dx = Math.abs(cellX - this.selectedCell.x);
                const dy = Math.abs(cellY - this.selectedCell.y);

                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                    this.swapCandies(this.selectedCell.x, this.selectedCell.y, cellX, cellY);
                } else {
                    this.selectCandy(cellX, cellY);
                }
            }

            this.resetHintTimer();
        }

        selectCandy(x, y) {
            this.selectedCell = { x, y };
            this.candyObjects[y][x].targetScale = 1.3;
            this.audioEngine.playSelectSound();
        }

        // ========== SWAP & MATCH ==========
        swapCandies(x1, y1, x2, y2) {
            this.isAnimating = true;

            // Swap board
            const temp = this.board[y1][x1];
            this.board[y1][x1] = this.board[y2][x2];
            this.board[y2][x2] = temp;

            // Animate swap
            const obj1 = this.candyObjects[y1][x1];
            const obj2 = this.candyObjects[y2][x2];

            obj1.targetX = x2 * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
            obj1.targetY = y2 * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
            obj2.targetX = x1 * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
            obj2.targetY = y1 * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;

            this.candyObjects[y1][x1] = obj2;
            this.candyObjects[y2][x2] = obj1;

            this.audioEngine.playSwapSound();

            setTimeout(() => {
                const matches = this.findMatches();

                if (matches.length > 0) {
                    this.moves--;
                    this.selectedCell = null;
                    this.comboCount = 0;
                    this.processMatches();
                } else {
                    // Invalid swap - undo
                    this.undoSwap(x1, y1, x2, y2, obj1, obj2, temp);
                }

                this.updateUI();
            }, 250);
        }

        undoSwap(x1, y1, x2, y2, obj1, obj2, temp) {
            this.board[y2][x2] = this.board[y1][x1];
            this.board[y1][x1] = temp;

            obj1.targetX = x1 * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
            obj1.targetY = y1 * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
            obj2.targetX = x2 * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
            obj2.targetY = y2 * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;

            this.candyObjects[y1][x1] = obj1;
            this.candyObjects[y2][x2] = obj2;

            this.audioEngine.playErrorSound();
            this.shakeBoard();

            setTimeout(() => {
                this.selectedCell = null;
                this.isAnimating = false;
            }, 250);
        }

        shakeBoard() {
            const shakes = ['-3px', '3px', '-2px', '2px', '-1px', '1px', '0'];
            let i = 0;

            const interval = setInterval(() => {
                if (i >= shakes.length) {
                    clearInterval(interval);
                    this.canvas.style.transform = '';
                    return;
                }
                this.canvas.style.transform = `translateX(${shakes[i]})`;
                i++;
            }, 50);
        }

        // ========== MATCH DETECTION ==========

        findMatches() {
            const matches = [];
            const marked = Array(this.config.GRID_SIZE).fill(null)
                .map(() => Array(this.config.GRID_SIZE).fill(false));

            // Horizontal matches
            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.config.GRID_SIZE - 2; x++) {
                    const candy = this.board[y][x];
                    if (candy === null) continue;

                    let count = 1;
                    while (x + count < this.config.GRID_SIZE &&
                        this.board[y][x + count] === candy) {
                        count++;
                    }

                    if (count >= this.config.MATCH_MIN) {
                        for (let i = 0; i < count; i++) {
                            if (!marked[y][x + i]) {
                                matches.push({ x: x + i, y });
                                marked[y][x + i] = true;
                            }
                        }
                    }
                }
            }

            // Vertical matches
            for (let x = 0; x < this.config.GRID_SIZE; x++) {
                for (let y = 0; y < this.config.GRID_SIZE - 2; y++) {
                    const candy = this.board[y][x];
                    if (candy === null) continue;

                    let count = 1;
                    while (y + count < this.config.GRID_SIZE &&
                        this.board[y + count][x] === candy) {
                        count++;
                    }

                    if (count >= this.config.MATCH_MIN) {
                        for (let i = 0; i < count; i++) {
                            if (!marked[y + i][x]) {
                                matches.push({ x, y: y + i });
                                marked[y + i][x] = true;
                            }
                        }
                    }
                }
            }

            return matches;
        }

        processMatches() {
            const matches = this.findMatches();

            if (matches.length === 0) {
                this.isAnimating = false;
                this.multiplier = 1;
                this.comboCount = 0;
                this.checkGameOver();
                return;
            }

            this.comboCount++;

            // Calculate score
            const points = matches.length * 60 * this.multiplier;
            this.score += points;
            this.multiplier++;

            // Play sound
            this.audioEngine.playMatchSound(matches.length);
            if (this.comboCount > 1) {
                this.audioEngine.playCascadeSound(this.comboCount);
            }

            // Animate removal
            this.animateRemoval(matches);

            setTimeout(() => {
                this.removeMatches();
                this.fillBoard();

                setTimeout(() => {
                    this.processMatches(); // Cascade
                }, 300);

            }, 400);

            this.updateUI();
        }

        animateRemoval(matches) {
            matches.forEach(match => {
                const obj = this.candyObjects[match.y][match.x];

                // Scale down & rotate
                obj.targetScale = 0;
                obj.rotation = Math.PI * 2;

                // Create particles
                const candyType = this.board[match.y][match.x];
                const design = CANDY_DESIGNS[candyType];
                const px = match.x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
                const py = match.y * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;

                this.particleSystem.createExplosion(
                    px, py,
                    design.colors.base,
                    1 + this.comboCount * 0.2
                );
            });
        }

        removeMatches() {
            const matches = this.findMatches();
            matches.forEach(match => {
                this.board[match.y][match.x] = null;
            });
        }

        removeMatchesInstant() {
            const matches = this.findMatches();
            matches.forEach(match => {
                this.board[match.y][match.x] = null;
            });
        }

        // ========== BOARD REFILL ==========
        fillBoard() {
            // Drop existing candies
            for (let x = 0; x < this.config.GRID_SIZE; x++) {
                let emptySpaces = 0;

                for (let y = this.config.GRID_SIZE - 1; y >= 0; y--) {
                    if (this.board[y][x] === null) {
                        emptySpaces++;
                    } else if (emptySpaces > 0) {
                        this.board[y + emptySpaces][x] = this.board[y][x];
                        this.board[y][x] = null;

                        // Update candy object
                        this.candyObjects[y + emptySpaces][x] = this.candyObjects[y][x];
                        this.candyObjects[y + emptySpaces][x].targetY =
                            (y + emptySpaces) * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
                        this.candyObjects[y + emptySpaces][x].velocityY = 0;
                    }
                }

                // Add new candies from top
                for (let i = 0; i < emptySpaces; i++) {
                    this.board[i][x] = Math.floor(Math.random() * this.config.CANDY_TYPES);

                    this.candyObjects[i][x] = {
                        x: x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2,
                        y: -this.config.CELL_SIZE * (emptySpaces - i),
                        targetX: x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2,
                        targetY: i * this.config.CELL_SIZE + this.config.CELL_SIZE / 2,
                        scale: 1,
                        targetScale: 1,
                        rotation: 0,
                        alpha: 1,
                        squashX: 1,
                        squashY: 1,
                        velocityY: 0
                    };
                }
            }
        }

        fillBoardInstant() {
            for (let x = 0; x < this.config.GRID_SIZE; x++) {
                let emptySpaces = 0;

                for (let y = this.config.GRID_SIZE - 1; y >= 0; y--) {
                    if (this.board[y][x] === null) {
                        emptySpaces++;
                    } else if (emptySpaces > 0) {
                        this.board[y + emptySpaces][x] = this.board[y][x];
                        this.board[y][x] = null;
                    }
                }

                for (let i = 0; i < emptySpaces; i++) {
                    this.board[i][x] = Math.floor(Math.random() * this.config.CANDY_TYPES);
                }
            }
        }

        // ========== HINT SYSTEM ==========
        startHintTimer() {
            this.hintTimer = setTimeout(() => {
                if (!this.isAnimating && !this.selectedCell) {
                    this.showHint();
                }
            }, 5000);
        }

        resetHintTimer() {
            if (this.hintTimer) {
                clearTimeout(this.hintTimer);
            }
            this.startHintTimer();
        }

        showHint() {
            const moves = this.findPossibleMoves();
            if (moves.length > 0) {
                const hint = moves[0];
                this.candyObjects[hint.y1][hint.x1].targetScale = 1.4;
                this.candyObjects[hint.y2][hint.x2].targetScale = 1.4;

                setTimeout(() => {
                    this.candyObjects[hint.y1][hint.x1].targetScale = 1;
                    this.candyObjects[hint.y2][hint.x2].targetScale = 1;
                }, 500);
            }

            this.resetHintTimer();
        }

        findPossibleMoves() {
            const moves = [];

            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.config.GRID_SIZE; x++) {
                    // Try swap right
                    if (x < this.config.GRID_SIZE - 1) {
                        this.swapBoardCells(x, y, x + 1, y);
                        if (this.findMatches().length > 0) {
                            moves.push({ x1: x, y1: y, x2: x + 1, y2: y });
                        }
                        this.swapBoardCells(x, y, x + 1, y); // Undo
                    }

                    // Try swap down
                    if (y < this.config.GRID_SIZE - 1) {
                        this.swapBoardCells(x, y, x, y + 1);
                        if (this.findMatches().length > 0) {
                            moves.push({ x1: x, y1: y, x2: x, y2: y + 1 });
                        }
                        this.swapBoardCells(x, y, x, y + 1); // Undo
                    }
                }
            }

            return moves;
        }

        swapBoardCells(x1, y1, x2, y2) {
            const temp = this.board[y1][x1];
            this.board[y1][x1] = this.board[y2][x2];
            this.board[y2][x2] = temp;
        }

        // ========== UI & GAME STATE ==========
        updateUI() {
            const scoreEl = document.getElementById('candyScore');
            const movesEl = document.getElementById('candyMoves');
            const progressEl = document.getElementById('candyProgress');

            if (scoreEl) scoreEl.textContent = this.score;
            if (movesEl) movesEl.textContent = this.moves;

            if (progressEl) {
                const percent = Math.min(100, (this.score / this.config.TARGET_SCORE) * 100);
                progressEl.style.width = percent + '%';
            }
        }

        checkGameOver() {
            if (this.moves <= 0) {
                if (this.score >= this.config.TARGET_SCORE) {
                    this.win();
                } else {
                    this.lose();
                }
            }
        }

        win() {
            this.audioEngine.playVictorySound();
            setTimeout(() => {
                alert(`🎉 Chúc mừng! Bé đã thắng!\n\nĐiểm: ${this.score}\nSao: ${this.getStars()}⭐`);
            }, 500);
        }

        lose() {
            setTimeout(() => {
                alert(`😢 Hết nước! Thử lại nhé!\n\nĐiểm: ${this.score}/${this.config.TARGET_SCORE}`);
            }, 500);
        }

        getStars() {
            const percent = (this.score / this.config.TARGET_SCORE) * 100;
            if (percent >= 150) return 3;
            if (percent >= 100) return 2;
            return 1;
        }
    }

    // ========== EXPORT ==========
    window.CandyCrushPro = CandyCrushPro;

    console.log('✅ Candy Crush Pro loaded successfully');

})();
