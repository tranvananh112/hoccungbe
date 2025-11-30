-- ========================================
-- SUPABASE IP TRACKING UPDATE
-- Thêm IP tracking và device name vào hệ thống
-- Chạy script này trong Supabase SQL Editor
-- ========================================

-- 1. Thêm cột ip_address và device_name vào bảng device_tracking
ALTER TABLE public.device_tracking 
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS device_name TEXT;

-- 2. Thêm cột ip_address vào bảng user_sessions
ALTER TABLE public.user_sessions 
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- 3. Tạo index cho ip_address để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_device_tracking_ip ON public.device_tracking(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_sessions_ip ON public.user_sessions(ip_address);

-- 4. Cập nhật device_name cho các record hiện có (nếu có)
UPDATE public.device_tracking 
SET device_name = COALESCE(os, 'Unknown') || ' - ' || COALESCE(browser, 'Unknown')
WHERE device_name IS NULL;

-- 5. Tạo view để xem thống kê IP
CREATE OR REPLACE VIEW public.ip_statistics AS
SELECT 
    ip_address,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_devices,
    MAX(last_seen) as last_activity,
    ARRAY_AGG(DISTINCT device_type) as device_types,
    ARRAY_AGG(DISTINCT browser) as browsers
FROM public.device_tracking
WHERE ip_address IS NOT NULL
GROUP BY ip_address
ORDER BY unique_users DESC, last_activity DESC;

-- 6. Tạo function để lấy thống kê IP theo user
CREATE OR REPLACE FUNCTION get_user_ip_history(p_user_id UUID)
RETURNS TABLE (
    ip_address TEXT,
    device_count INTEGER,
    first_seen TIMESTAMP WITH TIME ZONE,
    last_seen TIMESTAMP WITH TIME ZONE,
    is_currently_online BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dt.ip_address,
        COUNT(*)::INTEGER as device_count,
        MIN(dt.first_seen) as first_seen,
        MAX(dt.last_seen) as last_seen,
        BOOL_OR(dt.is_online) as is_currently_online
    FROM public.device_tracking dt
    WHERE dt.user_id = p_user_id 
        AND dt.ip_address IS NOT NULL
    GROUP BY dt.ip_address
    ORDER BY MAX(dt.last_seen) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Tạo function để phát hiện IP đáng ngờ (nhiều user cùng IP)
CREATE OR REPLACE FUNCTION detect_suspicious_ips()
RETURNS TABLE (
    ip_address TEXT,
    user_count INTEGER,
    user_ids UUID[],
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dt.ip_address,
        COUNT(DISTINCT dt.user_id)::INTEGER as user_count,
        ARRAY_AGG(DISTINCT dt.user_id) as user_ids,
        MAX(dt.last_seen) as last_activity
    FROM public.device_tracking dt
    WHERE dt.ip_address IS NOT NULL
    GROUP BY dt.ip_address
    HAVING COUNT(DISTINCT dt.user_id) > 3
    ORDER BY user_count DESC, last_activity DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant permissions cho authenticated users
GRANT SELECT ON public.ip_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_ip_history(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION detect_suspicious_ips() TO authenticated;

-- ========================================
-- HOÀN TẤT!
-- ========================================
-- Bây giờ hệ thống đã có khả năng:
-- ✅ Tracking IP address của mỗi thiết bị
-- ✅ Lưu tên thiết bị chi tiết
-- ✅ Xem thống kê IP
-- ✅ Phát hiện IP đáng ngờ
-- ✅ Lịch sử IP của từng user
-- ========================================
