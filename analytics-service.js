/* ========================================
   ANALYTICS SERVICE - Quản lý dữ liệu theo thời gian
   ======================================== */

(function () {
    'use strict';

    console.log('📊 Loading Analytics Service...');

    let currentSession = null;
    let sessionCheckInterval = null;

    // ========== HELPER: GET USER ID ==========
    async function getUserId() {
        try {
            // Ưu tiên lấy từ Supabase auth
            if (window.SupabaseConfig && window.SupabaseConfig.getCurrentUser) {
                const user = await window.SupabaseConfig.getCurrentUser();
                if (user && user.id) {
                    return user.id;
                }
            }

            // Fallback: Lấy từ localStorage (cho user chưa đăng nhập)
            let userId = localStorage.getItem('gamestva_user_id');
            if (!userId) {
                userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('gamestva_user_id', userId);
            }
            return userId;

        } catch (error) {
            console.error('❌ Get user ID error:', error);
            return 'user_anonymous';
        }
    }

    // ========== SESSION TRACKING ==========

    async function startSession(theme, level, mode) {
        try {
            // Nếu đã có session, end nó trước
            if (currentSession) {
                await endSession();
            }

            const userId = await getUserId();

            if (!window.SupabaseConfig || !window.SupabaseConfig.client) {
                console.warn('⚠️ Supabase not available, session tracking disabled');
                return null;
            }

            const client = window.SupabaseConfig.client();
            const { data, error } = await client
                .from('learning_sessions')
                .insert({
                    user_id: userId,
                    started_at: new Date().toISOString(),
                    theme: theme,
                    level: level,
                    mode: mode,
                    device_info: {
                        user_agent: navigator.userAgent,
                        screen: screen.width + 'x' + screen.height,
                        language: navigator.language
                    }
                })
                .select()
                .single();

            if (error) {
                console.error('❌ Start session error:', error);
                return null;
            }

            currentSession = {
                id: data.id,
                userId: userId,
                startTime: Date.now(),
                theme: theme,
                level: level,
                mode: mode,
                wordsLearned: [],
                starsEarned: 0,
                coinsEarned: 0,
                correctAnswers: 0,
                totalAnswers: 0
            };

            console.log('✅ Session started:', currentSession.id);

            // Auto-save session mỗi 30 giây
            sessionCheckInterval = setInterval(saveSessionProgress, 30000);

            return currentSession;

        } catch (error) {
            console.error('❌ Start session exception:', error);
            return null;
        }
    }

    async function saveSessionProgress() {
        if (!currentSession) return;

        try {
            const duration = Math.floor((Date.now() - currentSession.startTime) / 1000);
            const accuracy = currentSession.totalAnswers > 0
                ? (currentSession.correctAnswers / currentSession.totalAnswers * 100).toFixed(2)
                : 0;

            const client = window.SupabaseConfig.client();
            await client
                .from('learning_sessions')
                .update({
                    duration_seconds: duration,
                    words_learned: currentSession.wordsLearned,
                    stars_earned: currentSession.starsEarned,
                    coins_earned: currentSession.coinsEarned,
                    accuracy_percent: accuracy
                })
                .eq('id', currentSession.id);

            console.log('💾 Session progress saved');

        } catch (error) {
            console.error('❌ Save session progress error:', error);
        }
    }

    async function endSession() {
        if (!currentSession) return;

        try {
            // Clear interval
            if (sessionCheckInterval) {
                clearInterval(sessionCheckInterval);
                sessionCheckInterval = null;
            }

            const duration = Math.floor((Date.now() - currentSession.startTime) / 1000);
            const accuracy = currentSession.totalAnswers > 0
                ? (currentSession.correctAnswers / currentSession.totalAnswers * 100).toFixed(2)
                : 0;

            const client = window.SupabaseConfig.client();
            const { error } = await client
                .from('learning_sessions')
                .update({
                    ended_at: new Date().toISOString(),
                    duration_seconds: duration,
                    words_learned: currentSession.wordsLearned,
                    stars_earned: currentSession.starsEarned,
                    coins_earned: currentSession.coinsEarned,
                    accuracy_percent: accuracy
                })
                .eq('id', currentSession.id);

            if (error) throw error;

            // Cập nhật daily progress
            await updateDailyProgress({
                words_learned: currentSession.wordsLearned.length,
                games_played: 1,
                total_time_seconds: duration,
                stars_earned: currentSession.starsEarned,
                coins_earned: currentSession.coinsEarned,
                theme: currentSession.theme,
                level: currentSession.level
            });

            console.log('✅ Session ended:', currentSession.id, {
                duration: duration + 's',
                words: currentSession.wordsLearned.length,
                accuracy: accuracy + '%'
            });

            currentSession = null;

        } catch (error) {
            console.error('❌ End session error:', error);
        }
    }

    // ========== DAILY PROGRESS ==========

    async function updateDailyProgress(stats) {
        try {
            const userId = await getUserId();
            const today = new Date().toISOString().split('T')[0];

            if (!window.SupabaseConfig || !window.SupabaseConfig.client) {
                console.warn('⚠️ Supabase not available');
                return;
            }

            const client = window.SupabaseConfig.client();

            // Lấy progress hiện tại
            const { data: existing } = await client
                .from('daily_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('date', today)
                .maybeSingle();

            // Chuẩn bị themes và levels
            const themesPlayed = existing?.themes_played || [];
            if (stats.theme && !themesPlayed.includes(stats.theme)) {
                themesPlayed.push(stats.theme);
            }

            const levelsPlayed = existing?.levels_played || [];
            if (stats.level && !levelsPlayed.includes(stats.level)) {
                levelsPlayed.push(stats.level);
            }

            const updateData = {
                user_id: userId,
                date: today,
                words_learned: (existing?.words_learned || 0) + (stats.words_learned || 0),
                sentences_completed: (existing?.sentences_completed || 0) + (stats.sentences_completed || 0),
                games_played: (existing?.games_played || 0) + (stats.games_played || 0),
                total_time_seconds: (existing?.total_time_seconds || 0) + (stats.total_time_seconds || 0),
                stars_earned: (existing?.stars_earned || 0) + (stats.stars_earned || 0),
                coins_earned: (existing?.coins_earned || 0) + (stats.coins_earned || 0),
                perfect_games: (existing?.perfect_games || 0) + (stats.perfect_games || 0),
                themes_played: themesPlayed,
                levels_played: levelsPlayed,
                updated_at: new Date().toISOString()
            };

            const { error } = await client
                .from('daily_progress')
                .upsert(updateData, { onConflict: 'user_id,date' });

            if (error) throw error;

            console.log('✅ Daily progress updated:', updateData);

        } catch (error) {
            console.error('❌ Update daily progress error:', error);
        }
    }

    // ========== WORD MASTERY ==========

    async function trackWordPractice(word, theme, isCorrect) {
        try {
            const userId = await getUserId();

            if (!window.SupabaseConfig || !window.SupabaseConfig.client) {
                console.warn('⚠️ Supabase not available');
                return;
            }

            const client = window.SupabaseConfig.client();

            // Lấy mastery hiện tại
            const { data: existing } = await client
                .from('word_mastery')
                .select('*')
                .eq('user_id', userId)
                .eq('word', word)
                .maybeSingle();

            const timesPracticed = (existing?.times_practiced || 0) + 1;
            const timesCorrect = (existing?.times_correct || 0) + (isCorrect ? 1 : 0);
            const timesIncorrect = (existing?.times_incorrect || 0) + (isCorrect ? 0 : 1);

            // Tính mastery level (0-100)
            const masteryLevel = Math.min(100, Math.floor((timesCorrect / timesPracticed) * 100));

            const updateData = {
                user_id: userId,
                word: word,
                theme: theme,
                times_practiced: timesPracticed,
                times_correct: timesCorrect,
                times_incorrect: timesIncorrect,
                mastery_level: masteryLevel,
                first_learned_at: existing?.first_learned_at || new Date().toISOString(),
                last_practiced_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { error } = await client
                .from('word_mastery')
                .upsert(updateData, { onConflict: 'user_id,word' });

            if (error) throw error;

            // Track trong session
            if (currentSession) {
                if (isCorrect && !currentSession.wordsLearned.includes(word)) {
                    currentSession.wordsLearned.push(word);
                }
                currentSession.totalAnswers++;
                if (isCorrect) currentSession.correctAnswers++;
            }

            console.log('✅ Word mastery tracked:', word, masteryLevel + '%');

        } catch (error) {
            console.error('❌ Track word mastery error:', error);
        }
    }

    // ========== ANALYTICS QUERIES ==========

    async function getWeeklyStats(weekStart) {
        try {
            const userId = await getUserId();

            if (!window.SupabaseConfig || !window.SupabaseConfig.client) {
                return null;
            }

            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const client = window.SupabaseConfig.client();
            const { data, error } = await client
                .from('daily_progress')
                .select('*')
                .eq('user_id', userId)
                .gte('date', weekStart.toISOString().split('T')[0])
                .lte('date', weekEnd.toISOString().split('T')[0])
                .order('date', { ascending: true });

            if (error) throw error;

            // Tính tổng
            const stats = {
                totalWords: 0,
                totalTime: 0,
                totalGames: 0,
                totalStars: 0,
                totalCoins: 0,
                dailyData: data || []
            };

            if (data) {
                data.forEach(day => {
                    stats.totalWords += day.words_learned || 0;
                    stats.totalTime += day.total_time_seconds || 0;
                    stats.totalGames += day.games_played || 0;
                    stats.totalStars += day.stars_earned || 0;
                    stats.totalCoins += day.coins_earned || 0;
                });
            }

            return stats;

        } catch (error) {
            console.error('❌ Get weekly stats error:', error);
            return null;
        }
    }

    async function getWordMasteryReport() {
        try {
            const userId = await getUserId();

            if (!window.SupabaseConfig || !window.SupabaseConfig.client) {
                return null;
            }

            const client = window.SupabaseConfig.client();
            const { data, error } = await client
                .from('word_mastery')
                .select('*')
                .eq('user_id', userId)
                .order('mastery_level', { ascending: false });

            if (error) throw error;

            // Phân loại
            const report = {
                mastered: (data || []).filter(w => w.mastery_level >= 80),
                learning: (data || []).filter(w => w.mastery_level >= 50 && w.mastery_level < 80),
                needsPractice: (data || []).filter(w => w.mastery_level < 50),
                totalWords: (data || []).length,
                allWords: data || []
            };

            return report;

        } catch (error) {
            console.error('❌ Get word mastery report error:', error);
            return null;
        }
    }

    async function getTodayStats() {
        try {
            const userId = await getUserId();
            const today = new Date().toISOString().split('T')[0];

            if (!window.SupabaseConfig || !window.SupabaseConfig.client) {
                return null;
            }

            const client = window.SupabaseConfig.client();
            const { data, error } = await client
                .from('daily_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('date', today)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') throw error;

            return data || {
                words_learned: 0,
                games_played: 0,
                total_time_seconds: 0,
                stars_earned: 0,
                coins_earned: 0
            };

        } catch (error) {
            console.error('❌ Get today stats error:', error);
            return null;
        }
    }

    async function getRecentSessions(limit = 10) {
        try {
            const userId = await getUserId();

            if (!window.SupabaseConfig || !window.SupabaseConfig.client) {
                return [];
            }

            const client = window.SupabaseConfig.client();
            const { data, error } = await client
                .from('learning_sessions')
                .select('*')
                .eq('user_id', userId)
                .order('started_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return data || [];

        } catch (error) {
            console.error('❌ Get recent sessions error:', error);
            return [];
        }
    }

    // ========== SESSION HELPERS ==========

    function addStars(stars) {
        if (currentSession) {
            currentSession.starsEarned += stars;
        }
    }

    function addCoins(coins) {
        if (currentSession) {
            currentSession.coinsEarned += coins;
        }
    }

    function getCurrentSession() {
        return currentSession;
    }

    // ========== AUTO CLEANUP ==========

    // Tự động end session khi user rời trang
    window.addEventListener('beforeunload', function () {
        if (currentSession) {
            // Sync call để đảm bảo data được lưu
            navigator.sendBeacon && navigator.sendBeacon('/api/end-session', JSON.stringify({
                sessionId: currentSession.id
            }));
        }
    });

    // ========== EXPORT ==========

    window.AnalyticsService = {
        // Session management
        startSession: startSession,
        endSession: endSession,
        getCurrentSession: getCurrentSession,

        // Tracking
        trackWordPractice: trackWordPractice,
        updateDailyProgress: updateDailyProgress,

        // Queries
        getWeeklyStats: getWeeklyStats,
        getWordMasteryReport: getWordMasteryReport,
        getTodayStats: getTodayStats,
        getRecentSessions: getRecentSessions,

        // Session helpers
        addStars: addStars,
        addCoins: addCoins,

        // Utility
        getUserId: getUserId
    };

    console.log('✅ Analytics Service loaded');

})();
