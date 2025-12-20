/* ========================================
   CANDY SWIPE HANDLER - UNIFIED V2
   Tự động chọn Desktop hoặc Mobile handler
   ======================================== */

class CandySwipeUnified {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;
        this.handler = null;

        this.init();
    }

    init() {
        // Detect input method
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Create appropriate handler
        if (isTouch) {
            this.handler = new window.CandySwipeMobile(this.canvas, this.game);
            console.log('🎮 Using Mobile Swipe Handler (Touch)');
        } else {
            this.handler = new window.CandySwipeDesktop(this.canvas, this.game);
            console.log('🎮 Using Desktop Swipe Handler (Mouse)');
        }

        // Store reference
        this.inputType = isTouch ? 'touch' : 'mouse';
    }

    // Proxy methods to handler
    destroy() {
        if (this.handler && this.handler.destroy) {
            this.handler.destroy();
        }
    }

    // Get handler info
    getInfo() {
        return {
            type: this.inputType,
            handler: this.handler.constructor.name,
            threshold: this.handler.threshold
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CandySwipeUnified;
} else {
    window.CandySwipeUnified = CandySwipeUnified;
}
