# 🔴 Hướng Dẫn Setup Realtime Tracking

## 🎯 Mục Tiêu

Hệ thống tracking realtime giúp admin theo dõi:
- ✅ Người dùng đang online (cập nhật mỗi 30 giây)
- ✅ Thiết bị đang hoạt động với IP address
- ✅ Trạng thái online/offline tự động
- ✅ Dashboard tự động refresh khi có thay đổi

## 📋 Checklist Setup

### Bước 1: Cập Nhật Database ✅

1. Mở Supabase Dashboard
2. Vào **SQL Editor**
3. Chạy file `SUPABASE_IP_TRACKING_UPDATE.sql`
4. Kiểm tra các bảng đã có cột mới:
   - `device_tracking.ip_address`
   - `device_tracking.device_name`
   - `user_sessions.ip_address`

### Bước 2: Enable Realtime ✅

1. Trong Supabase Dashboard, vào **Database** > **Replication**
2. Bật Realtime cho các bảng:
   - ✅ `device_tracking`
   - ✅ `user_sessions`
   - ✅ `activity_stats`

### Bước 3: Test Tracking ✅

1. Mở file `test-realtime-tracking.html` trong trình duyệt
2. Đăng nhập nếu chưa đăng nhập
3. Kiểm tra các thông tin:
   - ✅ User info hiển thị
   - ✅ Device info hiển thị
   - ✅ IP address hiển thị
4. Test các nút:
   - Click "🚀 Start Session" - phải thấy session ID
   - Click "💓 Send Heartbeat" - phải thấy success
   - Click "📱 Get All Devices" - phải thấy danh sách thiết bị

### Bước 4: Test Admin Dashboard ✅

1. Mở `admin.html` trong tab mới
2. Đăng nhập admin (Admin/093701)
3. Kiểm tra trang **Tổng quan**:
   - ✅ Số "Đang online" phải > 0
   - ✅ Danh sách thiết bị online hiển thị với IP
4. Kiểm tra trang **Người dùng**:
   - ✅ Trạng thái Online/Offline chính xác
   - ✅ IP address hiển thị
5. Kiểm tra trang **Thiết bị**:
   - ✅ Danh sách thiết bị với IP
   - ✅ Trạng thái online/offline

### Bước 5: Test Realtime Updates ✅

1. Mở admin dashboard trong tab 1
2. Mở app (index.html) trong tab 2
3. Quan sát admin dashboard:
   - ✅ Số "Đang online" tăng lên
   - ✅ Thiết bị mới xuất hiện trong danh sách
4. Đóng tab 2
5. Đợi 1-2 phút, quan sát admin:
   - ✅ Số "Đang online" giảm xuống
   - ✅ Thiết bị chuyển sang offline

## 🔧 Cách Hoạt Động

### 1. Session Tracking

```javascript
// Khi user đăng nhập hoặc load app
await window.SupabaseConfig.startSession();
// → Tạo record trong user_sessions
// → Tạo/update record trong device_tracking với is_online = true
```

### 2. Heartbeat (Mỗi 30 giây)

```javascript
setInterval(async () => {
    await window.SupabaseConfig.updateHeartbeat();
    // → Update last_seen trong device_tracking
    // → Update is_online = true
}, 30000);
```

### 3. Mark Offline

```javascript
// Khi user đóng tab hoặc logout
await window.SupabaseConfig.markDeviceOffline();
// → Update is_online = false
```

### 4. Auto Cleanup (Admin - Mỗi 1 phút)

```javascript
// Admin tự động đánh dấu offline các thiết bị không hoạt động > 5 phút
setInterval(cleanupOfflineDevices, 60000);
```

### 5. Realtime Subscriptions (Admin)

```javascript
// Admin subscribe to changes
client.channel('device_tracking_changes')
    .on('postgres_changes', { table: 'device_tracking' }, () => {
        loadAllData(); // Refresh dashboard
    })
    .subscribe();
```

## 🐛 Troubleshooting

### Vấn đề: Không thấy thiết bị online

**Nguyên nhân:**
- Chưa chạy SQL update
- Realtime chưa được bật
- Session chưa start

**Giải pháp:**
1. Kiểm tra Console (F12) xem có lỗi không
2. Chạy lại SQL update
3. Bật Realtime trong Supabase
4. Mở `test-realtime-tracking.html` và test

### Vấn đề: IP address không hiển thị

**Nguyên nhân:**
- API ipify.org bị block
- Chưa có cột ip_address trong database

**Giải pháp:**
1. Kiểm tra Network tab (F12) xem request đến ipify.org
2. Chạy lại SQL update để thêm cột
3. Thử API khác nếu ipify bị block

### Vấn đề: Dashboard không tự động refresh

**Nguyên nhân:**
- Realtime chưa được bật trong Supabase
- Subscription chưa được setup

**Giải pháp:**
1. Vào Supabase > Database > Replication
2. Bật Realtime cho các bảng
3. Clear cache và reload admin dashboard

### Vấn đề: Thiết bị vẫn online sau khi đóng tab

**Nguyên nhân:**
- beforeunload event không trigger
- Cleanup chưa chạy

**Giải pháp:**
1. Đợi 5 phút để auto cleanup chạy
2. Hoặc click nút "🔄 Làm mới" trong admin
3. Hoặc chạy cleanup manually trong SQL:
```sql
UPDATE device_tracking 
SET is_online = false 
WHERE last_seen < NOW() - INTERVAL '5 minutes';
```

## 📊 Monitoring

### Kiểm tra trong Supabase

```sql
-- Xem tất cả thiết bị online
SELECT * FROM device_tracking 
WHERE is_online = true 
ORDER BY last_seen DESC;

-- Xem sessions đang active
SELECT * FROM user_sessions 
WHERE is_active = true 
ORDER BY session_start DESC;

-- Xem IP statistics
SELECT * FROM ip_statistics;

-- Xem lịch sử IP của user
SELECT * FROM get_user_ip_history('user-uuid-here');
```

### Kiểm tra trong Console

```javascript
// Trong app (index.html)
console.log('Session ID:', window.SupabaseConfig.currentSessionId);
console.log('Device ID:', window.SupabaseConfig.getDeviceId());

// Test heartbeat
await window.SupabaseConfig.updateHeartbeat();

// Test get devices
const devices = await window.SupabaseConfig.client()
    .from('device_tracking')
    .select('*')
    .eq('is_online', true);
console.log('Online devices:', devices.data);
```

## 🎯 Best Practices

1. **Heartbeat Interval**: 30 giây là tối ưu (không quá nhanh, không quá chậm)
2. **Cleanup Interval**: 5 phút để đánh dấu offline
3. **Admin Refresh**: 10 giây để cập nhật dashboard
4. **Realtime**: Bật cho các bảng quan trọng, tắt cho bảng ít thay đổi

## 📈 Performance

- **Heartbeat**: ~1KB mỗi 30 giây
- **Realtime**: ~2KB mỗi event
- **Admin Dashboard**: ~50KB mỗi 10 giây
- **Total**: ~5-10KB/phút cho mỗi user

## 🔐 Security

- IP address được lưu nhưng không public
- Chỉ admin mới xem được IP
- RLS (Row Level Security) được bật
- User chỉ xem được data của mình

## ✅ Checklist Hoàn Thành

- [ ] Chạy SQL update
- [ ] Bật Realtime trong Supabase
- [ ] Test với test-realtime-tracking.html
- [ ] Test admin dashboard
- [ ] Test realtime updates
- [ ] Kiểm tra cleanup tự động
- [ ] Kiểm tra IP tracking
- [ ] Kiểm tra 3 nút chức năng (Thông báo, Refresh, Dark mode)

---

**Phiên bản**: 2.0  
**Ngày cập nhật**: 2024  
**Tác giả**: Kiro AI Assistant
