# 🌐 Hướng Dẫn Nâng Cấp IP Tracking

## ✨ Tính Năng Mới

Hệ thống admin đã được nâng cấp với các tính năng mới:

### 1. 🔔 Nút Thông Báo (Notifications)
- Hiển thị hoạt động gần đây trong ngày
- Cập nhật realtime
- Click vào nút chuông để xem panel thông báo

### 2. 🔄 Nút Làm Mới (Refresh)
- Làm mới toàn bộ dữ liệu dashboard
- Animation xoay khi đang tải
- Hiển thị thông báo khi hoàn tất

### 3. 🌙 Nút Chế độ Tối (Dark Mode)
- Chuyển đổi giữa chế độ sáng/tối
- Lưu preference vào localStorage
- Tự động load theme đã lưu khi quay lại

### 4. 🌐 IP Address Tracking
- Tự động lấy và lưu IP address của mỗi thiết bị
- Hiển thị IP trong danh sách người dùng
- Hiển thị IP trong danh sách thiết bị
- Theo dõi lịch sử IP của từng user

### 5. 📊 Thống Kê Nâng Cao
- Phân tích thiết bị theo loại (Mobile/Desktop/Tablet)
- Phân tích trình duyệt
- Hiển thị thiết bị đang online với IP
- Chi tiết thiết bị khi click vào user

## 🚀 Cách Cài Đặt

### Bước 1: Cập nhật Database

1. Mở Supabase Dashboard
2. Vào **SQL Editor**
3. Chạy file `SUPABASE_IP_TRACKING_UPDATE.sql`
4. Đợi cho đến khi thấy "Success"

### Bước 2: Clear Cache

1. Mở trang admin: `admin.html`
2. Nhấn `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac)
3. Hoặc xóa cache trong DevTools (F12 > Application > Clear Storage)

### Bước 3: Đăng Nhập Lại

1. Đăng nhập vào admin dashboard
2. Username: `Admin`
3. Password: `093701`

## 📱 Các Tính Năng Chi Tiết

### Trang Tổng Quan (Overview)
- **Tổng người dùng**: Số lượng user đã đăng ký
- **Đang online**: Số user đang hoạt động (realtime)
- **Hoạt động hôm nay**: Số user có hoạt động trong ngày
- **Biểu đồ thiết bị**: Phân tích theo Mobile/Desktop/Tablet
- **Biểu đồ trình duyệt**: Phân tích theo Chrome/Firefox/Safari/Edge
- **Danh sách online**: Thiết bị đang online với IP address

### Trang Người Dùng (Users)
Hiển thị bảng với các cột:
- **Tên**: Username và ID
- **Email**: Email đăng ký
- **Trạng thái**: Online/Offline
- **Thiết bị**: Loại thiết bị + trình duyệt + IP address
- **Lần cuối**: Thời gian hoạt động cuối
- **Tiến độ**: Sao, xu, level
- **Hành động**: Nút xem chi tiết

### Trang Thiết Bị (Devices)
Hiển thị bảng với các cột:
- **Thiết bị**: Icon + tên thiết bị
- **Loại**: Mobile/Desktop/Tablet
- **Trình duyệt**: Chrome/Firefox/Safari/Edge
- **IP Address**: Địa chỉ IP hiện tại
- **Trạng thái**: Online/Offline
- **Lần cuối**: Thời gian hoạt động cuối

### Trang Hoạt Động (Activity)
- Thống kê games và từ học trong ngày
- Feed hoạt động realtime
- Thời gian trung bình

### Trang Thống Kê (Stats)
- Biểu đồ timeline 7/14/30 ngày
- Bảng thống kê chi tiết theo ngày

## 🎨 Giao Diện

### Chế Độ Sáng (Light Mode)
- Background trắng
- Text đen
- Card màu trắng với border xám nhạt

### Chế Độ Tối (Dark Mode)
- Background đen (#1a1a1a)
- Text trắng (#e0e0e0)
- Card màu xám đậm (#2d2d2d)
- Border xám (#404040)

## 🔧 Troubleshooting

### Không thấy IP Address?
1. Kiểm tra đã chạy SQL update chưa
2. Đăng xuất và đăng nhập lại
3. Đợi 1-2 phút để hệ thống cập nhật

### Nút không hoạt động?
1. Clear cache trình duyệt
2. Hard refresh (Ctrl + Shift + R)
3. Kiểm tra Console (F12) xem có lỗi không

### Dark mode không lưu?
1. Kiểm tra localStorage có bị block không
2. Thử ở chế độ incognito
3. Clear cookies và thử lại

## 📊 API Functions Mới

### JavaScript Functions

```javascript
// Lấy IP address
const ip = await window.SupabaseConfig.getIPAddress();

// Lấy thông tin thiết bị
const deviceInfo = window.SupabaseConfig.getDeviceInfo();

// Start session với IP tracking
await window.SupabaseConfig.startSession();

// Update heartbeat với IP
await window.SupabaseConfig.updateHeartbeat();
```

### SQL Functions

```sql
-- Lấy lịch sử IP của user
SELECT * FROM get_user_ip_history('user-uuid-here');

-- Phát hiện IP đáng ngờ
SELECT * FROM detect_suspicious_ips();

-- Xem thống kê IP
SELECT * FROM ip_statistics;
```

## 🎯 Best Practices

1. **Refresh thường xuyên**: Click nút refresh mỗi 5-10 phút để cập nhật data
2. **Kiểm tra IP đáng ngờ**: Nếu nhiều user cùng IP, có thể là proxy/VPN
3. **Monitor online users**: Theo dõi số user online để biết peak hours
4. **Dark mode ban đêm**: Bật dark mode khi làm việc ban đêm để bảo vệ mắt

## 🔐 Bảo Mật

- IP address được mã hóa trong database
- Chỉ admin mới xem được IP
- RLS (Row Level Security) được bật
- Không lưu thông tin nhạy cảm khác

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra Console (F12)
2. Xem file `DEBUG_ADMIN.md`
3. Kiểm tra Supabase logs
4. Clear cache và thử lại

---

**Phiên bản**: 2.0  
**Ngày cập nhật**: 2024  
**Tương thích**: Chrome, Firefox, Safari, Edge
