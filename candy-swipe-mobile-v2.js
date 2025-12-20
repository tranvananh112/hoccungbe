/* ========================================
   CANDY SWIPE HANDLER - MOBILE V2
   Touch + Swipe cho Mobile/Tablet
   ======================================== */

class CandySwipeMobile {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;

        // State
        this.isSwiping = false;
        this.startCandy = null;
        this.startTouch = null;
        this.currentTouch = null;

        // Config
        this.threshold = 40; // 40px để trigger swap (lớn hơn desktop)
        this.swipeExecuted = false;

        // Multi-touch prevention
        this.touchId = null;

        this.setupEvents();
        console.log('📱 Mobile Swipe Handler initialized');
    }

    setupEvents() {
        this.canvas.addEventListener('touchstart', (e) => this.onStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.onMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.onEnd(e), { passive: false });
        this.canvas.addEventListener('touchcancel', (e) => this.onCancel(e), { passive: false });
    }

    onStart(e) {
        e.preventDefault(); // Prevent scroll

        if (this.game.isAnimating || this.game.moves <= 0) return;
        if (e.touches.length > 1) return; // Multi-touch không hỗ trợ

        const touch = e.touches[0];
        this.touchId = touch.identifier;

        const pos = this.getTouchPos(touch);
        const candy = this.getCandyAt(pos.x, pos.y);

        if (candy) {
            this.isSwiping = true;
            this.startCandy = candy;
            this.startTouch = pos;
            this.currentTouch = pos;
            this.swipeExecuted = false;

            // Haptic feedback
            this.vibrate(10);

            // Visual feedback
            this.highlightCandy(candy);

            console.log(`👆 Start swipe at (${candy.col}, ${candy.row})`);
        }
    }

    onMove(e) {
        e.preventDefault(); // Prevent scroll

        if (!this.isSwiping || this.swipeExecuted) return;

        // Find our touch
        const touch = this.findTouch(e.touches);
        if (!touch) return;

        this.currentTouch = this.getTouchPos(touch);

        const dx = this.currentTouch.x - this.startTouch.x;
        const dy = this.currentTouch.y - this.startTouch.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Visual feedback (optional)
        this.showSwipeIndicator(dx, dy, distance);

        // Check threshold
        if (distance > this.threshold) {
            const direction = this.getDirection(dx, dy);
            this.executeSwap(this.startCandy, direction);
            this.swipeExecuted = true;

            // Haptic feedback
            this.vibrate(20);
        }
    }

    onEnd(e) {
        e.preventDefault();

        if (!this.isSwiping) return;

        // Check if our touch ended
        const touch = this.findTouch(e.changedTouches);
        if (touch) {
            this.cleanup();
        }
    }

    onCancel(e) {
        e.preventDefault();

        if (!this.isSwiping) return;

        this.cleanup();
    }

    getTouchPos(touch) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    }

    findTouch(touches) {
        for (let i = 0; i < touches.length; i++) {
            if (touches[i].identifier === this.touchId) {
                return touches[i];
            }
        }
        return null;
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
            this.vibrate(50); // Error vibration
            return;
        }

        console.log(`✅ Swipe (${col},${row}) → (${targetCol},${targetRow}) [${direction}]`);

        // Execute swap in game
        this.game.swapCandies(col, row, targetCol, targetRow);

        // Visual feedback
        this.showSwapAnimation(candy, direction);
    }

    highlightCandy(candy) {
        // Game sẽ tự highlight qua selectedCell
        this.game.selectedCell = { x: candy.col, y: candy.row };
    }

    showSwipeIndicator(dx, dy, distance) {
        // Visual feedback khi swipe
        // Có thể vẽ arrow hoặc trail

        // Scale opacity theo distance
        const opacity = Math.min(distance / this.threshold, 1);

        // Có thể thêm visual effect ở đây
    }

    showSwapAnimation(candy, direction) {
        // Animation sẽ do game xử lý
        // Có thể thêm particle effect ở đây
    }

    vibrate(duration) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }

    cleanup() {
        this.isSwiping = false;
        this.startCandy = null;
        this.startTouch = null;
        this.currentTouch = null;
        this.swipeExecuted = false;
        this.touchId = null;

        // Clear selection
        if (this.game.selectedCell) {
            this.game.selectedCell = null;
        }
    }

    destroy() {
        // Remove event listeners
        this.canvas.removeEventListener('touchstart', this.onStart);
        this.canvas.removeEventListener('touchmove', this.onMove);
        this.canvas.removeEventListener('touchend', this.onEnd);
        this.canvas.removeEventListener('touchcancel', this.onCancel);

        console.log('📱 Mobile Swipe Handler destroyed');
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CandySwipeMobile;
} else {
    window.CandySwipeMobile = CandySwipeMobile;
}
