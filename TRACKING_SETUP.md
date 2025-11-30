# 📊 Hướng dẫn Setup Tracking - Admin nhận data realtime

## ✅ Đã hoàn thành:

1. ✅ Tạo `auto-tracking.js` - Tự động track mọi hoạt động
2. ✅ Tích hợp vào `index.html`
3. ✅ Tạo `test-tracking.html` - Test tracking

## 🚀 Cách sử dụng:

### Bước 1: Test tracking

Mở: `http://localhost:3001/test-tracking.html`

**Yêu cầu:** User phải đăng nhập trước (vào `auth.html` để login)

**Test các chức năng:**
1. Click "🚀 Start Session" - Tạo session mới
2. Click "📊 Track Activity" - Ghi log hoạt động
3. Click "💓 Send Heartbeat" - Cập nhật online status
4. Click "🔍 Check Database" - Xem data đã ghi chưa

### Bước 2: Chơi game

1. Đăng nhập: `http://localhost:3001/auth.html`
2. Chơi game: `http://localhost:3001/index.html`
3. Mọi hoạt động sẽ tự động được track:
   - ✅ Đăng nhập
   - ✅ Bắt đầu chơi
   - ✅ Học từ mới
   - ✅ Nhận sao
   - ✅ Lên cấp
   - ✅ Đổi theme
   - ✅ Mua item

### Bước 3: Xem trong Admin

1. Mở: `http://localhost:3001/admin.html`
2. Đăng nhập: Admin / 093701
3. Xem data realtime:
   - **Tổng quan**: Số users, online, sessions
   - **Người dùng**: Danh sách users với status
   - **Thiết bị**: Devices đang online
   - **Hoạt động**: Activity feed realtime
   - **Thống kê**: Charts theo ngày

---

## 🔍 Kiểm tra tracking hoạt động:

### Console logs:

Mở Console (F12) khi chơi game, bạn sẽ thấy:

```
📊 Auto tracking initialized
✅ Auto tracking started
✅ All tracking hooks installed
📊 User signed in, starting session
✅ Session started: xxx
📊 Tracked: Game start {level: 1, theme: 'animals', mode: 'word'}
📊 Tracked: Word learned MÈO
📊 Tracked: Stars earned 3
💓 Heartbeat sent
```

### Database:

Kiểm tra trong Supabase Dashboard:

1. **user_sessions** - Có session mới không?
2. **activity_stats** - Có activities không?
3. **device_tracking** - Device có online không?

---

## 🐛 Troubleshooting:

### Không thấy data trong admin?

**Nguyên nhân:** User chưa đăng nhập hoặc tracking chưa chạy

**Giải pháp:**
1. Đăng nhập tại `auth.html`
2. Chơi game tại `index.html`
3. Mở Console (F12) xem có log tracking không
4. Reload admin: `Ctrl + Shift + R`

### Tracking không hoạt động?

**Kiểm tra:**
1. File `auto-tracking.js` đã load chưa? (xem Network tab)
2. Console có lỗi không?
3. User đã đăng nhập chưa?
4. Supabase config đúng chưa?

### Admin không cập nhật realtime?

**Giải pháp:**
1. Click nút "🔄 Làm mới" trong admin
2. Đợi 30s (auto refresh)
3. Reload trang admin

---

## 📊 Data flow:

```
User chơi game
    ↓
auto-tracking.js detect hoạt động
    ↓
tracking-helper.js gọi functions
    ↓
supabase-config.js ghi vào database
    ↓
Supabase lưu trữ
    ↓
Admin query và hiển thị
```

---

## ⚡ Các hoạt động được track:

### Tự động:
- ✅ `user_login` - Khi đăng nhập
- ✅ `page_view` - Khi chuyển trang
- ✅ `game_start` - Khi bắt đầu chơi
- ✅ `word_learned` - Khi học từ mới
- ✅ `star_earned` - Khi nhận sao
- ✅ `level_up` - Khi lên cấp
- ✅ `theme_change` - Khi đổi theme
- ✅ `shop_purchase` - Khi mua item

### Session tracking:
- ✅ Session start - Khi đăng nhập
- ✅ Heartbeat - Mỗi 2 phút
- ✅ Session end - Khi đóng tab

### Device tracking:
- ✅ Device info - Browser, OS, màn hình
- ✅ Online status - Realtime
- ✅ Last seen - Cập nhật liên tục

---

## 🎯 Kết quả mong đợi:

Sau khi setup xong:

1. **User chơi game** → Admin thấy ngay:
   - Số users tăng
   - Device online tăng
   - Activity feed có log mới
   - Stats cập nhật

2. **Realtime updates:**
   - Auto refresh mỗi 30s
   - Heartbeat mỗi 2 phút
   - Activity buffer flush mỗi 30s

3. **Admin dashboard:**
   - Hiển thị đầy đủ data
   - Charts cập nhật
   - Online status chính xác

---

## 📝 Notes:

- Tracking chỉ hoạt động khi user đã đăng nhập
- Data được buffer và ghi batch để tối ưu performance
- Admin cần refresh để thấy data mới (hoặc đợi auto refresh)
- Console logs giúp debug tracking

---

**Hãy test và cho tôi biết kết quả!** 🚀
