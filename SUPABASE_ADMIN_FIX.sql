-- ========================================
-- SUPABASE ADMIN FIX
-- Sửa lỗi admin không lấy được user data
-- ========================================

-- 1. Tạo function để lấy tất cả users với email từ auth.users
CREATE OR REPLACE FUNCTION get_all_users_with_email()
RETURNS TABLE (
    id UUID,
    email TEXT,
    username TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        au.id,
        au.email,
        COALESCE(p.full_name, up.player_name, 'User') as username,
        au.created_at
    FROM auth.users au
    LEFT JOIN public.profiles p ON p.id = au.id
    LEFT JOIN public.user_progress up ON up.user_id = au.id
    ORDER BY au.created_at DESC;
END;
$$;

-- 2. Grant execute permission
GRANT EXECUTE ON FUNCTION get_all_users_with_email() TO anon;
GRANT EXECUTE ON FUNCTION get_all_users_with_email() TO authenticated;

-- 3. Đảm bảo profiles table có đủ columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS username TEXT;

-- 4. Tạo trigger để tự động tạo profile khi user đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, username, full_name, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.created_at
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        username = EXCLUDED.username,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Tạo trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 6. Tạo function để sync users (chạy manual khi cần)
CREATE OR REPLACE FUNCTION sync_users_to_profiles()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    synced_count INTEGER := 0;
BEGIN
    -- Sync từ auth.users sang profiles
    INSERT INTO public.profiles (id, email, username, full_name, created_at)
    SELECT 
        au.id,
        au.email,
        COALESCE(au.raw_user_meta_data->>'username', au.email) as username,
        COALESCE(au.raw_user_meta_data->>'full_name', 'User') as full_name,
        au.created_at
    FROM auth.users au
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        username = COALESCE(EXCLUDED.username, public.profiles.username),
        updated_at = NOW();
    
    GET DIAGNOSTICS synced_count = ROW_COUNT;
    RETURN synced_count;
END;
$$;

-- Grant execute
GRANT EXECUTE ON FUNCTION sync_users_to_profiles() TO anon;
GRANT EXECUTE ON FUNCTION sync_users_to_profiles() TO authenticated;

-- 7. Tạo view đơn giản hơn (không dùng auth.users trực tiếp)
CREATE OR REPLACE VIEW admin_users_view 
SECURITY DEFINER
AS
SELECT 
    p.id,
    p.email,
    COALESCE(p.full_name, up.player_name, 'User') as username,
    COALESCE(up.total_stars, 0) as total_stars,
    COALESCE(up.coins, 0) as coins,
    COALESCE(up.current_level, 1) as current_level,
    COALESCE(up.streak, 0) as streak,
    p.created_at,
    p.updated_at as last_sign_in_at,
    (
        SELECT COUNT(*) 
        FROM device_tracking dt 
        WHERE dt.user_id = p.id 
            AND dt.is_online = true
            AND dt.last_seen > NOW() - INTERVAL '2 minutes'
    ) as online_devices_count,
    (
        SELECT MAX(last_seen) 
        FROM device_tracking dt 
        WHERE dt.user_id = p.id
    ) as last_seen
FROM public.profiles p
LEFT JOIN public.user_progress up ON up.user_id = p.id
ORDER BY p.created_at DESC;

-- 8. Grant select on view
GRANT SELECT ON admin_users_view TO anon;
GRANT SELECT ON admin_users_view TO authenticated;

-- 9. Chạy sync ngay (comment out nếu gặp lỗi)
-- SELECT sync_users_to_profiles();

-- ========================================
-- HOÀN TẤT!
-- ========================================
-- Bây giờ admin có thể:
-- ✅ Lấy danh sách users với email
-- ✅ Xem progress (stars, coins, level)
-- ✅ Xem trạng thái online
-- ✅ Profiles tự động sync khi user đăng ký
-- ========================================
