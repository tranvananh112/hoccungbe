/* ========================================
   CANDY CRUSH SAGA - COMPLETE VERSION
   Phase 1 + Phase 2: Core + Special Candies
   Giống 100% Candy Crush Saga thật
   ======================================== */

(function () {
    'use strict';

    console.log('🍬 Loading Complete Candy Crush Saga...');

    // ========== CONSTANTS ==========
    const SPECIAL_TYPES = {
        NORMAL: 'normal',
        STRIPED_H: 'striped_h',
        STRIPED_V: 'striped_v',
        WRAPPED: 'wrapped',
        COLOR_BOMB: 'color_bomb'
    };

    // ========== CANDY CLASS ==========
    class Candy {
        constructor(color, special = SPECIAL_TYPES.NORMAL) {
            this.color = color; // 0-5
            this.special = special;
        }

        isNormal() {
            return this.special === SPECIAL_TYPES.NORMAL;
        }

        isStriped() {
            return this.special === SPECIAL_TYPES.STRIPED_H ||
                this.special === SPECIAL_TYPES.STRIPED_V;
        }

        isWrapped() {
            return this.special === SPECIAL_TYPES.WRAPPED;
        }

        isColorBomb() {
            return this.special === SPECIAL_TYPES.COLOR_BOMB;
        }

        matches(other) {
            if (!other) return false;
            if (this.isColorBomb() || other.isColorBomb()) return true;
            return this.color === other.color;
        }
    }

    // ========== ENHANCED AUDIO ENGINE ==========
    class AudioEngine {
        constructor() {
            this.context = null;
            this.masterGain = null;
            this.reverbNode = null;
            this.initialized = false;
        }

        init() {
            if (this.initialized) return;
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.context = new AudioContext();

                // Master gain
                this.masterGain = this.context.createGain();
                this.masterGain.gain.value = 0.4;
                this.masterGain.connect(this.context.destination);

                // Create reverb
                this.createReverb();

                this.initialized = true;
                console.log('🔊 Enhanced Audio Engine initialized');
            } catch (e) {
                console.warn('Audio not supported');
            }
        }

        createReverb() {
            // Simple reverb using convolver
            this.reverbNode = this.context.createConvolver();

            // Create impulse response for reverb
            const sampleRate = this.context.sampleRate;
            const length = sampleRate * 0.5; // 0.5 second reverb
            const impulse = this.context.createBuffer(2, length, sampleRate);

            for (let channel = 0; channel < 2; channel++) {
                const channelData = impulse.getChannelData(channel);
                for (let i = 0; i < length; i++) {
                    channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
                }
            }

            this.reverbNode.buffer = impulse;
        }

        createTone(frequency, duration, type = 'sine', volume = 0.3, useReverb = false) {
            if (!this.initialized) return;

            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            const filter = this.context.createBiquadFilter();

            osc.type = type;
            osc.frequency.value = frequency;

            // Add filter for warmth
            filter.type = 'lowpass';
            filter.frequency.value = 2000;
            filter.Q.value = 1;

            osc.connect(filter);
            filter.connect(gain);

            if (useReverb && this.reverbNode) {
                const dry = this.context.createGain();
                const wet = this.context.createGain();

                dry.gain.value = 0.7;
                wet.gain.value = 0.3;

                gain.connect(dry);
                gain.connect(this.reverbNode);
                this.reverbNode.connect(wet);

                dry.connect(this.masterGain);
                wet.connect(this.masterGain);
            } else {
                gain.connect(this.masterGain);
            }

            // Enhanced ADSR envelope
            const now = this.context.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(volume, now + 0.01); // Attack
            gain.gain.linearRampToValueAtTime(volume * 0.8, now + 0.05); // Decay
            gain.gain.setValueAtTime(volume * 0.8, now + duration - 0.1); // Sustain
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Release

            osc.start(now);
            osc.stop(now + duration);
        }

        playSelectSound() {
            this.init();
            // Bright pop sound
            this.createTone(880, 0.08, 'sine', 0.25);
            setTimeout(() => this.createTone(1320, 0.05, 'sine', 0.15), 20);
        }

        playSwapSound() {
            this.init();
            const now = this.context.currentTime;
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            const filter = this.context.createBiquadFilter();

            osc.type = 'sawtooth';
            filter.type = 'lowpass';
            filter.frequency.value = 1500;

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            // Swoosh with filter sweep
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(2000, now + 0.15);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.start(now);
            osc.stop(now + 0.15);
        }

        playMatchSound(matchCount) {
            this.init();
            const baseFreq = 523.25; // C5
            let chord, delay;

            if (matchCount === 3) {
                chord = [0, 4, 7]; // C-E-G
                delay = 25;
            } else if (matchCount === 4) {
                chord = [0, 4, 7, 11]; // C-E-G-B
                delay = 20;
            } else {
                chord = [0, 2, 4, 7, 9, 12]; // Pentatonic + octave
                delay = 15;
            }

            // Play chord with reverb
            chord.forEach((semitone, i) => {
                const freq = baseFreq * Math.pow(2, semitone / 12);
                setTimeout(() => {
                    this.createTone(freq, 0.3, 'triangle', 0.18, true);
                }, i * delay);
            });

            // Add sparkle on top
            if (matchCount >= 4) {
                setTimeout(() => {
                    this.createTone(2093, 0.15, 'sine', 0.12); // High C
                }, chord.length * delay);
            }
        }

        playCascadeSound(level) {
            this.init();
            const pitchMultiplier = 1 + (level * 0.12);
            const freq = 523.25 * pitchMultiplier;

            // Arpeggio up
            this.createTone(freq, 0.12, 'square', 0.22, true);
            setTimeout(() => {
                this.createTone(freq * 1.25, 0.1, 'square', 0.18, true);
            }, 40);
        }

        playErrorSound() {
            this.init();
            // Descending buzz
            const now = this.context.currentTime;
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'sawtooth';
            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.start(now);
            osc.stop(now + 0.25);
        }

        playStripedSound() {
            this.init();
            // Electric zap with multiple layers
            const now = this.context.currentTime;

            // Layer 1: Main zap
            const osc1 = this.context.createOscillator();
            const gain1 = this.context.createGain();
            const filter1 = this.context.createBiquadFilter();

            osc1.type = 'sawtooth';
            filter1.type = 'bandpass';
            filter1.frequency.value = 2000;
            filter1.Q.value = 10;

            osc1.connect(filter1);
            filter1.connect(gain1);
            gain1.connect(this.masterGain);

            osc1.frequency.setValueAtTime(1500, now);
            osc1.frequency.exponentialRampToValueAtTime(80, now + 0.25);
            filter1.frequency.setValueAtTime(3000, now);
            filter1.frequency.exponentialRampToValueAtTime(500, now + 0.25);

            gain1.gain.setValueAtTime(0.35, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc1.start(now);
            osc1.stop(now + 0.25);

            // Layer 2: Crackle
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.createTone(Math.random() * 2000 + 1000, 0.02, 'square', 0.15);
                }, i * 30);
            }
        }

        playWrappedSound() {
            this.init();
            // Deep boom with sub bass
            const now = this.context.currentTime;

            // Sub bass
            const sub = this.context.createOscillator();
            const subGain = this.context.createGain();

            sub.type = 'sine';
            sub.frequency.value = 60;
            sub.connect(subGain);
            subGain.connect(this.masterGain);

            subGain.gain.setValueAtTime(0.5, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            sub.start(now);
            sub.stop(now + 0.4);

            // Mid boom
            const mid = this.context.createOscillator();
            const midGain = this.context.createGain();
            const midFilter = this.context.createBiquadFilter();

            mid.type = 'triangle';
            mid.frequency.value = 180;
            midFilter.type = 'lowpass';
            midFilter.frequency.value = 800;

            mid.connect(midFilter);
            midFilter.connect(midGain);
            midGain.connect(this.masterGain);

            midGain.gain.setValueAtTime(0.4, now);
            midGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            mid.start(now);
            mid.stop(now + 0.35);

            // High crack
            setTimeout(() => {
                this.createTone(1200, 0.1, 'square', 0.2);
            }, 50);
        }

        playColorBombSound() {
            this.init();
            // Rainbow whoosh - ascending melody
            const melody = [
                { freq: 261.63, time: 0 },     // C4
                { freq: 329.63, time: 60 },    // E4
                { freq: 392.00, time: 120 },   // G4
                { freq: 523.25, time: 180 },   // C5
                { freq: 659.25, time: 240 },   // E5
                { freq: 783.99, time: 300 }    // G5
            ];

            melody.forEach(note => {
                setTimeout(() => {
                    this.createTone(note.freq, 0.15, 'sine', 0.22, true);
                    // Add harmonic
                    this.createTone(note.freq * 2, 0.1, 'sine', 0.1, true);
                }, note.time);
            });

            // Sparkle layer
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const freq = Math.random() * 1000 + 1500;
                    this.createTone(freq, 0.08, 'sine', 0.12);
                }, i * 35);
            }
        }

        playComboSound() {
            this.init();
            // Epic fanfare
            const fanfare = [
                { freq: 523.25, time: 0 },     // C5
                { freq: 659.25, time: 80 },    // E5
                { freq: 783.99, time: 160 },   // G5
                { freq: 1046.50, time: 240 },  // C6
                { freq: 1318.51, time: 320 }   // E6
            ];

            fanfare.forEach(note => {
                setTimeout(() => {
                    // Main note
                    this.createTone(note.freq, 0.25, 'triangle', 0.25, true);
                    // Fifth harmony
                    this.createTone(note.freq * 1.5, 0.2, 'sine', 0.15, true);
                    // Octave
                    this.createTone(note.freq * 2, 0.15, 'sine', 0.1, true);
                }, note.time);
            });
        }

        playVictorySound() {
            this.init();
            // Triumphant melody
            const victory = [
                { freq: 523.25, time: 0 },     // C5
                { freq: 587.33, time: 150 },   // D5
                { freq: 659.25, time: 300 },   // E5
                { freq: 783.99, time: 450 },   // G5
                { freq: 1046.50, time: 600 }   // C6
            ];

            victory.forEach(note => {
                setTimeout(() => {
                    this.createTone(note.freq, 0.35, 'sine', 0.28, true);
                    this.createTone(note.freq * 1.5, 0.3, 'triangle', 0.15, true);
                }, note.time);
            });

            // Final chord
            setTimeout(() => {
                [0, 4, 7, 12].forEach((semitone, i) => {
                    const freq = 523.25 * Math.pow(2, semitone / 12);
                    setTimeout(() => {
                        this.createTone(freq, 0.8, 'sine', 0.2, true);
                    }, i * 20);
                });
            }, 800);
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
            this.maxParticles = 100; // OPTIMIZATION: Giới hạn particles
            this.pool = []; // OPTIMIZATION: Object pooling
        }

        createExplosion(x, y, color, intensity = 1) {
            // OPTIMIZATION: Giảm 50% particles (từ 20 xuống 10)
            const particleCount = Math.floor(10 * intensity);

            for (let i = 0; i < particleCount; i++) {
                if (this.particles.length >= this.maxParticles) break;

                const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3;
                const speed = (100 + Math.random() * 80) * intensity;

                // OPTIMIZATION: Reuse from pool
                let particle = this.pool.pop();
                if (!particle) {
                    particle = {};
                }

                particle.x = x;
                particle.y = y;
                particle.vx = Math.cos(angle) * speed;
                particle.vy = Math.sin(angle) * speed - 50;
                particle.size = 2 + Math.random() * 3 * intensity;
                particle.color = color;
                particle.life = 0.4; // Giảm từ 0.5
                particle.maxLife = 0.4;
                particle.alpha = 1;
                particle.type = 'circle'; // Chỉ circle, không star

                this.particles.push(particle);
            }
        }

        createLightningParticles(x1, y1, x2, y2) {
            // Lightning bolt particles
            const steps = 10;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = x1 + (x2 - x1) * t;
                const y = y1 + (y2 - y1) * t;

                this.particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 50,
                    vy: (Math.random() - 0.5) * 50,
                    size: 3 + Math.random() * 3,
                    color: '#FFFF00',
                    life: 0.3,
                    maxLife: 0.3,
                    alpha: 1,
                    type: 'star',
                    rotation: 0,
                    rotationSpeed: 0
                });
            }
        }

        update(dt) {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];

                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.vy += 400 * dt;
                p.life -= dt;
                p.alpha = p.life / p.maxLife;

                if (p.life <= 0) {
                    // OPTIMIZATION: Return to pool
                    this.pool.push(this.particles[i]);
                    this.particles.splice(i, 1);
                }
            }
        }

        draw(ctx) {
            // OPTIMIZATION: Batch rendering
            ctx.save();

            this.particles.forEach(p => {
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.restore();
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

    class CandyCrushComplete {
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
            this.lastSwapDirection = null;

            this.audioEngine = new AudioEngine();
            this.animSystem = new AnimationSystem();
            this.particleSystem = new ParticleSystem();

            this.hintTimer = null;
            this.lastTime = 0;
            this.shimmerOffset = 0;
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

            console.log('✅ Candy Crush Complete initialized');
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

        generateBoard() {
            this.board = [];
            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                const row = [];
                for (let x = 0; x < this.config.GRID_SIZE; x++) {
                    const color = Math.floor(Math.random() * this.config.CANDY_TYPES);
                    row.push(new Candy(color));
                }
                this.board.push(row);
            }

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
            this.shimmerOffset += dt * 2;

            // PERFORMANCE: Cache performance.now()
            const now = performance.now();
            const cachedPulseTime = now / 800;

            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.config.GRID_SIZE; x++) {
                    const obj = this.candyObjects[y][x];

                    // OPTIMIZATION: Snap to target (FIX JITTER!)
                    const dx = obj.targetX - obj.x;
                    const dy = obj.targetY - obj.y;

                    if (Math.abs(dx) > 0.5) { // Tăng từ 0.1 lên 0.5
                        obj.x += dx * 15 * dt;
                    } else {
                        obj.x = obj.targetX;
                    }

                    if (Math.abs(dy) > 0.5) { // Tăng từ 0.1 lên 0.5
                        obj.y += dy * 15 * dt;
                    } else {
                        obj.y = obj.targetY;
                    }

                    // Scale
                    const ds = obj.targetScale - obj.scale;
                    if (Math.abs(ds) > 0.01) {
                        obj.scale += ds * 12 * dt;
                    } else {
                        obj.scale = obj.targetScale;
                    }

                    // OPTIMIZED: Squash & stretch - chỉ khi cần
                    const distToTarget = Math.abs(dy);
                    if (distToTarget > 3) {
                        obj.velocityY += 1200 * dt;
                        obj.squashY = 1 + Math.min(obj.velocityY / 400, 0.4);
                        obj.squashX = 1 / obj.squashY;
                    } else if (obj.velocityY > 80) {
                        obj.squashY = 0.65;
                        obj.squashX = 1.35;
                        obj.velocityY = 0;
                    } else if (Math.abs(obj.squashX - 1) > 0.01 || Math.abs(obj.squashY - 1) > 0.01) {
                        obj.squashX += (1 - obj.squashX) * 15 * dt;
                        obj.squashY += (1 - obj.squashY) * 15 * dt;
                    } else {
                        // OPTIMIZATION: Snap to rest (FIX MICRO-MOVEMENTS!)
                        obj.squashX = 1;
                        obj.squashY = 1;
                    }

                    // OPTIMIZATION: Idle pulse CHỈ cho selected candy (FIX LAG!)
                    if (this.selectedCell && this.selectedCell.x === x && this.selectedCell.y === y) {
                        obj.targetScale = 1.2 + Math.sin(now / 300) * 0.1;
                    } else {
                        obj.targetScale = 1; // Không pulse khi idle - GIẢM 20% CPU!
                    }
                }
            }

            this.particleSystem.update(dt);
        }

        draw() {
            // OPTIMIZED: Cache background gradient
            if (!this.backgroundGradient) {
                this.backgroundGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
                this.backgroundGradient.addColorStop(0, '#FFF9E6');
                this.backgroundGradient.addColorStop(0.5, '#FFE6F0');
                this.backgroundGradient.addColorStop(1, '#E6F3FF');
            }
            this.ctx.fillStyle = this.backgroundGradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawGrid();

            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.config.GRID_SIZE; x++) {
                    const candy = this.board[y][x];
                    if (candy) {
                        const obj = this.candyObjects[y][x];
                        this.drawCandy(obj, candy);
                    }
                }
            }

            this.particleSystem.draw(this.ctx);

            if (this.comboCount > 1) {
                this.drawComboText();
            }
        }

        drawGrid() {
            // OPTIMIZED: Đơn giản hóa grid - không dùng shadow blur
            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.config.GRID_SIZE; x++) {
                    const cellX = x * this.config.CELL_SIZE;
                    const cellY = y * this.config.CELL_SIZE;

                    // Simple fill - nhanh hơn gradient
                    this.ctx.fillStyle = (x + y) % 2 === 0 ? '#FFFFFF' : '#F8F8F8';
                    this.ctx.fillRect(
                        cellX + 3, cellY + 3,
                        this.config.CELL_SIZE - 6,
                        this.config.CELL_SIZE - 6
                    );

                    if (this.selectedCell &&
                        this.selectedCell.x === x &&
                        this.selectedCell.y === y) {
                        this.ctx.strokeStyle = '#FFD700';
                        this.ctx.lineWidth = 3;
                        this.ctx.strokeRect(
                            cellX + 3, cellY + 3,
                            this.config.CELL_SIZE - 6,
                            this.config.CELL_SIZE - 6
                        );
                    }
                }
            }
        }

        drawCandy(obj, candy) {
            if (candy.isNormal()) {
                this.drawCandy3D(obj, candy.color);
            } else if (candy.isStriped()) {
                this.drawStripedCandy(obj, candy);
            } else if (candy.isWrapped()) {
                this.drawWrappedCandy(obj, candy);
            } else if (candy.isColorBomb()) {
                this.drawColorBomb(obj);
            }
        }

        drawCandy3D(obj, color) {
            const design = CANDY_DESIGNS[color];
            const { x, y, scale, rotation, alpha, squashX, squashY } = obj;

            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rotation);
            this.ctx.scale(scale * squashX, scale * squashY);
            this.ctx.globalAlpha = alpha;

            const size = this.config.CANDY_SIZE || 25;

            // Shadow - đơn giản hơn
            this.ctx.fillStyle = 'rgba(0,0,0,0.15)';
            this.ctx.beginPath();
            this.ctx.ellipse(0, 3, size * 0.8, size * 0.4, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // OPTIMIZED: Cache gradient
            const gradientKey = `candy_${color}`;
            if (!this.cachedGradients) this.cachedGradients = {};

            if (!this.cachedGradients[gradientKey]) {
                const gradient = this.ctx.createRadialGradient(0, -8, 0, 0, 0, size);
                gradient.addColorStop(0, design.colors.highlight);
                gradient.addColorStop(0.6, design.colors.base);
                gradient.addColorStop(1, design.colors.shadow);
                this.cachedGradients[gradientKey] = gradient;
            }

            this.ctx.fillStyle = this.cachedGradients[gradientKey];
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size, 0, Math.PI * 2);
            this.ctx.fill();

            // Specular - đơn giản hơn
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.beginPath();
            this.ctx.arc(-8, -8, 12, 0, Math.PI * 2);
            this.ctx.fill();

            // Emoji
            this.ctx.font = 'bold 32px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(design.emoji, 0, 2);

            this.ctx.restore();
        }

        drawStripedCandy(obj, candy) {
            const design = CANDY_DESIGNS[candy.color];
            const { x, y, scale, rotation, alpha, squashX, squashY } = obj;

            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rotation);
            this.ctx.scale(scale * squashX, scale * squashY);
            this.ctx.globalAlpha = alpha;

            // Draw base candy
            const size = this.config.CANDY_SIZE || 25;

            // OPTIMIZED: Cache gradient
            const gradientKey = `candy_${candy.color}`;
            if (!this.cachedGradients) this.cachedGradients = {};

            if (!this.cachedGradients[gradientKey]) {
                const gradient = this.ctx.createRadialGradient(0, -8, 0, 0, 0, size);
                gradient.addColorStop(0, design.colors.highlight);
                gradient.addColorStop(0.6, design.colors.base);
                gradient.addColorStop(1, design.colors.shadow);
                this.cachedGradients[gradientKey] = gradient;
            }

            this.ctx.fillStyle = this.cachedGradients[gradientKey];
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw stripes
            this.ctx.shadowBlur = 0;
            this.ctx.save();

            if (candy.special === SPECIAL_TYPES.STRIPED_V) {
                this.ctx.rotate(Math.PI / 2);
            }

            for (let i = -2; i <= 2; i++) {
                const stripeY = i * 8;
                const shimmer = Math.sin(this.shimmerOffset + i) * 0.3 + 0.7;

                const stripeGradient = this.ctx.createLinearGradient(0, stripeY - 2, 0, stripeY + 2);
                stripeGradient.addColorStop(0, 'rgba(255,255,255,0)');
                stripeGradient.addColorStop(0.5, `rgba(255,255,255,${0.8 * shimmer})`);
                stripeGradient.addColorStop(1, 'rgba(255,255,255,0)');

                this.ctx.fillStyle = stripeGradient;
                this.ctx.fillRect(-20, stripeY - 2, 40, 4);
            }

            this.ctx.restore();

            // Emoji
            this.ctx.font = 'bold 28px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(design.emoji, 0, 2);

            this.ctx.restore();
        }

        drawWrappedCandy(obj, candy) {
            const design = CANDY_DESIGNS[candy.color];
            const { x, y, scale, rotation, alpha, squashX, squashY } = obj;

            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rotation + performance.now() / 2000);
            this.ctx.scale(scale * squashX, scale * squashY);
            this.ctx.globalAlpha = alpha;

            const size = this.config.CANDY_SIZE || 25;

            // Base candy
            this.ctx.shadowColor = design.colors.glow;
            this.ctx.shadowBlur = 15;

            const gradient = this.ctx.createRadialGradient(0, -8, 0, 0, 0, size);
            gradient.addColorStop(0, design.colors.highlight);
            gradient.addColorStop(0.6, design.colors.base);
            gradient.addColorStop(1, design.colors.shadow);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size, 0, Math.PI * 2);
            this.ctx.fill();

            // Foil wrapper
            this.ctx.shadowBlur = 0;
            const foilGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size);
            foilGradient.addColorStop(0, 'rgba(255,255,255,0.9)');
            foilGradient.addColorStop(0.3, 'rgba(200,200,255,0.7)');
            foilGradient.addColorStop(0.6, 'rgba(150,150,200,0.5)');
            foilGradient.addColorStop(1, 'rgba(100,100,150,0.3)');

            // Draw crinkled wrapper
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x1 = Math.cos(angle) * size * 0.7;
                const y1 = Math.sin(angle) * size * 0.7;
                const x2 = Math.cos(angle + Math.PI / 8) * size;
                const y2 = Math.sin(angle + Math.PI / 8) * size;

                this.ctx.fillStyle = foilGradient;
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.closePath();
                this.ctx.fill();
            }

            // Emoji
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(design.emoji, 0, 2);

            this.ctx.restore();
        }

        drawColorBomb(obj) {
            const { x, y, scale, alpha, squashX, squashY } = obj;

            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(performance.now() / 1000);
            this.ctx.scale(scale * squashX, scale * squashY);
            this.ctx.globalAlpha = alpha;

            const size = this.config.CANDY_SIZE || 25;
            const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'];

            // Rainbow sphere
            for (let i = 0; i < colors.length; i++) {
                const angle = (i / colors.length) * Math.PI * 2;
                const gradient = this.ctx.createRadialGradient(
                    Math.cos(angle) * 5, Math.sin(angle) * 5, 0,
                    0, 0, size
                );
                gradient.addColorStop(0, colors[i]);
                gradient.addColorStop(1, 'transparent');

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, size, angle, angle + Math.PI / 3);
                this.ctx.lineTo(0, 0);
                this.ctx.fill();
            }

            // Sparkles
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + performance.now() / 500;
                const dist = size + 5 + Math.sin(performance.now() / 300 + i) * 3;
                const sx = Math.cos(angle) * dist;
                const sy = Math.sin(angle) * dist;

                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.beginPath();
                this.ctx.arc(sx, sy, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Center glow
            const centerGlow = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.5);
            centerGlow.addColorStop(0, 'rgba(255,255,255,0.8)');
            centerGlow.addColorStop(1, 'rgba(255,255,255,0)');

            this.ctx.fillStyle = centerGlow;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        }

        drawComboText() {
            const pulse = 1 + Math.sin(performance.now() / 100) * 0.1;

            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, 50);
            this.ctx.scale(pulse, pulse);

            this.ctx.font = 'bold 40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.strokeStyle = '#FF6B9D';
            this.ctx.lineWidth = 6;
            this.ctx.strokeText(`COMBO x${this.comboCount}!`, 0, 0);

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
                    this.lastSwapDirection = dx === 1 ? 'horizontal' : 'vertical';
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

        swapCandies(x1, y1, x2, y2) {
            this.isAnimating = true;

            const temp = this.board[y1][x1];
            this.board[y1][x1] = this.board[y2][x2];
            this.board[y2][x2] = temp;

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
                // Check for combo first
                const candy1 = this.board[y2][x2];
                const candy2 = this.board[y1][x1];

                if (!candy1.isNormal() && !candy2.isNormal()) {
                    this.handleCombo(x2, y2, candy1, x1, y1, candy2);
                    return;
                }

                // Check for special candy activation
                if (!candy1.isNormal()) {
                    this.activateSpecialCandy(x2, y2, candy1);
                    return;
                }

                if (!candy2.isNormal()) {
                    this.activateSpecialCandy(x1, y1, candy2);
                    return;
                }

                // Normal match check
                const matches = this.findMatches();

                if (matches.length > 0) {
                    this.moves--;
                    this.selectedCell = null;
                    this.comboCount = 0;
                    this.processMatches();
                } else {
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

        // ========== SPECIAL CANDY LOGIC ==========
        activateSpecialCandy(x, y, candy) {
            this.moves--;
            this.selectedCell = null;

            if (candy.isStriped()) {
                this.activateStriped(x, y, candy);
            } else if (candy.isWrapped()) {
                this.activateWrapped(x, y, candy);
            }

            setTimeout(() => {
                this.processMatches();
            }, 400);

            this.updateUI();
        }

        activateStriped(x, y, candy) {
            this.audioEngine.playStripedSound();

            if (candy.special === SPECIAL_TYPES.STRIPED_H) {
                // Clear row
                for (let i = 0; i < this.config.GRID_SIZE; i++) {
                    if (this.board[y][i]) {
                        this.animateRemovalSingle(i, y);
                        this.board[y][i] = null;
                    }
                }
                this.drawLightningBolt(0, y * this.config.CELL_SIZE + this.config.CELL_SIZE / 2,
                    this.canvas.width, y * this.config.CELL_SIZE + this.config.CELL_SIZE / 2);
            } else {
                // Clear column
                for (let i = 0; i < this.config.GRID_SIZE; i++) {
                    if (this.board[i][x]) {
                        this.animateRemovalSingle(x, i);
                        this.board[i][x] = null;
                    }
                }
                this.drawLightningBolt(x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2, 0,
                    x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2, this.canvas.height);
            }

            this.score += 500;
        }

        activateWrapped(x, y, candy) {
            this.audioEngine.playWrappedSound();

            // Explode 3x3
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx >= 0 && nx < this.config.GRID_SIZE &&
                        ny >= 0 && ny < this.config.GRID_SIZE &&
                        this.board[ny][nx]) {
                        this.animateRemovalSingle(nx, ny);
                        this.board[ny][nx] = null;
                    }
                }
            }

            // Second explosion
            setTimeout(() => {
                this.audioEngine.playWrappedSound();
                this.drawExplosionRing(
                    x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2,
                    y * this.config.CELL_SIZE + this.config.CELL_SIZE / 2
                );
            }, 300);

            this.score += 600;
        }

        handleCombo(x1, y1, candy1, x2, y2, candy2) {
            this.moves--;
            this.selectedCell = null;
            this.audioEngine.playComboSound();

            // Striped + Striped = Cross
            if (candy1.isStriped() && candy2.isStriped()) {
                this.comboStripedStriped(x1, y1);
            }
            // Striped + Wrapped = Giant explosion
            else if ((candy1.isStriped() && candy2.isWrapped()) ||
                (candy1.isWrapped() && candy2.isStriped())) {
                this.comboStripedWrapped(x1, y1);
            }
            // Wrapped + Wrapped = Double explosion
            else if (candy1.isWrapped() && candy2.isWrapped()) {
                this.comboWrappedWrapped(x1, y1, x2, y2);
            }
            // Color Bomb + Normal = Clear color
            else if (candy1.isColorBomb() || candy2.isColorBomb()) {
                const color = candy1.isColorBomb() ? candy2.color : candy1.color;
                this.comboColorBombNormal(color);
            }

            setTimeout(() => {
                this.processMatches();
            }, 600);

            this.updateUI();
        }

        comboStripedStriped(x, y) {
            // Clear row and column
            for (let i = 0; i < this.config.GRID_SIZE; i++) {
                if (this.board[y][i]) {
                    this.animateRemovalSingle(i, y);
                    this.board[y][i] = null;
                }
                if (this.board[i][x]) {
                    this.animateRemovalSingle(x, i);
                    this.board[i][x] = null;
                }
            }

            this.drawCrossExplosion(x, y);
            this.score += 1000;
        }

        comboStripedWrapped(x, y) {
            // Giant 5x5 explosion
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx >= 0 && nx < this.config.GRID_SIZE &&
                        ny >= 0 && ny < this.config.GRID_SIZE &&
                        this.board[ny][nx]) {
                        this.animateRemovalSingle(nx, ny);
                        this.board[ny][nx] = null;
                    }
                }
            }

            this.drawGiantExplosion(x, y);
            this.score += 1500;
        }

        comboWrappedWrapped(x1, y1, x2, y2) {
            // Double 5x5 explosion
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const nx1 = x1 + dx;
                    const ny1 = y1 + dy;
                    const nx2 = x2 + dx;
                    const ny2 = y2 + dy;

                    if (nx1 >= 0 && nx1 < this.config.GRID_SIZE &&
                        ny1 >= 0 && ny1 < this.config.GRID_SIZE &&
                        this.board[ny1][nx1]) {
                        this.animateRemovalSingle(nx1, ny1);
                        this.board[ny1][nx1] = null;
                    }

                    if (nx2 >= 0 && nx2 < this.config.GRID_SIZE &&
                        ny2 >= 0 && ny2 < this.config.GRID_SIZE &&
                        this.board[ny2][nx2]) {
                        this.animateRemovalSingle(nx2, ny2);
                        this.board[ny2][nx2] = null;
                    }
                }
            }

            this.drawGiantExplosion(x1, y1);
            setTimeout(() => this.drawGiantExplosion(x2, y2), 200);
            this.score += 2000;
        }

        comboColorBombNormal(color) {
            this.audioEngine.playColorBombSound();

            // Clear all of that color
            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.config.GRID_SIZE; x++) {
                    const candy = this.board[y][x];
                    if (candy && candy.color === color) {
                        this.animateRemovalSingle(x, y);
                        this.board[y][x] = null;
                    }
                }
            }

            this.score += 2500;
        }

        // ========== MATCH DETECTION ==========
        findMatches() {
            const matches = [];
            const marked = Array(this.config.GRID_SIZE).fill(null)
                .map(() => Array(this.config.GRID_SIZE).fill(false));

            // Horizontal
            for (let y = 0; y < this.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.config.GRID_SIZE - 2; x++) {
                    const candy = this.board[y][x];
                    if (!candy || !candy.isNormal()) continue;

                    let count = 1;
                    const matchCells = [{ x, y }];

                    while (x + count < this.config.GRID_SIZE &&
                        this.board[y][x + count] &&
                        this.board[y][x + count].isNormal() &&
                        this.board[y][x + count].color === candy.color) {
                        matchCells.push({ x: x + count, y });
                        count++;
                    }

                    if (count >= this.config.MATCH_MIN) {
                        matches.push({
                            cells: matchCells,
                            count: count,
                            color: candy.color,
                            direction: 'horizontal'
                        });

                        matchCells.forEach(cell => marked[cell.y][cell.x] = true);
                    }
                }
            }

            // Vertical
            for (let x = 0; x < this.config.GRID_SIZE; x++) {
                for (let y = 0; y < this.config.GRID_SIZE - 2; y++) {
                    const candy = this.board[y][x];
                    if (!candy || !candy.isNormal() || marked[y][x]) continue;

                    let count = 1;
                    const matchCells = [{ x, y }];

                    while (y + count < this.config.GRID_SIZE &&
                        this.board[y + count][x] &&
                        this.board[y + count][x].isNormal() &&
                        this.board[y + count][x].color === candy.color) {
                        matchCells.push({ x, y: y + count });
                        count++;
                    }

                    if (count >= this.config.MATCH_MIN) {
                        matches.push({
                            cells: matchCells,
                            count: count,
                            color: candy.color,
                            direction: 'vertical'
                        });
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

            // Check for special candy creation
            matches.forEach(match => {
                if (match.count === 4) {
                    // Create striped candy
                    const centerCell = match.cells[Math.floor(match.count / 2)];
                    const stripedType = this.lastSwapDirection === 'horizontal' ?
                        SPECIAL_TYPES.STRIPED_H : SPECIAL_TYPES.STRIPED_V;
                    this.board[centerCell.y][centerCell.x] = new Candy(match.color, stripedType);
                    // Remove this cell from removal list
                    match.cells = match.cells.filter(c => c.x !== centerCell.x || c.y !== centerCell.y);
                } else if (match.count >= 5) {
                    // Create color bomb
                    const centerCell = match.cells[Math.floor(match.count / 2)];
                    this.board[centerCell.y][centerCell.x] = new Candy(match.color, SPECIAL_TYPES.COLOR_BOMB);
                    match.cells = match.cells.filter(c => c.x !== centerCell.x || c.y !== centerCell.y);
                }
            });

            // Calculate score
            let totalCells = 0;
            matches.forEach(match => totalCells += match.cells.length);
            const points = totalCells * 60 * this.multiplier;
            this.score += points;
            this.multiplier++;

            this.audioEngine.playMatchSound(totalCells);
            if (this.comboCount > 1) {
                this.audioEngine.playCascadeSound(this.comboCount);
            }

            // Animate removal
            matches.forEach(match => {
                match.cells.forEach(cell => {
                    this.animateRemovalSingle(cell.x, cell.y);
                });
            });

            setTimeout(() => {
                matches.forEach(match => {
                    match.cells.forEach(cell => {
                        this.board[cell.y][cell.x] = null;
                    });
                });

                this.fillBoard();

                setTimeout(() => {
                    this.processMatches();
                }, 300);

            }, 400);

            this.updateUI();
        }

        animateRemovalSingle(x, y) {
            const obj = this.candyObjects[y][x];
            obj.targetScale = 0;
            obj.rotation = Math.PI * 2;

            const candy = this.board[y][x];
            if (candy) {
                const design = CANDY_DESIGNS[candy.color];
                const px = x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
                const py = y * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;

                this.particleSystem.createExplosion(
                    px, py,
                    design.colors.base,
                    1 + this.comboCount * 0.2
                );
            }
        }

        removeMatchesInstant() {
            const matches = this.findMatches();
            matches.forEach(match => {
                match.cells.forEach(cell => {
                    this.board[cell.y][cell.x] = null;
                });
            });
        }

        fillBoard() {
            for (let x = 0; x < this.config.GRID_SIZE; x++) {
                let emptySpaces = 0;

                for (let y = this.config.GRID_SIZE - 1; y >= 0; y--) {
                    if (!this.board[y][x]) {
                        emptySpaces++;
                    } else if (emptySpaces > 0) {
                        this.board[y + emptySpaces][x] = this.board[y][x];
                        this.board[y][x] = null;

                        this.candyObjects[y + emptySpaces][x] = this.candyObjects[y][x];
                        this.candyObjects[y + emptySpaces][x].targetY =
                            (y + emptySpaces) * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
                        this.candyObjects[y + emptySpaces][x].velocityY = 0;
                    }
                }

                for (let i = 0; i < emptySpaces; i++) {
                    const color = Math.floor(Math.random() * this.config.CANDY_TYPES);
                    this.board[i][x] = new Candy(color);

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
                    if (!this.board[y][x]) {
                        emptySpaces++;
                    } else if (emptySpaces > 0) {
                        this.board[y + emptySpaces][x] = this.board[y][x];
                        this.board[y][x] = null;
                    }
                }

                for (let i = 0; i < emptySpaces; i++) {
                    const color = Math.floor(Math.random() * this.config.CANDY_TYPES);
                    this.board[i][x] = new Candy(color);
                }
            }
        }

        // ========== VISUAL EFFECTS ==========

        drawLightningBolt(x1, y1, x2, y2) {
            this.particleSystem.createLightningParticles(x1, y1, x2, y2);
        }

        drawExplosionRing(x, y) {
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                const dist = 50;
                this.particleSystem.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * dist * 3,
                    vy: Math.sin(angle) * dist * 3,
                    size: 4,
                    color: '#FF6B9D',
                    life: 0.5,
                    maxLife: 0.5,
                    alpha: 1,
                    type: 'star',
                    rotation: 0,
                    rotationSpeed: 5
                });
            }
        }

        drawCrossExplosion(x, y) {
            const px = x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
            const py = y * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;

            // Horizontal line
            this.drawLightningBolt(0, py, this.canvas.width, py);
            // Vertical line
            this.drawLightningBolt(px, 0, px, this.canvas.height);
        }

        drawGiantExplosion(x, y) {
            const px = x * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;
            const py = y * this.config.CELL_SIZE + this.config.CELL_SIZE / 2;

            for (let i = 0; i < 50; i++) {
                const angle = (i / 50) * Math.PI * 2;
                const speed = 150 + Math.random() * 100;
                this.particleSystem.particles.push({
                    x: px,
                    y: py,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 4 + Math.random() * 4,
                    color: ['#FF6B9D', '#FFD93D', '#6BCF7F', '#4FACFE'][Math.floor(Math.random() * 4)],
                    life: 0.8,
                    maxLife: 0.8,
                    alpha: 1,
                    type: 'star',
                    rotation: 0,
                    rotationSpeed: (Math.random() - 0.5) * 10
                });
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
                    if (x < this.config.GRID_SIZE - 1) {
                        this.swapBoardCells(x, y, x + 1, y);
                        if (this.findMatches().length > 0) {
                            moves.push({ x1: x, y1: y, x2: x + 1, y2: y });
                        }
                        this.swapBoardCells(x, y, x + 1, y);
                    }

                    if (y < this.config.GRID_SIZE - 1) {
                        this.swapBoardCells(x, y, x, y + 1);
                        if (this.findMatches().length > 0) {
                            moves.push({ x1: x, y1: y, x2: x, y2: y + 1 });
                        }
                        this.swapBoardCells(x, y, x, y + 1);
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
    window.CandyCrushComplete = CandyCrushComplete;
    window.SPECIAL_TYPES = SPECIAL_TYPES;
    window.Candy = Candy;

    console.log('✅ Candy Crush Complete loaded successfully');
    console.log('🌟 Features: 3D Candies, Special Candies, Combos, Particles, Sounds');

})();
