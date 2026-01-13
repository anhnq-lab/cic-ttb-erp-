# CIC.TTB.ERP - Deployment Guide

## 📋 Tổng Quan

Hướng dẫn chi tiết để deploy ứng dụng **CIC.TTB.ERP** lên **Vercel** với database **Supabase**.

---

## 🚀 Bước 1: Tạo và Cấu Hình Supabase Project

### 1.1. Tạo Project Mới

1. Truy cập [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Điền thông tin:
   - **Name**: `cic-ttb-erp` (hoặc tên bạn muốn)
   - **Database Password**: Tạo password mạnh và lưu lại
   - **Region**: Chọn `Southeast Asia (Singapore)` hoặc gần nhất
4. Click **"Create new project"** và đợi ~2 phút

### 1.2. Lấy Thông Tin Kết Nối

Sau khi project được tạo:

1. Vào **Settings** → **API**
2. Copy các thông tin sau:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGci...` (key dài)

### 1.3. Chạy Database Migrations

Bạn có 2 cách để chạy migrations:

#### Cách 1: Sử dụng SQL Editor (Khuyến nghị)

1. Vào **SQL Editor** trong Supabase Dashboard
2. Chạy tuần tự các file trong thư mục `database/migrations/`:

```bash
# Thứ tự chạy (QUAN TRỌNG):
001_initial_schema.sql          # Schema cơ bản
002_seed_data.sql              # Dữ liệu mẫu ban đầu
003_fix_subtasks_fk.sql        # Fix foreign keys
004_fix_and_seed.sql           # Fix và seed thêm
005_anon_write_policies.sql    # RLS policies
006_restore_functional_data.sql
007_comprehensive_seed_data.sql
008_raci_templates.sql
009_fix_project_members_rls.sql
010_seed_fixed_employees.sql
011_task_management_enhancements.sql
012_task_seed_data.sql
013_disable_rls_for_tasks.sql
```

**Lưu ý**: Copy nội dung từng file, paste vào SQL Editor, và click **"Run"**.

#### Cách 2: Sử dụng Supabase CLI (Nâng cao)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 1.4. Verify Database

Sau khi chạy migrations, kiểm tra:

1. Vào **Table Editor**
2. Đảm bảo các bảng sau tồn tại:
   - `projects`
   - `tasks`
   - `employees`
   - `contracts`
   - `bidding_packages`
   - `payments`
   - `contractors`
   - `project_members`
   - `raci_matrix`
   - v.v.

---

## 🔑 Bước 2: Lấy Google Gemini API Key

1. Truy cập [https://ai.google.dev/](https://ai.google.dev/)
2. Click **"Get API Key"**
3. Tạo API key mới hoặc dùng key có sẵn
4. Copy và lưu lại key có dạng `AIzaSy...`

---

## 🌐 Bước 3: Deploy lên Vercel

### 3.1. Chuẩn Bị Repository

Đảm bảo code đã được push lên GitHub:

```bash
git add .
git commit -m "chore: Prepare for Vercel deployment"
git push origin main
```

### 3.2. Import Project vào Vercel

1. Truy cập [https://vercel.com/new](https://vercel.com/new)
2. Login bằng GitHub account
3. Import repository `anhnq-lab/cic-ttb-erp-`
4. Vercel sẽ tự động detect dự án Vite

### 3.3. Cấu Hình Environment Variables

Trong màn hình **Configure Project**, thêm các biến môi trường:

| Key | Value | Example |
|-----|-------|---------|
| `VITE_SUPABASE_URL` | URL từ Supabase Settings → API | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Anon key từ Supabase Settings → API | `eyJhbGci...` |
| `VITE_GEMINI_API_KEY` | API key từ Google AI Studio | `AIzaSy...` |

**Lưu ý**: Click **"Add"** sau mỗi biến.

### 3.4. Deploy

1. Click **"Deploy"**
2. Đợi ~2-3 phút
3. Sau khi deploy xong, bạn sẽ có URL dạng: `https://cic-ttb-erp.vercel.app`

---

## ✅ Bước 4: Verify Deployment

### 4.1. Kiểm Tra Cơ Bản

1. Truy cập URL Vercel của bạn
2. Mở **DevTools** (F12) → **Console**
3. Không có lỗi về Supabase connection
4. Thấy log: `✅ Supabase configured successfully`

### 4.2. Test Chức Năng

- [ ] **Login**: Đăng nhập thành công
- [ ] **Dashboard**: Hiển thị dữ liệu từ Supabase
- [ ] **Projects**: Load danh sách dự án
- [ ] **Tasks**: Tạo/sửa/xóa task
- [ ] **Employees**: Hiển thị danh sách nhân viên
- [ ] **AI Chatbot**: Hỏi đáp với Gemini AI

### 4.3. Kiểm Tra Database

1. Mở **Supabase Dashboard** → **Table Editor**
2. Kiểm tra bảng `tasks`, `projects`, etc. có dữ liệu
3. Thử tạo 1 task mới trên ứng dụng
4. Refresh Table Editor, task mới xuất hiện trong database

---

## 🔧 Bước 5: Troubleshooting

### Lỗi: "Supabase not configured"

**Nguyên nhân**: Thiếu hoặc sai environment variables

**Giải pháp**:
1. Vào **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Kiểm tra `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`
3. Đảm bảo có prefix `VITE_`
4. Redeploy: **Deployments** → **...** → **Redeploy**

### Lỗi: "Failed to fetch" hoặc CORS

**Nguyên nhân**: Supabase RLS policies quá strict

**Giải pháp**:
1. Vào **Supabase** → **Authentication** → **Policies**
2. Disable RLS tạm thời để test hoặc add policy:
   ```sql
   -- Allow anonymous read on projects
   CREATE POLICY "Allow public read access" ON projects
   FOR SELECT USING (true);
   ```

### Lỗi: 404 khi refresh trang

**Nguyên nhân**: Thiếu SPA routing config (đã fix trong `vercel.json`)

**Giải pháp**: Đảm bảo file `vercel.json` có:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Gemini AI không hoạt động

**Nguyên nhân**: Thiếu hoặc sai `VITE_GEMINI_API_KEY`

**Giải pháp**:
1. Verify API key tại [https://ai.google.dev/](https://ai.google.dev/)
2. Add lại biến môi trường trên Vercel
3. Redeploy

---

## 🎯 Bước 6: Cấu Hình Custom Domain (Tùy chọn)

1. Vào **Vercel Dashboard** → **Settings** → **Domains**
2. Add domain của bạn (ví dụ: `erp.cic.com.vn`)
3. Follow hướng dẫn cấu hình DNS
4. Chờ domain được verify (~5-10 phút)

---

## 📊 Monitoring & Analytics

### Vercel Analytics

Vercel tự động cung cấp:
- **Performance metrics**: Core Web Vitals
- **Error tracking**: Runtime errors
- **Deployment logs**: Build logs chi tiết

Truy cập: **Vercel Dashboard** → **Analytics**

### Supabase Monitoring

Theo dõi database performance:
- **Database** → **Database Health**
- **API Logs**
- **Query Performance**

---

## 🔄 Continuous Deployment

Sau khi setup xong, mỗi khi push code lên GitHub:

```bash
git add .
git commit -m "feat: Add new feature"
git push origin main
```

Vercel sẽ **tự động**:
1. Detect changes
2. Build lại project
3. Deploy production
4. Thông báo kết quả qua email/Slack

---

## 📝 Checklist Hoàn Thành

- [ ] Supabase project đã tạo
- [ ] Database migrations đã chạy
- [ ] Gemini API key đã có
- [ ] Repository đã push lên GitHub
- [ ] Vercel project đã import
- [ ] Environment variables đã cấu hình
- [ ] Deployment thành công
- [ ] Test các tính năng chính
- [ ] Database có dữ liệu
- [ ] AI Chatbot hoạt động

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Check **Vercel Deployment Logs**
2. Check **Browser Console** (F12)
3. Check **Supabase Logs**
4. Liên hệ team để được hỗ trợ

---

**Lưu ý**: Document này được tạo tự động. Update thường xuyên khi có thay đổi về kiến trúc hoặc deployment process.
