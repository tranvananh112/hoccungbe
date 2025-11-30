# 🔧 HƯỚNG DẪN SETUP SUPABASE

## 📋 Bước 1: Tạo Tables trong Supabase

Vào **SQL Editor** trong Supabase Dashboard và chạy các câu lệnh sau:

### 1. Bảng `profiles` (Thông tin người dùng)

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'parent',
  total_stars INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sign_in_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 2. Bảng `user_progress` (Tiến độ học tập)

```sql
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  total_stars INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  words_learned TEXT[] DEFAULT '{}',
  owned_characters TEXT[] DEFAULT '{}',
  player_name TEXT,
  player_avatar TEXT DEFAULT '🐝',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own progress
CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3. Bảng `user_notes` (Ghi chú của Admin)

```sql
CREATE TABLE user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  note TEXT,
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (chỉ admin mới xem được)
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
```

### 4. Bảng `activity_logs` (Lịch sử hoạt động)

```sql
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  device_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own logs
CREATE POLICY "Users can read own logs"
  ON activity_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own logs
CREATE POLICY "Users can insert own logs"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 5. Function tự động tạo profile khi đăng ký

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, last_sign_in_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.last_sign_in_at
  );
  
  -- Log activity
  INSERT INTO public.activity_logs (user_id, action)
  VALUES (NEW.id, 'User registered');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 6. Function cập nhật last_sign_in

```sql
CREATE OR REPLACE FUNCTION public.handle_user_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET last_sign_in_at = NEW.last_sign_in_at
  WHERE id = NEW.id;
  
  -- Log activity
  INSERT INTO public.activity_logs (user_id, action)
  VALUES (NEW.id, 'User logged in');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.handle_user_login();
```

## 📋 Bước 2: Cấu hình Email Templates (Optional)

Vào **Authentication > Email Templates** để tùy chỉnh email xác nhận.

## 📋 Bước 3: Test

1. Mở `auth.html` và đăng ký tài khoản mới
2. Kiểm tra email xác nhận
3. Đăng nhập và chơi game
4. Dữ liệu sẽ tự động lưu vào Supabase

## 🔐 Admin Dashboard

- URL: `admin.html`
- Username: `Admin`
- Password: `093701`

## ⚠️ LƯU Ý BẢO MẬT

1. **KHÔNG** commit file chứa secret keys lên Git
2. Sử dụng `.env` file cho production
3. Enable RLS (Row Level Security) cho tất cả tables
4. Thay đổi admin password trong production

## 📊 Cấu trúc Database

```
auth.users (Supabase Auth)
  ↓
profiles (Thông tin cơ bản)
  ↓
user_progress (Tiến độ học tập)
```

## 🚀 Deploy

Khi deploy lên production:
1. Tạo file `.env` với keys
2. Cập nhật `supabase-config.js` để đọc từ `.env`
3. Enable email confirmation
4. Setup custom domain

---

✅ **Hoàn tất!** Hệ thống đã sẵn sàng sử dụng.
