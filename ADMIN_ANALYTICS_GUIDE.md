# 📊 Hướng dẫn Hệ thống Thống kê Admin - Gamestva

## 🎯 Tổng quan

Hệ thống thống kê admin chuyên nghiệp cho phép bạn theo dõi và quản lý mọi hoạt động của người dùng trong ứng dụng Gamestva.

## 🚀 Cài đặt

### Bước 1: Cập nhật Database

1. Mở Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **SQL Editor**
4. Copy toàn bộ nội dung file `SUPABASE_DATABASE_SETUP.sql`
5. Paste vào SQL Editor và click **Run**

Hệ thống sẽ tạo các bảng sau:
- `user_sessions` - Theo dõi phiên truy cập
- `activity_stats` - Thống kê hoạt động chi tiết
- `daily_stats` - Thống kê theo ngày
- `device_tracking` - Theo dõi thiết bị realtime

### Bước 2: Truy cập Admin Dashboard

1. Mở trình duyệt và truy cập: `admin-analytics.html`
2. Đăng nhập với:
   - **Username**: `Admin`
   - **Password**: `093701`

## 📊 Các tính năng

### 1. Tổng quan (Overview)

**Thống kê realtime:**
- 👥 Tổng số người dùng
- 🟢 Số người đang online (cập nhật mỗi 30s)
- 🎮 Người dùng hoạt động hôm nay
- ⭐ Tổng số sao kiếm được

**Biểu đồ:**
- 📊 Phân loại thiết bị (Mobile, Desktop, Tablet)
- 🌐 Phân loại trình duyệt
- 🟢 Danh sách thiết bị đang online

### 2. Người dùng (Users)

**Danh sách chi tiết:**
- Tên, email, trạng thái online/offline
- Thiết bị đang sử dụng
- Lần đăng nhập cuối
- Tiến độ học tập (sao, xu, cấp độ)

**Tìm kiếm và lọc:**
- 🔍 Tìm kiếm theo tên/email
- Lọc: Tất cả / Đang online / Hoạt động hôm nay / Hoạt động tuần này

**Chi tiết user:**
- 📋 Thông tin cơ bản
- 📊 Thống kê học tập
- 📱 Danh sách thiết bị
- 🕐 Lịch sử sessions
- 🎮 Hoạt động chi tiết
- 📝 Ghi chú của admin

### 3. Thiết bị (Devices)

**Thống kê:**
- 📱 Số lượng Mobile
- 💻 Số lượng Desktop
- 📟 Số lượng Tablet

**Danh sách thiết bị:**
- Loại thiết bị, trình duyệt, hệ điều hành
- Độ phân giải màn hình
- Lần đầu tiên truy cập
- Lần cuối cùng hoạt động
- Số lần truy cập
- Trạng thái online/offline

### 4. Hoạt động (Activity)

**Thống kê hôm nay:**
- 🎮 Số games đã chơi
- 📚 Số từ đã học
- ⏱️ Thời gian trung bình (phút)

**Activity Feed:**
- Danh sách hoạt động realtime
- Loại hoạt động: Bắt đầu chơi, Hoàn thành game, Học từ mới, Lên cấp, v.v.
- Thời gian, sao/xu nhận được

### 5. Theo thời gian (Timeline)

**Biểu đồ:**
- 📈 Người dùng hoạt động theo ngày
- Chọn khoảng thời gian: 7/14/30/90 ngày

**Bảng thống kê:**
- Ngày
- Users mới
- Users hoạt động
- Số sessions
- Số games
- Số từ học
- Tổng sao

## 🔄 Tự động cập nhật

### Realtime Tracking

Hệ thống tự động theo dõi:
- ✅ Khi user đăng nhập → Tạo session mới
- ✅ Mỗi 2 phút → Cập nhật heartbeat (user vẫn online)
- ✅ Khi user đóng tab → Kết thúc session
- ✅ Mỗi 30 giây → Flush activity buffer vào database
- ✅ Mỗi 5 phút → Đánh dấu offline các thiết bị không hoạt động

### Activity Tracking

Các hoạt động được track tự động:
- 🎮 `game_start` - Bắt đầu chơi
- ✅ `game_complete` - Hoàn thành game
- 📚 `word_learned` - Học từ mới
- ⬆️ `level_up` - Lên cấp
- ⭐ `star_earned` - Nhận sao
- 💰 `coin_earned` - Nhận xu
- 🛒 `shop_purchase` - Mua item
- 🎨 `theme_change` - Đổi theme
- 👤 `avatar_change` - Đổi avatar
- 📖 `custom_lesson_created` - Tạo bài học tùy chỉnh
- 📄 `page_view` - Xem trang
- 🔐 `user_login` - Đăng nhập

## 📱 Thông tin thiết bị được thu thập

Mỗi thiết bị được track với:
- **Device Type**: Mobile, Desktop, Tablet
- **Browser**: Chrome, Safari, Firefox, Edge
- **OS**: Windows, MacOS, Linux, Android, iOS
- **Screen Resolution**: Ví dụ: 1920x1080
- **Language**: Ngôn ngữ trình duyệt
- **First Seen**: Lần đầu tiên truy cập
- **Last Seen**: Lần cuối cùng hoạt động
- **Visit Count**: Số lần truy cập
- **Online Status**: Đang online hay offline

## 🔐 Bảo mật

### Row Level Security (RLS)

Tất cả bảng đều có RLS enabled:
- Users chỉ có thể xem/sửa data của chính mình
- Admin có thể xem tất cả thông qua Supabase Dashboard
- Không có API public để truy cập data của users khác

### Privacy

Thông tin được thu thập:
- ✅ Thông tin thiết bị (loại, trình duyệt, OS)
- ✅ Hoạt động trong app (games, từ học, v.v.)
- ✅ Thời gian sử dụng
- ❌ KHÔNG thu thập: Vị trí GPS, danh bạ, ảnh, v.v.

## 📈 Tính toán Daily Stats

### Tự động

Để tính toán thống kê hàng ngày, chạy function:

```javascript
await window.SupabaseConfig.calculateTodayStats();
```

### Thủ công (SQL)

Trong Supabase SQL Editor:

```sql
-- Tính stats cho hôm nay
SELECT calculate_daily_stats(CURRENT_DATE);

-- Tính stats cho ngày cụ thể
SELECT calculate_daily_stats('2024-01-15');

-- Tính stats cho 7 ngày qua
DO $$
DECLARE
    d DATE;
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

## 🔧 Cấu hình

### Thay đổi thời gian refresh

Trong `admin-analytics.js`, dòng 48:

```javascript
// Auto refresh every 30 seconds
refreshInterval = setInterval(() => {
    loadAllData();
}, 30000); // 30000ms = 30s
```

### Thay đổi thời gian offline

Trong `SUPABASE_DATABASE_SETUP.sql`, function `update_device_online_status`:

```sql
-- Đánh dấu offline các thiết bị không hoạt động > 5 phút
UPDATE public.device_tracking
SET is_online = false
WHERE is_online = true
AND last_seen < NOW() - INTERVAL '5 minutes'; -- Thay đổi ở đây
```

### Thay đổi số lượng activities hiển thị

Trong `supabase-config.js`, function `getUserActivityStats`:

```javascript
.limit(50); // Thay đổi số lượng ở đây
```

## 🐛 Troubleshooting

### Không thấy data

1. Kiểm tra user đã đăng nhập chưa
2. Kiểm tra console log: `F12` → Console
3. Kiểm tra Supabase Dashboard → Table Editor
4. Chạy lại SQL setup nếu thiếu bảng

### Không track được hoạt động

1. Kiểm tra `tracking-helper.js` đã được load chưa
2. Kiểm tra console log có lỗi không
3. Kiểm tra RLS policies trong Supabase

### Thiết bị không hiển thị online

1. Kiểm tra heartbeat có chạy không (mỗi 2 phút)
2. Kiểm tra thời gian offline threshold (5 phút)
3. Chạy function `update_device_online_status()`

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Console log trong browser (F12)
2. Supabase Dashboard → Logs
3. Network tab để xem API calls

## 🎉 Tính năng nâng cao

### Export data

Trong Supabase Dashboard:
1. Vào Table Editor
2. Chọn bảng cần export
3. Click "Export" → CSV/JSON

### Tạo báo cáo tùy chỉnh

Sử dụng SQL Editor để query:

```sql
-- Top 10 users có nhiều sao nhất
SELECT 
    p.player_name,
    p.total_stars,
    p.coins,
    p.current_level
FROM user_progress p
ORDER BY p.total_stars DESC
LIMIT 10;

-- Thống kê theo giờ trong ngày
SELECT 
    EXTRACT(HOUR FROM created_at) as hour,
    COUNT(*) as activity_count
FROM activity_stats
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY hour
ORDER BY hour;

-- Thiết bị phổ biến nhất
SELECT 
    device_type,
    browser,
    COUNT(*) as count
FROM device_tracking
GROUP BY device_type, browser
ORDER BY count DESC;
```

## 🔮 Roadmap

Tính năng sắp có:
- [ ] Email báo cáo hàng tuần
- [ ] Push notification cho admin
- [ ] Export PDF reports
- [ ] A/B testing
- [ ] Heatmap user interaction
- [ ] Funnel analysis
- [ ] Cohort analysis

---

**Phiên bản**: 1.0.0  
**Cập nhật**: 2024-01-15  
**Tác giả**: Gamestva Team
