# Hướng Dẫn Deploy Migrations & Seeds

Các bước để deploy database changes lên Supabase Production.

---

## Bước 1: Backup Database (Quan trọng!)

Trước khi chạy bất kỳ migration nào, **LUÔN LUÔN backup** database hiện tại:

1. Vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của anh
3. Vào **Database** → **Backups**
4. Bấm **Create backup** (hoặc export manual)

---

## Bước 2: Chạy Migrations

### Cách 1: Supabase SQL Editor (Khuyến nghị)

1. Vào **SQL Editor** trong Supabase Dashboard
2. Copy nội dung từng file migration theo thứ tự:

```
✅ 014_enhance_tasks_table.sql
✅ 015_add_indexes.sql
✅ 016_project_members_table.sql
✅ 017_production_rls_policies.sql
```

3. Paste vào SQL Editor và bấm **RUN**
4. Kiểm tra không có lỗi (success message)
5. Lặp lại cho migration tiếp theo

### Cách 2: Supabase CLI (Tự động hơn)

```bash
# Nếu chưa cài Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref <your-project-ref>

# Push migrations
supabase db push
```

---

## Bước 3: Tạo Admin User trong Supabase Auth

**QUAN TRỌNG:** Seed script chỉ tạo employee record, anh cần tạo Supabase Auth user thủ công:

1. Vào **Authentication** → **Users**
2. Bấm **Add user** → **Create new user**
3. Nhập:
   - **Email**: `admin@cic.vn`
   - **Password**: `Admin123!` (hoặc password anh muốn)
   - **Auto Confirm User**: ✅ (tick)
4. Bấm **Create user**

---

## Bước 4: Chạy Seed Script

1. Vào **SQL Editor**
2. Copy toàn bộ nội dung file `database/seeds/001_master_and_demo_data.sql`
3. Paste và bấm **RUN**
4. Kiểm tra message: "✅ Master data và demo data đã được seed thành công!"

---

## Bước 5: Verification (Kiểm tra)

### 5.1. Kiểm tra Tables

Vào **Table Editor** và verify:
- ✅ `tasks` table có đủ columns mới (phase, description, estimated_hours...)
- ✅ `project_members` table đã được tạo
- ✅ Indexes đã được tạo (xem trong **Database** → **Indexes**)

### 5.2. Kiểm tra Data

- ✅ Bảng `employees`: Có 5 records (Admin + 4 demo users)
- ✅ Bảng `projects`: Có 3 demo projects
- ✅ Bảng `tasks`: Có 3 demo tasks
- ✅ Bảng `project_members`: Có team assignments

### 5.3. Test Login

1. Mở app production (Vercel URL)
2. Login với `admin@cic.vn` / `Admin123!`
3. Verify:
   - Thấy 3 projects trong danh sách
   - Vào project xem tasks
   - Test kéo thả task trên Kanban

---

## Bước 6: Test RLS Policies

### Test với Admin user:
- ✅ Có thể tạo/sửa/xóa projects
- ✅ Có thể tạo/sửa/xóa tasks
- ✅ Thấy tất cả data

### Test với Regular user (nếu tạo thêm):
- ✅ Chỉ thấy projects mình là member
- ✅ Chỉ sửa được tasks của mình hoặc tasks trong project mình quản lý
- ❌ Không xóa được projects

---

## Troubleshooting

### Lỗi: "relation already exists"
➜ Migration đã chạy rồi. Skip hoặc check xem table/column đã có chưa.

### Lỗi: "foreign key constraint"
➜ Chạy migrations sai thứ tự. Phải chạy 014 trước 016.

### Lỗi: "permission denied"
➜ RLS policies quá strict. Check lại policies trong migration 017.

### Data không hiện trong app
➜ Check RLS policies. User có thể không có quyền SELECT.

---

## Rollback (Nếu cần)

Nếu có vấn đề, restore từ backup:

1. Vào **Database** → **Backups**
2. Chọn backup gần nhất
3. Bấm **Restore**

---

## Next Steps

Sau khi Deploy thành công:

1. ✅ Test toàn bộ tính năng CRUD
2. ✅ Monitor logs trong 24h đầu
3. ✅ Tạo thêm real users (không phải demo)
4. ✅ Import dữ liệu thật của anh
5. ✅ Setup backup schedule (weekly manual hoặc upgrade Pro)

---

## Quick Reference Commands

```bash
# Backup via CLI
supabase db dump -f backup_$(date +%Y%m%d).sql

# Run single migration
supabase db push --db-url <your-db-url> --file migrations/014_enhance_tasks_table.sql

# Check migration status
supabase migration list
```

---

**Lưu ý cuối:** Nếu gặp bất kỳ lỗi nào, STOP ngay và restore backup. Không tiếp tục migration cho đến khi fix được lỗi.
