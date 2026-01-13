# Database Deployment Guide

## ⚠️ QUAN TRỌNG: Đọc trước khi chạy!

Migration này sẽ **XÓA TOÀN BỘ DATA** hiện tại trong database.

---

## Các bước thực hiện

### 1️⃣ Migration 100: Drop All Tables

**File:** `database/migrations/100_drop_all_tables.sql`

```sql
-- Copy toàn bộ nội dung file này
-- Paste vào Supabase SQL Editor
-- Click RUN
```

Kết quả: Tất cả tables bị xóa.

---

### 2️⃣ Migration 101: Create Clean Schema

**File:** `database/migrations/101_create_clean_schema.sql`

```sql
-- Copy toàn bộ nội dung file này
-- Paste vào Supabase SQL Editor
-- Click RUN
```

Kết quả: Tạo 5 tables mới:
- `employees`
- `projects`
- `tasks`
- `project_members`
- `task_templates`

---

### 3️⃣ Migration 102: Task Templates

**File:** `database/migrations/102_seed_task_templates.sql`

```sql
-- Copy toàn bộ nội dung file này
-- Paste vào Supabase SQL Editor
-- Click RUN
```

Kết quả: 20 task templates được tạo.

---

### 4️⃣ Seed 103: Minimal Data

**File:** `database/seeds/003_minimal_seed_data.sql`

```sql
-- Copy toàn bộ nội dung file này
-- Paste vào Supabase SQL Editor
-- Click RUN
```

Kết quả: 3 employees (admin + 2 test users).

---

### 5️⃣ Tạo Auth User

1. Vào **Authentication** → **Users**
2. Click **Add user**
3. Email: `admin@cic.vn`
4. Password: `Admin123!`
5. **Auto Confirm**: ✅
6. Click **Create user**

---

## Testing

1. Login vào app với `admin@cic.vn`
2. Tạo dự án mới
3. **Kiểm tra:** Dự án phải tự động có 20 tasks!
4. Test drag-drop Kanban
5. Test update task → project progress tự động cập nhật

---

## Rollback

Nếu có lỗi, chỉ cần chạy lại từ Migration 100.

---

## ✅ Success Indicators

- [ ] 5 tables created
- [ ] 20 task templates
- [ ] 3 employees
- [ ] Auto-task generation works
- [ ] Realtime updates work
