/* ========================================
   DISABLE SUPABASE SYNC - Tạm thời tắt sync
   Chỉ dùng localStorage cho đến khi fix xong Supabase
   ======================================== */

(function () {
    'use strict';

    console.log('⚠️ Disabling Supabase sync temporarily...');

    // Tắt hoàn toàn SyncManager TRƯỚC KHI NÓ LOAD
    window.SyncManager = {
        _disabled: true,  // ⭐ Flag để sync-manager.js biết đã disable
        init: function () {
            console.log('ℹ️ Sync init disabled - using localStorage only');
            return Promise.resolve();
        },
        sync: function () {
            console.log('ℹ️ Sync disabled - using localStorage only');
            return Promise.resolve();
        },
        getUserId: function () {
            var userId = localStorage.getItem('gamestva_user_id');
            if (!userId) {
                userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('gamestva_user_id', userId);
            }
            return userId;
        },
        loadFromCloud: function () {
            console.log('ℹ️ Load from cloud disabled');
            return Promise.resolve(null);
        }
    };

    // Tắt SupabaseConfig save functions
    setTimeout(function () {
        if (window.SupabaseConfig) {
            var originalConfig = window.SupabaseConfig;

            window.SupabaseConfig.saveUserProgress = function () {
                console.log('ℹ️ Supabase save disabled - using localStorage only');
                return Promise.resolve({ success: true });
            };

            window.SupabaseConfig.getUserProgress = function () {
                console.log('ℹ️ Supabase get disabled - using localStorage only');
                return Promise.resolve({ success: false });
            };

            window.SupabaseConfig.logActivity = function () {
                return Promise.resolve({ success: true });
            };
        }
    }, 100);

    console.log('✅ Supabase sync disabled - game will work with localStorage only');
    console.log('ℹ️ To re-enable: Remove disable-supabase-sync.js from index.html');

})();
