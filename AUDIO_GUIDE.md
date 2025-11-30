# 🔊 HƯỚNG DẪN SỬA LỖI ÂM THANH

## ❌ **VẤN ĐỀ**

Âm thanh không phát ra khi chơi game.

---

## 🔍 **NGUYÊN NHÂN**

### **1. Đang mở từ sai nguồn**

❌ **SAI**:
- `file:///F:/Trò%20Chơi%20Xếp%20Chữ/index.html`
- `http://127.0.0.1:5500/index.html` (Live Server)
- `http://localhost:5500/index.html` (Live Server)

✅ **ĐÚNG**:
- `http://localhost:3001/` (Node Server)

### **2. Node Server chưa chạy**

Nếu không chạy `node server.js`, TTS API sẽ không hoạt động.

### **3. Trình duyệt chặn autoplay**

Một số trình duyệt yêu cầu user tương tác trước khi phát âm thanh.

---

## ✅ **GIẢI PHÁP ĐÃ TRIỂN KHAI**

### **1. Dual TTS System**

Hệ thống giờ có 2 phương thức phát âm:

#### **A. TTS Server (Ưu tiên)**
- Sử dụng Google Translate TTS API
- Chất lượng cao, giọng tự nhiên
- Yêu cầu Node server đang chạy
- URL: `/api/tts?text=...`

#### **B. Web Speech API (Fallback)**
- Sử dụng TTS có sẵn trong trình duyệt
- Tự động kích hoạt khi TTS Server không khả dụng
- Không cần server
- Chất lượng phụ thuộc vào trình duyệt

### **2. Auto-detect & Fallback**

```javascript
// Thử TTS Server trước
audio.play().catch(function(error) {
  // Nếu lỗi → Tự động chuyển sang Web Speech API
  useBrowserTTS(text, volume);
});
```

### **3. Kiểm tra TTS khi khởi động**

```javascript
checkTTSAvailability();
// ✅ TTS Server đang hoạt động
// hoặc
// ⚠️ TTS Server không khả dụng, sẽ dùng Web Speech API
```

---

## 🚀 **CÁCH SỬA**

### **Bước 1: Đảm bảo Server đang chạy**

```bash
node server.js
```

Phải thấy:
```
🐝 Học Đọc - Đánh Vần Gamestva
🎮 Game đang chạy tại: http://localhost:3001
🔊 TTS API: http://localhost:3001/api/tts?text=xin chào
```

### **Bước 2: Mở đúng URL**

```
http://localhost:3001
```

### **Bước 3: Kiểm tra Console (F12)**

Mở Console và xem log:

**Nếu TTS Server hoạt động**:
```
✅ TTS Server đang hoạt động
```

**Nếu TTS Server không khả dụng**:
```
⚠️ TTS Server không khả dụng, sẽ dùng Web Speech API
💡 Đảm bảo bạn đang chạy từ http://localhost:3001
```

### **Bước 4: Test âm thanh**

1. Click vào game
2. Chọn chế độ chơi
3. Nghe âm thanh hướng dẫn
4. Nếu không có âm thanh → Xem Console để biết lỗi

---

## 🔧 **TROUBLESHOOTING**

### **Lỗi 1: "TTS server không khả dụng"**

**Nguyên nhân**: Đang mở từ Live Server hoặc file://

**Giải pháp**:
1. Dừng Live Server
2. Chạy `node server.js`
3. Mở `http://localhost:3001`

### **Lỗi 2: "Failed to load resource: net::ERR_ABORTED 404"**

**Nguyên nhân**: TTS API endpoint không tồn tại

**Giải pháp**:
1. Kiểm tra server có đang chạy không
2. Kiểm tra URL có đúng `localhost:3001` không
3. Hệ thống sẽ tự động fallback sang Web Speech API

### **Lỗi 3: "The play() request was interrupted"**

**Nguyên nhân**: Trình duyệt chặn autoplay

**Giải pháp**:
- Hệ thống đã có modal "Bật âm thanh"
- Click vào modal để unlock audio
- Sau đó âm thanh sẽ hoạt động bình thường

### **Lỗi 4: "speechSynthesis is not defined"**

**Nguyên nhân**: Trình duyệt không hỗ trợ Web Speech API

**Giải pháp**:
- Dùng Chrome, Edge, hoặc Safari (hỗ trợ tốt nhất)
- Hoặc đảm bảo TTS Server đang chạy

---

## 🎯 **KIỂM TRA NHANH**

### **Test 1: TTS Server**

Mở trình duyệt và truy cập:
```
http://localhost:3001/api/tts?text=xin chào
```

**Kết quả mong đợi**: Tải xuống file âm thanh MP3

### **Test 2: Web Speech API**

Mở Console (F12) và chạy:
```javascript
var utterance = new SpeechSynthesisUtterance('xin chào');
utterance.lang = 'vi-VN';
speechSynthesis.speak(utterance);
```

**Kết quả mong đợi**: Nghe thấy "xin chào"

### **Test 3: Game Audio**

1. Mở game
2. Click "Bật âm thanh" (nếu có modal)
3. Chơi game
4. Mở Console → Xem log

**Log mong đợi**:
```
✅ TTS Server đang hoạt động
✅ Audio unlocked
```

---

## 📊 **SO SÁNH 2 PHƯƠNG THỨC**

| Tính năng | TTS Server | Web Speech API |
|-----------|------------|----------------|
| Chất lượng | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Giọng tự nhiên | ✅ | ⚠️ (phụ thuộc browser) |
| Cần server | ✅ | ❌ |
| Offline | ❌ | ✅ |
| Tốc độ | Nhanh | Rất nhanh |
| Hỗ trợ tiếng Việt | ✅ | ⚠️ (phụ thuộc browser) |

---

## 💡 **KHUYẾN NGHỊ**

### **Cho Development**
- Luôn chạy `node server.js`
- Mở từ `http://localhost:3001`
- Dùng TTS Server để có chất lượng tốt nhất

### **Cho Production**
- Deploy Node server lên hosting
- Hoặc dùng Web Speech API làm primary (không cần server)
- Hoặc dùng dịch vụ TTS cloud (Google Cloud TTS, AWS Polly)

### **Cho Testing**
- Nếu không muốn chạy server → Web Speech API vẫn hoạt động
- Chất lượng có thể kém hơn nhưng đủ để test

---

## 🎉 **KẾT LUẬN**

Hệ thống âm thanh giờ đã:
- ✅ Tự động phát hiện TTS Server
- ✅ Tự động fallback sang Web Speech API
- ✅ Hiển thị log rõ ràng
- ✅ Không bị crash khi TTS Server không khả dụng
- ✅ Vẫn có âm thanh dù không chạy server

**Chơi game vui vẻ!** 🐝🎮🔊
