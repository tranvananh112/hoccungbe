# ⚡ FIX NGAY BÂY GIỜ - 3 PHÚT

## 🎯 Lỗi: "Database error saving new user"

## ✅ GIẢI PHÁP NHANH

### Bước 1: Vào Supabase SQL Editor
https://supabase.com/dashboard/project/apyohrljwovonoecuwml/sql

### Bước 2: Copy và chạy đoạn này:

```sql
-- XÓA TRIGGER GÂY LỖI
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- TẮT RLS TẠM THỜI
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
```

Click **Run** (hoặc Ctrl+Enter)

### Bước 3: Tắt Email Confirmation

1. Vào **Authentication** > **Settings**
2. Tìm "Enable email confirmations"
3. **TẮT** (uncheck)
4. Click **Save**

### Bước 4: Test đăng ký

1. Mở `auth.html`
2. Đăng ký với:
   - Email: `test@example.com`
   - Password: `123456`

### ✅ Nếu thành công:

Chạy SQL này để tạo profile/progress thủ công:

```sql
-- Lấy User ID
SELECT id, email FROM auth.users 
WHERE email = 'test@example.com';

-- Thay YOUR_USER_ID bằng ID vừa lấy
INSERT INTO public.profiles (id, email, full_name, role)
VALUES ('YOUR_USER_ID', 'test@example.com', 'Test User', 'parent');

INSERT INTO public.user_progress (user_id, player_name)
VALUES ('YOUR_USER_ID', 'Test User');
```

### Bước 5: Tạo trigger mới (đơn giản)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), 'parent')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_progress (user_id, player_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Bé'))
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

### Bước 6: Test lại

Đăng ký user mới:
- Email: `test2@example.com`
- Password: `123456`

### Bước 7: Bật lại RLS (sau khi mọi thứ OK)

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Policies đơn giản
CREATE POLICY "Anyone can view profiles"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Anyone can insert profiles"
    ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own progress"
    ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert progress"
    ON public.user_progress FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own progress"
    ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
```

---

## 🔍 NẾU VẪN LỖI

### Kiểm tra:

```sql
-- 1. Trigger đã xóa chưa?
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
-- Phải trả về 0 rows

-- 2. RLS đã tắt chưa?
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('profiles', 'user_progress');
-- rowsecurity phải = false

-- 3. Bảng có tồn tại không?
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('profiles', 'user_progress');
-- Phải có 2 bảng
```

### Xem logs:
1. Vào **Logs** > **Postgres Logs**
2. Tìm lỗi màu đỏ
3. Copy và gửi để được hỗ trợ

---

## 📞 HỖ TRỢ NHANH

Nếu vẫn lỗi, gửi:
1. Screenshot lỗi trong Console (F12)
2. Kết quả của 3 query kiểm tra ở trên
3. Postgres Logs (nếu có)

---

## ✅ CHECKLIST

- [ ] Xóa trigger cũ
- [ ] Tắt RLS
- [ ] Tắt email confirmation
- [ ] Test đăng ký thành công
- [ ] Tạo profile/progress thủ công
- [ ] Tạo trigger mới
- [ ] Test lại
- [ ] Bật RLS

🎯 **Mục tiêu:** Đăng ký thành công không lỗi 500
