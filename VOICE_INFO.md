# 🎤 THÔNG TIN GIỌNG ĐỌC

## 🌟 **GIỌNG MẶC ĐỊNH**

### **Google Translate TTS - Giọng Nữ Việt Nam**

✅ **Đây là giọng chính được sử dụng trong game**

**Đặc điểm**:
- 👩 **Giọng nữ** trẻ, tự nhiên
- 🇻🇳 **Tiếng Việt** chuẩn, rõ ràng
- 💝 **Dịu dàng**, hiền từ như cô giáo mầm non
- 🎯 **Phù hợp** cho trẻ em 3-7 tuổi
- ⭐ **Chất lượng cao**, giọng đọc chuyên nghiệp

**Tham số tối ưu**:
```javascript
Tốc độ: 0.85x (chậm hơn bình thường)
→ Trẻ em nghe rõ từng âm, dễ học theo

Âm lượng: Theo cài đặt game
→ Điều chỉnh được trong game
```

---

## 🔄 **HỆ THỐNG DỰ PHÒNG**

### **Web Speech API - Giọng Trình Duyệt**

⚠️ **Chỉ sử dụng khi Google TTS không khả dụng**

**Khi nào dùng**:
- Không chạy Node server
- Mở từ file:// hoặc Live Server
- Mất kết nối internet
- Google TTS bị lỗi

**Giọng được ưu tiên** (theo thứ tự):
1. **Google tiếng Việt** (Chrome)
2. **Microsoft Linh Online** (Edge)
3. **Microsoft An Online** (Edge)
4. **Linh** (Windows)
5. **An** (Windows)
6. **Ting-Ting** (macOS/iOS)
7. **Sin-Ji** (macOS/iOS)

**Tham số**:
```javascript
Tốc độ: 0.85x
Cao độ: 1.15 (giọng cao hơn, dễ thương)
```

---

## 📊 **SO SÁNH 2 GIỌNG**

| Tiêu chí | Google TTS | Web Speech API |
|----------|------------|----------------|
| **Chất lượng** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Tự nhiên** | ✅ Rất tự nhiên | ⚠️ Phụ thuộc browser |
| **Giọng nữ** | ✅ Luôn là giọng nữ | ⚠️ Tùy browser |
| **Tiếng Việt** | ✅ Chuẩn | ⚠️ Có thể không có |
| **Cần server** | ✅ Cần | ❌ Không cần |
| **Offline** | ❌ Cần internet | ✅ Có thể offline |
| **Tốc độ** | Nhanh | Rất nhanh |

---

## 🚀 **CÁCH SỬ DỤNG GIỌNG TỐT NHẤT**

### **Bước 1: Chạy Server**
```bash
node server.js
```

### **Bước 2: Mở từ localhost**
```
http://localhost:3001
```

### **Bước 3: Kiểm tra Console**
Mở Console (F12) và xem:
```
✅ Đang sử dụng: Google TTS (Giọng nữ Việt Nam tự nhiên)
🎤 Giọng đọc: Phụ nữ trẻ, dịu dàng, phù hợp trẻ em
```

### **Bước 4: Chơi game**
- Giọng Google TTS sẽ tự động được sử dụng
- Không cần cài đặt gì thêm
- Giọng luôn ổn định, chất lượng cao

---

## 🧪 **TEST GIỌNG ĐỌC**

### **Test 1: Nghe giọng Google TTS**
```
http://localhost:3001/test-voices.html
```
Click **"TTS Server (Google)"** để nghe

### **Test 2: So sánh các giọng**
Click **"Xem Tất Cả Giọng"** để xem và test từng giọng

### **Test 3: Trong game**
1. Vào game
2. Chọn chế độ chơi
3. Nghe giọng hướng dẫn
4. Mở Console để xem đang dùng giọng nào

---

## 💡 **KHUYẾN NGHỊ**

### **Cho phụ huynh**:
✅ **Luôn chạy từ Node server** để có giọng tốt nhất
- Giọng Google TTS tự nhiên, dễ nghe
- Trẻ em học phát âm chuẩn hơn
- Không cần cài đặt thêm

### **Cho developer**:
✅ **Ưu tiên Google TTS** trong mọi trường hợp
- Đã được tối ưu sẵn
- Tự động fallback khi cần
- Log rõ ràng để debug

### **Khi không có server**:
⚠️ **Web Speech API vẫn hoạt động**
- Chất lượng phụ thuộc trình duyệt
- Có thể không có giọng Việt
- Vẫn đủ để test/demo

---

## 🎯 **KẾT LUẬN**

### **Giọng mặc định của game**:
```
🎤 Google Translate TTS
👩 Giọng nữ Việt Nam
💝 Dịu dàng, tự nhiên
🎯 Phù hợp trẻ em 3-7 tuổi
⭐ Chất lượng cao nhất
```

### **Cách sử dụng**:
```
1. Chạy: node server.js
2. Mở: http://localhost:3001
3. Chơi game → Tự động dùng giọng tốt nhất!
```

### **Không cần**:
- ❌ Không cần cài đặt giọng
- ❌ Không cần chọn giọng
- ❌ Không cần config gì thêm

**Mọi thứ đã được tối ưu sẵn!** 🎉

---

## 📞 **HỖ TRỢ**

### **Nếu không nghe thấy giọng**:
1. Kiểm tra server có chạy không
2. Kiểm tra URL có đúng localhost:3001 không
3. Mở Console xem log
4. Xem file `AUDIO_GUIDE.md` để troubleshoot

### **Nếu muốn giọng khác**:
- Mở `test-voices.html` để nghe thử các giọng
- Hiện tại game tự động chọn giọng tốt nhất
- Có thể thêm tùy chọn chọn giọng trong tương lai

**Giọng hiện tại đã là tốt nhất cho trẻ em Việt Nam!** 🇻🇳✨
