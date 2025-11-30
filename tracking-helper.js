/* ========================================
   TRACKING HELPER - Tích hợp tracking vào game
   ======================================== */

(function () {
    'use strict';

    console.log('📊 Loading tracking helper...');

    let gameStartTime = null;
    let currentGameData = null;

    // Track khi bắt đầu game
    window.trackGameStart = function (level, theme, mode) {
        gameStartTime = Date.now();
        currentGameData = {
            level: level,
            theme: theme,
            mode: mode
        };

        if (window.SupabaseConfig && window.SupabaseConfig.trackActivity) {
            window.SupabaseConfig.trackActivity('game_start', {
                level: level,
                theme: theme,
                mode: mode
            });
        }

        console.log('📊 Track: Game started', currentGameData);
    };

    // Track khi hoàn thành game
    window.trackGameComplete = function (stars, coins, wordsLearned) {
        if (!gameStartTime) return;

        const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);

        if (window.SupabaseConfig && window.SupabaseConfig.trackActivity) {
            window.SupabaseConfig.trackActivity('game_complete', {
                ...currentGameData,
                words_learned: wordsLearned
            }, {
                stars: stars,
                coins: coins,
                timeSpent: timeSpent
            });
        }

        console.log('📊 Track: Game completed', {
            stars,
            coins,
            timeSpent,
            wordsLearned
        });

        gameStartTime = null;
        currentGameData = null;
    };

    // Track khi học từ mới
    window.trackWordLearned = function (word, stars) {
        if (window.SupabaseConfig && window.SupabaseConfig.trackActivity) {
            window.SupabaseConfig.trackActivity('word_learned', {
                word: word,
                ...currentGameData
            }, {
                stars: stars || 0
            });
        }

        console.log('📊 Track: Word learned', word);
    };

    // Track khi lên cấp
    window.trackLevelUp = function (newLevel) {
        if (window.SupabaseConfig && window.SupabaseConfig.trackActivity) {
            window.SupabaseConfig.trackActivity('level_up', {
                new_level: newLevel,
                old_level: newLevel - 1
            });
        }

        console.log('📊 Track: Level up', newLevel);
    };

    // Track khi nhận sao
    window.trackStarEarned = function (stars, totalStars) {
        if (window.SupabaseConfig && window.SupabaseConfig.trackActivity) {
            window.SupabaseConfig.trackActivity('star_earned', {
                stars_earned: stars,
                total_stars: totalStars
            }, {
                stars: stars
            });
        }

        console.log('📊 Track: Star earned', stars);
    };

    // Track khi nhận xu
    window.trackCoinEarned = function (coins, totalCoins) {
        if (window.SupabaseConfig && window.SupabaseConfig.trackActivity) {
            window.SupabaseConfig.trackActivity('coin_earned', {
                coins_earned: coins,
                total_coins: totalCoins
            }, {
                coins: coins
            });
        }

        console.log('📊 Track: Coin earned', coins);
    };

    // Track khi mua item trong shop
    window.trackShopPurchase = function (itemId, itemName, cost) {
        if (window.SupabaseConfig && window.SupabaseConfig.trackActivity) {
            window.SupabaseConfig.trackActivity('shop_purchase', {
                item_id: itemId,
                item_name: itemName,
                cost: cost
            }, {
                coins: -cost
            });
        }

        console.log('📊 Track: Shop purchase', itemName, cost);
    };

    // Track khi thay đổi theme
    window.trackThemeChange = function (oldTheme, newTheme) {
        if (window.SupabaseConfig && window.SupabaseConfig.trackActivity) {
            window.SupabaseConfig.trackActivity('theme_change', {
                old_theme: oldTheme,
                new_theme: newTheme
            });
        }

        console.log('📊 Track: Theme change', oldTheme, '->', newTheme);
    };

    // Track khi thay đổi avatar
    window.trackAvatarChange = function (oldAvatar, newAvatar) {
        if (window.SupabaseConfig && window.SupabaseConfig.trackActivity) {
            window.SupabaseConfig.trackActivity('avatar_change', {
                old_avatar: oldAvatar,
                new_avatar: newAvatar
            });
        }

        console.log('📊 Track: Avatar change', oldAvatar, '->', newAvatar);
    };

    // Track khi tạo custom lesson
    window.trackCustomLesson = function (lessonName, wordCount) {
        if (window.SupabaseConfig && window.SupabaseConfig.trackActivity) {
            window.SupabaseConfig.trackActivity('custom_lesson_created', {
                lesson_name: lessonName,
                word_count: wordCount
            });
        }

        console.log('📊 Track: Custom lesson created', lessonName);
    };

    // Track page view
    window.trackPageView = function (pageName) {
        if (window.SupabaseConfig && window.SupabaseConfig.trackActivity) {
            window.SupabaseConfig.trackActivity('page_view', {
                page: pageName
            });
        }

        console.log('📊 Track: Page view', pageName);
    };

    // Auto-track khi user đăng nhập
    if (window.SupabaseConfig && window.SupabaseConfig.client) {
        const client = window.SupabaseConfig.client();
        if (client) {
            client.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    console.log('📊 User signed in, tracking enabled');

                    // Track login
                    if (window.SupabaseConfig.trackActivity) {
                        window.SupabaseConfig.trackActivity('user_login', {
                            login_method: 'email'
                        });
                    }
                }
            });
        }
    }

    console.log('✅ Tracking helper loaded');

})();
