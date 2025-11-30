<<<<<<< HEAD
# 🐝 Học Đọc - Đánh Vần Gamestva

Game học ghép chữ tiếng Việt cho bé 3-7 tuổi

## ✨ Tính năng

- 🎮 **Game ghép chữ**: Kéo thả chữ cái để ghép từ
- 📝 **Ghép câu**: Học ghép câu hoàn chỉnh
- 🔊 **Giọng đọc tiếng Việt**: Phát âm chuẩn với Microsoft Hoa
- 🎨 **Nhiều chủ đề**: Động vật, đồ vật, thức ăn, giao thông...
- 🏆 **Hệ thống điểm**: Sao, xu, huy hiệu
- 🏪 **Cửa hàng**: Đổi quà bằng xu
- 👨‍👩‍👧 **Chế độ phụ huynh**: Theo dõi tiến độ, soạn từ tùy chỉnh
- ❄️ **Hiệu ứng tuyết rơi**: Giao diện đẹp mắt

## 🚀 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd gamestva
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy server
```bash
npm start
```

Hoặc dùng server đơn giản:
```bash
node server.js
```

### 4. Mở trình duyệt
```
http://localhost:3000
```

## 📁 Cấu trúc thư mục

```
gamestva/
├── index.html              # Trang chính
├── styles.css              # CSS chính
├── main.js                 # JavaScript chính
├── snow-effect.css         # Hiệu ứng tuyết
├── snow-effect.js          # Logic tuyết rơi
├── word-themes.js          # Dữ liệu chủ đề
├── sentence-data.js        # Dữ liệu câu
├── animations.js           # Hiệu ứng động
├── audio-manager.js        # Quản lý âm thanh
├── mobile-optimizer.js     # Tối ưu mobile
├── shop-data.js            # Dữ liệu cửa hàng
├── parent-controls.js      # Chức năng phụ huynh
├── parent-page.js          # Trang phụ huynh
├── admin.html              # Trang admin
├── admin.js                # Logic admin
├── auth.html               # Trang đăng nhập
├── auth.js                 # Logic xác thực
├── supabase-config.js      # Cấu hình Supabase
└── server.js               # Node.js server
```

## 🎮 Cách chơi

1. **Chọn avatar và nhập tên**
2. **Chọn chủ đề học** (Động vật, Đồ vật, Thức ăn...)
3. **Chọn cấp độ** (1: Từ đơn, 2: Từ ghép, 3: Câu)
4. **Kéo thả chữ cái** vào ô đúng để ghép từ
5. **Nhận sao và xu** khi làm đúng
6. **Đổi quà** tại cửa hàng

## 👨‍👩‍👧 Chế độ phụ huynh

- 📊 **Thống kê**: Xem tiến độ học của bé
- 📖 **Từ đã học**: Danh sách từ bé đã học
- ✏️ **Soạn từ**: Tạo từ/câu tùy chỉnh
- ⏰ **Giới hạn thời gian**: Đặt thời gian chơi mỗi ngày
- 📚 **Chọn chủ đề**: Chọn chủ đề phù hợp với bé

## 🔧 Cấu hình

### Supabase (Database)
1. Tạo project tại [supabase.com](https://supabase.com)
2. Chạy SQL trong `SUPABASE_DATABASE_SETUP.sql`
3. Cập nhật `supabase-config.js` với URL và API key

### Giọng đọc
- Tự động sử dụng Microsoft Hoa (giọng nữ Việt Nam)
- Fallback: Microsoft Việt → Google Việt
- Hoạt động trên mọi trình duyệt hiện đại

## 📱 Hỗ trợ

- ✅ Desktop: Chrome, Firefox, Safari, Edge
- ✅ Mobile: iOS Safari, Chrome Android
- ✅ Tablet: iPad, Android tablets

## 🎨 Tùy chỉnh

### Thêm chủ đề mới
Chỉnh sửa `word-themes.js`:
```javascript
window.WordThemes = {
  'ten-chu-de': {
    name: 'Tên chủ đề',
    icon: '🎨',
    prefix: 'Đây là',
    level1: [
      { word: "TỪ", image: "🎨", label: "Từ" }
    ]
  }
};
```

### Thay đổi màu sắc
Chỉnh sửa `styles.css`:
```css
:root {
  --pink: #FFB6C1;
  --mint: #98D8C8;
  --yellow: #FFE66D;
  --orange: #FF9F43;
  --coral: #FF6B6B;
}
```

## 🐛 Troubleshooting

### Âm thanh không hoạt động
- Đảm bảo trình duyệt cho phép autoplay
- Click vào nút 🔊 để bật âm thanh
- Kiểm tra volume của hệ thống

### Tuyết không rơi
- Refresh trang (Ctrl+F5)
- Kiểm tra console có lỗi không
- Tắt "Reduce motion" trong settings

### Database không kết nối
- Kiểm tra `supabase-config.js`
- Đảm bảo đã chạy SQL setup
- Kiểm tra network connection

## 📄 License

MIT License - Tự do sử dụng cho mục đích giáo dục

## 👨‍💻 Phát triển bởi

Gamestva Team

## 🙏 Credits

- Font: Nunito, Baloo 2, Fredoka
- Icons: Emoji Unicode
- TTS: Web Speech API
- Database: Supabase

---

**Chúc bé học vui! 🎉**
=======
# 🐝 Học Đọc - Đánh Vần Gamestva

Game học ghép chữ tiếng Việt cho bé 3-7 tuổi

## ✨ Tính năng

- 🎮 **Game ghép chữ**: Kéo thả chữ cái để ghép từ
- 📝 **Ghép câu**: Học ghép câu hoàn chỉnh
- 🔊 **Giọng đọc tiếng Việt**: Phát âm chuẩn với Microsoft Hoa
- 🎨 **Nhiều chủ đề**: Động vật, đồ vật, thức ăn, giao thông...
- 🏆 **Hệ thống điểm**: Sao, xu, huy hiệu
- 🏪 **Cửa hàng**: Đổi quà bằng xu
- 👨‍👩‍👧 **Chế độ phụ huynh**: Theo dõi tiến độ, soạn từ tùy chỉnh
- ❄️ **Hiệu ứng tuyết rơi**: Giao diện đẹp mắt

## 🚀 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd gamestva
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy server
```bash
npm start
```

Hoặc dùng server đơn giản:
```bash
node server.js
```

### 4. Mở trình duyệt
```
http://localhost:3000
```

## 📁 Cấu trúc thư mục

```
gamestva/
├── index.html              # Trang chính
├── styles.css              # CSS chính
├── main.js                 # JavaScript chính
├── snow-effect.css         # Hiệu ứng tuyết
├── snow-effect.js          # Logic tuyết rơi
├── word-themes.js          # Dữ liệu chủ đề
├── sentence-data.js        # Dữ liệu câu
├── animations.js           # Hiệu ứng động
├── audio-manager.js        # Quản lý âm thanh
├── mobile-optimizer.js     # Tối ưu mobile
├── shop-data.js            # Dữ liệu cửa hàng
├── parent-controls.js      # Chức năng phụ huynh
├── parent-page.js          # Trang phụ huynh
├── admin.html              # Trang admin
├── admin.js                # Logic admin
├── auth.html               # Trang đăng nhập
├── auth.js                 # Logic xác thực
├── supabase-config.js      # Cấu hình Supabase
└── server.js               # Node.js server
```

## 🎮 Cách chơi

1. **Chọn avatar và nhập tên**
2. **Chọn chủ đề học** (Động vật, Đồ vật, Thức ăn...)
3. **Chọn cấp độ** (1: Từ đơn, 2: Từ ghép, 3: Câu)
4. **Kéo thả chữ cái** vào ô đúng để ghép từ
5. **Nhận sao và xu** khi làm đúng
6. **Đổi quà** tại cửa hàng

## 👨‍👩‍👧 Chế độ phụ huynh

- 📊 **Thống kê**: Xem tiến độ học của bé
- 📖 **Từ đã học**: Danh sách từ bé đã học
- ✏️ **Soạn từ**: Tạo từ/câu tùy chỉnh
- ⏰ **Giới hạn thời gian**: Đặt thời gian chơi mỗi ngày
- 📚 **Chọn chủ đề**: Chọn chủ đề phù hợp với bé

## 🔧 Cấu hình

### Supabase (Database)
1. Tạo project tại [supabase.com](https://supabase.com)
2. Chạy SQL trong `SUPABASE_DATABASE_SETUP.sql`
3. Cập nhật `supabase-config.js` với URL và API key

### Giọng đọc
- Tự động sử dụng Microsoft Hoa (giọng nữ Việt Nam)
- Fallback: Microsoft Việt → Google Việt
- Hoạt động trên mọi trình duyệt hiện đại

## 📱 Hỗ trợ

- ✅ Desktop: Chrome, Firefox, Safari, Edge
- ✅ Mobile: iOS Safari, Chrome Android
- ✅ Tablet: iPad, Android tablets

## 🎨 Tùy chỉnh

### Thêm chủ đề mới
Chỉnh sửa `word-themes.js`:
```javascript
window.WordThemes = {
  'ten-chu-de': {
    name: 'Tên chủ đề',
    icon: '🎨',
    prefix: 'Đây là',
    level1: [
      { word: "TỪ", image: "🎨", label: "Từ" }
    ]
  }
};
```

### Thay đổi màu sắc
Chỉnh sửa `styles.css`:
```css
:root {
  --pink: #FFB6C1;
  --mint: #98D8C8;
  --yellow: #FFE66D;
  --orange: #FF9F43;
  --coral: #FF6B6B;
}
```

## 🐛 Troubleshooting

### Âm thanh không hoạt động
- Đảm bảo trình duyệt cho phép autoplay
- Click vào nút 🔊 để bật âm thanh
- Kiểm tra volume của hệ thống

### Tuyết không rơi
- Refresh trang (Ctrl+F5)
- Kiểm tra console có lỗi không
- Tắt "Reduce motion" trong settings

### Database không kết nối
- Kiểm tra `supabase-config.js`
- Đảm bảo đã chạy SQL setup
- Kiểm tra network connection

## 📄 License

MIT License - Tự do sử dụng cho mục đích giáo dục

## 👨‍💻 Phát triển bởi

Gamestva Team

## 🙏 Credits

- Font: Nunito, Baloo 2, Fredoka
- Icons: Emoji Unicode
- TTS: Web Speech API
- Database: Supabase

---

**Chúc bé học vui! 🎉**
>>>>>>> 24c03eda35bab541d2f3fd43d47c2f7b5555ba3f
