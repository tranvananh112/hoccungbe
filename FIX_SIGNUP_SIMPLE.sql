-- ========================================
-- KHẮC PHỤC LỖI ĐĂNG KÝ - PHƯƠNG PHÁP ĐỘC LẬP
-- Chạy từng bước một và kiểm tra kết quả
-- ========================================

-- ============================================================
-- BƯỚC 1: XÓA HOÀN TOÀN TRIGGER CŨ (QUAN TRỌNG!)
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Kiểm tra đã xóa chưa
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
-- Kết quả phải RỖNG (0 rows)

-- ============================================================
-- BƯỚC 2: TẮT RLS TẠM THỜI ĐỂ TEST
-- ============================================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;

-- Kiểm tra RLS đã tắt
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_progress');
-- Kết quả: rowsecurity = false

-- ============================================================
-- BƯỚC 3: ĐẢM BẢO BẢNG PROFILES CÓ CẤU TRÚC ĐÚNG
-- ============================================================
-- Xóa bảng cũ nếu có vấn đề
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- Tạo lại bảng profiles
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

-- Thêm index
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================================
-- BƯỚC 4: ĐẢM BẢO BẢNG USER_PROGRESS CÓ CẤU TRÚC ĐÚNG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    total_stars INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    words_learned TEXT[] DEFAULT '{}',
    owned_characters TEXT[] DEFAULT '{}',
    player_name TEXT DEFAULT 'Bé',
    player_avatar TEXT DEFAULT '🐝',
    current_level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thêm index
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);

-- ============================================================
-- BƯỚC 5: TEST ĐĂNG KÝ KHÔNG CÓ TRIGGER
-- ============================================================
-- Bây giờ thử đăng ký trong ứng dụng
-- Nếu thành công -> trigger là nguyên nhân
-- Nếu vẫn lỗi -> có vấn đề khác

-- ============================================================
-- BƯỚC 6: TẠO TRIGGER MỚI CỰC KỲ ĐỠN GIẢN (SAU KHI TEST XONG)
-- ============================================================
-- CHỈ CHẠY BƯỚC NÀY SAU KHI ĐĂNG KÝ THÀNH CÔNG Ở BƯỚC 5

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Chỉ tạo profile, không làm gì khác
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        'parent'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Chỉ tạo progress, không làm gì khác
    INSERT INTO public.user_progress (user_id, player_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Bé')
    )
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Nếu lỗi, log nhưng KHÔNG fail
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Tạo trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- BƯỚC 7: BẬT LẠI RLS (SAU KHI MỌI THỨ HOẠT ĐỘNG)
-- ============================================================
-- CHỈ CHẠY SAU KHI ĐĂNG KÝ THÀNH CÔNG

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Xóa policies cũ
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

-- Tạo policies mới ĐƠN GIẢN
-- Profiles
CREATE POLICY "Anyone can view profiles"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- User Progress
CREATE POLICY "Users can view own progress"
    ON public.user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert progress"
    ON public.user_progress FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own progress"
    ON public.user_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================
-- KIỂM TRA CUỐI CÙNG
-- ============================================================

-- 1. Kiểm tra trigger
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;

-- 2. Kiểm tra RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'user_progress');

-- 3. Kiểm tra policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'user_progress')
ORDER BY tablename, policyname;

-- 4. Xem users hiện có
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 5. Xem profiles hiện có
SELECT 
    id,
    email,
    full_name,
    created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;

-- ============================================================
-- GHI CHÚ QUAN TRỌNG
-- ============================================================

/*
THỨ TỰ THỰC HIỆN:

1. Chạy BƯỚC 1-4 (xóa trigger, tắt RLS, đảm bảo bảng OK)
2. Test đăng ký trong ứng dụng
3. Nếu THÀNH CÔNG -> chạy BƯỚC 6 (tạo trigger mới)
4. Test lại đăng ký
5. Nếu THÀNH CÔNG -> chạy BƯỚC 7 (bật RLS)
6. Test lại lần cuối

NẾU VẪN LỖI Ở BƯỚC 2:
- Vấn đề KHÔNG PHẢI trigger
- Kiểm tra:
  * Email confirmation settings (phải TẮT)
  * Supabase project status (có bị pause không?)
  * API keys có đúng không?
  * Network/CORS issues
*/
