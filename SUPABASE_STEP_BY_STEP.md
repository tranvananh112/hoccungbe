# 📝 Hướng Dẫn Chạy SQL Từng Bước

## ⚠️ Quan Trọng

Nếu file SQL lớn bị lỗi, hãy chạy từng bước một theo hướng dẫn này.

## 🎯 Mục Tiêu

Sau khi hoàn thành, admin sẽ:
- ✅ Hiển thị đúng email của users
- ✅ Hiển thị đúng số sao và xu
- ✅ Hiển thị trạng thái online/offline

## 📋 Cách 1: Chạy File Simple (Khuyến Nghị)

### Bước 1: Mở Supabase SQL Editor

1. Vào https://supabase.com
2. Chọn project của bạn
3. Click **SQL Editor** ở sidebar bên trái
4. Click **New query**

### Bước 2: Copy & Paste

1. Mở file `SUPABASE_ADMIN_FIX_SIMPLE.sql`
2. Copy toàn bộ nội dung
3. Paste vào SQL Editor
4. Click **Run** (hoặc Ctrl + Enter)

### Bước 3: Kiểm Tra

Chạy các query test:

```sql
-- Test 1: Xem profiles
SELECT * FROM profiles LIMIT 5;

-- Test 2: Xem user_progress  
SELECT * FROM user_progress LIMIT 5;

-- Test 3: Xem view
SELECT * FROM admin_users_simple;

-- Test 4: Xem function
SELECT * FROM get_all_users_simple();
```

Nếu tất cả đều chạy OK → Hoàn tất! Chuyển sang Bước 4.

### Bước 4: Test Admin Dashboard

1. Mở `admin.html`
2. Clear cache (Ctrl + Shift + R)
3. Đăng nhập admin
4. Kiểm tra trang Người dùng

## 📋 Cách 2: Chạy Từng Lệnh (Nếu Cách 1 Lỗi)

### Lệnh 1: Thêm Columns

```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS username TEXT;
```

**Kết quả mong đợi**: "Success. No rows returned"

---

### Lệnh 2: Tạo Function

```sql
CREATE OR REPLACE FUNCTION get_all_users_simple()
RETURNS TABLE (
    id UUID,
    email TEXT,
    username TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        COALESCE(p.email, 'N/A') as email,
        COALESCE(p.full_name, p.username, up.player_name, 'User') as username,
        p.created_at
    FROM public.profiles p
    LEFT JOIN public.user_progress up ON up.user_id = p.id
    ORDER BY p.created_at DESC;
END;
$$;
```

**Kết quả mong đợi**: "Success. No rows returned"

---

### Lệnh 3: Grant Permissions

```sql
GRANT EXECUTE ON FUNCTION get_all_users_simple() TO anon;
GRANT EXECUTE ON FUNCTION get_all_users_simple() TO authenticated;
```

**Kết quả mong đợi**: "Success. No rows returned"

---

### Lệnh 4: Tạo View

```sql
CREATE OR REPLACE VIEW admin_users_simple AS
SELECT 
    p.id,
    COALESCE(p.email, 'N/A') as email,
    COALESCE(p.full_name, p.username, up.player_name, 'User') as username,
    COALESCE(up.total_stars, 0) as total_stars,
    COALESCE(up.coins, 0) as coins,
    COALESCE(up.current_level, 1) as current_level,
    p.created_at
FROM public.profiles p
LEFT JOIN public.user_progress up ON up.user_id = p.id
ORDER BY p.created_at DESC;
```

**Kết quả mong đợi**: "Success. No rows returned"

---

### Lệnh 5: Grant Select on View

```sql
GRANT SELECT ON admin_users_simple TO anon;
GRANT SELECT ON admin_users_simple TO authenticated;
```

**Kết quả mong đợi**: "Success. No rows returned"

---

### Lệnh 6: Test

```sql
SELECT * FROM admin_users_simple;
```

**Kết quả mong đợi**: Danh sách users với email, username, stars, coins

## 🐛 Xử Lý Lỗi

### Lỗi: "permission denied for schema auth"

**Nguyên nhân**: Không có quyền access auth.users

**Giải pháp**: Dùng phương pháp Simple (không cần access auth.users)

---

### Lỗi: "relation profiles does not exist"

**Nguyên nhân**: Chưa có bảng profiles

**Giải pháp**: Chạy lệnh tạo bảng:

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    username TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'parent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);
```

---

### Lỗi: "function already exists"

**Nguyên nhân**: Function đã tồn tại

**Giải pháp**: Bỏ qua lỗi này, hoặc dùng `CREATE OR REPLACE`

---

### Lỗi: "view already exists"

**Nguyên nhân**: View đã tồn tại

**Giải pháp**: Bỏ qua lỗi này, hoặc dùng `CREATE OR REPLACE`

---

### Profiles table rỗng?

**Kiểm tra**:
```sql
SELECT COUNT(*) FROM profiles;
```

**Nếu = 0**: Chưa có user nào, hoặc chưa sync

**Giải pháp**: Đăng ký user mới hoặc chạy manual insert:

```sql
-- Lấy user_id từ user_progress
SELECT DISTINCT user_id FROM user_progress;

-- Insert vào profiles (thay YOUR_USER_ID)
INSERT INTO profiles (id, username, email, created_at)
VALUES (
    'YOUR_USER_ID',
    'Test User',
    'test@example.com',
    NOW()
)
ON CONFLICT (id) DO NOTHING;
```

## ✅ Kiểm Tra Hoàn Tất

Chạy query này để kiểm tra:

```sql
SELECT 
    (SELECT COUNT(*) FROM profiles) as profiles_count,
    (SELECT COUNT(*) FROM user_progress) as progress_count,
    (SELECT COUNT(*) FROM admin_users_simple) as view_count,
    (SELECT COUNT(*) FROM get_all_users_simple()) as function_count;
```

**Kết quả mong đợi**:
- profiles_count > 0
- progress_count > 0  
- view_count > 0
- function_count > 0

Nếu tất cả > 0 → Hoàn tất! ✅

## 🎯 Bước Tiếp Theo

1. Clear cache trình duyệt (Ctrl + Shift + R)
2. Mở admin.html
3. Đăng nhập admin (Admin/093701)
4. Vào trang Người dùng
5. Kiểm tra:
   - ✅ Email hiển thị
   - ✅ Sao và xu hiển thị đúng
   - ✅ Trạng thái online/offline

## 📞 Vẫn Gặp Lỗi?

1. Chụp màn hình lỗi trong SQL Editor
2. Kiểm tra Console (F12) trong admin.html
3. Chạy query debug:

```sql
-- Debug 1: Xem structure
\d profiles
\d user_progress

-- Debug 2: Xem data
SELECT * FROM profiles LIMIT 1;
SELECT * FROM user_progress LIMIT 1;

-- Debug 3: Xem functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%user%';

-- Debug 4: Xem views
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';
```

---

**Phiên bản**: 2.2  
**Ngày cập nhật**: 2024  
**Tác giả**: Kiro AI Assistant
