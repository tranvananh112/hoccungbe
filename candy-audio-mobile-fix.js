/* ========================================
   CANDY AUDIO MOBILE FIX
   Fix audio không hoạt động trên mobile
   ======================================== */

class CandyAudioMobileFix {
    constructor(audioEngine) {
        this.audioEngine = audioEngine;
        this.unlocked = false;
        this.setupUnlock();
    }

    setupUnlock() {
        // Các sự kiện có thể unlock audio trên mobile
        const events = ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'];

        const unlock = () => {
            if (this.unlocked) return;

            console.log('🔓 Attempting to unlock audio...');

            // Khởi tạo audio engine
            if (this.audioEngine && !this.audioEngine.initialized) {
                this.audioEngine.init();
            }

            // Resume audio context nếu bị suspended (iOS)
            if (this.audioEngine && this.audioEngine.context) {
                if (this.audioEngine.context.state === 'suspended') {
                    this.audioEngine.context.resume().then(() => {
                        console.log('✅ Audio context resumed');
                        this.unlocked = true;
                        this.removeListeners(events, unlock);
                    }).catch(err => {
                        console.warn('⚠️ Failed to resume audio:', err);
                    });
                } else {
                    console.log('✅ Audio unlocked');
                    this.unlocked = true;
                    this.removeListeners(events, unlock);
                }
            }

            // Play silent sound để unlock (iOS trick)
            this.playSilentSound();
        };

        // Add listeners
        events.forEach(event => {
            document.addEventListener(event, unlock, { once: false, passive: true });
        });

        console.log('🎵 Audio unlock listeners added');
    }

    playSilentSound() {
        if (!this.audioEngine || !this.audioEngine.context) return;

        try {
            // Tạo buffer rỗng
            const buffer = this.audioEngine.context.createBuffer(1, 1, 22050);
            const source = this.audioEngine.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioEngine.context.destination);
            source.start(0);

            console.log('🔇 Silent sound played (unlock trick)');
        } catch (e) {
            console.warn('⚠️ Silent sound failed:', e);
        }
    }

    removeListeners(events, handler) {
        events.forEach(event => {
            document.removeEventListener(event, handler);
        });
        console.log('🗑️ Audio unlock listeners removed');
    }

    // Check if audio is working
    isWorking() {
        if (!this.audioEngine || !this.audioEngine.context) {
            return false;
        }
        return this.audioEngine.context.state === 'running';
    }

    // Force resume (call this on user interaction)
    forceResume() {
        if (!this.audioEngine || !this.audioEngine.context) return;

        if (this.audioEngine.context.state === 'suspended') {
            this.audioEngine.context.resume().then(() => {
                console.log('✅ Audio force resumed');
                this.unlocked = true;
            });
        }
    }

    // Get status
    getStatus() {
        if (!this.audioEngine || !this.audioEngine.context) {
            return {
                initialized: false,
                state: 'not-initialized',
                unlocked: false
            };
        }

        return {
            initialized: this.audioEngine.initialized,
            state: this.audioEngine.context.state,
            unlocked: this.unlocked
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CandyAudioMobileFix;
} else {
    window.CandyAudioMobileFix = CandyAudioMobileFix;
}

console.log('✅ Candy Audio Mobile Fix loaded');
