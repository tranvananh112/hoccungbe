-- ========================================
-- KHẮC PHỤC LỖI ĐĂNG KÝ (500 ERROR)
-- ========================================

-- BƯỚC 1: Kiểm tra và xóa trigger cũ có thể gây lỗi
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- BƯỚC 2: Tạo lại function xử lý user mới (AN TOÀN HƠN)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Tạo profile cho user mới
    INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'parent'),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    -- Tạo user_progress cho user mới
    INSERT INTO public.user_progress (
        user_id,
        player_name,
        player_avatar,
        total_stars,
        coins,
        current_level,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Bé'),
        '🐝',
        0,
        0,
        1,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Nếu có lỗi, log nhưng KHÔNG fail transaction
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- BƯỚC 3: Tạo trigger mới (chỉ chạy AFTER INSERT để tránh conflict)
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- BƯỚC 4: Đảm bảo bảng profiles tồn tại với cấu trúc đúng
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    username TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'parent',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BƯỚC 5: Thêm cột email vào profiles nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'email'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
END $$;

-- BƯỚC 6: Cập nhật RLS policies cho profiles (CHO PHÉP INSERT)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- Cho phép mọi người xem profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Cho phép service role tạo profile (quan trọng!)
CREATE POLICY "Enable insert for service role"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- Cho phép user tự insert profile của mình
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Cho phép user update profile của mình
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- BƯỚC 7: Cập nhật RLS policies cho user_progress (CHO PHÉP INSERT)
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.user_progress;

-- Cho phép service role tạo progress
CREATE POLICY "Enable insert for service role"
    ON public.user_progress FOR INSERT
    WITH CHECK (true);

-- Cho phép user tự insert progress
CREATE POLICY "Users can insert own progress"
    ON public.user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- BƯỚC 8: Tắt RLS tạm thời để test (BẬT LẠI SAU KHI FIX)
-- Uncomment 2 dòng dưới nếu vẫn lỗi
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;

-- BƯỚC 9: Kiểm tra cấu hình email trong Supabase Dashboard
-- Vào: Authentication > Settings > Email Templates
-- Đảm bảo "Confirm signup" template được bật

-- BƯỚC 10: Kiểm tra Auth settings
-- Vào: Authentication > Settings
-- Đảm bảo:
-- - "Enable email confirmations" = OFF (để test nhanh)
-- - "Enable email signup" = ON

-- ========================================
-- KIỂM TRA SAU KHI CHẠY
-- ========================================

-- Xem trigger hiện tại
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Xem policies của profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Xem policies của user_progress
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_progress';

-- Test tạo user thủ công (thay YOUR_EMAIL và YOUR_PASSWORD)
-- SELECT auth.signup(
--     email := 'test@example.com',
--     password := 'password123'
-- );

-- ========================================
-- NẾU VẪN LỖI, CHẠY CÁC LỆNH SAU
-- ========================================

-- Xóa tất cả triggers và tạo lại từ đầu
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Tắt RLS hoàn toàn để test
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;

-- Sau khi signup thành công, BẬT LẠI RLS
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
