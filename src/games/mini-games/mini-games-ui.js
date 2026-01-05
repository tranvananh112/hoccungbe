/* ========================================
   MINI-GAMES UI CONTROLLER
   ======================================== */

(function () {
    'use strict';

    console.log('🎨 Loading Mini-Games UI...');

    var currentGame = null;
    var selectedPieceColor = null;

    // ========== KHỞI TẠO ==========
    function init() {
        loadPlayerData();
        renderGamesList();
        setupEventListeners();
    }

    // ========== TẢI DỮ LIỆU NGƯỜI CHƠI ==========
    function loadPlayerData() {
        try {
            var saved = localStorage.getItem('gamestva');
            if (saved) {
                var gameState = JSON.parse(saved);

                // Hiển thị tên và số câu đã làm
                var playerNameEl = document.getElementById('playerName');
                var totalSentencesEl = document.getElementById('totalSentences');

                if (playerNameEl) {
                    playerNameEl.textContent = gameState.playerName || 'Bé';
                }

                if (totalSentencesEl) {
                    // Đếm số câu đã hoàn thành
                    var totalSentences = Object.keys(gameState.sentencesCompleted || {}).length;
                    totalSentencesEl.textContent = totalSentences;
                }
            }
        } catch (e) {
            console.error('Load player data error:', e);
        }
    }

    // ========== RENDER DANH SÁCH GAME ==========
    function renderGamesList() {
        var gamesListEl = document.getElementById('gamesList');
        if (!gamesListEl) return;

        // Lấy số câu đã hoàn thành
        var totalSentences = 0;
        try {
            var saved = localStorage.getItem('gamestva');
            if (saved) {
                var gameState = JSON.parse(saved);
                totalSentences = Object.keys(gameState.sentencesCompleted || {}).length;
            }
        } catch (e) { }

        // Lấy danh sách game
        var games = window.MiniGames.getAvailableGames(totalSentences);

        // Render
        gamesListEl.innerHTML = '';
        games.forEach(function (game) {
            var card = document.createElement('div');
            card.className = 'game-card' + (game.unlocked ? '' : ' locked');

            card.innerHTML = `
                <div class="game-icon">${game.icon}</div>
                <div class="game-name">${game.name}</div>
                <div class="game-description">${game.description}</div>
                <div class="game-progress">
                    <div class="game-progress-bar" style="width: ${game.progress}%"></div>
                </div>
                <div class="game-required">
                    ${game.unlocked ? '✅ Đã mở khóa!' : `🔒 Cần ${game.required} câu`}
                </div>
            `;

            if (game.unlocked) {
                card.onclick = function () {
                    openGame(game.id);
                };
            }

            gamesListEl.appendChild(card);
        });
    }

    // ========== MỞ GAME ==========
    function openGame(gameId) {
        console.log('Opening game:', gameId);

        // Ẩn game selection
        var selectionEl = document.getElementById('gameSelection');
        if (selectionEl) selectionEl.style.display = 'none';

        // Hiện game screen
        var gameScreenId = gameId + 'Game';
        var gameScreenEl = document.getElementById(gameScreenId);
        if (!gameScreenEl) {
            console.error('Game screen not found:', gameScreenId);
            return;
        }

        gameScreenEl.style.display = 'block';
        currentGame = gameId;

        // Khởi tạo game
        switch (gameId) {
            case 'tetris':
                if (window.MiniGames.Tetris.init('tetrisCanvas')) {
                    window.MiniGames.Tetris.start();
                }
                break;
            case 'blockPuzzle':
                window.MiniGames.BlockPuzzle.init('blockPuzzleCanvas');
                setupBlockPuzzleClick();
                break;
            case 'candyMatch':
                window.MiniGames.CandyMatch.init('candyMatchCanvas');
                setupCandyMatchClick();
                break;
            case 'jigsaw':
                window.MiniGames.Jigsaw.init('jigsawCanvas');
                setupJigsawClick();
                break;
        }
    }

    // ========== ĐÓNG GAME ==========
    window.closeGame = function () {
        // Dừng game nếu đang chạy
        if (currentGame === 'tetris') {
            window.MiniGames.Tetris.stop();
        }

        // Ẩn tất cả game screens
        var gameScreens = document.querySelectorAll('.game-screen');
        gameScreens.forEach(function (screen) {
            screen.style.display = 'none';
        });

        // Hiện game selection
        var selectionEl = document.getElementById('gameSelection');
        if (selectionEl) selectionEl.style.display = 'block';

        currentGame = null;
    };

    // ========== QUAY LẠI ==========
    window.goBack = function () {
        window.location.href = 'index.html';
    };

    // ========== SETUP BLOCK PUZZLE CLICK ==========
    function setupBlockPuzzleClick() {
        var canvas = document.getElementById('blockPuzzleCanvas');
        if (!canvas) return;

        canvas.onclick = function (e) {
            var rect = canvas.getBoundingClientRect();
            var x = Math.floor((e.clientX - rect.left) / 50);
            var y = Math.floor((e.clientY - rect.top) / 50);

            if (selectedPieceColor) {
                window.MiniGames.BlockPuzzle.placeBlock(x, y, selectedPieceColor);
            }
        };
    }

    // ========== CHỌN PIECE (BLOCK PUZZLE) ==========
    window.selectPiece = function (index) {
        var colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'];
        selectedPieceColor = colors[index];

        // Highlight selected piece
        var pieces = document.querySelectorAll('.piece');
        pieces.forEach(function (piece, i) {
            if (i === index) {
                piece.classList.add('selected');
            } else {
                piece.classList.remove('selected');
            }
        });
    };

    // ========== SETUP CANDY MATCH CLICK ==========
    function setupCandyMatchClick() {
        var canvas = document.getElementById('candyMatchCanvas');
        if (!canvas) return;

        canvas.onclick = function (e) {
            var rect = canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            window.MiniGames.CandyMatch.handleClick(x, y);
        };
    }

    // ========== SETUP JIGSAW CLICK - ĐƠN GIẢN CHO TRẺ EM ==========
    function setupJigsawClick() {
        var canvas = document.getElementById('jigsawCanvas');
        if (!canvas) return;

        // ✅ CHỈ CẦN CLICK - KHÔNG CẦN KÉO
        canvas.onclick = function (e) {
            var rect = canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            window.MiniGames.Jigsaw.handleClick(x, y);
        };

        // ✅ HỖ TRỢ TOUCH CHO MOBILE
        canvas.ontouchstart = function (e) {
            e.preventDefault();
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches[0];
            var x = touch.clientX - rect.left;
            var y = touch.clientY - rect.top;

            window.MiniGames.Jigsaw.handleClick(x, y);
        };
    }

    // ========== ĐỔI CHỦ ĐỀ JIGSAW ==========
    window.changeJigsawTheme = function (theme) {
        if (window.MiniGames && window.MiniGames.Jigsaw) {
            window.MiniGames.Jigsaw.changeTheme(theme);
        }
    };

    // ========== SETUP EVENT LISTENERS ==========
    function setupEventListeners() {
        // Keyboard controls for Tetris
        document.addEventListener('keydown', function (e) {
            if (currentGame !== 'tetris') return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    window.MiniGames.Tetris.moveLeft();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    window.MiniGames.Tetris.moveRight();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    window.MiniGames.Tetris.moveDown();
                    break;
                case 'ArrowUp':
                case ' ':
                    e.preventDefault();
                    window.MiniGames.Tetris.rotate();
                    break;
            }
        });
    }

    // ========== AUTO INIT ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('✅ Mini-Games UI loaded');

})();
