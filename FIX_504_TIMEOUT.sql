-- ============================================================
-- FIX LỖI 504 TIMEOUT KHI ĐĂNG KÝ USER MỚI
-- Nguyên nhân: Trigger handle_new_user() chạy quá lâu
-- Giải pháp: Đơn giản hóa trigger, bỏ IP tracking
-- ============================================================

-- BƯỚC 1: XÓA TRIGGER CŨ (GÂY TIMEOUT)
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Kiểm tra đã xóa chưa
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
-- Kết quả phải RỖNG (0 rows)

-- BƯỚC 2: TẠO TRIGGER MỚI - ĐƠN GIẢN, NHANH
-- ============================================================
-- Chỉ tạo profile, KHÔNG gọi API, KHÔNG insert nhiều bảng

CREATE OR REPLACE FUNCTION public.handle_new_user_simple()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Chỉ tạo profile đơn giản
    INSERT INTO public.profiles (id, full_name, email, username, role, created_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'parent'),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Nếu lỗi, log nhưng KHÔNG fail
    RAISE WARNING 'handle_new_user_simple error: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Tạo trigger mới
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_simple();

-- BƯỚC 3: ĐẢM BẢO BẢNG PROFILES CÓ CẤU TRÚC ĐÚNG
-- ============================================================
-- Thêm cột email và username nếu chưa có
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS username TEXT;

-- BƯỚC 4: KIỂM TRA
-- ============================================================
-- Xem trigger mới
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Xem function mới
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user_simple';

-- ============================================================
-- SAU KHI CHẠY SQL NÀY:
-- 1. Test đăng ký user mới tại auth.html
-- 2. Kiểm tra có còn lỗi 504 không
-- 3. Nếu thành công, user_progress sẽ được tạo tự động khi đăng nhập lần đầu
-- ============================================================
