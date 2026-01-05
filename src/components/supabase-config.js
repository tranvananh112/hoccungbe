/* ========================================
   SUPABASE CONFIGURATION
   ======================================== */

(function () {
    'use strict';

    console.log('🔗 Loading Supabase config...');

    // Supabase configuration
    const SUPABASE_URL = 'https://apyohrljwovonoecuwml.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFweW9ocmxqd292b25vZWN1d21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzkxMDIsImV4cCI6MjA3OTcxNTEwMn0.Ol0YDm1U2weoaDQWJMCHopFmYRztmhGcYOrp8tg98C4';

    // Initialize Supabase client
    let supabaseClient = null;

    function initSupabase() {
        try {
            if (typeof supabase === 'undefined') {
                console.error('❌ Supabase library not loaded! Make sure to include the CDN script.');
                return null;
            }

            if (supabaseClient) {
                console.log('ℹ️ Supabase already initialized');
                return supabaseClient;
            }

            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase initialized successfully');
            return supabaseClient;
        } catch (error) {
            console.error('❌ Supabase init error:', error);
            return null;
        }
    }

    // Helper: Retry với exponential backoff
    async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                const isRetryable = error.name === 'AuthRetryableFetchError' ||
                    error.message?.includes('504') ||
                    error.message?.includes('timeout') ||
                    error.message?.includes('network');

                const isLastRetry = i === maxRetries - 1;

                if (!isRetryable || isLastRetry) {
                    throw error;
                }

                const delay = baseDelay * Math.pow(2, i);
                console.log(`⏳ Retry ${i + 1}/${maxRetries} sau ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // Auth functions
    async function signUp(email, password, userData) {
        try {
            const result = await retryWithBackoff(async () => {
                const { data, error } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: userData
                    }
                });

                if (error) throw error;
                return { success: true, data: data };
            });

            return result;
        } catch (error) {
            console.error('Sign up error:', error);

            // Xử lý các loại lỗi cụ thể
            let errorMessage = error.message || 'Unknown error';

            if (error.name === 'AuthRetryableFetchError' || errorMessage.includes('504')) {
                errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra internet và thử lại.';
            } else if (errorMessage.includes('timeout')) {
                errorMessage = 'Kết nối quá chậm. Vui lòng thử lại.';
            } else if (errorMessage.includes('network')) {
                errorMessage = 'Lỗi mạng. Vui lòng kiểm tra kết nối internet.';
            } else if (errorMessage === '{}' || errorMessage === '') {
                errorMessage = 'Lỗi không xác định. Vui lòng thử lại sau.';
            }

            return { success: false, error: errorMessage };
        }
    }

    async function signIn(email, password) {
        try {
            const result = await retryWithBackoff(async () => {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) throw error;
                return { success: true, data: data };
            });

            return result;
        } catch (error) {
            console.error('Sign in error:', error);

            // Xử lý các loại lỗi cụ thể
            let errorMessage = error.message || 'Unknown error';

            if (error.name === 'AuthRetryableFetchError' || errorMessage.includes('504')) {
                errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra internet và thử lại.';
            } else if (errorMessage.includes('Invalid login credentials')) {
                errorMessage = 'Email hoặc mật khẩu không đúng.';
            } else if (errorMessage.includes('timeout')) {
                errorMessage = 'Kết nối quá chậm. Vui lòng thử lại.';
            } else if (errorMessage.includes('network')) {
                errorMessage = 'Lỗi mạng. Vui lòng kiểm tra kết nối internet.';
            } else if (errorMessage === '{}' || errorMessage === '') {
                errorMessage = 'Lỗi không xác định. Vui lòng thử lại sau.';
            }

            return { success: false, error: errorMessage };
        }
    }

    async function signOut() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    async function getCurrentUser() {
        try {
            if (!supabaseClient) {
                console.warn('Supabase client not initialized');
                return null;
            }

            // Thử lấy session trước
            const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

            // Nếu không có session, return null (không phải lỗi)
            if (!session) {
                console.log('ℹ️ No active session');
                return null;
            }

            // Nếu có session, lấy user
            const { data: { user }, error } = await supabaseClient.auth.getUser();
            if (error) {
                // Nếu lỗi là AuthSessionMissingError, không log error
                if (error.name === 'AuthSessionMissingError') {
                    console.log('ℹ️ No auth session');
                    return null;
                }
                throw error;
            }
            return user;
        } catch (error) {
            // Chỉ log error nếu không phải AuthSessionMissingError
            if (error.name !== 'AuthSessionMissingError') {
                console.error('Get user error:', error);
            }
            return null;
        }
    }

    // Database functions
    async function saveUserProgress(userId, progressData) {
        try {
            const { data, error } = await supabaseClient
                .from('user_progress')
                .upsert({
                    user_id: userId,
                    ...progressData,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('Save progress error:', error);
            return { success: false, error: error.message };
        }
    }

    async function getUserProgress(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('Get progress error:', error);
            return { success: false, error: error.message };
        }
    }

    // Admin functions
    async function getAllUsers() {
        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('Get users error:', error);
            return { success: false, error: error.message };
        }
    }

    // Activity logging
    async function logActivity(action) {
        try {
            const user = await getCurrentUser();
            if (!user) return;

            const { error } = await supabaseClient
                .from('activity_logs')
                .insert({
                    user_id: user.id,
                    action: action,
                    user_agent: navigator.userAgent,
                    device_info: JSON.stringify({
                        language: navigator.language,
                        screen: screen.width + 'x' + screen.height
                    })
                });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Log activity error:', error);
            return { success: false };
        }
    }

    // Admin: Get activity logs
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
            console.error('Get activity logs error:', error);
            return { success: false, error: error.message };
        }
    }

    // Admin: Add note
    async function addUserNote(userId, note) {
        try {
            const { data, error } = await supabaseClient
                .from('user_notes')
                .insert({
                    user_id: userId,
                    note: note
                });

            if (error) throw error;
            return { success: true, data: data };
        } catch (error) {
            console.error('Add note error:', error);
            return { success: false, error: error.message };
        }
    }

    // Admin: Get notes
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
            console.error('Get notes error:', error);
            return { success: false, error: error.message };
        }
    }

    // Admin: Reset user password
    async function adminResetPassword(email) {
        try {
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/auth.html'
            });

            if (error) throw error;
            return { success: true, message: 'Email reset đã được gửi!' };
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, error: error.message };
        }
    }

    // Export
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
        client: () => supabaseClient
    };

    // Auto-init when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(initSupabase, 100);
        });
    } else {
        setTimeout(initSupabase, 100);
    }

    console.log('✅ Supabase config loaded');

})();
