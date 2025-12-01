/* ========================================
   SYNC MANAGER - Đồng bộ localStorage <-> Supabase
   ======================================== */

(function () {
    'use strict';

    console.log('🔄 Sync Manager loading...');

    var syncQueue = [];
    var isSyncing = false;
    var lastSyncTime = 0;
    var SYNC_INTERVAL = 30000; // 30 giây

    // ========== GET USER ID ==========
    function getUserId() {
        // Tạo unique ID cho user (dựa trên device)
        var userId = localStorage.getItem('gamestva_user_id');

        if (!userId) {
            // Tạo ID mới
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('gamestva_user_id', userId);
        }

        return userId;
    }

    // ========== SYNC TO SUPABASE ==========
    async function syncToSupabase() {
        if (isSyncing) {
            console.log('⏳ Sync đang chạy, bỏ qua...');
            return;
        }

        // Kiểm tra có Supabase không
        if (!window.SupabaseConfig || !window.SupabaseConfig.client) {
            console.log('⚠️ Supabase không khả dụng, chỉ lưu local');
            return;
        }

        isSyncing = true;
        console.log('🔄 Bắt đầu sync...');

        try {
            var userId = getUserId();
            var gameData = localStorage.getItem('gamestva');

            if (!gameData) {
                console.log('ℹ️ Không có dữ liệu để sync');
                isSyncing = false;
                return;
            }

            var data = JSON.parse(gameData);

            // Chuẩn bị dữ liệu để sync
            var syncData = {
                user_id: userId,
                player_name: data.playerName || 'Bé',
                player_avatar: data.playerAvatar || '🐝',
                total_stars: data.totalStars || 0,
                coins: data.coins || 0,
                current_level: data.currentLevel || 1,
                current_theme: data.currentTheme || 'animals',
                words_completed: data.wordsCompleted || {},
                sentences_completed: data.sentencesCompleted || {},
                word_progress: data.wordProgress || {},
                badges: data.badges || [],
                stickers: data.stickers || [],
                settings: data.settings || {},
                last_played: new Date().toISOString(),
                device_info: {
                    user_agent: navigator.userAgent,
                    language: navigator.language,
                    screen: screen.width + 'x' + screen.height
                }
            };

            // Sync lên Supabase
            var client = window.SupabaseConfig.client();
            var { data: result, error } = await client
                .from('user_progress')
                .upsert(syncData, {
                    onConflict: 'user_id'
                });

            if (error) {
                console.error('❌ Sync error:', error);
            } else {
                console.log('✅ Sync thành công!');
                lastSyncTime = Date.now();
                localStorage.setItem('gamestva_last_sync', lastSyncTime);
            }

        } catch (error) {
            console.error('❌ Sync exception:', error);
        } finally {
            isSyncing = false;
        }
    }

    // ========== LOAD FROM SUPABASE ==========
    async function loadFromSupabase() {
        if (!window.SupabaseConfig || !window.SupabaseConfig.client) {
            console.log('⚠️ Supabase không khả dụng');
            return null;
        }

        try {
            var userId = getUserId();
            var client = window.SupabaseConfig.client();

            var { data, error } = await client
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Không tìm thấy data - bình thường
                    console.log('ℹ️ Chưa có dữ liệu trên cloud');
                    return null;
                }
                console.error('❌ Load error:', error);
                return null;
            }

            console.log('✅ Load từ cloud thành công!');
            return data;

        } catch (error) {
            console.error('❌ Load exception:', error);
            return null;
        }
    }

    // ========== MERGE DATA ==========
    function mergeData(localData, cloudData) {
        if (!cloudData) return localData;
        if (!localData) return cloudData;

        // Merge: Ưu tiên dữ liệu mới nhất
        var merged = { ...localData };

        // Merge numbers (lấy giá trị lớn hơn)
        merged.totalStars = Math.max(localData.totalStars || 0, cloudData.total_stars || 0);
        merged.coins = Math.max(localData.coins || 0, cloudData.coins || 0);

        // Merge objects (combine)
        merged.wordsCompleted = { ...(cloudData.words_completed || {}), ...(localData.wordsCompleted || {}) };
        merged.sentencesCompleted = { ...(cloudData.sentences_completed || {}), ...(localData.sentencesCompleted || {}) };
        merged.wordProgress = { ...(cloudData.word_progress || {}), ...(localData.wordProgress || {}) };

        // Merge arrays (unique)
        merged.badges = [...new Set([...(cloudData.badges || []), ...(localData.badges || [])])];
        merged.stickers = [...new Set([...(cloudData.stickers || []), ...(localData.stickers || [])])];

        // Lấy thông tin mới nhất
        if (cloudData.player_name) merged.playerName = cloudData.player_name;
        if (cloudData.player_avatar) merged.playerAvatar = cloudData.player_avatar;
        if (cloudData.current_level) merged.currentLevel = cloudData.current_level;
        if (cloudData.current_theme) merged.currentTheme = cloudData.current_theme;
        if (cloudData.settings) merged.settings = cloudData.settings;

        return merged;
    }

    // ========== INIT SYNC ==========
    async function initSync() {
        console.log('🔄 Init sync...');

        // Load dữ liệu local
        var localData = null;
        try {
            var saved = localStorage.getItem('gamestva');
            if (saved) {
                localData = JSON.parse(saved);
            }
        } catch (e) {
            console.error('❌ Load local error:', e);
        }

        // Load dữ liệu cloud
        var cloudData = await loadFromSupabase();

        // Merge
        if (cloudData) {
            var merged = mergeData(localData, cloudData);
            localStorage.setItem('gamestva', JSON.stringify(merged));
            console.log('✅ Đã merge dữ liệu local + cloud');
        }

        // Sync lần đầu
        setTimeout(syncToSupabase, 5000);

        // Auto sync định kỳ
        setInterval(function () {
            var now = Date.now();
            if (now - lastSyncTime > SYNC_INTERVAL) {
                syncToSupabase();
            }
        }, SYNC_INTERVAL);

        console.log('✅ Sync manager ready!');
    }

    // ========== MANUAL SYNC ==========
    function manualSync() {
        console.log('🔄 Manual sync triggered');
        syncToSupabase();
    }

    // ========== EXPORT ==========
    window.SyncManager = {
        init: initSync,
        sync: manualSync,
        getUserId: getUserId,
        loadFromCloud: loadFromSupabase
    };

    // Auto init khi có gameState
    var checkInterval = setInterval(function () {
        if (window.gameState) {
            clearInterval(checkInterval);
            initSync();
        }
    }, 1000);

    console.log('✅ Sync Manager loaded');

})();
