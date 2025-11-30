-- ========================================
-- SUPABASE ADMIN FIX - SIMPLE VERSION
-- Phiên bản đơn giản, chắc chắn chạy được
-- ========================================

-- Bước 1: Thêm columns vào profiles (nếu chưa có)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS username TEXT;

-- Bước 2: Tạo function lấy users đơn giản
CREATE OR REPLACE FUNCTION get_all_users_simple()
RETURNS TABLE (
    id UUID,
    email TEXT,
    username TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        COALESCE(p.email, 'N/A') as email,
        COALESCE(p.full_name, p.username, up.player_name, 'User') as username,
        p.created_at
    FROM public.profiles p
    LEFT JOIN public.user_progress up ON up.user_id = p.id
    ORDER BY p.created_at DESC;
END;
$$;

-- Bước 3: Grant permissions
GRANT EXECUTE ON FUNCTION get_all_users_simple() TO anon;
GRANT EXECUTE ON FUNCTION get_all_users_simple() TO authenticated;

-- Bước 4: Tạo view đơn giản
CREATE OR REPLACE VIEW admin_users_simple AS
SELECT 
    p.id,
    COALESCE(p.email, 'N/A') as email,
    COALESCE(p.full_name, p.username, up.player_name, 'User') as username,
    COALESCE(up.total_stars, 0) as total_stars,
    COALESCE(up.coins, 0) as coins,
    COALESCE(up.current_level, 1) as current_level,
    p.created_at
FROM public.profiles p
LEFT JOIN public.user_progress up ON up.user_id = p.id
ORDER BY p.created_at DESC;

-- Bước 5: Grant select on view
GRANT SELECT ON admin_users_simple TO anon;
GRANT SELECT ON admin_users_simple TO authenticated;

-- ========================================
-- TEST
-- ========================================
-- Chạy các query này để test:

-- Test 1: Xem profiles
-- SELECT * FROM profiles LIMIT 5;

-- Test 2: Xem user_progress
-- SELECT * FROM user_progress LIMIT 5;

-- Test 3: Xem view
-- SELECT * FROM admin_users_simple;

-- Test 4: Xem function
-- SELECT * FROM get_all_users_simple();

-- ========================================
-- HOÀN TẤT!
-- ========================================
