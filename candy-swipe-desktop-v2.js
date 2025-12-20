/* ========================================
   CANDY SWIPE HANDLER - DESKTOP V2
   Click + Drag cho Desktop/Laptop
   ======================================== */

class CandySwipeDesktop {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;

        // State
        this.isDragging = false;
        this.startCandy = null;
        this.startPos = null;
        this.currentPos = null;

        // Config
        this.threshold = 30; // 30px để trigger swap
        this.swipeExecuted = false;

        // Visual feedback
        this.dragIndicator = null;

        this.setupEvents();
        console.log('🖱️ Desktop Swipe Handler initialized');
    }

    setupEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onStart(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onEnd(e));
        this.canvas.addEventListener('mouseleave', (e) => this.onCancel(e));

        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    onStart(e) {
        if (this.game.isAnimating || this.game.moves <= 0) return;

        const pos = this.getMousePos(e);
        const candy = this.getCandyAt(pos.x, pos.y);

        if (candy) {
            this.isDragging = true;
            this.startCandy = candy;
            this.startPos = pos;
            this.currentPos = pos;
            this.swipeExecuted = false;

            // Visual feedback
            this.highlightCandy(candy);
            this.canvas.style.cursor = 'grabbing';

            console.log(`🎯 Start drag at (${candy.col}, ${candy.row})`);
        }
    }

    onMove(e) {
        if (!this.isDragging || this.swipeExecuted) return;

        this.currentPos = this.getMousePos(e);

        const dx = this.currentPos.x - this.startPos.x;
        const dy = this.currentPos.y - this.startPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Show drag indicator
        this.showDragIndicator(dx, dy);

        // Check threshold
        if (distance > this.threshold) {
            const direction = this.getDirection(dx, dy);
            this.executeSwap(this.startCandy, direction);
            this.swipeExecuted = true;
        }
    }

    onEnd(e) {
        if (!this.isDragging) return;

        this.cleanup();
    }

    onCancel(e) {
        if (!this.isDragging) return;

        this.cleanup();
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    getCandyAt(x, y) {
        const cellSize = this.game.config.CELL_SIZE;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);

        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            // Check if inside hit area
            const centerX = col * cellSize + cellSize / 2;
            const centerY = row * cellSize + cellSize / 2;
            const hitArea = this.game.config.HIT_AREA || cellSize * 0.8;

            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= hitArea / 2) {
                return { row, col, x: centerX, y: centerY };
            }
        }

        return null;
    }

    getDirection(dx, dy) {
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        // Right: -45 to 45
        if (angle >= -45 && angle < 45) return 'right';
        // Down: 45 to 135
        if (angle >= 45 && angle < 135) return 'down';
        // Up: -135 to -45
        if (angle >= -135 && angle < -45) return 'up';
        // Left: 135 to 180 or -180 to -135
        return 'left';
    }

    executeSwap(candy, direction) {
        const { row, col } = candy;
        let targetRow = row;
        let targetCol = col;

        switch (direction) {
            case 'up': targetRow = row - 1; break;
            case 'down': targetRow = row + 1; break;
            case 'left': targetCol = col - 1; break;
            case 'right': targetCol = col + 1; break;
        }

        // Validate target
        if (targetRow < 0 || targetRow >= 8 || targetCol < 0 || targetCol >= 8) {
            console.log('❌ Invalid swap target');
            this.game.audioEngine.playErrorSound();
            return;
        }

        console.log(`✅ Swap (${col},${row}) → (${targetCol},${targetRow}) [${direction}]`);

        // Execute swap in game
        this.game.swapCandies(col, row, targetCol, targetRow);

        // Visual feedback
        this.showSwapAnimation(candy, direction);
    }

    highlightCandy(candy) {
        // Game sẽ tự highlight qua selectedCell
        this.game.selectedCell = { x: candy.col, y: candy.row };
    }

    showDragIndicator(dx, dy) {
        // Vẽ arrow chỉ hướng drag
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 10) return; // Quá nhỏ, không vẽ

        // Tính góc
        const angle = Math.atan2(dy, dx);

        // Vẽ arrow trên canvas (optional - có thể bỏ qua)
        // Hoặc dùng CSS cursor
        const direction = this.getDirection(dx, dy);
        const cursors = {
            'up': 'n-resize',
            'down': 's-resize',
            'left': 'w-resize',
            'right': 'e-resize'
        };
        this.canvas.style.cursor = cursors[direction] || 'grabbing';
    }

    showSwapAnimation(candy, direction) {
        // Animation sẽ do game xử lý
        // Có thể thêm particle effect ở đây
    }

    cleanup() {
        this.isDragging = false;
        this.startCandy = null;
        this.startPos = null;
        this.currentPos = null;
        this.swipeExecuted = false;

        this.canvas.style.cursor = 'pointer';

        // Clear selection
        if (this.game.selectedCell) {
            this.game.selectedCell = null;
        }
    }

    destroy() {
        // Remove event listeners
        this.canvas.removeEventListener('mousedown', this.onStart);
        this.canvas.removeEventListener('mousemove', this.onMove);
        this.canvas.removeEventListener('mouseup', this.onEnd);
        this.canvas.removeEventListener('mouseleave', this.onCancel);

        console.log('🖱️ Desktop Swipe Handler destroyed');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CandySwipeDesktop;
} else {
    window.CandySwipeDesktop = CandySwipeDesktop;
}
