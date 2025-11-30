# 🚀 Admin Analytics - Hướng dẫn nhanh

## Bước 1: Setup Database (5 phút)

1. Mở https://supabase.com/dashboard
2. Chọn project → SQL Editor
3. Copy toàn bộ `SUPABASE_DATABASE_SETUP.sql`
4. Paste và click **Run**
5. Đợi hoàn tất ✅

## Bước 2: Truy cập Admin

1. Mở `admin-analytics.html`
2. Đăng nhập:
   - Username: `Admin`
   - Password: `093701`

## Bước 3: Xem thống kê

### 📊 Tổng quan
- Số người online realtime
- Thiết bị đang truy cập
- Thống kê tổng quan

### 👥 Người dùng
- Danh sách chi tiết
- Tìm kiếm, lọc
- Xem chi tiết từng user

### 📱 Thiết bị
- Phân loại Mobile/Desktop/Tablet
- Trình duyệt, OS
- Lịch sử truy cập

### 🎮 Hoạt động
- Games đã chơi
- Từ đã học
- Activity feed realtime

### 📅 Theo thời gian
- Biểu đồ 7/14/30/90 ngày
- Thống kê chi tiết theo ngày

## 🔄 Tự động tracking

Hệ thống tự động theo dõi:
- ✅ Đăng nhập/đăng xuất
- ✅ Chơi game
- ✅ Học từ mới
- ✅ Lên cấp
- ✅ Nhận sao/xu
- ✅ Mua item
- ✅ Thay đổi theme/avatar
- ✅ Tạo bài học tùy chỉnh

## 📊 Thông tin được track

### Mỗi user:
- Thông tin cơ bản (tên, email)
- Tiến độ (sao, xu, cấp độ)
- Từ đã học
- Thời gian sử dụng

### Mỗi thiết bị:
- Loại: Mobile/Desktop/Tablet
- Trình duyệt: Chrome/Safari/Firefox/Edge
- OS: Windows/Mac/Linux/Android/iOS
- Màn hình: 1920x1080, v.v.
- Trạng thái: Online/Offline
- Lần đầu/cuối truy cập

### Mỗi session:
- Thời gian bắt đầu/kết thúc
- Thời lượng (giây)
- Thiết bị sử dụng

### Mỗi hoạt động:
- Loại: game_start, game_complete, word_learned, v.v.
- Thời gian
- Sao/xu nhận được
- Chi tiết (level, theme, từ học, v.v.)

## 🔐 Bảo mật

- ✅ Row Level Security (RLS) enabled
- ✅ Users chỉ xem data của mình
- ✅ Admin xem tất cả qua dashboard
- ✅ Không thu thập GPS, danh bạ, ảnh

## 🐛 Gặp lỗi?

1. Mở Console (F12)
2. Kiểm tra lỗi màu đỏ
3. Kiểm tra Supabase Dashboard → Logs
4. Đọc `ADMIN_ANALYTICS_GUIDE.md` để biết chi tiết

## 📈 Tips

### Tính daily stats thủ công

Mở Supabase SQL Editor:

```sql
-- Tính stats hôm nay
SELECT calculate_daily_stats(CURRENT_DATE);

-- Tính stats 7 ngày qua
DO $$
DECLARE d DATE;
BEGIN
    FOR d IN SELECT generate_series(
        CURRENT_DATE - INTERVAL '7 days',
        CURRENT_DATE,
        '1 day'::interval
    )::DATE
    LOOP
        PERFORM calculate_daily_stats(d);
    END LOOP;
END $$;
```

### Xem top users

```sql
SELECT 
    player_name,
    total_stars,
    coins,
    current_level
FROM user_progress
ORDER BY total_stars DESC
LIMIT 10;
```

### Xem thiết bị online

```sql
SELECT 
    device_type,
    browser,
    os,
    last_seen
FROM device_tracking
WHERE is_online = true
ORDER BY last_seen DESC;
```

## 🎯 Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 🟢 Realtime | Cập nhật mỗi 30s |
| 📊 Dashboard | Tổng quan đầy đủ |
| 👥 User Management | Quản lý chi tiết |
| 📱 Device Tracking | Theo dõi thiết bị |
| 🎮 Activity Feed | Hoạt động realtime |
| 📅 Timeline | Thống kê theo thời gian |
| 🔍 Search & Filter | Tìm kiếm, lọc |
| 📝 Notes | Ghi chú cho user |

## ✅ Checklist

- [ ] Đã chạy SQL setup
- [ ] Đã đăng nhập admin
- [ ] Thấy được thống kê
- [ ] Thấy được users
- [ ] Thấy được devices
- [ ] Thấy được activities
- [ ] Tracking hoạt động tự động

---

**Cần hỗ trợ?** Đọc `ADMIN_ANALYTICS_GUIDE.md` để biết chi tiết đầy đủ.
