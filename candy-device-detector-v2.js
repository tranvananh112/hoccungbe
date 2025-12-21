/* ========================================
   CANDY DEVICE DETECTOR V2
   Phát hiện thiết bị và tính toán canvas size
   ======================================== */

class CandyDeviceDetectorV2 {
    constructor() {
        this.viewport = this.getViewport();
        this.device = this.detectDevice();
        this.canvasConfig = this.calculateCanvas();

        console.log('🔍 Device Detector V2 initialized');
        this.logInfo();
    }

    // Lấy thông tin viewport
    getViewport() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.devicePixelRatio || 1
        };
    }

    // Phát hiện loại thiết bị
    detectDevice() {
        const width = this.viewport.width;
        const height = this.viewport.height;
        const userAgent = navigator.userAgent.toLowerCase();

        // Phát hiện platform
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);
        const isMobile = /mobile/.test(userAgent) || isIOS || isAndroid;
        const isTablet = /tablet|ipad/.test(userAgent) || (isAndroid && !/mobile/.test(userAgent));

        // Phân loại theo kích thước
        let category;
        if (width >= 1024) {
            category = 'desktop';
        } else if (width >= 768) {
            category = isTablet ? 'tablet' : 'desktop-small';
        } else if (width >= 480) {
            category = 'mobile-large';
        } else if (width >= 375) {
            category = 'mobile-medium';
        } else {
            category = 'mobile-small';
        }

        // Orientation
        const orientation = width > height ? 'landscape' : 'portrait';

        return {
            category,
            width,
            height,
            orientation,
            isIOS,
            isAndroid,
            isMobile,
            isTablet,
            isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
        };
    }

    // Tính toán canvas size tối ưu
    calculateCanvas() {
        const { category, width, height, orientation } = this.device;
        let canvasSize, cellSize, candySize;

        switch (category) {
            case 'desktop':
                // Desktop: 600x600, thoải mái
                canvasSize = 600;
                break;

            case 'desktop-small':
                // Desktop nhỏ: 500x500
                canvasSize = 500;
                break;

            case 'tablet':
                // Tablet: 90% width, max 550px
                canvasSize = Math.min(Math.floor(width * 0.9), 550);
                break;

            case 'mobile-large':
                // Mobile lớn (iPhone 11, 12): 90% width, max 450px
                canvasSize = Math.min(Math.floor(width * 0.9), 450);
                break;

            case 'mobile-medium':
                // Mobile trung (iPhone SE, 8): 92% width, max 400px
                canvasSize = Math.min(Math.floor(width * 0.92), 400);
                break;

            case 'mobile-small':
                // Mobile nhỏ: 95% width, min 320px
                canvasSize = Math.max(Math.floor(width * 0.95), 320);
                break;

            default:
                canvasSize = 600;
        }

        // Đảm bảo canvas là số chẵn (dễ chia cho 8)
        canvasSize = Math.floor(canvasSize / 8) * 8;

        // Tính cell size và candy size
        cellSize = canvasSize / 8;

        // Candy size: Mobile nhỏ hơn để giãn cách, Desktop lớn hơn
        let candyRatio;
        if (category === 'desktop' || category === 'desktop-small') {
            candyRatio = 0.65; // Desktop: 65% (gần nhau hơn)
        } else if (category === 'tablet') {
            candyRatio = 0.58; // Tablet: 58% (giãn vừa)
        } else {
            candyRatio = 0.50; // Mobile: 50% (giãn nhiều hơn, dễ chạm)
        }

        candySize = Math.floor(cellSize * candyRatio);

        return {
            canvasSize,
            cellSize,
            candySize,
            candyRatio, // Thêm ratio để debug
            padding: Math.floor((cellSize - candySize) / 2),
            hitArea: Math.floor(cellSize * 0.8) // 80% cell size cho vùng chạm
        };
    }

    // Lấy CSS class cho device
    getDeviceClass() {
        const { category, orientation, isIOS, isAndroid, isTouch } = this.device;
        const classes = ['candy-game'];

        classes.push(`device-${category}`);
        classes.push(`orientation-${orientation}`);

        if (isIOS) classes.push('platform-ios');
        if (isAndroid) classes.push('platform-android');
        if (isTouch) classes.push('input-touch');
        else classes.push('input-mouse');

        return classes.join(' ');
    }

    // Log thông tin
    logInfo() {
        console.log('📱 Device Info:');
        console.log(`  Category: ${this.device.category}`);
        console.log(`  Viewport: ${this.viewport.width}x${this.viewport.height}`);
        console.log(`  Orientation: ${this.device.orientation}`);
        console.log(`  Platform: ${this.device.isIOS ? 'iOS' : this.device.isAndroid ? 'Android' : 'Desktop'}`);
        console.log(`  Input: ${this.device.isTouch ? 'Touch' : 'Mouse'}`);
        console.log('');
        console.log('📐 Canvas Config:');
        console.log(`  Canvas: ${this.canvasConfig.canvasSize}x${this.canvasConfig.canvasSize}px`);
        console.log(`  Cell: ${this.canvasConfig.cellSize}px`);
        console.log(`  Candy: ${this.canvasConfig.candySize}px (${Math.round(this.canvasConfig.candyRatio * 100)}% of cell)`);
        console.log(`  Spacing: ${this.canvasConfig.padding * 2}px between candies`);
        console.log(`  Hit Area: ${this.canvasConfig.hitArea}px`);
    }

    // Update khi resize
    update() {
        this.viewport = this.getViewport();
        this.device = this.detectDevice();
        this.canvasConfig = this.calculateCanvas();

        console.log('🔄 Device config updated');
        this.logInfo();

        return this.canvasConfig;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CandyDeviceDetectorV2;
} else {
    window.CandyDeviceDetectorV2 = CandyDeviceDetectorV2;
}
