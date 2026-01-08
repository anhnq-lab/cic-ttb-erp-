# TÀI LIỆU MÔ TẢ ĐẶC TÍNH KỸ THUẬT VÀ TÍNH NĂNG PHẦN MỀM

## CIC.TTB.ERP - Hệ thống Quản lý Doanh nghiệp Xây dựng

**Phiên bản:** 1.0.0  
**Ngày cập nhật:** 04/01/2026  
**Nhà phát triển:** Công ty CP Tư vấn Xây dựng Chuyển đổi số (CIC)

---

## 1. TỔNG QUAN PHẦN MỀM

### 1.1. Giới thiệu

CIC.TTB.ERP là hệ thống quản lý doanh nghiệp toàn diện (Enterprise Resource Planning) được thiết kế đặc biệt cho ngành xây dựng và tư vấn thiết kế. Phần mềm tích hợp các module quản lý dự án, hợp đồng, nhân sự, khách hàng (CRM), và hỗ trợ trí tuệ nhân tạo (AI), giúp doanh nghiệp số hóa quy trình làm việc và nâng cao hiệu quả quản lý.

### 1.2. Mục tiêu phần mềm

- **Số hóa quy trình:** Chuyển đổi các quy trình thủ công sang digital
- **Tập trung dữ liệu:** Hợp nhất toàn bộ dữ liệu doanh nghiệp về một nền tảng
- **Tự động hóa:** Giảm thiểu công việc thủ công thông qua automation
- **Hỗ trợ quyết định:** Cung cấp báo cáo và phân tích thời gian thực
- **Tuân thủ quy định:** Đảm bảo tuân thủ Luật Xây dựng 58/2024/QH15 và các thông tư hướng dẫn

---

## 2. KIẾN TRÚC KỸ THUẬT

### 2.1. Technology Stack

| Thành phần | Công nghệ | Phiên bản |
|------------|-----------|-----------|
| **Frontend Framework** | React | 18.2.0 |
| **Ngôn ngữ lập trình** | TypeScript | 5.8.2 |
| **Build Tool** | Vite | 6.2.0 |
| **Routing** | React Router DOM | 6.22.3 |
| **Database/Backend** | Supabase (PostgreSQL) | 2.89.0 |
| **Charts & Visualization** | Recharts | 2.12.3 |
| **Icons** | Lucide React | 0.358.0 |
| **Gantt Chart** | gantt-task-react | 0.3.9 |
| **AI Integration** | Google Gemini API | - |

### 2.2. Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React + TypeScript)          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Pages  │  │Components│  │ Services │  │   Contexts   │  │
│  └─────────┘  └──────────┘  └──────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                        API LAYER                            │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐   │
│  │ Supabase Client│  │  Gemini API    │  │   REST APIs  │   │
│  └────────────────┘  └────────────────┘  └──────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    DATABASE (PostgreSQL)                    │
│  ┌─────────┐ ┌────────┐ ┌───────┐ ┌─────────┐ ┌─────────┐   │
│  │Employees│ │Projects│ │ Tasks │ │Contracts│ │Customers│   │
│  └─────────┘ └────────┘ └───────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.3. Cấu trúc thư mục dự án

```
CIC.TTB.ERP/
├── components/          # Các component tái sử dụng
│   ├── AIChatAssistant.tsx
│   ├── BIMModelViewer.tsx
│   ├── ProjectGantt.tsx
│   ├── ProjectKanban.tsx
│   ├── TaskModal.tsx
│   └── ...
├── pages/               # Các trang chính
│   ├── Dashboard.tsx
│   ├── ProjectList.tsx
│   ├── ContractList.tsx
│   ├── HRMList.tsx
│   ├── CRMList.tsx
│   └── ...
├── services/            # Lớp service xử lý business logic
│   ├── api.service.ts
│   ├── project.service.ts
│   ├── analytics.service.ts
│   ├── AIService.ts
│   └── ...
├── contexts/            # React Context cho state management
├── database/            # Database migrations và seeds
├── types/               # TypeScript interface definitions
├── utils/               # Tiện ích và helper functions
└── App.tsx              # Root component
```

---

## 3. DANH SÁCH TÍNH NĂNG CHI TIẾT

### 3.1. Module Dashboard (Bảng điều khiển)

#### 3.1.1. Tổng quan Dashboard

Dashboard cung cấp cái nhìn tổng quan về tình trạng hoạt động của doanh nghiệp thông qua các chỉ số KPI quan trọng.

**Các tính năng chính:**

| Tính năng | Mô tả |
|-----------|-------|
| **KPI Cards** | Hiển thị các chỉ số: Tổng giá trị hợp đồng, Dự án đang thực hiện, Tiến độ trung bình, Nhân viên |
| **Revenue Chart** | Biểu đồ doanh thu theo thời gian (AreaChart) |
| **Project Status Pie** | Biểu đồ tròn phân bố trạng thái dự án |
| **Contract Status Bar** | Biểu đồ cột trạng thái hợp đồng |
| **Cash Flow Forecast** | Dự báo dòng tiền theo tháng |
| **Top Performers** | Danh sách nhân viên hiệu suất cao |
| **Risk Alerts** | Cảnh báo rủi ro dự án |

#### 3.1.2. My Dashboard (Dashboard cá nhân)

Trang cá nhân hóa cho từng nhân viên:

- **Nhiệm vụ được giao:** Hiển thị các task đang được phân công
- **Tiến độ cá nhân:** Theo dõi KPI cá nhân
- **Lịch làm việc:** Hiển thị deadline và sự kiện quan trọng
- **Thông báo:** Nhận thông báo từ hệ thống

---

### 3.2. Module Quản lý Dự án (Project Management)

#### 3.2.1. Danh sách dự án (ProjectList)

**Các tính năng:**

| Tính năng | Mô tả |
|-----------|-------|
| **Xem danh sách** | Hiển thị tất cả dự án dạng bảng/lưới |
| **Tìm kiếm & Lọc** | Lọc theo trạng thái, nguồn vốn, khách hàng |
| **Tạo dự án mới** | Wizard tạo dự án với các bước hướng dẫn |
| **Import/Export** | Nhập/xuất dữ liệu Excel |
| **Quick Actions** | Xem, sửa, xóa dự án |

#### 3.2.2. Chi tiết dự án (ProjectDetail)

Giao diện chi tiết dự án bao gồm nhiều tab:

**Tab Thông tin (Info Tab):**
- Thông tin cơ bản: Mã, tên, khách hàng, địa điểm
- Thông tin kỹ thuật: Nhóm dự án, loại công trình, cấp công trình
- Quy mô, ngân sách, tiến độ
- Trạng thái chi tiết theo Luật 58/2024/QH15

**Tab Kế hoạch (Plan Tab):**
- Quản lý task theo phases
- Gantt Chart tương tác
- Kanban Board

**Tab Nhân sự (Personnel Tab):**
- Danh sách thành viên dự án
- Phân công vai trò (RACI)
- Thêm/xóa thành viên

**Tab Tài liệu (Documents Tab):**
- Quản lý tài liệu dự án
- Liên kết Google Drive
- Upload/download files

**Tab BIM Viewer:**
- Xem mô hình 3D BIM
- Model tree navigation
- Element properties panel

#### 3.2.3. RACI Matrix

Ma trận RACI phân công trách nhiệm theo phases dự án:

| Vai trò | Ký hiệu | Mô tả |
|---------|---------|-------|
| **R** (Responsible) | R | Người thực hiện |
| **A** (Accountable) | A | Người chịu trách nhiệm phê duyệt |
| **C** (Consulted) | C | Người được tham vấn |
| **I** (Informed) | I | Người được thông báo |

**Các vai trò trong hệ thống:**
- GĐTT (Giám đốc Trung tâm)
- PGĐTT (Phó Giám đốc Trung tâm)
- QLDA (Quản lý Dự án)
- QL BIM (Quản lý BIM)
- ĐPBM (Đại diện Bộ môn)
- TNDH (Trưởng nhóm điều hành)
- NDH (Nhóm điều hành)
- Admin
- Kế toán

---

### 3.3. Module Quản lý Công việc (Task Management)

#### 3.3.1. Danh sách công việc (TaskList)

**Các tính năng:**

| Tính năng | Mô tả |
|-----------|-------|
| **Dạng xem đa dạng** | Danh sách, Kanban, Calendar |
| **Tìm kiếm nâng cao** | Lọc theo dự án, người thực hiện, trạng thái |
| **Batch Actions** | Thao tác hàng loạt |
| **Drag & Drop** | Kéo thả thay đổi trạng thái |

#### 3.3.2. Chi tiết công việc (TaskModal)

**Thông tin task:**
- Mã task (code) theo format: `[GiaiDoan].[Loai].[BoMon].[STT]`
- Tên công việc
- Dự án liên quan
- Người thực hiện (assignee)
- Người kiểm tra (reviewer)
- Trạng thái, độ ưu tiên
- Ngày bắt đầu, deadline
- Tiến độ (%)
- Tags, comments, attachments

**Trạng thái công việc (theo Quy chế 40.20.4):**

| Mã | Trạng thái | Mô tả |
|----|------------|-------|
| OPEN | Mở | Công việc mới tạo |
| PENDING | Đang chờ | Đang chờ xử lý |
| S0 | Đang thực hiện | Đang triển khai |
| S1 | Phối hợp | Cần phối hợp các bộ phận |
| S3 | Duyệt nội bộ | Kiểm tra nội bộ |
| S4 | Lãnh đạo duyệt | Chờ lãnh đạo phê duyệt |
| S4.1 | Sửa theo LĐ | Sửa theo comment lãnh đạo |
| S5 | Đã duyệt | Đã duyệt nội bộ |
| S6 | Trình khách hàng | Gửi khách hàng review |
| S6.1 | Sửa theo KH | Sửa theo comment khách hàng |
| COMPLETED | Hoàn thành | Đóng công việc |

**Độ ưu tiên:**
- `CRITICAL`: Khẩn cấp
- `HIGH`: Cao
- `MEDIUM`: Trung bình
- `LOW`: Thấp

#### 3.3.3. Subtasks (Công việc con)

- Tạo danh sách công việc con
- Checkbox hoàn thành
- Phân công người thực hiện subtask
- Deadline riêng cho subtask

#### 3.3.4. Quality Checklists

- Danh sách kiểm tra chất lượng theo quy trình
- Đánh dấu hoàn thành từng item
- Ghi log người kiểm tra và thời gian

---

### 3.4. Module Quản lý Hợp đồng (Contract Management)

#### 3.4.1. Danh sách hợp đồng (ContractList)

**Tính năng chính:**
- Hiển thị toàn bộ hợp đồng
- Lọc theo trạng thái, khách hàng, thời gian
- Xem chi tiết hợp đồng
- Tạo hợp đồng mới

#### 3.4.2. Thông tin hợp đồng

**Thông tin cơ bản:**
- Mã hợp đồng, ngày ký
- Tên gói thầu, tên dự án
- Địa điểm, loại hợp đồng
- Luật áp dụng

**Thông tin các bên:**

| Bên A (Chủ đầu tư) | Bên B (Nhà thầu) |
|--------------------|------------------|
| Tên công ty | Tên công ty |
| Người đại diện | Người đại diện |
| Chức vụ | Chức vụ |
| Mã số thuế | Mã số thuế |
| Nhân viên phụ trách | Ngân hàng |

**Thông tin tài chính:**
- Tổng giá trị hợp đồng
- Bao gồm VAT hay không
- Tạm ứng
- Nguồn vốn (Ngân sách/Ngoài ngân sách)
- Giá trị đã thanh toán / Còn lại / WIP

**Thông tin tiến độ:**
- Thời gian thực hiện
- Ngày bắt đầu, ngày kết thúc
- Thời gian bảo hành

**Phạm vi công việc:**
- Danh sách công việc chính
- Định dạng file bàn giao
- Phương thức bàn giao
- Tiêu chuẩn nghiệm thu

**Nhân sự chủ chốt:**
- Danh sách nhân sự theo vai trò
- Liên kết với module HR

#### 3.4.3. Payment Milestones (Đợt thanh toán)

| Trường | Mô tả |
|--------|-------|
| Phase | Giai đoạn thanh toán |
| Condition | Điều kiện thanh toán |
| Percentage | % giá trị |
| Amount | Số tiền (VNĐ) |
| Due Date | Hạn thanh toán |
| Status | Trạng thái |
| Invoice Date | Ngày xuất hóa đơn |
| Acceptance Product | Sản phẩm nghiệm thu |

**Trạng thái thanh toán:**
- `PENDING`: Chưa thanh toán
- `INVOICED`: Đã xuất hóa đơn
- `PAID`: Đã thanh toán
- `OVERDUE`: Quá hạn
- `PARTIAL`: Thanh toán 1 phần

#### 3.4.4. Payment Transactions (Giao dịch thanh toán)

Theo dõi lịch sử thanh toán thực tế:
- Số hóa đơn GTGT
- Hình thức thanh toán (Chuyển khoản/Tiền mặt/Séc)
- Thuế suất VAT (8%/10%)
- Ghi chú, tài liệu đính kèm

---

### 3.5. Module Quản lý Nhân sự (HRM)

#### 3.5.1. Danh sách nhân viên (HRMList)

**Thông tin nhân viên:**

| Trường | Mô tả |
|--------|-------|
| id | Mã định danh |
| code | Mã nhân viên |
| name | Họ và tên |
| role | Chức danh |
| department | Phòng/Ban |
| email | Email công ty |
| phone | Số điện thoại |
| avatar | Ảnh đại diện |
| status | Trạng thái (Chính thức/Nghỉ phép/Thử việc) |
| joinDate | Ngày vào công ty |
| dob | Ngày sinh |
| degree | Bằng cấp |
| certificates | Chứng chỉ |
| skills | Kỹ năng |

**Tính năng:**
- Xem danh sách nhân viên theo phòng ban
- Tìm kiếm, lọc nhân viên
- Xem profile chi tiết
- Quản lý kỹ năng
- Liên kết với KPI cá nhân

---

### 3.6. Module CRM (Quản lý Khách hàng)

#### 3.6.1. Danh sách khách hàng (CRMList)

**Thông tin khách hàng:**

| Trường | Mô tả |
|--------|-------|
| code | Mã khách hàng |
| name | Tên công ty/tổ chức |
| shortName | Tên viết tắt |
| type | Loại (Client/Partner/Subcontractor) |
| category | Phân loại (RealEstate/StateBudget/Consulting/Construction/Other) |
| taxCode | Mã số thuế |
| representative | Người đại diện pháp luật |
| contactPerson | Người liên hệ chính |
| tier | Phân hạng (VIP/Gold/Standard) |
| totalProjectValue | Tổng giá trị dự án đã hợp tác |
| rating | Đánh giá (1-5 sao) |

#### 3.6.2. CRM Contacts (Liên hệ)

Quản lý danh sách liên hệ của từng khách hàng:
- Tên, chức vụ
- Email, điện thoại
- Đánh dấu liên hệ chính

#### 3.6.3. CRM Activities (Hoạt động)

Theo dõi lịch sử tương tác với khách hàng:
- Meeting (Họp)
- Call (Cuộc gọi)
- Email
- Meal (Tiếp khách)
- Note (Ghi chú)

#### 3.6.4. CRM Opportunities (Cơ hội)

Quản lý pipeline bán hàng:

| Giai đoạn | Mô tả |
|-----------|-------|
| New | Cơ hội mới |
| Qualification | Đánh giá |
| Proposal | Đề xuất |
| Negotiation | Đàm phán |
| Won | Thắng thầu |
| Lost | Mất cơ hội |

---

### 3.7. Module Báo cáo & Phân tích (Analytics)

#### 3.7.1. Dashboard Summary

Service `AnalyticsService` cung cấp các metrics:

**Financial Metrics:**
- Tổng giá trị hợp đồng
- Tổng giá trị đã thanh toán
- Công nợ phải thu
- Giá trị WIP
- Doanh thu theo quý/khách hàng
- Tiến độ thanh toán

**Project Metrics:**
- Tổng số dự án
- Phân bố theo trạng thái
- Phân bố theo nguồn vốn
- Tiến độ trung bình
- Dự án chậm tiến độ
- Dự án theo quản lý

**Contract Metrics:**
- Tổng số hợp đồng
- Giá trị trung bình
- Top hợp đồng theo giá trị
- Phân bố theo năm

**HR Metrics:**
- Tổng số nhân viên
- Phân bố theo phòng ban
- Phân bố theo trạng thái
- Thời gian làm việc trung bình

**CRM Metrics:**
- Tổng số khách hàng
- Phân bố theo tier
- Giá trị pipeline
- Top khách hàng

**Quality Metrics:**
- Tỷ lệ bàn giao đúng hạn
- Tỷ lệ làm lại (rework)
- Thời gian hoàn thành trung bình

#### 3.7.2. Reports Page

Trang báo cáo tổng hợp với các biểu đồ:
- Revenue trends
- Project distribution
- Cash flow forecast
- Performance comparison

---

### 3.8. Module Chính sách & Quy trình (Policy)

#### 3.8.1. PolicyViewer

Xem và quản lý các quy chế công ty:
- Quy chế đi công tác
- Quy định kỷ luật ngày công
- Kế hoạch công tác
- Các quy trình SOP

---

### 3.9. Module Kiến thức (Knowledge Base)

#### 3.9.1. KnowledgeBase Page

Cơ sở tri thức doanh nghiệp:
- Lessons Learned từ các dự án
- Best practices
- Tài liệu hướng dẫn
- FAQ

---

### 3.10. Tính năng BIM Viewer

#### 3.10.1. Xem mô hình 3D

**BIMModelViewer Component:**

| Tính năng | Mô tả |
|-----------|-------|
| 3D Rendering | Hiển thị mô hình 3D tương tác |
| Model Tree | Cây cấu trúc mô hình theo IFC |
| Element Selection | Chọn và highlight elements |
| Properties Panel | Xem thuộc tính element (name, type, GUID, material) |
| Visibility Toggle | Bật/tắt hiển thị các nhóm đối tượng |
| Zoom/Pan/Rotate | Điều khiển camera |
| Fullscreen Mode | Chế độ toàn màn hình |

**Element Properties:**
- ID, Name, Type
- GUID
- Geometry Type
- IFC Element/Element Type/Class
- Material
- Dimensions (Height, Width, Length)

---

### 3.11. Tính năng AI Chat Assistant

#### 3.11.1. AIChatAssistant Component

Trợ lý AI tích hợp trong ứng dụng:

**Tính năng:**
- Chat interface với streaming response
- Suggestion chips (gợi ý câu hỏi)
- Markdown formatting
- Resize/minimize window
- Context-aware responses

**Tích hợp Gemini API:**
- GeminiService cho API calls
- AIService cho business logic
- Xử lý context từ dữ liệu dự án

**Ví dụ câu hỏi mẫu:**
- "Dự án Cầu Thủ Thiêm 4 đang thế nào?"
- "Ai là quản lý dự án P-007?"
- "Quy trình nghiệm thu cốt thép?"
- "Tổng ngân sách các dự án?"

---

## 4. CƠ SỞ DỮ LIỆU

### 4.1. Sơ đồ Database

Hệ thống sử dụng PostgreSQL thông qua Supabase với 14 bảng chính:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   employees  │     │   projects   │     │   customers  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       ├────────────────────┼────────────────────┤
       │                    │                    │
  ┌────┴────┐         ┌─────┴─────┐        ┌─────┴─────┐
  │  tasks  │         │ contracts │        │crm_contacts│
  └────┬────┘         └─────┬─────┘        └───────────┘
       │                    │
  ┌────┴────┐         ┌─────┴──────┐
  │subtasks │         │payment_    │
  │comments │         │milestones  │
  └─────────┘         └────────────┘
```

### 4.2. Danh sách bảng

| Bảng | Mô tả | Số cột |
|------|-------|--------|
| employees | Nhân viên | 16 |
| customers | Khách hàng | 20 |
| projects | Dự án | 25 |
| contracts | Hợp đồng | 35 |
| tasks | Công việc | 18 |
| subtasks | Công việc con | 6 |
| task_comments | Bình luận task | 7 |
| payment_milestones | Đợt thanh toán | 15 |
| payment_transactions | Giao dịch | 12 |
| crm_contacts | Liên hệ CRM | 7 |
| crm_activities | Hoạt động CRM | 8 |
| crm_opportunities | Cơ hội | 8 |
| project_members | Thành viên dự án | 5 |
| contract_personnel | Nhân sự hợp đồng | 6 |

### 4.3. Row Level Security (RLS)

Supabase RLS đảm bảo:
- Authenticated users có quyền SELECT/INSERT/UPDATE
- Dữ liệu được bảo vệ ở database level
- Không có anonymous access

---

## 5. BẢO MẬT

### 5.1. Authentication

- Supabase Auth với email/password
- Protected routes với `ProtectedRoute` component
- Session management
- JWT tokens

### 5.2. Authorization

- Role-based access (thông qua employee roles)
- Row Level Security policies
- API key management (.env)

---

## 6. HIỆU NĂNG

### 6.1. Tối ưu Frontend

- Lazy loading components
- useMemo/useCallback hooks
- Virtual scrolling cho danh sách lớn
- Debouncing search inputs

### 6.2. Tối ưu Database

- Indexes trên các cột thường query
- Proper foreign key relationships
- Trigger auto-update timestamps

---

## 7. HƯỚNG DẪN CÀI ĐẶT

### 7.1. Yêu cầu hệ thống

- Node.js >= 18.0
- npm hoặc yarn
- Supabase account (cho production)

### 7.2. Cài đặt development

```bash
# Clone repository
git clone <repository-url>
cd CIC.TTB.ERP

# Cài đặt dependencies
npm install

# Cấu hình environment
cp .env.local.example .env.local
# Chỉnh sửa GEMINI_API_KEY và SUPABASE credentials

# Chạy development server
npm run dev
```

### 7.3. Build production

```bash
npm run build
npm run preview
```

---

## 8. PHỤ LỤC

### 8.1. Danh sách API Endpoints (Supabase)

| Endpoint | Phương thức | Mô tả |
|----------|-------------|-------|
| /employees | GET/POST | Quản lý nhân viên |
| /projects | GET/POST/PATCH | Quản lý dự án |
| /contracts | GET/POST/PATCH | Quản lý hợp đồng |
| /tasks | GET/POST/PATCH/DELETE | Quản lý công việc |
| /customers | GET/POST/PATCH | Quản lý khách hàng |

### 8.2. Tuân thủ quy định

Phần mềm được thiết kế tuân thủ:
- **Luật Xây dựng 58/2024/QH15**
- **Thông tư 06/2021/TT-BXD** về phân cấp công trình
- **Nghị định về đầu tư công** (phân loại nguồn vốn)

### 8.3. Liên hệ hỗ trợ

- **Email:** support@cic-digital.vn
- **Website:** https://cic-digital.vn
- **Hotline:** 1900-xxxx

---

**© 2026 Công ty CP Tư vấn Xây dựng Chuyển đổi số (CIC). Bảo lưu mọi quyền.**
