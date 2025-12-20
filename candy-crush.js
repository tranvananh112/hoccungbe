/* ========================================
   CANDY CRUSH SAGA - GAME CHO TRẺ EM
   Phiên bản đơn giản hóa, phù hợp 3-7 tuổi
   ======================================== */

(function () {
    'use strict';

    console.log('🍬 Loading Candy Crush Game...');

    // ========== CẤU HÌNH GAME ==========
    var CONFIG = {
        GRID_SIZE: 8,
        CELL_SIZE: 60,
        CANDY_TYPES: 5, // 5 màu kẹo
        MOVES_LIMIT: 30,
        MATCH_MIN: 3,
        ANIMATION_SPEED: 300,
        HINT_DELAY: 5000, // 5s không chơi → hiện hint
        COLORS: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'], // Đỏ, xanh lá, xanh dương, cam, xanh nhạt
        EMOJIS: ['🍬', '🍭', '🍫', '🍩', '🍪']
    };

    // ========== CANDY CRUSH GAME ==========
    var CandyCrushGame = {
        canvas: null,
        ctx: null,
        board: [],
        score: 0,
        moves: CONFIG.MOVES_LIMIT,
        selectedCell: null,
        isAnimating: false,
        hintTimer: null,
        multiplier: 1,
        targetScore: 1000,

        init: function (canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return false;

            this.ctx = this.canvas.getContext('2d');
            this.score = 0;
            this.moves = CONFIG.MOVES_LIMIT;
            this.multiplier = 1;
            this.selectedCell = null;

            this.generateBoard();
            this.draw();
            this.updateUI();
            this.startHintTimer();

            return true;
        },

        // ========== TẠO BOARD ==========
        generateBoard: function () {
            this.board = [];

            // Tạo board ngẫu nhiên
            for (var y = 0; y < CONFIG.GRID_SIZE; y++) {
                var row = [];
                for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                    row.push(this.getRandomCandy());
                }
                this.board.push(row);
            }

            // Xóa matches ban đầu
            while (this.findMatches().length > 0) {
                this.removeMatches();
                this.fillBoard();
            }
        },

        getRandomCandy: function () {
            return Math.floor(Math.random() * CONFIG.CANDY_TYPES);
        },

        // ========== VẼ BOARD ==========
        draw: function () {
            // Background
            this.ctx.fillStyle = '#FFF5E1';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw grid
            for (var y = 0; y < CONFIG.GRID_SIZE; y++) {
                for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                    var cellX = x * CONFIG.CELL_SIZE;
                    var cellY = y * CONFIG.CELL_SIZE;

                    // Cell background
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.fillRect(cellX + 2, cellY + 2, CONFIG.CELL_SIZE - 4, CONFIG.CELL_SIZE - 4);

                    // Border
                    this.ctx.strokeStyle = '#E0E0E0';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(cellX + 2, cellY + 2, CONFIG.CELL_SIZE - 4, CONFIG.CELL_SIZE - 4);

                    // Highlight selected
                    if (this.selectedCell &&
                        this.selectedCell.x === x &&
                        this.selectedCell.y === y) {
                        this.ctx.fillStyle = 'rgba(255, 230, 109, 0.5)';
                        this.ctx.fillRect(cellX + 2, cellY + 2, CONFIG.CELL_SIZE - 4, CONFIG.CELL_SIZE - 4);
                    }

                    // Draw candy
                    var candy = this.board[y][x];
                    if (candy !== null && candy !== undefined) {
                        this.drawCandy(cellX, cellY, candy);
                    }
                }
            }
        },

        drawCandy: function (x, y, type) {
            var centerX = x + CONFIG.CELL_SIZE / 2;
            var centerY = y + CONFIG.CELL_SIZE / 2;

            // Draw emoji
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(CONFIG.EMOJIS[type], centerX, centerY);
        },

        // ========== XỬ LÝ CLICK ==========
        handleClick: function (x, y) {
            if (this.isAnimating || this.moves <= 0) return;

            var cellX = Math.floor(x / CONFIG.CELL_SIZE);
            var cellY = Math.floor(y / CONFIG.CELL_SIZE);

            if (cellX < 0 || cellX >= CONFIG.GRID_SIZE ||
                cellY < 0 || cellY >= CONFIG.GRID_SIZE) return;

            if (!this.selectedCell) {
                // Chọn ô đầu tiên
                this.selectedCell = { x: cellX, y: cellY };
                this.draw();
            } else {
                // Kiểm tra ô thứ 2 có liền kề không
                var dx = Math.abs(cellX - this.selectedCell.x);
                var dy = Math.abs(cellY - this.selectedCell.y);

                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                    // Swap
                    this.swap(this.selectedCell.x, this.selectedCell.y, cellX, cellY);
                } else {
                    // Chọn ô mới
                    this.selectedCell = { x: cellX, y: cellY };
                    this.draw();
                }
            }

            this.resetHintTimer();
        },

        // ========== SWAP KẸO ==========
        swap: function (x1, y1, x2, y2) {
            var temp = this.board[y1][x1];
            this.board[y1][x1] = this.board[y2][x2];
            this.board[y2][x2] = temp;

            this.draw();

            // Kiểm tra match
            var matches = this.findMatches();

            if (matches.length > 0) {
                // Valid swap
                this.moves--;
                this.selectedCell = null;
                this.processMatches();
            } else {
                // Invalid swap - undo
                setTimeout(function () {
                    this.board[y2][x2] = this.board[y1][x1];
                    this.board[y1][x1] = temp;
                    this.selectedCell = null;
                    this.draw();
                }.bind(this), 300);
            }

            this.updateUI();
        },

        // ========== TÌM MATCHES ==========
        findMatches: function () {
            var matches = [];
            var marked = [];

            // Khởi tạo marked array
            for (var y = 0; y < CONFIG.GRID_SIZE; y++) {
                marked[y] = [];
                for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                    marked[y][x] = false;
                }
            }

            // Tìm matches ngang
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

            // Tìm matches dọc
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

        // ========== XỬ LÝ MATCHES ==========
        processMatches: function () {
            this.isAnimating = true;

            var matches = this.findMatches();
            if (matches.length === 0) {
                this.isAnimating = false;
                this.multiplier = 1;
                this.checkGameOver();
                return;
            }

            // Tính điểm
            var points = matches.length * 60 * this.multiplier;
            this.score += points;
            this.multiplier++;

            // Xóa matches
            this.removeMatches();

            // Animation delay
            setTimeout(function () {
                this.fillBoard();
                this.draw();

                // Kiểm tra cascade
                setTimeout(function () {
                    this.processMatches(); // Đệ quy cho cascade
                }.bind(this), CONFIG.ANIMATION_SPEED);

            }.bind(this), CONFIG.ANIMATION_SPEED);

            this.updateUI();
        },

        removeMatches: function () {
            var matches = this.findMatches();
            matches.forEach(function (match) {
                this.board[match.y][match.x] = null;
            }.bind(this));
        },

        // ========== FILL BOARD (GRAVITY) ==========
        fillBoard: function () {
            // Rơi xuống
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

                // Thêm kẹo mới từ trên
                for (var i = 0; i < emptySpaces; i++) {
                    this.board[i][x] = this.getRandomCandy();
                }
            }
        },

        // ========== TÌM HINT ==========
        findPossibleMoves: function () {
            var moves = [];

            for (var y = 0; y < CONFIG.GRID_SIZE; y++) {
                for (var x = 0; x < CONFIG.GRID_SIZE; x++) {
                    // Thử swap phải
                    if (x < CONFIG.GRID_SIZE - 1) {
                        this.swap(x, y, x + 1, y);
                        if (this.findMatches().length > 0) {
                            moves.push({ x1: x, y1: y, x2: x + 1, y2: y });
                        }
                        this.swap(x + 1, y, x, y); // Undo
                    }

                    // Thử swap xuống
                    if (y < CONFIG.GRID_SIZE - 1) {
                        this.swap(x, y, x, y + 1);
                        if (this.findMatches().length > 0) {
                            moves.push({ x1: x, y1: y, x2: x, y2: y + 1 });
                        }
                        this.swap(x, y + 1, x, y); // Undo
                    }
                }
            }

            return moves;
        },

        showHint: function () {
            var moves = this.findPossibleMoves();
            if (moves.length > 0) {
                var hint = moves[0];

                // Vẽ mũi tên hint
                this.draw();
                this.drawHintArrow(hint.x1, hint.y1, hint.x2, hint.y2);
            }
        },

        drawHintArrow: function (x1, y1, x2, y2) {
            var startX = x1 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
            var startY = y1 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
            var endX = x2 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;
            var endY = y2 * CONFIG.CELL_SIZE + CONFIG.CELL_SIZE / 2;

            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();

            // Arrow head
            var angle = Math.atan2(endY - startY, endX - startX);
            this.ctx.beginPath();
            this.ctx.moveTo(endX, endY);
            this.ctx.lineTo(
                endX - 10 * Math.cos(angle - Math.PI / 6),
                endY - 10 * Math.sin(angle - Math.PI / 6)
            );
            this.ctx.lineTo(
                endX - 10 * Math.cos(angle + Math.PI / 6),
                endY - 10 * Math.sin(angle + Math.PI / 6)
            );
            this.ctx.closePath();
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fill();
        },

        // ========== HINT TIMER ==========
        startHintTimer: function () {
            this.hintTimer = setTimeout(function () {
                if (!this.isAnimating && !this.selectedCell) {
                    this.showHint();
                }
            }.bind(this), CONFIG.HINT_DELAY);
        },

        resetHintTimer: function () {
            if (this.hintTimer) {
                clearTimeout(this.hintTimer);
            }
            this.startHintTimer();
        },

        // ========== UPDATE UI ==========
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

        // ========== KIỂM TRA GAME OVER ==========
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

        // ========== RESET GAME ==========
        reset: function () {
            this.score = 0;
            this.moves = CONFIG.MOVES_LIMIT;
            this.multiplier = 1;
            this.selectedCell = null;
            this.generateBoard();
            this.draw();
            this.updateUI();
            this.resetHintTimer();
        }
    };

    // ========== EXPORT ==========
    window.CandyCrushGame = CandyCrushGame;

    console.log('✅ Candy Crush Game loaded');

})();
