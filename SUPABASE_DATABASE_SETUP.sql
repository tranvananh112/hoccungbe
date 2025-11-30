-- ========================================
-- SUPABASE DATABASE SETUP
-- Chạy các câu lệnh này trong Supabase SQL Editor
-- ========================================

-- 1. Tạo bảng user_progress
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    total_stars INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    words_learned TEXT[] DEFAULT '{}',
    owned_characters TEXT[] DEFAULT '{}',
    player_name TEXT DEFAULT 'Bé',
    player_avatar TEXT DEFAULT '👦',
    current_level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tạo index cho tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 4. Tạo policy cho user chỉ được xem/sửa data của mình
CREATE POLICY "Users can view own progress"
    ON public.user_progress
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
    ON public.user_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON public.user_progress
    FOR UPDATE
    USING (auth.uid() = user_id);

-- 5. Tạo bảng profiles (nếu chưa có)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role TEXT DEFAULT 'parent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enable RLS cho profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- 7. Tạo bảng activity_logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    user_agent TEXT,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable RLS cho activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
    ON public.activity_logs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity"
    ON public.activity_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 9. Tạo bảng user_notes (cho admin)
CREATE TABLE IF NOT EXISTS public.user_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Enable RLS cho user_notes
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notes about them"
    ON public.user_notes
    FOR SELECT
    USING (auth.uid() = user_id);

-- 11. Tạo function để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. Tạo trigger cho user_progress
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 13. Tạo trigger cho profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- HỆ THỐNG THỐNG KÊ NÂNG CAO
-- ========================================

-- 14. Bảng theo dõi phiên truy cập (sessions)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER DEFAULT 0,
    device_type TEXT, -- mobile, tablet, desktop
    browser TEXT,
    os TEXT,
    screen_resolution TEXT,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_date ON public.user_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active);

-- 15. Bảng thống kê hoạt động chi tiết
CREATE TABLE IF NOT EXISTS public.activity_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.user_sessions(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- game_start, game_complete, word_learned, level_up, etc.
    activity_data JSONB, -- Chi tiết hoạt động
    stars_earned INTEGER DEFAULT 0,
    coins_earned INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_stats_user_id ON public.activity_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_stats_session_id ON public.activity_stats(session_id);
CREATE INDEX IF NOT EXISTS idx_activity_stats_type ON public.activity_stats(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_stats_date ON public.activity_stats(created_at);

-- 16. Bảng thống kê theo ngày
CREATE TABLE IF NOT EXISTS public.daily_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stat_date DATE NOT NULL,
    total_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0,
    total_games_played INTEGER DEFAULT 0,
    total_words_learned INTEGER DEFAULT 0,
    total_stars_earned INTEGER DEFAULT 0,
    device_breakdown JSONB, -- {mobile: 10, desktop: 5, tablet: 2}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(stat_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON public.daily_stats(stat_date);

-- 17. Bảng thống kê thiết bị realtime
CREATE TABLE IF NOT EXISTS public.device_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL, -- Unique device identifier
    device_type TEXT,
    browser TEXT,
    os TEXT,
    screen_resolution TEXT,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    visit_count INTEGER DEFAULT 1,
    is_online BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_device_tracking_user_id ON public.device_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tracking_online ON public.device_tracking(is_online);
CREATE INDEX IF NOT EXISTS idx_device_tracking_last_seen ON public.device_tracking(last_seen);

-- 18. Enable RLS cho các bảng mới
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tracking ENABLE ROW LEVEL SECURITY;

-- Policies cho user_sessions
CREATE POLICY "Users can view own sessions"
    ON public.user_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
    ON public.user_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
    ON public.user_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- Policies cho activity_stats
CREATE POLICY "Users can view own activity stats"
    ON public.activity_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity stats"
    ON public.activity_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policies cho daily_stats (public read)
CREATE POLICY "Anyone can view daily stats"
    ON public.daily_stats FOR SELECT
    USING (true);

-- Policies cho device_tracking
CREATE POLICY "Users can view own devices"
    ON public.device_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own devices"
    ON public.device_tracking FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own devices"
    ON public.device_tracking FOR UPDATE
    USING (auth.uid() = user_id);

-- 19. Function tự động cập nhật device online status
CREATE OR REPLACE FUNCTION update_device_online_status()
RETURNS void AS $$
BEGIN
    -- Đánh dấu offline các thiết bị không hoạt động > 5 phút
    UPDATE public.device_tracking
    SET is_online = false
    WHERE is_online = true
    AND last_seen < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- 20. Function tính toán daily stats
CREATE OR REPLACE FUNCTION calculate_daily_stats(target_date DATE)
RETURNS void AS $$
DECLARE
    v_total_users INTEGER;
    v_new_users INTEGER;
    v_active_users INTEGER;
    v_total_sessions INTEGER;
    v_avg_duration INTEGER;
    v_total_games INTEGER;
    v_total_words INTEGER;
    v_total_stars INTEGER;
    v_device_breakdown JSONB;
BEGIN
    -- Tổng số users
    SELECT COUNT(*) INTO v_total_users
    FROM auth.users
    WHERE DATE(created_at) <= target_date;

    -- Users mới trong ngày
    SELECT COUNT(*) INTO v_new_users
    FROM auth.users
    WHERE DATE(created_at) = target_date;

    -- Users hoạt động trong ngày
    SELECT COUNT(DISTINCT user_id) INTO v_active_users
    FROM public.user_sessions
    WHERE DATE(session_start) = target_date;

    -- Tổng số sessions
    SELECT COUNT(*) INTO v_total_sessions
    FROM public.user_sessions
    WHERE DATE(session_start) = target_date;

    -- Thời gian trung bình
    SELECT COALESCE(AVG(duration_seconds), 0)::INTEGER INTO v_avg_duration
    FROM public.user_sessions
    WHERE DATE(session_start) = target_date
    AND duration_seconds > 0;

    -- Tổng số games
    SELECT COUNT(*) INTO v_total_games
    FROM public.activity_stats
    WHERE DATE(created_at) = target_date
    AND activity_type = 'game_complete';

    -- Tổng số từ học
    SELECT COUNT(*) INTO v_total_words
    FROM public.activity_stats
    WHERE DATE(created_at) = target_date
    AND activity_type = 'word_learned';

    -- Tổng số sao
    SELECT COALESCE(SUM(stars_earned), 0)::INTEGER INTO v_total_stars
    FROM public.activity_stats
    WHERE DATE(created_at) = target_date;

    -- Phân loại thiết bị
    SELECT jsonb_build_object(
        'mobile', COUNT(*) FILTER (WHERE device_type = 'mobile'),
        'desktop', COUNT(*) FILTER (WHERE device_type = 'desktop'),
        'tablet', COUNT(*) FILTER (WHERE device_type = 'tablet')
    ) INTO v_device_breakdown
    FROM public.user_sessions
    WHERE DATE(session_start) = target_date;

    -- Insert hoặc update
    INSERT INTO public.daily_stats (
        stat_date, total_users, new_users, active_users,
        total_sessions, avg_session_duration, total_games_played,
        total_words_learned, total_stars_earned, device_breakdown
    ) VALUES (
        target_date, v_total_users, v_new_users, v_active_users,
        v_total_sessions, v_avg_duration, v_total_games,
        v_total_words, v_total_stars, v_device_breakdown
    )
    ON CONFLICT (stat_date) DO UPDATE SET
        total_users = EXCLUDED.total_users,
        new_users = EXCLUDED.new_users,
        active_users = EXCLUDED.active_users,
        total_sessions = EXCLUDED.total_sessions,
        avg_session_duration = EXCLUDED.avg_session_duration,
        total_games_played = EXCLUDED.total_games_played,
        total_words_learned = EXCLUDED.total_words_learned,
        total_stars_earned = EXCLUDED.total_stars_earned,
        device_breakdown = EXCLUDED.device_breakdown;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- KIỂM TRA
-- ========================================

-- Xem tất cả bảng
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Xem cấu trúc bảng user_progress
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_progress';

-- Test insert (thay YOUR_USER_ID bằng UUID thật)
-- INSERT INTO public.user_progress (user_id, total_stars, coins)
-- VALUES ('YOUR_USER_ID', 10, 5);
