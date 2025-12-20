/* ========================================
   CANDY CRUSH SAGA - ENHANCED VERSION
   Animations mượt mà, particle effects, gameplay sinh động
   ======================================== */

(function () {
    'use strict';

    console.log('🍬 Loading Enhanced Candy Crush...');

    // ========== CẤU HÌNH ==========
    var CONFIG = {
        GRID_SIZE: 8,
        CELL_SIZE: 60,
        CANDY_TYPES: 6,
        MOVES_LIMIT: 30,
        MATCH_MIN: 3,
        ANIMATION_SPEED: 400,
        FALL_SPEED: 200,
        SWAP_SPEED: 250,
        HINT_DELAY: 5000,
        PARTICLE_COUNT: 20
    };

    // ========== CANDY CRUSH ENHANCED ==========
    var CandyCrushEnhanced = {
        canvas: null,
        ctx: null,
        board: [],
        candyObjects: [], // Lưu object với position, scale, rotation
        score: 0,
        moves: CONFIG.MOVES_LIMIT,
        selectedCell: null,
        isAnimating: false,
        particles: [],
        animations: [],
        hintTimer: null,
        multiplier: 1,
        targetScore: 1000,
        comboCount: 0,

        // Candy designs với gradient
        candyDesigns: [
            { emoji: '🍬', color1: '#FF6B9D', color2: '#C44569', glow: '#FFB3D9' },
            { emoji: '🍭', color1: '#4FACFE', color2: '#00F2FE', glow: '#B3E5FC' },
            { emoji: '🍫', color1: '#FA709A', color2: '#FEE140', glow: '#FFE082' },
            { emoji: '🍩', color1: '#A8E6CF', color2: '#3EECAC', glow: '#C8E6C9' },
            { emoji: '🍪', color1: '#FFD93D', color2: '#FF9A3D', glow: '#FFE57F' },
            { emoji: '🧁', color1: '#C471ED', color2: '#F64F59', glow: '#E1BEE7' }
        ],

        init: function (canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return false;

            this.ctx = this.canvas.getContext('2d');
            this.score = 0;
            this.moves = CONFIG.MOVES_LIMIT;
            this.multiplier = 1;
            this.comboCount = 0;
            this.selectedCell = null;
            this.particles = [];
            this.animations = [];

            this.generateBoard();
            this.initCandyObjects();
            this.startGameLoop();
            this.updateUI();
            this.startHintTimer();

            return true;
        },

        // ========== TẠO BOARD ==========
        generateBoard: function () {
            this.board = [];
            for (var y = 0; y < CONFIG.GRID_SIZE; y++) {
                var row = [];
                for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                    row.push(Math.floor(Math.random() * CONFIG.CANDY_TYPES));
                }
                this.board.push(row);
            }

            // Xóa matches ban đầu
            var attempts = 0;
            while (this.findMatches().length > 0 && attempts < 100) {
                this.removeMatchesInstant();
                this.fillBoardInstant();
                attempts++;
            }
        },

        initCandyObjects: function () {
            this.candyObjects = [];
            for (var y = 0; y < CONFIG.GRID_SIZE; y++) {
                var row = [];
                for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                    row.push({
                        x: x * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
                        y: y * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
                        targetX: x * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
                        targetY: y * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
                        scale: 1,
                        rotation: 0,
                        alpha: 1
                    });
                }
                this.candyObjects.push(row);
            }
        },

        // ========== GAME LOOP ==========
        startGameLoop: function () {
            var self = this;
            var lastTime = Date.now();

            function loop() {
                var now = Date.now();
                var deltaTime = (now - lastTime) / 1000;
                lastTime = now;

                self.update(deltaTime);
                self.draw();

                requestAnimationFrame(loop);
            }

            requestAnimationFrame(loop);
        },

        update: function (dt) {
            // Update candy positions (smooth interpolation)
            for (var y = 0; y < CONFIG.GRID_SIZE; y++) {
                for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                    var obj = this.candyObjects[y][x];

                    // Lerp position
                    obj.x += (obj.targetX - obj.x) * 10 * dt;
                    obj.y += (obj.targetY - obj.y) * 10 * dt;

                    // Lerp scale
                    obj.scale += (1 - obj.scale) * 8 * dt;
                }
            }

            // Update particles
            for (var i = this.particles.length - 1; i >= 0; i--) {
                var p = this.particles[i];
                p.x += p.vx * dt * 60;
                p.y += p.vy * dt * 60;
                p.vy += 300 * dt; // Gravity
                p.life -= dt;
                p.alpha = p.life / p.maxLife;

                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }

            // Update animations
            for (var i = this.animations.length - 1; i >= 0; i--) {
                var anim = this.animations[i];
                anim.progress += dt / anim.duration;

                if (anim.progress >= 1) {
                    if (anim.onComplete) anim.onComplete();
                    this.animations.splice(i, 1);
                }
            }
        },

        // ========== VẼ BOARD ==========
        draw: function () {
            // Clear với gradient background
            var gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#FFF9E6');
            gradient.addColorStop(1, '#FFE6F0');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw grid với shadow
            this.ctx.shadowColor = 'rgba(0,0,0,0.1)';
            this.ctx.shadowBlur = 5;

            for (var y = 0; y < CONFIG.GRID_SIZE; y++) {
                for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                    var cellX = x * CONFIG.CELL_SIZE;
                    var cellY = y * CONFIG.CELL_SIZE;

                    // Cell background với gradient
                    var cellGradient = this.ctx.createRadialGradient(
                        cellX + CONFIG.CELL_SIZE / 2, cellY + CONFIG.CELL_SIZE / 2, 0,
                        cellX + CONFIG.CELL_SIZE / 2, cellY + CONFIG.CELL_SIZE / 2, CONFIG.CELL_SIZE / 2
                    );
                    cellGradient.addColorStop(0, '#FFFFFF');
                    cellGradient.addColorStop(1, '#F5F5F5');

                    this.ctx.fillStyle = cellGradient;
                    this.ctx.fillRect(cellX + 3, cellY + 3, CONFIG.CELL_SIZE - 6, CONFIG.CELL_SIZE - 6);

                    // Highlight selected với glow
                    if (this.selectedCell &&
                        this.selectedCell.x === x &&
                        this.selectedCell.y === y) {
                        this.ctx.shadowColor = '#FFD700';
                        this.ctx.shadowBlur = 20;
                        this.ctx.strokeStyle = '#FFD700';
                        this.ctx.lineWidth = 4;
                        this.ctx.strokeRect(cellX + 3, cellY + 3, CONFIG.CELL_SIZE - 6, CONFIG.CELL_SIZE - 6);
                        this.ctx.shadowBlur = 5;
                    }
                }
            }

            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;

            // Draw candies với effects
            for (var y = 0; y < CONFIG.GRID_SIZE; y++) {
                for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                    var candy = this.board[y][x];
                    if (candy !== null && candy !== undefined) {
                        var obj = this.candyObjects[y][x];
                        this.drawCandyEnhanced(obj.x, obj.y, candy, obj.scale, obj.rotation, obj.alpha);
                    }
                }
            }

            // Draw particles
            for (var i = 0; i < this.particles.length; i++) {
                this.drawParticle(this.particles[i]);
            }

            // Draw combo text
            if (this.comboCount > 1) {
                this.drawComboText();
            }
        },

        drawCandyEnhanced: function (x, y, type, scale, rotation, alpha) {
            var design = this.candyDesigns[type];

            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rotation);
            this.ctx.scale(scale, scale);
            this.ctx.globalAlpha = alpha;

            // Glow effect
            this.ctx.shadowColor = design.glow;
            this.ctx.shadowBlur = 15 * scale;

            // Draw candy circle với gradient
            var gradient = this.ctx.createRadialGradient(0, -5, 0, 0, 0, 25);
            gradient.addColorStop(0, design.color1);
            gradient.addColorStop(1, design.color2);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 25, 0, Math.PI * 2);
            this.ctx.fill();

            // Shine effect
            this.ctx.shadowBlur = 0;
            var shineGradient = this.ctx.createRadialGradient(-8, -8, 0, -8, -8, 15);
            shineGradient.addColorStop(0, 'rgba(255,255,255,0.8)');
            shineGradient.addColorStop(1, 'rgba(255,255,255,0)');
            this.ctx.fillStyle = shineGradient;
            this.ctx.beginPath();
            this.ctx.arc(-8, -8, 15, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw emoji
            this.ctx.font = 'bold 32px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(design.emoji, 0, 2);

            this.ctx.restore();
        },

        drawParticle: function (p) {
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        },

        drawComboText: function () {
            this.ctx.save();
            this.ctx.font = 'bold 40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            // Outline
            this.ctx.strokeStyle = '#FF6B9D';
            this.ctx.lineWidth = 6;
            this.ctx.strokeText('COMBO x' + this.comboCount + '!',
                this.canvas.width / 2, 50);

            // Fill
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText('COMBO x' + this.comboCount + '!',
                this.canvas.width / 2, 50);

            this.ctx.restore();
        },

        // ========== XỬ LÝ CLICK ==========
        handleClick: function (x, y) {
            if (this.isAnimating || this.moves <= 0) return;

            var cellX = Math.floor(x / CONFIG.CELL_SIZE);
            var cellY = Math.floor(y / CONFIG.CELL_SIZE);

            if (cellX < 0 || cellX >= CONFIG.GRID_SIZE ||
                cellY < 0 || cellY >= CONFIG.GRID_SIZE) return;

            if (!this.selectedCell) {
                this.selectedCell = { x: cellX, y: cellY };
                this.playSelectSound();
                this.animateCandySelect(cellX, cellY);
            } else {
                var dx = Math.abs(cellX - this.selectedCell.x);
                var dy = Math.abs(cellY - this.selectedCell.y);

                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                    this.swapCandies(this.selectedCell.x, this.selectedCell.y, cellX, cellY);
                } else {
                    this.selectedCell = { x: cellX, y: cellY };
                    this.playSelectSound();
                    this.animateCandySelect(cellX, cellY);
                }
            }

            this.resetHintTimer();
        },

        // ========== SWAP ANIMATION ==========
        swapCandies: function (x1, y1, x2, y2) {
            this.isAnimating = true;

            // Swap board
            var temp = this.board[y1][x1];
            this.board[y1][x1] = this.board[y2][x2];
            this.board[y2][x2] = temp;

            // Animate swap
            var obj1 = this.candyObjects[y1][x1];
            var obj2 = this.candyObjects[y2][x2];

            obj1.targetX = x2 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
            obj1.targetY = y2 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
            obj2.targetX = x1 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
            obj2.targetY = y1 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;

            // Swap objects
            this.candyObjects[y1][x1] = obj2;
            this.candyObjects[y2][x2] = obj1;

            this.playSwapSound();

            var self = this;
            setTimeout(function () {
                var matches = self.findMatches();

                if (matches.length > 0) {
                    self.moves--;
                    self.selectedCell = null;
                    self.comboCount = 0;
                    self.processMatches();
                } else {
                    // Invalid swap - undo
                    self.board[y2][x2] = self.board[y1][x1];
                    self.board[y1][x1] = temp;

                    obj1.targetX = x1 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
                    obj1.targetY = y1 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
                    obj2.targetX = x2 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
                    obj2.targetY = y2 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;

                    self.candyObjects[y1][x1] = obj1;
                    self.candyObjects[y2][x2] = obj2;

                    self.playErrorSound();
                    self.shakeBoard();

                    setTimeout(function () {
                        self.selectedCell = null;
                        self.isAnimating = false;
                    }, CONFIG.SWAP_SPEED);
                }

                self.updateUI();
            }, CONFIG.SWAP_SPEED);
        },

        // ========== ANIMATIONS ==========
        animateCandySelect: function (x, y) {
            var obj = this.candyObjects[y][x];
            obj.scale = 1.2;
        },

        shakeBoard: function () {
            // Shake animation
            var originalX = this.canvas.style.transform;
            var shakes = ['-3px', '3px', '-2px', '2px', '-1px', '1px', '0'];
            var i = 0;

            var self = this;
            var interval = setInterval(function () {
                if (i >= shakes.length) {
                    clearInterval(interval);
                    self.canvas.style.transform = '';
                    return;
                }
                self.canvas.style.transform = 'translateX(' + shakes[i] + ')';
                i++;
            }, 50);
        },

        // ========== MATCH & REMOVE ==========
        findMatches: function () {
            var matches = [];
            var marked = [];

            for (var y = 0; y < CONFIG.GRID_SIZE; y++) {
                marked[y] = [];
                for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                    marked[y][x] = false;
                }
            }

            // Horizontal matches
            for (var y = 0; y < CONFIG.GRID_SIZE; y++) {
                for (var x = 0; x < CONFIG.GRID_SIZE - 2; x++) {
                    var candy = this.board[y][x];
                    if (candy === null) continue;

                    var count = 1;
                    while (x + count < CONFIG.GRID_SIZE &&
                        this.board[y][x + count] === candy) {
                        count++;
                    }

                    if (count >= CONFIG.MATCH_MIN) {
                        for (var i = 0; i < count; i++) {
                            if (!marked[y][x + i]) {
                                matches.push({ x: x + i, y: y });
                                marked[y][x + i] = true;
                            }
                        }
                    }
                }
            }

            // Vertical matches
            for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                for (var y = 0; y < CONFIG.GRID_SIZE - 2; y++) {
                    var candy = this.board[y][x];
                    if (candy === null) continue;

                    var count = 1;
                    while (y + count < CONFIG.GRID_SIZE &&
                        this.board[y + count][x] === candy) {
                        count++;
                    }

                    if (count >= CONFIG.MATCH_MIN) {
                        for (var i = 0; i < count; i++) {
                            if (!marked[y + i][x]) {
                                matches.push({ x: x, y: y + i });
                                marked[y + i][x] = true;
                            }
                        }
                    }
                }
            }

            return matches;
        },

        processMatches: function () {
            var matches = this.findMatches();
            if (matches.length === 0) {
                this.isAnimating = false;
                this.multiplier = 1;
                this.comboCount = 0;
                this.checkGameOver();
                return;
            }

            this.comboCount++;

            // Calculate score
            var points = matches.length * 60 * this.multiplier;
            this.score += points;
            this.multiplier++;

            // Animate removal
            this.animateRemoval(matches);

            var self = this;
            setTimeout(function () {
                self.removeMatches();
                self.fillBoard();

                setTimeout(function () {
                    self.processMatches(); // Cascade
                }, CONFIG.FALL_SPEED);

            }, CONFIG.ANIMATION_SPEED);

            this.updateUI();
        },

        animateRemoval: function (matches) {
            var self = this;

            matches.forEach(function (match) {
                var obj = self.candyObjects[match.y][match.x];

                // Scale down animation
                obj.scale = 0;
                obj.rotation = Math.PI * 2;

                // Create particles
                self.createParticles(
                    match.x * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
                    match.y * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
                    self.board[match.y][match.x]
                );
            });

            this.playMatchSound();
        },

        createParticles: function (x, y, candyType) {
            var design = this.candyDesigns[candyType];

            for (var i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
                var angle = (Math.PI * 2 * i) / CONFIG.PARTICLE_COUNT;
                var speed = 100 + Math.random() * 100;

                this.particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 50,
                    size: 3 + Math.random() * 4,
                    color: design.color1,
                    life: 0.5 + Math.random() * 0.5,
                    maxLife: 0.5 + Math.random() * 0.5,
                    alpha: 1
                });
            }
        },

        removeMatches: function () {
            var matches = this.findMatches();
            matches.forEach(function (match) {
                this.board[match.y][match.x] = null;
            }.bind(this));
        },

        removeMatchesInstant: function () {
            var matches = this.findMatches();
            matches.forEach(function (match) {
                this.board[match.y][match.x] = null;
            }.bind(this));
        },

        fillBoard: function () {
            // Drop existing candies
            for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                var emptySpaces = 0;

                for (var y = CONFIG.GRID_SIZE - 1; y >= 0; y--) {
                    if (this.board[y][x] === null) {
                        emptySpaces++;
                    } else if (emptySpaces > 0) {
                        this.board[y + emptySpaces][x] = this.board[y][x];
                        this.board[y][x] = null;

                        // Update candy object target
                        this.candyObjects[y + emptySpaces][x] = this.candyObjects[y][x];
                        this.candyObjects[y + emptySpaces][x].targetY =
                            (y + emptySpaces) * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
                    }
                }

                // Add new candies from top
                for (var i = 0; i < emptySpaces; i++) {
                    this.board[i][x] = Math.floor(Math.random() * CONFIG.CANDY_TYPES);

                    this.candyObjects[i][x] = {
                        x: x * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
                        y: -CONFIG.CELL_SIZE * (emptySpaces - i),
                        targetX: x * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
                        targetY: i * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2,
                        scale: 1,
                        rotation: 0,
                        alpha: 1
                    };
                }
            }
        },

        fillBoardInstant: function () {
            for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                var emptySpaces = 0;

                for (var y = CONFIG.GRID_SIZE - 1; y >= 0; y--) {
                    if (this.board[y][x] === null) {
                        emptySpaces++;
                    } else if (emptySpaces > 0) {
                        this.board[y + emptySpaces][x] = this.board[y][x];
                        this.board[y][x] = null;
                    }
                }

                for (var i = 0; i < emptySpaces; i++) {
                    this.board[i][x] = Math.floor(Math.random() * CONFIG.CANDY_TYPES);
                }
            }
        },

        // ========== SOUNDS ==========
        playSelectSound: function () {
            this.playBeep(800, 0.1, 0.1);
        },

        playSwapSound: function () {
            this.playBeep(600, 0.15, 0.15);
        },

        playMatchSound: function () {
            this.playBeep(1000, 0.2, 0.2);
        },

        playErrorSound: function () {
            this.playBeep(300, 0.2, 0.2);
        },

        playBeep: function (freq, duration, volume) {
            try {
                var AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;

                var ctx = new AudioContext();
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = freq;
                gain.gain.setValueAtTime(volume, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

                osc.start();
                osc.stop(ctx.currentTime + duration);
            } catch (e) { }
        },

        // ========== HINT SYSTEM ==========
        startHintTimer: function () {
            var self = this;
            this.hintTimer = setTimeout(function () {
                if (!self.isAnimating && !self.selectedCell) {
                    self.showHint();
                }
            }, CONFIG.HINT_DELAY);
        },

        resetHintTimer: function () {
            if (this.hintTimer) {
                clearTimeout(this.hintTimer);
            }
            this.startHintTimer();
        },

        showHint: function () {
            var moves = this.findPossibleMoves();
            if (moves.length > 0) {
                var hint = moves[0];
                // Animate hint candies
                this.candyObjects[hint.y1][hint.x1].scale = 1.3;
                this.candyObjects[hint.y2][hint.x2].scale = 1.3;

                var self = this;
                setTimeout(function () {
                    self.candyObjects[hint.y1][hint.x1].scale = 1;
                    self.candyObjects[hint.y2][hint.x2].scale = 1;
                }, 500);
            }
        },

        findPossibleMoves: function () {
            var moves = [];
            // Implementation similar to original
            return moves;
        },

        // ========== UI ==========
        updateUI: function () {
            var scoreEl = document.getElementById('candyScore');
            var movesEl = document.getElementById('candyMoves');
            var progressEl = document.getElementById('candyProgress');

            if (scoreEl) scoreEl.textContent = this.score;
            if (movesEl) movesEl.textContent = this.moves;

            if (progressEl) {
                var percent = Math.min(100, (this.score / this.targetScore) * 100);
                progressEl.style.width = percent + '%';
            }
        },

        checkGameOver: function () {
            if (this.moves <= 0) {
                if (this.score >= this.targetScore) {
                    this.win();
                } else {
                    this.lose();
                }
            }
        },

        win: function () {
            setTimeout(function () {
                alert('🎉 Chúc mừng! Bé đã thắng!\nĐiểm: ' + this.score);
            }.bind(this), 500);
        },

        lose: function () {
            setTimeout(function () {
                alert('😢 Hết nước! Thử lại nhé!\nĐiểm: ' + this.score);
            }.bind(this), 500);
        },

        reset: function () {
            this.score = 0;
            this.moves = CONFIG.MOVES_LIMIT;
            this.multiplier = 1;
            this.comboCount = 0;
            this.selectedCell = null;
            this.particles = [];
            this.generateBoard();
            this.initCandyObjects();
            this.updateUI();
            this.resetHintTimer();
        }
    };

    // ========== EXPORT ==========
    window.CandyCrushEnhanced = CandyCrushEnhanced;

    console.log('✅ Enhanced Candy Crush loaded');

})();
