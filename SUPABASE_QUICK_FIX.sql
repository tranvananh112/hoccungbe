-- ========================================
-- SUPABASE QUICK FIX - Đơn giản nhất
-- Chạy từng câu lệnh một, kiểm tra kết quả
-- ========================================

-- 1. Đảm bảo profiles có đủ columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS username TEXT;

-- 2. Sync data từ auth.users vào profiles
INSERT INTO public.profiles (id, email, username, full_name, created_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'username', email) as username,
    COALESCE(raw_user_meta_data->>'full_name', 'User') as full_name,
    created_at
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    updated_at = NOW();

-- 3. Kiểm tra kết quả
SELECT 
    p.id,
    p.email,
    p.username,
    p.full_name,
    up.total_stars,
    up.coins,
    up.current_level
FROM profiles p
LEFT JOIN user_progress up ON up.user_id = p.id;

-- ========================================
-- Nếu thấy data ở bước 3 → SUCCESS!
-- Nếu không thấy data → Check auth.users:
-- SELECT * FROM auth.users;
-- ========================================
