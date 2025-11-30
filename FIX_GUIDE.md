# 🔧 HƯỚNG DẪN SỬA LỖI VÀ SETUP

## ❌ **CÁC LỖI ĐÃ SỬA**

### 1. **Lỗi 400 Bad Request - user_progress**
**Nguyên nhân**: Database chưa có bảng hoặc cấu trúc sai

**Giải pháp**:
- ✅ Đã sửa `supabase-config.js` để chỉ lưu các field được phép
- ✅ Đã sửa `main.js` để map đúng field names (snake_case ↔ camelCase)
- ✅ Đã thêm error handling rõ ràng

### 2. **Lỗi 404 TTS API**
**Nguyên nhân**: Đang mở từ Live Server (port 5500) thay vì Node server (port 3001)

**Giải pháp**: 
- ⚠️ **QUAN TRỌNG**: Phải mở từ `http://localhost:3001` (Node server)
- ❌ KHÔNG mở từ Live Server (127.0.0.1:5500)

### 3. **Lỗi 406 favicon**
**Nguyên nhân**: Favicon dùng SVG inline, một số browser không hỗ trợ

**Giải pháp**: Không ảnh hưởng, có thể bỏ qua

---

## 🗄️ **SETUP DATABASE SUPABASE**

### **Bước 1: Truy cập Supabase Dashboard**
1. Vào https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **SQL Editor** (menu bên trái)

### **Bước 2: Chạy SQL Script**
1. Mở file `SUPABASE_DATABASE_SETUP.sql`
2. Copy toàn bộ nội dung
3. Paste vào SQL Editor
4. Click **Run** để thực thi

### **Bước 3: Kiểm tra**
Chạy query này để xem bảng đã tạo chưa:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Kết quả phải có:
- ✅ user_progress
- ✅ profiles
- ✅ activity_logs
- ✅ user_notes

---

## 🚀 **CÁCH CHẠY ĐÚNG**

### **1. Start Server**
```bash
node server.js
```

### **2. Mở trình duyệt**
```
http://localhost:3001
```

### **3. Luồng hoạt động**
```
1. Mở http://localhost:3001
   ↓
2. Chưa đăng nhập → Redirect sang /auth.html
   ↓
3. Đăng ký/Đăng nhập
   ↓
4. Thành công → Redirect về /index.html
   ↓
5. Load progress từ Supabase
   ↓
6. Chơi game!
   ↓
7. Mỗi lần save → Tự động sync lên Supabase
```

---

## 🧪 **TEST HỆ THỐNG**

### **Test 1: Kiểm tra Supabase**
```
http://localhost:3001/test-auth.html
```
- Click "Test Supabase Connection"
- Phải thấy: ✅ Supabase đã kết nối thành công!

### **Test 2: Đăng ký tài khoản mới**
```
http://localhost:3001/auth.html
```
- Tab "Đăng ký"
- Nhập thông tin:
  - Tên: Test User
  - Email: test@example.com
  - Password: 123456
- Click "Đăng ký"
- Kiểm tra email để xác nhận (nếu có)

### **Test 3: Đăng nhập**
- Tab "Đăng nhập"
- Nhập email/password vừa tạo
- Click "Đăng nhập"
- Phải redirect về game

### **Test 4: Kiểm tra sync**
1. Chơi game, làm vài câu
2. Mở Console (F12)
3. Phải thấy: `✅ Progress saved to Supabase`
4. Refresh trang
5. Progress phải được giữ nguyên

---

## 🔍 **KIỂM TRA LỖI**

### **Mở Console (F12)**
Các log quan trọng:

**Khi load trang**:
```
✅ Supabase initialized
✅ User authenticated: email@example.com
✅ Progress loaded from Supabase
```

**Khi chơi game**:
```
✅ Progress saved to Supabase
```

**Nếu có lỗi**:
```
❌ Failed to save progress: [error message]
```

### **Các lỗi thường gặp**

#### **1. "Invalid API key"**
- Kiểm tra `SUPABASE_URL` và `SUPABASE_ANON_KEY` trong `supabase-config.js`
- Đảm bảo copy đúng từ Supabase Dashboard

#### **2. "relation user_progress does not exist"**
- Chưa chạy SQL script
- Vào SQL Editor và chạy `SUPABASE_DATABASE_SETUP.sql`

#### **3. "Row Level Security policy violation"**
- RLS chưa được setup đúng
- Chạy lại phần policy trong SQL script

#### **4. "TTS API 404"**
- Đang mở từ Live Server
- Phải mở từ `http://localhost:3001`

---

## 📊 **CẤU TRÚC DATABASE**

### **Bảng: user_progress**
```
- id: UUID (primary key)
- user_id: UUID (foreign key → auth.users)
- total_stars: INTEGER
- coins: INTEGER
- words_learned: TEXT[]
- owned_characters: TEXT[]
- player_name: TEXT
- player_avatar: TEXT
- current_level: INTEGER
- streak: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### **Mapping: Database ↔ GameState**
```javascript
Database              →  GameState
-----------------        ----------------
total_stars          →  totalStars
coins                →  coins
words_learned        →  wordsLearned
owned_characters     →  ownedCharacters
player_name          →  playerName
player_avatar        →  playerAvatar
current_level        →  currentLevel
streak               →  streak
```

---

## ✅ **CHECKLIST**

Trước khi chạy, đảm bảo:

- [ ] Đã chạy SQL script trong Supabase
- [ ] Server đang chạy (`node server.js`)
- [ ] Mở từ `http://localhost:3001` (KHÔNG phải Live Server)
- [ ] Đã có tài khoản test
- [ ] Console không có lỗi đỏ

---

## 🆘 **HỖ TRỢ**

Nếu vẫn gặp lỗi:

1. Mở Console (F12)
2. Copy toàn bộ error message
3. Kiểm tra:
   - Server có đang chạy?
   - URL có đúng localhost:3001?
   - Database đã setup chưa?
   - Đã đăng nhập chưa?

---

## 🎉 **HOÀN TẤT!**

Sau khi làm theo hướng dẫn:
- ✅ Hệ thống đăng nhập hoạt động
- ✅ Progress được sync lên cloud
- ✅ TTS API hoạt động
- ✅ Không còn lỗi 400/404

**Chúc bạn chơi game vui vẻ!** 🐝🎮
