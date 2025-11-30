# 🧪 Hướng Dẫn Test Admin Dashboard

## 📋 Checklist Test

### Bước 1: Test Data ✅

1. Mở file `test-admin-data.html` trong trình duyệt
2. Click nút **"🚀 Test All"**
3. Kiểm tra kết quả:

#### ✅ Kết Quả Mong Đợi:

**admin_users_view:**
- ✅ Có data (ít nhất 1 user)
- ✅ Email hiển thị đúng
- ✅ Stars và Coins hiển thị đúng (không phải 0 nếu user đã chơi)
- ✅ Level hiển thị đúng

**get_all_users_with_email():**
- ✅ Function hoạt động
- ✅ Trả về danh sách users với email

**profiles:**
- ✅ Có data
- ✅ Email và username hiển thị

**user_progress:**
- ✅ Có data
- ✅ Stars, coins, level hiển thị đúng

**device_tracking:**
- ✅ Có data
- ✅ IP address hiển thị
- ✅ Trạng thái online/offline chính xác

#### ❌ Nếu Có Lỗi:

**"View/Function does not exist":**
```sql
-- Chạy lại SQL
-- File: SUPABASE_ADMIN_FIX.sql
```

**"No data":**
- User chưa chơi game → Mở app và chơi 1 game
- Profiles chưa sync → Chạy sync script trong SQL

### Bước 2: Test Admin Dashboard ✅

1. Mở `admin.html` trong trình duyệt
2. Mở Console (F12)
3. Đăng nhập: Admin / 093701
4. Quan sát Console logs

#### ✅ Console Logs Mong Đợi:

```
📊 Loading overview data...
👥 Users: 1 {success: true, data: Array(1)}
⭐ Progress records: 1
💰 Total stars: 216 Total coins: 97
🟢 Online devices: 1 Unique users: 1
📱 Today sessions: 1 Active users: 1
✅ Overview data loaded successfully
```

#### ✅ UI Mong Đợi:

**Trang Tổng Quan:**
- Tổng người dùng: > 0
- Đang online: > 0 (nếu có user đang online)
- Tổng sao: 216 (hoặc số đúng)
- Tổng xu: 97 (hoặc số đúng)
- Biểu đồ thiết bị hiển thị
- Danh sách online hiển thị với IP

**Trang Người Dùng:**
- Bảng hiển thị users
- Email hiển thị đúng
- Stars và Coins hiển thị đúng (216 ⭐ | 97 🪙)
- Trạng thái Online/Offline chính xác
- IP address hiển thị
- Nút "Xem" hoạt động

### Bước 3: Test Realtime ✅

1. Giữ admin dashboard mở
2. Mở `index.html` trong tab mới
3. Đăng nhập với user
4. Quay lại admin dashboard
5. Quan sát:

#### ✅ Mong Đợi:
- Số "Đang online" tăng lên
- User xuất hiện trong danh sách online
- Thiết bị mới xuất hiện
- Console log: `🔄 Device tracking changed`

6. Đóng tab app
7. Đợi 2-3 phút
8. Quan sát:

#### ✅ Mong Đợi:
- Số "Đang online" giảm xuống
- User chuyển sang Offline
- Thiết bị chuyển sang Offline

### Bước 4: Test 3 Nút Chức Năng ✅

#### 🔔 Nút Thông Báo:
1. Click nút chuông
2. ✅ Panel mở ra
3. ✅ Hiển thị hoạt động gần đây
4. Click bên ngoài
5. ✅ Panel đóng lại

#### 🔄 Nút Làm Mới:
1. Click nút refresh
2. ✅ Icon xoay
3. ✅ Data được reload
4. ✅ Thông báo "Đã làm mới dữ liệu!"

#### 🌙 Nút Chế Độ Tối:
1. Click nút moon
2. ✅ Chuyển sang dark mode
3. ✅ Icon đổi thành sun
4. ✅ Thông báo "Đã bật chế độ tối"
5. Refresh page
6. ✅ Dark mode vẫn được giữ

### Bước 5: Test User Detail Modal ✅

1. Vào trang Người dùng
2. Click nút "👁️ Xem" của 1 user
3. ✅ Modal mở ra
4. ✅ Hiển thị thông tin user
5. ✅ Hiển thị progress (stars, coins, level)
6. ✅ Hiển thị danh sách thiết bị với IP
7. Click X để đóng
8. ✅ Modal đóng lại

## 🐛 Troubleshooting

### Console Errors

#### Error: "getAllUsers failed"
```javascript
// Check trong Console:
const result = await window.SupabaseConfig.getAllUsers();
console.log(result);

// Nếu error, check SQL:
SELECT * FROM admin_users_view;
```

#### Error: "Cannot read property 'total_stars'"
```javascript
// Check progress data:
const progress = await window.SupabaseConfig.client()
    .from('user_progress')
    .select('*');
console.log(progress.data);

// Nếu empty, user chưa chơi game
```

#### Error: "Auth session missing"
- ✅ Đã fix - admin không cần auth
- Nếu vẫn thấy: Clear cache và reload

### UI Issues

#### Số 0 sao, 0 xu
**Kiểm tra:**
1. Console có log "⭐ User progress" không?
2. Nếu không → User chưa có progress
3. Mở app và chơi game để tạo progress

#### Trạng thái Online sai
**Kiểm tra:**
1. Console log "🟢 Online devices"
2. Check last_seen trong database
3. Nếu > 2 phút → Đúng là offline

#### Email hiển thị N/A
**Kiểm tra:**
1. Console log "👥 Users"
2. Check profiles table có email không
3. Chạy sync script nếu cần

## 📊 Debug Commands

### Trong Console (F12)

```javascript
// Test get users
const users = await window.SupabaseConfig.getAllUsers();
console.log('Users:', users);

// Test get progress
const progress = await window.SupabaseConfig.client()
    .from('user_progress')
    .select('*');
console.log('Progress:', progress.data);

// Test get devices
const devices = await window.SupabaseConfig.client()
    .from('device_tracking')
    .select('*')
    .eq('is_online', true);
console.log('Online devices:', devices.data);

// Force reload data
await loadAllData();

// Check current tab
const activeTab = document.querySelector('.nav-item.active');
console.log('Active tab:', activeTab.getAttribute('data-tab'));
```

### Trong Supabase SQL Editor

```sql
-- Check admin view
SELECT * FROM admin_users_view;

-- Check progress
SELECT 
    user_id,
    player_name,
    total_stars,
    coins,
    current_level
FROM user_progress;

-- Check online devices
SELECT 
    user_id,
    device_type,
    browser,
    ip_address,
    is_online,
    last_seen,
    NOW() - last_seen as time_since_last_seen
FROM device_tracking
WHERE is_online = true;

-- Check profiles
SELECT * FROM profiles;
```

## ✅ Success Criteria

Admin dashboard hoạt động đúng khi:

- ✅ Không có error trong Console
- ✅ Email hiển thị đúng
- ✅ Stars và Coins hiển thị đúng (không phải 0)
- ✅ Trạng thái Online/Offline chính xác
- ✅ IP address hiển thị
- ✅ 3 nút chức năng hoạt động
- ✅ Realtime updates hoạt động
- ✅ User detail modal hoạt động
- ✅ Dark mode hoạt động và lưu được

## 📞 Next Steps

Nếu tất cả test pass:
1. ✅ Admin dashboard đã sẵn sàng sử dụng
2. ✅ Có thể deploy lên production
3. ✅ Có thể thêm features mới

Nếu có test fail:
1. Kiểm tra Console logs
2. Kiểm tra Supabase data
3. Chạy lại SQL nếu cần
4. Clear cache và thử lại

---

**Phiên bản**: 2.1  
**Ngày cập nhật**: 2024  
**Tác giả**: Kiro AI Assistant
