-- ========================================
-- FIX MISSING COLUMNS
-- Thêm các columns bị thiếu trong database
-- ========================================

-- 1. Thêm ip_address vào device_tracking (nếu chưa có)
ALTER TABLE public.device_tracking 
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS device_name TEXT;

-- 2. Thêm streak vào user_progress (nếu chưa có)
ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;

-- 3. Kiểm tra kết quả
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'device_tracking' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- HOÀN TẤT!
-- Sau khi chạy SQL này:
-- ✅ device_tracking có ip_address
-- ✅ user_progress có streak
-- ✅ Không còn lỗi 400
-- ========================================
