/* ========================================
   CANDY CRUSH SAGA - ULTIMATE VERSION
   Phase 2: Special Candies Implementation
   Striped, Wrapped, Color Bomb + Combos
   ======================================== */

(function () {
    'use strict';

    console.log('🍬 Loading Ultimate Candy Crush Saga...');

    // Import Phase 1 code (Audio, Animation, Particle systems)
    // ... (sẽ copy từ candy-crush-pro.js)

    // ========== SPECIAL CANDY TYPES ==========
    const SPECIAL_TYPES = {
        NORMAL: 'normal',
        STRIPED_H: 'striped_h',
        STRIPED_V: 'striped_v',
        WRAPPED: 'wrapped',
        COLOR_BOMB: 'color_bomb'
    };

    // ========== CANDY DATA STRUCTURE ==========
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

    // ========== ENHANCED MATCH DETECTION ==========
    class MatchDetector {
        constructor(board) {
            this.board = board;
            this.gridSize = board.length;
        }

        findAllMatches() {
            const matches = [];
            const marked = Array(this.gridSize).fill(null)
                .map(() => Array(this.gridSize).fill(false));

            // Find horizontal matches
            for (let y = 0; y < this.gridSize; y++) {
                for (let x = 0; x < this.gridSize - 2; x++) {
                    const candy = this.board[y][x];
                    if (!candy) continue;

                    let count = 1;
                    const matchCells = [{ x, y }];

                    while (x + count < this.gridSize &&
                        this.board[y][x + count] &&
                        this.board[y][x + count].matches(candy)) {
                        matchCells.push({ x: x + count, y });
                        count++;
                    }

                    if (count >= 3) {
                        const matchType = this.detectMatchType(matchCells, 'horizontal');
                        matches.push({
                            cells: matchCells,
                            type: matchType,
                            direction: 'horizontal',
                            color: candy.color
                        });

                        matchCells.forEach(cell => marked[cell.y][cell.x] = true);
                    }
                }
            }

            // Find vertical matches
            for (let x = 0; x < this.gridSize; x++) {
                for (let y = 0; y < this.gridSize - 2; y++) {
                    const candy = this.board[y][x];
                    if (!candy || marked[y][x]) continue;

                    let count = 1;
                    const matchCells = [{ x, y }];

                    while (y + count < this.gridSize &&
                        this.board[y + count][x] &&
                        this.board[y + count][x].matches(candy)) {
                        matchCells.push({ x, y: y + count });
                        count++;
                    }

                    if (count >= 3) {
                        const matchType = this.detectMatchType(matchCells, 'vertical');
                        matches.push({
                            cells: matchCells,
                            type: matchType,
                            direction: 'vertical',
                            color: candy.color
                        });
                    }
                }
            }

            return matches;
        }

        detectMatchType(cells, direction) {
            const count = cells.length;

            if (count === 3) return 'match3';
            if (count === 4) return 'match4';
            if (count >= 5) return 'match5';

            // Check for L/T shapes (wrapped candy)
            // TODO: Implement L/T detection

            return 'match3';
        }

        // Detect L and T shapes for wrapped candy
        detectLTShapes() {
            const shapes = [];

            for (let y = 1; y < this.gridSize - 1; y++) {
                for (let x = 1; x < this.gridSize - 1; x++) {
                    const center = this.board[y][x];
                    if (!center) continue;

                    // Check T shape (top)
                    if (this.checkTShape(x, y, center, 'top')) {
                        shapes.push({ x, y, type: 'T_top', color: center.color });
                    }

                    // Check T shape (bottom)
                    if (this.checkTShape(x, y, center, 'bottom')) {
                        shapes.push({ x, y, type: 'T_bottom', color: center.color });
                    }

                    // Check T shape (left)
                    if (this.checkTShape(x, y, center, 'left')) {
                        shapes.push({ x, y, type: 'T_left', color: center.color });
                    }

                    // Check T shape (right)
                    if (this.checkTShape(x, y, center, 'right')) {
                        shapes.push({ x, y, type: 'T_right', color: center.color });
                    }

                    // Check L shapes
                    if (this.checkLShape(x, y, center)) {
                        shapes.push({ x, y, type: 'L', color: center.color });
                    }
                }
            }

            return shapes;
        }

        checkTShape(x, y, center, direction) {
            // Implementation for T shape detection
            // Returns true if T shape found
            return false; // Placeholder
        }

        checkLShape(x, y, center) {
            // Implementation for L shape detection
            return false; // Placeholder
        }
    }

    // ========== SPECIAL CANDY CREATOR ==========
    class SpecialCandyCreator {
        static createFromMatch(match, swapDirection) {
            const { type, direction, color, cells } = match;

            // Match 4 → Striped Candy
            if (type === 'match4') {
                const stripedDirection = swapDirection === 'horizontal' ?
                    SPECIAL_TYPES.STRIPED_H : SPECIAL_TYPES.STRIPED_V;
                return new Candy(color, stripedDirection);
            }

            // Match 5 straight → Color Bomb
            if (type === 'match5') {
                return new Candy(color, SPECIAL_TYPES.COLOR_BOMB);
            }

            // L/T shape → Wrapped Candy
            if (type === 'L' || type.startsWith('T_')) {
                return new Candy(color, SPECIAL_TYPES.WRAPPED);
            }

            return null;
        }
    }

    // ========== SPECIAL CANDY ACTIVATOR ==========
    class SpecialCandyActivator {
        constructor(game) {
            this.game = game;
        }

        activate(x, y, candy) {
            if (candy.isStriped()) {
                return this.activateStriped(x, y, candy);
            }

            if (candy.isWrapped()) {
                return this.activateWrapped(x, y, candy);
            }

            if (candy.isColorBomb()) {
                return this.activateColorBomb(x, y, candy);
            }

            return [];
        }

        activateStriped(x, y, candy) {
            const cellsToRemove = [];

            if (candy.special === SPECIAL_TYPES.STRIPED_H) {
                // Clear entire row
                for (let i = 0; i < this.game.config.GRID_SIZE; i++) {
                    cellsToRemove.push({ x: i, y });
                }
                this.game.playStripedAnimation(x, y, 'horizontal');
            } else {
                // Clear entire column
                for (let i = 0; i < this.game.config.GRID_SIZE; i++) {
                    cellsToRemove.push({ x, y: i });
                }
                this.game.playStripedAnimation(x, y, 'vertical');
            }

            this.game.audioEngine.playStripedSound();
            return cellsToRemove;
        }

        activateWrapped(x, y, candy) {
            const cellsToRemove = [];

            // Explode 3x3 around center
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx >= 0 && nx < this.game.config.GRID_SIZE &&
                        ny >= 0 && ny < this.game.config.GRID_SIZE) {
                        cellsToRemove.push({ x: nx, y: ny });
                    }
                }
            }

            this.game.playWrappedAnimation(x, y);
            this.game.audioEngine.playWrappedSound();

            // Wrapped explodes twice
            setTimeout(() => {
                this.game.playWrappedAnimation(x, y);
                this.game.audioEngine.playWrappedSound();
            }, 300);

            return cellsToRemove;
        }

        activateColorBomb(x, y, candy) {
            // Color bomb needs to be swapped with another candy
            // Will be handled in combo system
            return [];
        }

        // ========== COMBO DETECTION ==========
        detectCombo(x1, y1, candy1, x2, y2, candy2) {
            // Striped + Striped = Cross explosion
            if (candy1.isStriped() && candy2.isStriped()) {
                return this.comboStripedStriped(x1, y1, x2, y2);
            }

            // Striped + Wrapped = Giant wrapped
            if ((candy1.isStriped() && candy2.isWrapped()) ||
                (candy1.isWrapped() && candy2.isStriped())) {
                return this.comboStripedWrapped(x1, y1, x2, y2);
            }

            // Wrapped + Wrapped = Double explosion
            if (candy1.isWrapped() && candy2.isWrapped()) {
                return this.comboWrappedWrapped(x1, y1, x2, y2);
            }

            // Color Bomb + Striped = All candies become striped
            if ((candy1.isColorBomb() && candy2.isStriped()) ||
                (candy1.isStriped() && candy2.isColorBomb())) {
                return this.comboColorBombStriped(candy1, candy2);
            }

            // Color Bomb + Wrapped = All candies become wrapped
            if ((candy1.isColorBomb() && candy2.isWrapped()) ||
                (candy1.isWrapped() && candy2.isColorBomb())) {
                return this.comboColorBombWrapped(candy1, candy2);
            }

            // Color Bomb + Color Bomb = Clear entire board
            if (candy1.isColorBomb() && candy2.isColorBomb()) {
                return this.comboColorBombColorBomb();
            }

            // Color Bomb + Normal = Clear all of that color
            if (candy1.isColorBomb() || candy2.isColorBomb()) {
                const color = candy1.isColorBomb() ? candy2.color : candy1.color;
                return this.comboColorBombNormal(color);
            }

            return null;
        }

        comboStripedStriped(x1, y1, x2, y2) {
            const cellsToRemove = [];

            // Clear row and column (cross pattern)
            for (let i = 0; i < this.game.config.GRID_SIZE; i++) {
                cellsToRemove.push({ x: i, y: y1 });
                cellsToRemove.push({ x: x1, y: i });
            }

            this.game.playCrossExplosion(x1, y1);
            return { cells: cellsToRemove, type: 'striped_striped' };
        }

        comboStripedWrapped(x1, y1, x2, y2) {
            const cellsToRemove = [];

            // Giant 5x5 explosion
            const centerX = Math.floor((x1 + x2) / 2);
            const centerY = Math.floor((y1 + y2) / 2);

            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const nx = centerX + dx;
                    const ny = centerY + dy;

                    if (nx >= 0 && nx < this.game.config.GRID_SIZE &&
                        ny >= 0 && ny < this.game.config.GRID_SIZE) {
                        cellsToRemove.push({ x: nx, y: ny });
                    }
                }
            }

            this.game.playGiantExplosion(centerX, centerY);
            return { cells: cellsToRemove, type: 'striped_wrapped' };
        }

        comboWrappedWrapped(x1, y1, x2, y2) {
            const cellsToRemove = [];

            // Double 5x5 explosion
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const nx1 = x1 + dx;
                    const ny1 = y1 + dy;
                    const nx2 = x2 + dx;
                    const ny2 = y2 + dy;

                    if (nx1 >= 0 && nx1 < this.game.config.GRID_SIZE &&
                        ny1 >= 0 && ny1 < this.game.config.GRID_SIZE) {
                        cellsToRemove.push({ x: nx1, y: ny1 });
                    }

                    if (nx2 >= 0 && nx2 < this.game.config.GRID_SIZE &&
                        ny2 >= 0 && ny2 < this.game.config.GRID_SIZE) {
                        cellsToRemove.push({ x: nx2, y: ny2 });
                    }
                }
            }

            this.game.playDoubleExplosion(x1, y1, x2, y2);
            return { cells: cellsToRemove, type: 'wrapped_wrapped' };
        }

        comboColorBombNormal(color) {
            const cellsToRemove = [];

            // Find all candies of this color
            for (let y = 0; y < this.game.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.game.config.GRID_SIZE; x++) {
                    const candy = this.game.board[y][x];
                    if (candy && candy.color === color) {
                        cellsToRemove.push({ x, y });
                    }
                }
            }

            this.game.playColorBombAnimation(color);
            return { cells: cellsToRemove, type: 'color_bomb_normal' };
        }

        comboColorBombStriped(candy1, candy2) {
            const cellsToRemove = [];
            const color = candy1.isColorBomb() ? candy2.color : candy1.color;

            // All candies of that color become striped and activate
            for (let y = 0; y < this.game.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.game.config.GRID_SIZE; x++) {
                    const candy = this.game.board[y][x];
                    if (candy && candy.color === color) {
                        // Clear row or column
                        for (let i = 0; i < this.game.config.GRID_SIZE; i++) {
                            cellsToRemove.push({ x: i, y });
                            cellsToRemove.push({ x, y: i });
                        }
                    }
                }
            }

            this.game.playMassiveExplosion();
            return { cells: cellsToRemove, type: 'color_bomb_striped' };
        }

        comboColorBombWrapped(candy1, candy2) {
            const cellsToRemove = [];
            const color = candy1.isColorBomb() ? candy2.color : candy1.color;

            // All candies of that color become wrapped and explode
            for (let y = 0; y < this.game.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.game.config.GRID_SIZE; x++) {
                    const candy = this.game.board[y][x];
                    if (candy && candy.color === color) {
                        // 3x3 explosion around each
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const nx = x + dx;
                                const ny = y + dy;
                                if (nx >= 0 && nx < this.game.config.GRID_SIZE &&
                                    ny >= 0 && ny < this.game.config.GRID_SIZE) {
                                    cellsToRemove.push({ x: nx, y: ny });
                                }
                            }
                        }
                    }
                }
            }

            this.game.playMassiveExplosion();
            return { cells: cellsToRemove, type: 'color_bomb_wrapped' };
        }

        comboColorBombColorBomb() {
            const cellsToRemove = [];

            // Clear entire board
            for (let y = 0; y < this.game.config.GRID_SIZE; y++) {
                for (let x = 0; x < this.game.config.GRID_SIZE; x++) {
                    cellsToRemove.push({ x, y });
                }
            }

            this.game.playUltimateExplosion();
            return { cells: cellsToRemove, type: 'color_bomb_color_bomb' };
        }
    }

    // ========== EXPORT ==========
    window.SPECIAL_TYPES = SPECIAL_TYPES;
    window.Candy = Candy;
    window.MatchDetector = MatchDetector;
    window.SpecialCandyCreator = SpecialCandyCreator;
    window.SpecialCandyActivator = SpecialCandyActivator;

    console.log('✅ Special Candy System loaded');

})();
