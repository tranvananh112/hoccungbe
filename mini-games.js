/* ========================================
   HỆ THỐNG MINI-GAME PHẦN THƯỞNG
   Trò chơi xếp hình mở khóa khi hoàn thành câu
   ======================================== */

(function () {
    'use strict';

    console.log('🎮 Loading Mini-Games System...');

    // ========== CẤU HÌNH MỞ KHÓA GAME ==========
    var GAME_UNLOCK_CONFIG = {
        tetris: {
            name: 'Tetris',
            icon: '🧱',
            requiredSentences: 0, // ✅ MỞ KHÓA NGAY
            description: 'Xếp gạch cổ điển'
        },
        blockPuzzle: {
            name: 'Xếp Khối',
            icon: '🔲',
            requiredSentences: 0, // ✅ MỞ KHÓA NGAY
            description: 'Ghép khối màu sắc'
        },
        candyMatch: {
            name: 'Ghép Kẹo',
            icon: '🍬',
            requiredSentences: 0, // ✅ MỞ KHÓA NGAY
            description: 'Ghép 3 kẹo cùng màu'
        },
        jigsaw: {
            name: 'Ghép Hình',
            icon: '🧩',
            requiredSentences: 0, // ✅ MỞ KHÓA NGAY
            description: 'Ghép tranh động vật'
        }
    };

    // ========== KIỂM TRA GAME ĐÃ MỞ KHÓA ==========
    function isGameUnlocked(gameId, totalSentences) {
        // ✅ TẤT CẢ GAME ĐỀU MỞ KHÓA
        return true;
    }

    // ========== LẤY DANH SÁCH GAME KHẢ DỤNG ==========
    function getAvailableGames(totalSentences) {
        var games = [];
        for (var gameId in GAME_UNLOCK_CONFIG) {
            var config = GAME_UNLOCK_CONFIG[gameId];
            var unlocked = isGameUnlocked(gameId, totalSentences);
            games.push({
                id: gameId,
                name: config.name,
                icon: config.icon,
                description: config.description,
                required: config.requiredSentences,
                unlocked: unlocked,
                progress: Math.min(100, (totalSentences / config.requiredSentences) * 100)
            });
        }
        return games;
    }

    // ========== TETRIS GAME ==========
    var TetrisGame = {
        canvas: null,
        ctx: null,
        board: [],
        currentPiece: null,
        score: 0,
        gameLoop: null,

        pieces: [
            [[1, 1, 1, 1]], // I
            [[1, 1], [1, 1]], // O
            [[1, 1, 1], [0, 1, 0]], // T
            [[1, 1, 1], [1, 0, 0]], // L
            [[1, 1, 1], [0, 0, 1]], // J
            [[1, 1, 0], [0, 1, 1]], // S
            [[0, 1, 1], [1, 1, 0]]  // Z
        ],

        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'],

        init: function (canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return false;

            this.ctx = this.canvas.getContext('2d');
            this.board = Array(20).fill(null).map(() => Array(10).fill(0));
            this.score = 0;
            this.spawnPiece();
            return true;
        },

        spawnPiece: function () {
            var pieceIndex = Math.floor(Math.random() * this.pieces.length);
            this.currentPiece = {
                shape: this.pieces[pieceIndex],
                color: this.colors[pieceIndex],
                x: 3,
                y: 0
            };
        },

        draw: function () {
            // Clear canvas
            this.ctx.fillStyle = '#2C3E50';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw board
            var cellSize = 30;
            for (var y = 0; y < 20; y++) {
                for (var x = 0; x < 10; x++) {
                    if (this.board[y][x]) {
                        this.ctx.fillStyle = this.board[y][x];
                        this.ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
                    }
                }
            }

            // Draw current piece
            if (this.currentPiece) {
                this.ctx.fillStyle = this.currentPiece.color;
                var shape = this.currentPiece.shape;
                for (var y = 0; y < shape.length; y++) {
                    for (var x = 0; x < shape[y].length; x++) {
                        if (shape[y][x]) {
                            this.ctx.fillRect(
                                (this.currentPiece.x + x) * cellSize,
                                (this.currentPiece.y + y) * cellSize,
                                cellSize - 1, cellSize - 1
                            );
                        }
                    }
                }
            }
        },

        moveDown: function () {
            this.currentPiece.y++;
            if (this.checkCollision()) {
                this.currentPiece.y--;
                this.mergePiece();
                this.clearLines();
                this.spawnPiece();
                if (this.checkCollision()) {
                    this.gameOver();
                }
            }
        },

        moveLeft: function () {
            this.currentPiece.x--;
            if (this.checkCollision()) this.currentPiece.x++;
        },

        moveRight: function () {
            this.currentPiece.x++;
            if (this.checkCollision()) this.currentPiece.x--;
        },

        rotate: function () {
            var shape = this.currentPiece.shape;
            var rotated = shape[0].map((_, i) => shape.map(row => row[i]).reverse());
            var oldShape = this.currentPiece.shape;
            this.currentPiece.shape = rotated;
            if (this.checkCollision()) this.currentPiece.shape = oldShape;
        },

        checkCollision: function () {
            var shape = this.currentPiece.shape;
            for (var y = 0; y < shape.length; y++) {
                for (var x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        var newX = this.currentPiece.x + x;
                        var newY = this.currentPiece.y + y;
                        if (newX < 0 || newX >= 10 || newY >= 20) return true;
                        if (newY >= 0 && this.board[newY][newX]) return true;
                    }
                }
            }
            return false;
        },

        mergePiece: function () {
            var shape = this.currentPiece.shape;
            for (var y = 0; y < shape.length; y++) {
                for (var x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        var boardY = this.currentPiece.y + y;
                        var boardX = this.currentPiece.x + x;
                        if (boardY >= 0) {
                            this.board[boardY][boardX] = this.currentPiece.color;
                        }
                    }
                }
            }
        },

        clearLines: function () {
            var linesCleared = 0;
            for (var y = 19; y >= 0; y--) {
                if (this.board[y].every(cell => cell !== 0)) {
                    this.board.splice(y, 1);
                    this.board.unshift(Array(10).fill(0));
                    linesCleared++;
                    y++;
                }
            }
            if (linesCleared > 0) {
                this.score += linesCleared * 100;
                this.updateScore();
            }
        },

        updateScore: function () {
            var scoreEl = document.getElementById('tetrisScore');
            if (scoreEl) scoreEl.textContent = this.score;
        },

        gameOver: function () {
            this.stop();
            alert('Game Over! Điểm: ' + this.score);
        },

        start: function () {
            var self = this;
            this.gameLoop = setInterval(function () {
                self.moveDown();
                self.draw();
            }, 500);
        },

        stop: function () {
            if (this.gameLoop) {
                clearInterval(this.gameLoop);
                this.gameLoop = null;
            }
        }
    };

    // ========== BLOCK PUZZLE GAME ==========
    var BlockPuzzleGame = {
        canvas: null,
        ctx: null,
        board: [],
        score: 0,

        init: function (canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return false;

            this.ctx = this.canvas.getContext('2d');
            this.board = Array(8).fill(null).map(() => Array(8).fill(0));
            this.score = 0;
            this.draw();
            return true;
        },

        draw: function () {
            var cellSize = 50;
            this.ctx.fillStyle = '#ECF0F1';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw grid
            for (var y = 0; y < 8; y++) {
                for (var x = 0; x < 8; x++) {
                    this.ctx.strokeStyle = '#BDC3C7';
                    this.ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

                    if (this.board[y][x]) {
                        this.ctx.fillStyle = this.board[y][x];
                        this.ctx.fillRect(x * cellSize + 2, y * cellSize + 2, cellSize - 4, cellSize - 4);
                    }
                }
            }
        },

        placeBlock: function (x, y, color) {
            if (x >= 0 && x < 8 && y >= 0 && y < 8 && !this.board[y][x]) {
                this.board[y][x] = color;
                this.checkMatches();
                this.draw();
                return true;
            }
            return false;
        },

        checkMatches: function () {
            // Check rows
            for (var y = 0; y < 8; y++) {
                if (this.board[y].every(cell => cell !== 0)) {
                    this.board[y] = Array(8).fill(0);
                    this.score += 100;
                }
            }

            // Check columns
            for (var x = 0; x < 8; x++) {
                var full = true;
                for (var y = 0; y < 8; y++) {
                    if (!this.board[y][x]) {
                        full = false;
                        break;
                    }
                }
                if (full) {
                    for (var y = 0; y < 8; y++) {
                        this.board[y][x] = 0;
                    }
                    this.score += 100;
                }
            }

            this.updateScore();
        },

        updateScore: function () {
            var scoreEl = document.getElementById('blockPuzzleScore');
            if (scoreEl) scoreEl.textContent = this.score;
        }
    };

    // ========== CANDY MATCH GAME ==========
    var CandyMatchGame = {
        canvas: null,
        ctx: null,
        board: [],
        score: 0,
        candies: ['🍬', '🍭', '🍫', '🍩', '🍪'],
        selectedCell: null,

        init: function (canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return false;

            this.ctx = this.canvas.getContext('2d');
            this.generateBoard();
            this.draw();
            return true;
        },

        generateBoard: function () {
            this.board = [];
            for (var y = 0; y < 8; y++) {
                var row = [];
                for (var x = 0; x < 8; x++) {
                    row.push(this.candies[Math.floor(Math.random() * this.candies.length)]);
                }
                this.board.push(row);
            }
        },

        draw: function () {
            var cellSize = 50;
            this.ctx.fillStyle = '#FFF5E1';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            for (var y = 0; y < 8; y++) {
                for (var x = 0; x < 8; x++) {
                    // Draw cell background
                    if (this.selectedCell && this.selectedCell.x === x && this.selectedCell.y === y) {
                        this.ctx.fillStyle = '#FFE66D';
                    } else {
                        this.ctx.fillStyle = '#FFFFFF';
                    }
                    this.ctx.fillRect(x * cellSize + 2, y * cellSize + 2, cellSize - 4, cellSize - 4);

                    // Draw candy
                    this.ctx.fillText(
                        this.board[y][x],
                        x * cellSize + cellSize / 2,
                        y * cellSize + cellSize / 2
                    );
                }
            }
        },

        handleClick: function (x, y) {
            var cellX = Math.floor(x / 50);
            var cellY = Math.floor(y / 50);

            if (!this.selectedCell) {
                this.selectedCell = { x: cellX, y: cellY };
            } else {
                // Check if adjacent
                var dx = Math.abs(cellX - this.selectedCell.x);
                var dy = Math.abs(cellY - this.selectedCell.y);

                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                    this.swap(this.selectedCell.x, this.selectedCell.y, cellX, cellY);
                }
                this.selectedCell = null;
            }
            this.draw();
        },

        swap: function (x1, y1, x2, y2) {
            var temp = this.board[y1][x1];
            this.board[y1][x1] = this.board[y2][x2];
            this.board[y2][x2] = temp;

            if (!this.checkMatches()) {
                // Swap back if no match
                this.board[y2][x2] = this.board[y1][x1];
                this.board[y1][x1] = temp;
            }
        },

        checkMatches: function () {
            var matches = [];

            // Check horizontal
            for (var y = 0; y < 8; y++) {
                for (var x = 0; x < 6; x++) {
                    if (this.board[y][x] === this.board[y][x + 1] &&
                        this.board[y][x] === this.board[y][x + 2]) {
                        matches.push({ x: x, y: y }, { x: x + 1, y: y }, { x: x + 2, y: y });
                    }
                }
            }

            // Check vertical
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 6; y++) {
                    if (this.board[y][x] === this.board[y + 1][x] &&
                        this.board[y][x] === this.board[y + 2][x]) {
                        matches.push({ x: x, y: y }, { x: x, y: y + 1 }, { x: x, y: y + 2 });
                    }
                }
            }

            if (matches.length > 0) {
                this.removeMatches(matches);
                this.score += matches.length * 10;
                this.updateScore();
                return true;
            }
            return false;
        },

        removeMatches: function (matches) {
            matches.forEach(function (match) {
                this.board[match.y][match.x] = this.candies[Math.floor(Math.random() * this.candies.length)];
            }.bind(this));
        },

        updateScore: function () {
            var scoreEl = document.getElementById('candyMatchScore');
            if (scoreEl) scoreEl.textContent = this.score;
        }
    };

    // ========== JIGSAW PUZZLE GAME - CẢI TIẾN CHO TRẺ EM ==========
    var JigsawGame = {
        canvas: null,
        ctx: null,
        pieces: [],
        selectedPiece: null,
        completed: false,
        currentTheme: 'animals',

        // ✅ NHIỀU CHỦ ĐỀ ĐA DẠNG
        themes: {
            animals: {
                name: 'Động Vật',
                items: ['🐶', '🐱', '🐰', '🐻', '🦁', '🐯', '🐼', '🐨', '🐸']
            },
            fruits: {
                name: 'Trái Cây',
                items: ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🍑', '🍒', '🥝']
            },
            vehicles: {
                name: 'Phương Tiện',
                items: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒']
            },
            food: {
                name: 'Đồ Ăn',
                items: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧁', '🍰', '🍪', '🍩']
            },
            nature: {
                name: 'Thiên Nhiên',
                items: ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🌿', '🍀', '🌳']
            }
        },

        init: function (canvasId, theme) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return false;

            this.ctx = this.canvas.getContext('2d');
            this.currentTheme = theme || 'animals';
            this.completed = false;
            this.generatePuzzle();
            this.draw();
            return true;
        },

        generatePuzzle: function () {
            this.pieces = [];
            var gridSize = 3;
            var pieceSize = 100;
            var theme = this.themes[this.currentTheme];
            var items = theme.items;

            // Tạo 9 mảnh ghép
            for (var i = 0; i < 9; i++) {
                this.pieces.push({
                    id: i,
                    emoji: items[i],
                    correctX: (i % gridSize) * pieceSize,
                    correctY: Math.floor(i / gridSize) * pieceSize,
                    placed: false,
                    selected: false
                });
            }

            // Xáo trộn thứ tự
            this.pieces = this.shuffleArray(this.pieces);
        },

        shuffleArray: function (array) {
            var arr = array.slice();
            for (var i = arr.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            return arr;
        },

        draw: function () {
            // Background
            this.ctx.fillStyle = '#E8F5E9';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // ✅ VẼ LƯỚI 3x3 BÊN TRÁI (khu vực ghép)
            var gridSize = 3;
            var pieceSize = 100;

            this.ctx.strokeStyle = '#4CAF50';
            this.ctx.lineWidth = 3;
            for (var i = 0; i <= gridSize; i++) {
                // Vertical lines
                this.ctx.beginPath();
                this.ctx.moveTo(i * pieceSize, 0);
                this.ctx.lineTo(i * pieceSize, gridSize * pieceSize);
                this.ctx.stroke();

                // Horizontal lines
                this.ctx.beginPath();
                this.ctx.moveTo(0, i * pieceSize);
                this.ctx.lineTo(gridSize * pieceSize, i * pieceSize);
                this.ctx.stroke();
            }

            // ✅ VẼ CÁC MẢNH ĐÃ GHÉP (bên trái)
            this.ctx.font = '60px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            this.pieces.forEach(function (piece) {
                if (piece.placed) {
                    // Vẽ mảnh đã ghép đúng vị trí
                    this.ctx.fillText(
                        piece.emoji,
                        piece.correctX + pieceSize / 2,
                        piece.correctY + pieceSize / 2
                    );
                }
            }.bind(this));

            // ✅ VẼ CÁC MẢNH CHƯA GHÉP (bên phải)
            var rightX = 320;
            var startY = 20;
            var spacing = 80;
            var col = 0;
            var row = 0;

            this.pieces.forEach(function (piece) {
                if (!piece.placed) {
                    var x = rightX + (col * spacing);
                    var y = startY + (row * spacing);

                    // Background
                    if (piece.selected) {
                        this.ctx.fillStyle = '#FFE66D';
                    } else {
                        this.ctx.fillStyle = '#FFFFFF';
                    }
                    this.ctx.fillRect(x - 35, y - 35, 70, 70);
                    this.ctx.strokeStyle = piece.selected ? '#FF9800' : '#CCCCCC';
                    this.ctx.lineWidth = piece.selected ? 4 : 2;
                    this.ctx.strokeRect(x - 35, y - 35, 70, 70);

                    // Emoji
                    this.ctx.fillStyle = '#000000';
                    this.ctx.fillText(piece.emoji, x, y);

                    // Lưu vị trí để click
                    piece.displayX = x;
                    piece.displayY = y;

                    col++;
                    if (col >= 2) {
                        col = 0;
                        row++;
                    }
                }
            }.bind(this));

            // ✅ HIỂN THỊ CHỦ ĐỀ
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillStyle = '#2E7D32';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                this.themes[this.currentTheme].name,
                200,
                320
            );
        },

        handleClick: function (x, y) {
            if (this.completed) return;

            // ✅ CLICK VÀO MẢNH CHƯA GHÉP (bên phải)
            for (var i = 0; i < this.pieces.length; i++) {
                var piece = this.pieces[i];
                if (!piece.placed && piece.displayX && piece.displayY) {
                    var dx = Math.abs(x - piece.displayX);
                    var dy = Math.abs(y - piece.displayY);

                    if (dx < 35 && dy < 35) {
                        // Bỏ chọn mảnh khác
                        this.pieces.forEach(function (p) {
                            p.selected = false;
                        });

                        // Chọn mảnh này
                        piece.selected = true;
                        this.selectedPiece = piece;
                        this.draw();
                        return;
                    }
                }
            }

            // ✅ CLICK VÀO Ô TRỐNG (bên trái) - TỰ ĐỘNG GHÉP
            if (this.selectedPiece) {
                var gridSize = 3;
                var pieceSize = 100;

                for (var row = 0; row < gridSize; row++) {
                    for (var col = 0; col < gridSize; col++) {
                        var cellX = col * pieceSize;
                        var cellY = row * pieceSize;

                        // Kiểm tra click vào ô này
                        if (x >= cellX && x < cellX + pieceSize &&
                            y >= cellY && y < cellY + pieceSize) {

                            // Kiểm tra ô này có đúng vị trí không
                            if (this.selectedPiece.correctX === cellX &&
                                this.selectedPiece.correctY === cellY) {
                                // ✅ ĐÚNG - Ghép vào
                                this.selectedPiece.placed = true;
                                this.selectedPiece.selected = false;
                                this.selectedPiece = null;
                                this.draw();
                                this.checkComplete();
                                return;
                            } else {
                                // ❌ SAI - Shake và thử lại
                                this.shakeWrong();
                                return;
                            }
                        }
                    }
                }
            }
        },

        shakeWrong: function () {
            // Animation shake khi sai
            var canvas = this.canvas;
            var originalTransform = canvas.style.transform;

            canvas.style.transform = 'translateX(-5px)';
            setTimeout(function () {
                canvas.style.transform = 'translateX(5px)';
            }, 50);
            setTimeout(function () {
                canvas.style.transform = 'translateX(-5px)';
            }, 100);
            setTimeout(function () {
                canvas.style.transform = originalTransform;
            }, 150);
        },

        checkComplete: function () {
            if (this.pieces.every(function (p) { return p.placed; })) {
                this.completed = true;
                setTimeout(function () {
                    alert('🎉 Chúc mừng! Bé đã hoàn thành tranh ' +
                        this.themes[this.currentTheme].name + '!');
                }.bind(this), 300);
            }
        },

        changeTheme: function (theme) {
            if (this.themes[theme]) {
                this.currentTheme = theme;
                this.generatePuzzle();
                this.draw();
            }
        }
    };

    // ========== EXPORT ==========
    window.MiniGames = {
        GAME_UNLOCK_CONFIG: GAME_UNLOCK_CONFIG,
        isGameUnlocked: isGameUnlocked,
        getAvailableGames: getAvailableGames,
        Tetris: TetrisGame,
        BlockPuzzle: BlockPuzzleGame,
        CandyMatch: CandyMatchGame,
        Jigsaw: JigsawGame
    };

    console.log('✅ Mini-Games System loaded');

})();
