<<<<<<< HEAD
/* ========================================
   SUPABASE CONFIGURATION
   ======================================== */

(function () {
    'use strict';

    console.log('🔗 Loading Supabase config...');

    const SUPABASE_URL = 'https://apyohrljwovonoecuwml.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFweW9ocmxqd292b25vZWN1d21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzkxMDIsImV4cCI6MjA3OTcxNTEwMn0.Ol0YDm1U2weoaDQWJMCHopFmYRztmhGcYOrp8tg98C4';

    let supabaseClient = null;

    function initSupabase() {
        try {
            if (typeof supabase === 'undefined') {
                console.error('❌ Supabase library not loaded!');
                return null;
            }

            if (supabaseClient) {
                return supabaseClient;
            }

            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase initialized');
            return supabaseClient;
        } catch (error) {
            console.error('❌ Init error:', error);
            return null;
        }
    }

    async function signUp(email, password, userData) {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: { data: userData }
            });
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function signIn(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }


    async function signOut() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function getCurrentUser() {
        try {
            if (!supabaseClient) return null;
            const { data: { user }, error } = await supabaseClient.auth.getUser();
            if (error) {
                // Don't log error if it's just missing session (normal for admin)
                if (error.message !== 'Auth session missing!') {
                    console.error('Get user error:', error);
                }
                return null;
            }
            return user;
        } catch (error) {
            // Silently return null for auth errors in admin context
            if (error.message !== 'Auth session missing!') {
                console.error('Get user error:', error);
            }
            return null;
        }
    }

    async function saveUserProgress(userId, progressData) {
        try {
            // Chỉ lưu các field được phép trong database
            const allowedData = {
                user_id: userId,
                total_stars: progressData.totalStars || 0,
                coins: progressData.coins || 0,
                words_learned: progressData.wordsLearned || [],
                owned_characters: progressData.ownedCharacters || [],
                player_name: progressData.playerName || 'Bé',
                player_avatar: progressData.playerAvatar || '👦',
                current_level: progressData.currentLevel || 1,
                streak: progressData.streak || 0,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabaseClient
                .from('user_progress')
                .upsert(allowedData, {
                    onConflict: 'user_id'
                });

            if (error) {
                console.error('Save progress error:', error);
                throw error;
            }
            return { success: true, data: data };
        } catch (error) {
            console.error('Save progress failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async function getUserProgress(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle(); // Dùng maybeSingle() thay vì single() để tránh lỗi 406

            if (error) {
                console.error('Get progress error:', error);
                throw error;
            }

            // Nếu không có data, trả về success với data null
            return { success: true, data: data };
        } catch (error) {
            console.error('Get progress failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async function getAllUsers() {
        try {
            console.log('🔍 Getting all users...');

            // Method 1: Direct query profiles (simplest and most reliable)
            const { data: profilesData, error: profilesError } = await supabaseClient
                .from('profiles')
                .select('id, email, username, full_name, created_at')
                .order('created_at', { ascending: false });

            if (!profilesError && profilesData && profilesData.length > 0) {
                console.log('✅ Got users from profiles:', profilesData.length);
                const users = profilesData.map(p => ({
                    id: p.id,
                    email: p.email || 'N/A',
                    username: p.full_name || p.username || 'User',
                    created_at: p.created_at
                }));
                return { success: true, data: users };
            }

            // Method 2: Fallback to user_progress
            console.log('⚠️ No profiles, trying user_progress...');
            const { data: progressData, error: progressError } = await supabaseClient
                .from('user_progress')
                .select('user_id, player_name, created_at')
                .order('created_at', { ascending: false });

            if (progressError) {
                console.error('❌ Progress error:', progressError);
                throw progressError;
            }

            if (!progressData || progressData.length === 0) {
                console.log('⚠️ No users found in any table');
                return { success: true, data: [] };
            }

            console.log('✅ Got users from user_progress:', progressData.length);
            const users = progressData.map(p => ({
                id: p.user_id,
                email: 'N/A',
                username: p.player_name || 'User',
                created_at: p.created_at
            }));

            return { success: true, data: users };

        } catch (error) {
            console.error('❌ Get all users error:', error);
            return { success: false, error: error.message };
        }
    }


    async function logActivity(action, metadata = {}) {
        try {
            const user = await getCurrentUser();
            if (!user) return;
            const { data, error } = await supabaseClient
                .from('activity_logs')
                .insert({
                    user_id: user.id,
                    action: action,
                    user_agent: navigator.userAgent,
                    device_info: JSON.stringify({
                        platform: navigator.platform,
                        language: navigator.language,
                        screen: screen.width + 'x' + screen.height
                    })
                });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    }

    async function getUserActivityLogs(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('activity_logs')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50);
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function addUserNote(userId, note) {
        try {
            const { data, error } = await supabaseClient
                .from('user_notes')
                .insert({ user_id: userId, note: note });
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function getUserNotes(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('user_notes')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function adminResetPassword(email) {
        try {
            const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/auth.html'
            });
            if (error) throw error;
            return { success: true, message: 'Email reset đã được gửi!' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // HỆ THỐNG TRACKING NÂNG CAO
    // ========================================

    let currentSessionId = null;
    let sessionStartTime = null;
    let activityBuffer = [];

    // Lấy thông tin thiết bị chi tiết
    function getDeviceInfo() {
        const ua = navigator.userAgent;
        let deviceType = 'desktop';
        let browser = 'Unknown';
        let os = 'Unknown';

        // Detect device type
        if (/mobile/i.test(ua)) deviceType = 'mobile';
        else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

        // Detect browser
        if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
        else if (ua.indexOf('Safari') > -1) browser = 'Safari';
        else if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
        else if (ua.indexOf('Edge') > -1) browser = 'Edge';

        // Detect OS
        if (ua.indexOf('Win') > -1) os = 'Windows';
        else if (ua.indexOf('Mac') > -1) os = 'MacOS';
        else if (ua.indexOf('Linux') > -1) os = 'Linux';
        else if (ua.indexOf('Android') > -1) os = 'Android';
        else if (ua.indexOf('iOS') > -1) os = 'iOS';

        return {
            deviceType,
            browser,
            os,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            userAgent: ua,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            connection: navigator.connection ? navigator.connection.effectiveType : 'unknown'
        };
    }

    // Lấy IP address (sử dụng API public)
    async function getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            // CSP blocked or network error - silently return unknown
            console.log('⚠️ Cannot get IP, using unknown');
            return 'unknown';
        }
    }

    // Tạo device ID duy nhất
    function getDeviceId() {
        let deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
            deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('device_id', deviceId);
        }
        return deviceId;
    }

    // Bắt đầu session tracking
    async function startSession() {
        try {
            const user = await getCurrentUser();
            if (!user) return null;

            // Nếu đã có session rồi thì không tạo mới
            if (currentSessionId) {
                console.log('⚠️ Session already exists:', currentSessionId);
                return currentSessionId;
            }

            const deviceInfo = getDeviceInfo();
            const deviceId = getDeviceId();
            const ipAddress = await getIPAddress();

            console.log('🚀 Starting new session...', {
                user: user.email,
                deviceId,
                deviceType: deviceInfo.deviceType,
                ip: ipAddress
            });

            // Tạo session mới
            const { data, error } = await supabaseClient
                .from('user_sessions')
                .insert({
                    user_id: user.id,
                    device_type: deviceInfo.deviceType,
                    browser: deviceInfo.browser,
                    os: deviceInfo.os,
                    screen_resolution: deviceInfo.screenResolution,
                    ip_address: ipAddress,
                    is_active: true
                })
                .select()
                .single();

            if (error) throw error;

            currentSessionId = data.id;
            sessionStartTime = Date.now();

            // Cập nhật device tracking với IP address
            const { error: deviceError } = await supabaseClient
                .from('device_tracking')
                .upsert({
                    user_id: user.id,
                    device_id: deviceId,
                    device_name: `${deviceInfo.os} - ${deviceInfo.browser}`,
                    device_type: deviceInfo.deviceType,
                    browser: deviceInfo.browser,
                    os: deviceInfo.os,
                    screen_resolution: deviceInfo.screenResolution,
                    ip_address: ipAddress,
                    last_seen: new Date().toISOString(),
                    is_online: true
                }, {
                    onConflict: 'user_id,device_id'
                });

            if (deviceError) {
                console.error('❌ Device tracking error:', deviceError);
            }

            console.log('✅ Session started:', currentSessionId, 'Device:', deviceId);
            return currentSessionId;
        } catch (error) {
            console.error('❌ Start session error:', error);
            return null;
        }
    }

    // Kết thúc session
    async function endSession() {
        if (!currentSessionId || !sessionStartTime) return;

        try {
            const duration = Math.floor((Date.now() - sessionStartTime) / 1000);

            await supabaseClient
                .from('user_sessions')
                .update({
                    session_end: new Date().toISOString(),
                    duration_seconds: duration,
                    is_active: false
                })
                .eq('id', currentSessionId);

            // Flush activity buffer
            if (activityBuffer.length > 0) {
                await supabaseClient
                    .from('activity_stats')
                    .insert(activityBuffer);
                activityBuffer = [];
            }

            console.log('✅ Session ended:', currentSessionId, 'Duration:', duration, 's');
            currentSessionId = null;
            sessionStartTime = null;
        } catch (error) {
            console.error('❌ End session error:', error);
        }
    }

    // Cập nhật heartbeat (user vẫn online)
    async function updateHeartbeat() {
        try {
            const user = await getCurrentUser();
            if (!user) return;

            const deviceId = getDeviceId();
            const ipAddress = await getIPAddress();

            const { error } = await supabaseClient
                .from('device_tracking')
                .update({
                    last_seen: new Date().toISOString(),
                    is_online: true,
                    ip_address: ipAddress
                })
                .eq('user_id', user.id)
                .eq('device_id', deviceId);

            if (error) {
                console.error('❌ Heartbeat update error:', error);
            }
        } catch (error) {
            console.error('❌ Heartbeat error:', error);
        }
    }

    // Đánh dấu thiết bị offline
    async function markDeviceOffline() {
        try {
            const user = await getCurrentUser();
            if (!user) return;

            const deviceId = getDeviceId();

            await supabaseClient
                .from('device_tracking')
                .update({
                    is_online: false,
                    last_seen: new Date().toISOString()
                })
                .eq('user_id', user.id)
                .eq('device_id', deviceId);

            console.log('🔴 Device marked offline');
        } catch (error) {
            console.error('❌ Mark offline error:', error);
        }
    }

    // Track hoạt động chi tiết
    async function trackActivity(activityType, activityData = {}, stats = {}) {
        try {
            const user = await getCurrentUser();
            if (!user || !currentSessionId) return;

            const activity = {
                user_id: user.id,
                session_id: currentSessionId,
                activity_type: activityType,
                activity_data: activityData,
                stars_earned: stats.stars || 0,
                coins_earned: stats.coins || 0,
                time_spent_seconds: stats.timeSpent || 0,
                created_at: new Date().toISOString()
            };

            // Buffer activities để giảm số lần gọi DB
            activityBuffer.push(activity);

            // Flush buffer khi đủ 10 activities hoặc mỗi 30s
            if (activityBuffer.length >= 10) {
                const toInsert = [...activityBuffer];
                activityBuffer = [];
                await supabaseClient
                    .from('activity_stats')
                    .insert(toInsert);
            }

            return { success: true };
        } catch (error) {
            console.error('❌ Track activity error:', error);
            return { success: false, error: error.message };
        }
    }

    // Lấy thống kê tổng quan cho admin
    async function getAdminDashboardStats() {
        try {
            // Lấy tất cả users với thông tin từ auth.users
            const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
            if (authError) throw authError;

            // Lấy progress của users
            const { data: progressData } = await supabaseClient
                .from('user_progress')
                .select('*');

            // Lấy devices đang online
            const { data: onlineDevices } = await supabaseClient
                .from('device_tracking')
                .select('*')
                .eq('is_online', true)
                .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

            // Lấy sessions hôm nay
            const today = new Date().toISOString().split('T')[0];
            const { data: todaySessions } = await supabaseClient
                .from('user_sessions')
                .select('*')
                .gte('session_start', today);

            // Tính toán stats
            const totalUsers = authUsers.users.length;
            const activeToday = new Set(todaySessions?.map(s => s.user_id) || []).size;
            const onlineNow = new Set(onlineDevices?.map(d => d.user_id) || []).size;
            const totalStars = progressData?.reduce((sum, p) => sum + (p.total_stars || 0), 0) || 0;
            const totalCoins = progressData?.reduce((sum, p) => sum + (p.coins || 0), 0) || 0;

            return {
                success: true,
                data: {
                    totalUsers,
                    activeToday,
                    onlineNow,
                    totalStars,
                    totalCoins,
                    totalSessions: todaySessions?.length || 0,
                    onlineDevices: onlineDevices || []
                }
            };
        } catch (error) {
            console.error('❌ Get dashboard stats error:', error);
            return { success: false, error: error.message };
        }
    }

    // Lấy thống kê theo ngày
    async function getDailyStats(startDate, endDate) {
        try {
            const { data, error } = await supabaseClient
                .from('daily_stats')
                .select('*')
                .gte('stat_date', startDate)
                .lte('stat_date', endDate)
                .order('stat_date', { ascending: true });

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Lấy thống kê thiết bị của user
    async function getUserDevices(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('device_tracking')
                .select('*')
                .eq('user_id', userId)
                .order('last_seen', { ascending: false });

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Lấy sessions của user
    async function getUserSessions(userId, limit = 20) {
        try {
            const { data, error } = await supabaseClient
                .from('user_sessions')
                .select('*')
                .eq('user_id', userId)
                .order('session_start', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Lấy activity stats của user
    async function getUserActivityStats(userId, limit = 50) {
        try {
            const { data, error } = await supabaseClient
                .from('activity_stats')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Tính toán daily stats cho ngày hôm nay
    async function calculateTodayStats() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { error } = await supabaseClient.rpc('calculate_daily_stats', {
                target_date: today
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Auto-start session khi user đăng nhập
    let heartbeatInterval = null;
    let activityFlushInterval = null;

    supabaseClient?.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
            console.log('🟢 User signed in, starting session...');
            await startSession();

            // Clear old intervals nếu có
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            if (activityFlushInterval) clearInterval(activityFlushInterval);

            // Heartbeat mỗi 30 giây (thay vì 2 phút) để realtime hơn
            heartbeatInterval = setInterval(async () => {
                await updateHeartbeat();
                console.log('💓 Heartbeat sent');
            }, 30 * 1000);

            // Gửi heartbeat ngay lập tức
            setTimeout(() => updateHeartbeat(), 2000);

            // Flush activity buffer mỗi 30s
            activityFlushInterval = setInterval(async () => {
                if (activityBuffer.length > 0) {
                    const toInsert = [...activityBuffer];
                    activityBuffer = [];
                    try {
                        await supabaseClient.from('activity_stats').insert(toInsert);
                        console.log('📊 Flushed', toInsert.length, 'activities');
                    } catch (error) {
                        console.error('Flush error:', error);
                    }
                }
            }, 30 * 1000);

        } else if (event === 'SIGNED_OUT') {
            console.log('🔴 User signed out, ending session...');
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            if (activityFlushInterval) clearInterval(activityFlushInterval);
            await endSession();
            await markDeviceOffline();
        }
    });

    // End session khi đóng tab
    window.addEventListener('beforeunload', async () => {
        if (currentSessionId) {
            // Đánh dấu offline ngay lập tức
            await markDeviceOffline();

            // Sử dụng sendBeacon để đảm bảo request được gửi
            const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
            const data = {
                session_end: new Date().toISOString(),
                duration_seconds: duration,
                is_active: false
            };

            // Try sendBeacon first
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            navigator.sendBeacon(
                `${SUPABASE_URL}/rest/v1/user_sessions?id=eq.${currentSessionId}`,
                blob
            );
        }
    });

    // Đánh dấu offline khi tab bị ẩn
    document.addEventListener('visibilitychange', async () => {
        if (document.hidden) {
            console.log('👁️ Tab hidden, marking offline...');
            await markDeviceOffline();
        } else {
            console.log('👁️ Tab visible, marking online...');
            await updateHeartbeat();
        }
    });

    window.SupabaseConfig = {
        init: initSupabase,
        signUp: signUp,
        signIn: signIn,
        signOut: signOut,
        getCurrentUser: getCurrentUser,
        saveUserProgress: saveUserProgress,
        getUserProgress: getUserProgress,
        getAllUsers: getAllUsers,
        logActivity: logActivity,
        getUserActivityLogs: getUserActivityLogs,
        addUserNote: addUserNote,
        getUserNotes: getUserNotes,
        adminResetPassword: adminResetPassword,
        // Tracking functions
        startSession: startSession,
        endSession: endSession,
        updateHeartbeat: updateHeartbeat,
        markDeviceOffline: markDeviceOffline,
        trackActivity: trackActivity,
        getAdminDashboardStats: getAdminDashboardStats,
        getDailyStats: getDailyStats,
        getUserDevices: getUserDevices,
        getUserSessions: getUserSessions,
        getUserActivityStats: getUserActivityStats,
        calculateTodayStats: calculateTodayStats,
        getIPAddress: getIPAddress,
        getDeviceInfo: getDeviceInfo,
        getDeviceId: getDeviceId,
        client: () => supabaseClient
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(initSupabase, 100);
        });
    } else {
        setTimeout(initSupabase, 100);
    }

    console.log('✅ Supabase config loaded');

})();
=======
/* ========================================
   SUPABASE CONFIGURATION
   ======================================== */

(function () {
    'use strict';

    console.log('🔗 Loading Supabase config...');

    const SUPABASE_URL = 'https://apyohrljwovonoecuwml.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFweW9ocmxqd292b25vZWN1d21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzkxMDIsImV4cCI6MjA3OTcxNTEwMn0.Ol0YDm1U2weoaDQWJMCHopFmYRztmhGcYOrp8tg98C4';

    let supabaseClient = null;

    function initSupabase() {
        try {
            if (typeof supabase === 'undefined') {
                console.error('❌ Supabase library not loaded!');
                return null;
            }

            if (supabaseClient) {
                return supabaseClient;
            }

            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase initialized');
            return supabaseClient;
        } catch (error) {
            console.error('❌ Init error:', error);
            return null;
        }
    }

    async function signUp(email, password, userData) {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: { data: userData }
            });
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function signIn(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }


    async function signOut() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function getCurrentUser() {
        try {
            if (!supabaseClient) return null;
            const { data: { user }, error } = await supabaseClient.auth.getUser();
            if (error) {
                // Don't log error if it's just missing session (normal for admin)
                if (error.message !== 'Auth session missing!') {
                    console.error('Get user error:', error);
                }
                return null;
            }
            return user;
        } catch (error) {
            // Silently return null for auth errors in admin context
            if (error.message !== 'Auth session missing!') {
                console.error('Get user error:', error);
            }
            return null;
        }
    }

    async function saveUserProgress(userId, progressData) {
        try {
            // Chỉ lưu các field được phép trong database
            const allowedData = {
                user_id: userId,
                total_stars: progressData.totalStars || 0,
                coins: progressData.coins || 0,
                words_learned: progressData.wordsLearned || [],
                owned_characters: progressData.ownedCharacters || [],
                player_name: progressData.playerName || 'Bé',
                player_avatar: progressData.playerAvatar || '👦',
                current_level: progressData.currentLevel || 1,
                streak: progressData.streak || 0,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabaseClient
                .from('user_progress')
                .upsert(allowedData, {
                    onConflict: 'user_id'
                });

            if (error) {
                console.error('Save progress error:', error);
                throw error;
            }
            return { success: true, data: data };
        } catch (error) {
            console.error('Save progress failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async function getUserProgress(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle(); // Dùng maybeSingle() thay vì single() để tránh lỗi 406

            if (error) {
                console.error('Get progress error:', error);
                throw error;
            }

            // Nếu không có data, trả về success với data null
            return { success: true, data: data };
        } catch (error) {
            console.error('Get progress failed:', error.message);
            return { success: false, error: error.message };
        }
    }

    async function getAllUsers() {
        try {
            console.log('🔍 Getting all users...');

            // Method 1: Direct query profiles (simplest and most reliable)
            const { data: profilesData, error: profilesError } = await supabaseClient
                .from('profiles')
                .select('id, email, username, full_name, created_at')
                .order('created_at', { ascending: false });

            if (!profilesError && profilesData && profilesData.length > 0) {
                console.log('✅ Got users from profiles:', profilesData.length);
                const users = profilesData.map(p => ({
                    id: p.id,
                    email: p.email || 'N/A',
                    username: p.full_name || p.username || 'User',
                    created_at: p.created_at
                }));
                return { success: true, data: users };
            }

            // Method 2: Fallback to user_progress
            console.log('⚠️ No profiles, trying user_progress...');
            const { data: progressData, error: progressError } = await supabaseClient
                .from('user_progress')
                .select('user_id, player_name, created_at')
                .order('created_at', { ascending: false });

            if (progressError) {
                console.error('❌ Progress error:', progressError);
                throw progressError;
            }

            if (!progressData || progressData.length === 0) {
                console.log('⚠️ No users found in any table');
                return { success: true, data: [] };
            }

            console.log('✅ Got users from user_progress:', progressData.length);
            const users = progressData.map(p => ({
                id: p.user_id,
                email: 'N/A',
                username: p.player_name || 'User',
                created_at: p.created_at
            }));

            return { success: true, data: users };

        } catch (error) {
            console.error('❌ Get all users error:', error);
            return { success: false, error: error.message };
        }
    }


    async function logActivity(action, metadata = {}) {
        try {
            const user = await getCurrentUser();
            if (!user) return;
            const { data, error } = await supabaseClient
                .from('activity_logs')
                .insert({
                    user_id: user.id,
                    action: action,
                    user_agent: navigator.userAgent,
                    device_info: JSON.stringify({
                        platform: navigator.platform,
                        language: navigator.language,
                        screen: screen.width + 'x' + screen.height
                    })
                });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    }

    async function getUserActivityLogs(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('activity_logs')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50);
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function addUserNote(userId, note) {
        try {
            const { data, error } = await supabaseClient
                .from('user_notes')
                .insert({ user_id: userId, note: note });
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function getUserNotes(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('user_notes')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async function adminResetPassword(email) {
        try {
            const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/auth.html'
            });
            if (error) throw error;
            return { success: true, message: 'Email reset đã được gửi!' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // HỆ THỐNG TRACKING NÂNG CAO
    // ========================================

    let currentSessionId = null;
    let sessionStartTime = null;
    let activityBuffer = [];

    // Lấy thông tin thiết bị chi tiết
    function getDeviceInfo() {
        const ua = navigator.userAgent;
        let deviceType = 'desktop';
        let browser = 'Unknown';
        let os = 'Unknown';

        // Detect device type
        if (/mobile/i.test(ua)) deviceType = 'mobile';
        else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

        // Detect browser
        if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
        else if (ua.indexOf('Safari') > -1) browser = 'Safari';
        else if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
        else if (ua.indexOf('Edge') > -1) browser = 'Edge';

        // Detect OS
        if (ua.indexOf('Win') > -1) os = 'Windows';
        else if (ua.indexOf('Mac') > -1) os = 'MacOS';
        else if (ua.indexOf('Linux') > -1) os = 'Linux';
        else if (ua.indexOf('Android') > -1) os = 'Android';
        else if (ua.indexOf('iOS') > -1) os = 'iOS';

        return {
            deviceType,
            browser,
            os,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            userAgent: ua,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            connection: navigator.connection ? navigator.connection.effectiveType : 'unknown'
        };
    }

    // Lấy IP address (sử dụng API public)
    async function getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            // CSP blocked or network error - silently return unknown
            console.log('⚠️ Cannot get IP, using unknown');
            return 'unknown';
        }
    }

    // Tạo device ID duy nhất
    function getDeviceId() {
        let deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
            deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('device_id', deviceId);
        }
        return deviceId;
    }

    // Bắt đầu session tracking
    async function startSession() {
        try {
            const user = await getCurrentUser();
            if (!user) return null;

            // Nếu đã có session rồi thì không tạo mới
            if (currentSessionId) {
                console.log('⚠️ Session already exists:', currentSessionId);
                return currentSessionId;
            }

            const deviceInfo = getDeviceInfo();
            const deviceId = getDeviceId();
            const ipAddress = await getIPAddress();

            console.log('🚀 Starting new session...', {
                user: user.email,
                deviceId,
                deviceType: deviceInfo.deviceType,
                ip: ipAddress
            });

            // Tạo session mới
            const { data, error } = await supabaseClient
                .from('user_sessions')
                .insert({
                    user_id: user.id,
                    device_type: deviceInfo.deviceType,
                    browser: deviceInfo.browser,
                    os: deviceInfo.os,
                    screen_resolution: deviceInfo.screenResolution,
                    ip_address: ipAddress,
                    is_active: true
                })
                .select()
                .single();

            if (error) throw error;

            currentSessionId = data.id;
            sessionStartTime = Date.now();

            // Cập nhật device tracking với IP address
            const { error: deviceError } = await supabaseClient
                .from('device_tracking')
                .upsert({
                    user_id: user.id,
                    device_id: deviceId,
                    device_name: `${deviceInfo.os} - ${deviceInfo.browser}`,
                    device_type: deviceInfo.deviceType,
                    browser: deviceInfo.browser,
                    os: deviceInfo.os,
                    screen_resolution: deviceInfo.screenResolution,
                    ip_address: ipAddress,
                    last_seen: new Date().toISOString(),
                    is_online: true
                }, {
                    onConflict: 'user_id,device_id'
                });

            if (deviceError) {
                console.error('❌ Device tracking error:', deviceError);
            }

            console.log('✅ Session started:', currentSessionId, 'Device:', deviceId);
            return currentSessionId;
        } catch (error) {
            console.error('❌ Start session error:', error);
            return null;
        }
    }

    // Kết thúc session
    async function endSession() {
        if (!currentSessionId || !sessionStartTime) return;

        try {
            const duration = Math.floor((Date.now() - sessionStartTime) / 1000);

            await supabaseClient
                .from('user_sessions')
                .update({
                    session_end: new Date().toISOString(),
                    duration_seconds: duration,
                    is_active: false
                })
                .eq('id', currentSessionId);

            // Flush activity buffer
            if (activityBuffer.length > 0) {
                await supabaseClient
                    .from('activity_stats')
                    .insert(activityBuffer);
                activityBuffer = [];
            }

            console.log('✅ Session ended:', currentSessionId, 'Duration:', duration, 's');
            currentSessionId = null;
            sessionStartTime = null;
        } catch (error) {
            console.error('❌ End session error:', error);
        }
    }

    // Cập nhật heartbeat (user vẫn online)
    async function updateHeartbeat() {
        try {
            const user = await getCurrentUser();
            if (!user) return;

            const deviceId = getDeviceId();
            const ipAddress = await getIPAddress();

            const { error } = await supabaseClient
                .from('device_tracking')
                .update({
                    last_seen: new Date().toISOString(),
                    is_online: true,
                    ip_address: ipAddress
                })
                .eq('user_id', user.id)
                .eq('device_id', deviceId);

            if (error) {
                console.error('❌ Heartbeat update error:', error);
            }
        } catch (error) {
            console.error('❌ Heartbeat error:', error);
        }
    }

    // Đánh dấu thiết bị offline
    async function markDeviceOffline() {
        try {
            const user = await getCurrentUser();
            if (!user) return;

            const deviceId = getDeviceId();

            await supabaseClient
                .from('device_tracking')
                .update({
                    is_online: false,
                    last_seen: new Date().toISOString()
                })
                .eq('user_id', user.id)
                .eq('device_id', deviceId);

            console.log('🔴 Device marked offline');
        } catch (error) {
            console.error('❌ Mark offline error:', error);
        }
    }

    // Track hoạt động chi tiết
    async function trackActivity(activityType, activityData = {}, stats = {}) {
        try {
            const user = await getCurrentUser();
            if (!user || !currentSessionId) return;

            const activity = {
                user_id: user.id,
                session_id: currentSessionId,
                activity_type: activityType,
                activity_data: activityData,
                stars_earned: stats.stars || 0,
                coins_earned: stats.coins || 0,
                time_spent_seconds: stats.timeSpent || 0,
                created_at: new Date().toISOString()
            };

            // Buffer activities để giảm số lần gọi DB
            activityBuffer.push(activity);

            // Flush buffer khi đủ 10 activities hoặc mỗi 30s
            if (activityBuffer.length >= 10) {
                const toInsert = [...activityBuffer];
                activityBuffer = [];
                await supabaseClient
                    .from('activity_stats')
                    .insert(toInsert);
            }

            return { success: true };
        } catch (error) {
            console.error('❌ Track activity error:', error);
            return { success: false, error: error.message };
        }
    }

    // Lấy thống kê tổng quan cho admin
    async function getAdminDashboardStats() {
        try {
            // Lấy tất cả users với thông tin từ auth.users
            const { data: authUsers, error: authError } = await supabaseClient.auth.admin.listUsers();
            if (authError) throw authError;

            // Lấy progress của users
            const { data: progressData } = await supabaseClient
                .from('user_progress')
                .select('*');

            // Lấy devices đang online
            const { data: onlineDevices } = await supabaseClient
                .from('device_tracking')
                .select('*')
                .eq('is_online', true)
                .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

            // Lấy sessions hôm nay
            const today = new Date().toISOString().split('T')[0];
            const { data: todaySessions } = await supabaseClient
                .from('user_sessions')
                .select('*')
                .gte('session_start', today);

            // Tính toán stats
            const totalUsers = authUsers.users.length;
            const activeToday = new Set(todaySessions?.map(s => s.user_id) || []).size;
            const onlineNow = new Set(onlineDevices?.map(d => d.user_id) || []).size;
            const totalStars = progressData?.reduce((sum, p) => sum + (p.total_stars || 0), 0) || 0;
            const totalCoins = progressData?.reduce((sum, p) => sum + (p.coins || 0), 0) || 0;

            return {
                success: true,
                data: {
                    totalUsers,
                    activeToday,
                    onlineNow,
                    totalStars,
                    totalCoins,
                    totalSessions: todaySessions?.length || 0,
                    onlineDevices: onlineDevices || []
                }
            };
        } catch (error) {
            console.error('❌ Get dashboard stats error:', error);
            return { success: false, error: error.message };
        }
    }

    // Lấy thống kê theo ngày
    async function getDailyStats(startDate, endDate) {
        try {
            const { data, error } = await supabaseClient
                .from('daily_stats')
                .select('*')
                .gte('stat_date', startDate)
                .lte('stat_date', endDate)
                .order('stat_date', { ascending: true });

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Lấy thống kê thiết bị của user
    async function getUserDevices(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('device_tracking')
                .select('*')
                .eq('user_id', userId)
                .order('last_seen', { ascending: false });

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Lấy sessions của user
    async function getUserSessions(userId, limit = 20) {
        try {
            const { data, error } = await supabaseClient
                .from('user_sessions')
                .select('*')
                .eq('user_id', userId)
                .order('session_start', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Lấy activity stats của user
    async function getUserActivityStats(userId, limit = 50) {
        try {
            const { data, error } = await supabaseClient
                .from('activity_stats')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Tính toán daily stats cho ngày hôm nay
    async function calculateTodayStats() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { error } = await supabaseClient.rpc('calculate_daily_stats', {
                target_date: today
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Auto-start session khi user đăng nhập
    let heartbeatInterval = null;
    let activityFlushInterval = null;

    supabaseClient?.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
            console.log('🟢 User signed in, starting session...');
            await startSession();

            // Clear old intervals nếu có
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            if (activityFlushInterval) clearInterval(activityFlushInterval);

            // Heartbeat mỗi 30 giây (thay vì 2 phút) để realtime hơn
            heartbeatInterval = setInterval(async () => {
                await updateHeartbeat();
                console.log('💓 Heartbeat sent');
            }, 30 * 1000);

            // Gửi heartbeat ngay lập tức
            setTimeout(() => updateHeartbeat(), 2000);

            // Flush activity buffer mỗi 30s
            activityFlushInterval = setInterval(async () => {
                if (activityBuffer.length > 0) {
                    const toInsert = [...activityBuffer];
                    activityBuffer = [];
                    try {
                        await supabaseClient.from('activity_stats').insert(toInsert);
                        console.log('📊 Flushed', toInsert.length, 'activities');
                    } catch (error) {
                        console.error('Flush error:', error);
                    }
                }
            }, 30 * 1000);

        } else if (event === 'SIGNED_OUT') {
            console.log('🔴 User signed out, ending session...');
            if (heartbeatInterval) clearInterval(heartbeatInterval);
            if (activityFlushInterval) clearInterval(activityFlushInterval);
            await endSession();
            await markDeviceOffline();
        }
    });

    // End session khi đóng tab
    window.addEventListener('beforeunload', async () => {
        if (currentSessionId) {
            // Đánh dấu offline ngay lập tức
            await markDeviceOffline();

            // Sử dụng sendBeacon để đảm bảo request được gửi
            const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
            const data = {
                session_end: new Date().toISOString(),
                duration_seconds: duration,
                is_active: false
            };

            // Try sendBeacon first
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            navigator.sendBeacon(
                `${SUPABASE_URL}/rest/v1/user_sessions?id=eq.${currentSessionId}`,
                blob
            );
        }
    });

    // Đánh dấu offline khi tab bị ẩn
    document.addEventListener('visibilitychange', async () => {
        if (document.hidden) {
            console.log('👁️ Tab hidden, marking offline...');
            await markDeviceOffline();
        } else {
            console.log('👁️ Tab visible, marking online...');
            await updateHeartbeat();
        }
    });

    window.SupabaseConfig = {
        init: initSupabase,
        signUp: signUp,
        signIn: signIn,
        signOut: signOut,
        getCurrentUser: getCurrentUser,
        saveUserProgress: saveUserProgress,
        getUserProgress: getUserProgress,
        getAllUsers: getAllUsers,
        logActivity: logActivity,
        getUserActivityLogs: getUserActivityLogs,
        addUserNote: addUserNote,
        getUserNotes: getUserNotes,
        adminResetPassword: adminResetPassword,
        // Tracking functions
        startSession: startSession,
        endSession: endSession,
        updateHeartbeat: updateHeartbeat,
        markDeviceOffline: markDeviceOffline,
        trackActivity: trackActivity,
        getAdminDashboardStats: getAdminDashboardStats,
        getDailyStats: getDailyStats,
        getUserDevices: getUserDevices,
        getUserSessions: getUserSessions,
        getUserActivityStats: getUserActivityStats,
        calculateTodayStats: calculateTodayStats,
        getIPAddress: getIPAddress,
        getDeviceInfo: getDeviceInfo,
        getDeviceId: getDeviceId,
        client: () => supabaseClient
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(initSupabase, 100);
        });
    } else {
        setTimeout(initSupabase, 100);
    }

    console.log('✅ Supabase config loaded');

})();
>>>>>>> 24c03eda35bab541d2f3fd43d47c2f7b5555ba3f
