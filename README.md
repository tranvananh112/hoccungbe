# 🎮 Học Cùng Bé - Trò Chơi Giáo Dục

> Hệ thống trò chơi giáo dục thông minh dành cho trẻ em

## 🚀 Demo Live
- **Website:** https://tranvananh112.github.io/hoccungbe/
- **Candy Crush:** https://tranvananh112.github.io/hoccungbe/src/games/candy-crush/candy-crush.html

## 📁 Cấu Trúc Project

```
📦 hoccungbe/
├── 📄 index.html                    # Trang chủ chính
├── 📄 README.md                     # Tài liệu này
├── 📄 package.json                  # Dependencies
├── 📁 src/                          # Source code chính
│   ├── 📁 games/                    # Các trò chơi
│   │   ├── 📁 candy-crush/          # Game Candy Crush
│   │   │   └── 📄 candy-crush.html  # All-in-one file
│   │   └── 📁 mini-games/           # Mini games khác
│   ├── 📁 admin/                    # Quản trị viên
│   ├── 📁 parent/                   # Dashboard phụ huynh
│   ├── 📁 components/               # Components dùng chung
│   └── 📁 data/                     # Dữ liệu game
├── 📁 assets/                       # Tài nguyên tĩnh
│   ├── 📁 css/                      # Stylesheets
│   ├── 📁 js/                       # JavaScript modules
│   └── 📁 sounds/                   # File âm thanh
├── 📁 docs/                         # Tài liệu
└── 📁 scripts/                      # Build scripts
```

## 🎯 Tính Năng Chính

### 🍬 Candy Crush Saga
- ✅ **Giao diện giống bản gốc** - Header hồng, stars, lives, boosters
- ✅ **Mobile-first** - Responsive hoàn hảo trên mọi thiết bị
- ✅ **Audio system** - Âm thanh tự unlock trên mobile
- ✅ **Touch & Mouse** - Hỗ trợ cả touch và mouse
- ✅ **Level progression** - Hệ thống level tăng dần độ khó
- ✅ **Lives system** - 5 mạng, mất mạng khi thua
- ✅ **Star rating** - 1-3 sao tùy điểm số
- ✅ **Boosters** - Hammer, Hand, Lollipop, Shuffle
- ✅ **All-in-one file** - Không cần file CSS/JS riêng

### 🎮 Mini Games
- Tập hợp các trò chơi nhỏ bổ ích
- Phát triển tư duy logic
- Giao diện thân thiện trẻ em

### 👨‍💼 Admin Dashboard
- Quản lý người dùng
- Thống kê analytics
- Cấu hình hệ thống

### 👨‍👩‍👧‍👦 Parent Dashboard
- Theo dõi tiến độ con em
- Tạo bài học tùy chỉnh
- Báo cáo chi tiết

## 🛠️ Công Nghệ

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Responsive:** Mobile-first design
- **Audio:** Web Audio API với mobile unlock
- **Animation:** CSS3 + Canvas
- **Icons:** Unicode Emoji (không cần font library)
- **Database:** Supabase (optional)

## 🚀 Cài Đặt & Chạy

### 1. Clone Repository
```bash
git clone https://github.com/tranvananh112/hoccungbe.git
cd hoccungbe
```

### 2. Chạy Local Server
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

### 3. Mở Trình Duyệt
```
http://localhost:8000
```

## 📱 Hỗ Trợ Thiết Bị

- ✅ **Desktop:** Chrome, Firefox, Safari, Edge
- ✅ **Mobile:** iOS Safari, Android Chrome
- ✅ **Tablet:** iPad, Android tablets
- ✅ **PWA:** Có thể cài đặt như app

## 🎨 Thiết Kế

- **Màu sắc:** Gradient hồng-xanh pastel
- **Font:** Poppins (Google Fonts)
- **Icons:** Unicode Emoji
- **Animation:** Smooth transitions
- **Responsive:** Breakpoints 768px, 480px

## 🔧 Development

### File Structure
- **All-in-one files:** Mỗi game là 1 file HTML hoàn chỉnh
- **Modular CSS:** Tách riêng theo component
- **Vanilla JS:** Không dependency framework
- **Mobile-first:** Thiết kế từ mobile lên desktop

### Code Style
- **Clean code:** Dễ đọc, dễ maintain
- **Comments:** Tiếng Việt cho dễ hiểu
- **Performance:** Tối ưu cho mobile
- **Accessibility:** Thân thiện với trẻ em

## 📈 Roadmap

- [ ] Thêm nhiều mini games
- [ ] Multiplayer mode
- [ ] Offline support (PWA)
- [ ] Voice commands
- [ ] AI tutor
- [ ] Gamification system

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👨‍💻 Author

**Trần Văn Anh**
- GitHub: [@tranvananh112](https://github.com/tranvananh112)
- Website: https://tranvananh112.github.io/hoccungbe/

---

⭐ **Star repo này nếu bạn thấy hữu ích!**