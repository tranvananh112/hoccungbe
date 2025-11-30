/* Auto Tracking - Tự động track mọi hoạt động */
(function () {
    'use strict';

    console.log('📊 Auto tracking initialized');

    // Đợi game state sẵn sàng
    let checkInterval = setInterval(() => {
        if (window.gameState && window.SupabaseConfig) {
            clearInterval(checkInterval);
            initAutoTracking();
        }
    }, 500);

    function initAutoTracking() {
        console.log('✅ Auto tracking started');

        // Track khi user đăng nhập
        window.SupabaseConfig.client().auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                console.log('📊 User signed in, starting session');

                // Start session tracking
                if (window.SupabaseConfig.startSession) {
                    window.SupabaseConfig.startSession();
                }

                // Track login
                if (window.SupabaseConfig.trackActivity) {
                    window.SupabaseConfig.trackActivity('user_login', {
                        login_method: 'email',
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });

        // Track game start
        const originalShowPage = window.showPage;
        if (originalShowPage) {
            window.showPage = function (pageId) {
                originalShowPage.call(this, pageId);

                if (pageId === 'play' && window.trackGameStart) {
                    const level = window.gameState?.currentLevel || 1;
                    const theme = window.gameState?.currentTheme || 'animals';
                    const mode = window.gameState?.gameMode || 'word';

                    window.trackGameStart(level, theme, mode);
                    console.log('📊 Tracked: Game start', { level, theme, mode });
                }

                // Track page view
                if (window.SupabaseConfig.trackActivity) {
                    window.SupabaseConfig.trackActivity('page_view', {
                        page: pageId,
                        timestamp: new Date().toISOString()
                    });
                }
            };
        }

        // Track word completion
        const originalCheckWordComplete = window.checkWordComplete;
        if (originalCheckWordComplete) {
            window.checkWordComplete = function () {
                const result = originalCheckWordComplete.call(this);

                // Track word learned
                if (window.currentWord && window.trackWordLearned) {
                    const word = window.currentWord.word || window.currentWord.sentence;
                    window.trackWordLearned(word, 3);
                    console.log('📊 Tracked: Word learned', word);
                }

                // Track stars earned
                if (window.trackStarEarned && window.gameState) {
                    window.trackStarEarned(3, window.gameState.totalStars);
                    console.log('📊 Tracked: Stars earned', 3);
                }

                return result;
            };
        }

        // Track level up
        const originalNextWord = window.nextWord;
        if (originalNextWord) {
            window.nextWord = function () {
                const oldLevel = window.gameState?.currentLevel || 1;
                const result = originalNextWord.call(this);
                const newLevel = window.gameState?.currentLevel || 1;

                if (newLevel > oldLevel && window.trackLevelUp) {
                    window.trackLevelUp(newLevel);
                    console.log('📊 Tracked: Level up', newLevel);
                }

                return result;
            };
        }

        // Track shop purchase
        window.addEventListener('shop-purchase', (e) => {
            if (window.trackShopPurchase && e.detail) {
                window.trackShopPurchase(
                    e.detail.itemId,
                    e.detail.itemName,
                    e.detail.cost
                );
                console.log('📊 Tracked: Shop purchase', e.detail);
            }
        });

        // Track theme change
        const originalChangeTheme = window.changeTheme;
        if (originalChangeTheme) {
            window.changeTheme = function (newTheme) {
                const oldTheme = window.gameState?.currentTheme;
                const result = originalChangeTheme.call(this, newTheme);

                if (window.trackThemeChange) {
                    window.trackThemeChange(oldTheme, newTheme);
                    console.log('📊 Tracked: Theme change', oldTheme, '->', newTheme);
                }

                return result;
            };
        }

        // Heartbeat mỗi 2 phút
        setInterval(() => {
            if (window.SupabaseConfig.updateHeartbeat) {
                window.SupabaseConfig.updateHeartbeat();
                console.log('💓 Heartbeat sent');
            }
        }, 2 * 60 * 1000);

        // Flush activity buffer mỗi 30 giây
        setInterval(() => {
            console.log('📊 Activity buffer check');
        }, 30 * 1000);

        console.log('✅ All tracking hooks installed');
    }

    // Track page unload
    window.addEventListener('beforeunload', () => {
        if (window.SupabaseConfig.endSession) {
            window.SupabaseConfig.endSession();
        }
    });

})();
