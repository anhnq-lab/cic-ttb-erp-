import { Task, TaskStatus, TaskPriority } from '../types';

// Sample tasks for projects based on BIM workflow
export const SAMPLE_TASKS: Task[] = [
    // =============================================
    // P-001: Cơ sở nghiên cứu khối các viện nghiên cứu xã hội
    // =============================================
    {
        id: "T-001-01",
        code: "TKBVTC.ARC.001",
        name: "Dựng mô hình Kiến trúc LOD 350",
        projectId: "P-001",
        assignee: { id: "NV019", name: "Vũ Ngọc Thủy", avatar: "https://ui-avatars.com/api/?name=Vũ+Ngọc+Thủy&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-01-20",
        dueDate: "2025-03-20",
        progress: 75,
        tags: ["Revit", "Architecture", "LOD350"],
        phase: "Triển khai Hỗ trợ QLDA"
    },
    {
        id: "T-001-02",
        code: "TKBVTC.STR.001",
        name: "Dựng mô hình Kết cấu LOD 350",
        projectId: "P-001",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-02-01",
        dueDate: "2025-04-01",
        progress: 40,
        tags: ["Revit", "Structure", "LOD350"],
        phase: "Triển khai Hỗ trợ QLDA"
    },
    {
        id: "T-001-03",
        code: "TKBVTC.MEP.001",
        name: "Dựng mô hình MEP LOD 350",
        projectId: "P-001",
        assignee: { id: "NV018", name: "Nguyễn Bá Nhiệm", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Bá+Nhiệm&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S1, // CHANGED to S1 - Phối hợp
        priority: TaskPriority.MEDIUM,
        startDate: "2025-03-01",
        dueDate: "2025-05-15",
        progress: 20,
        tags: ["Revit", "MEP", "LOD350"],
        phase: "Triển khai Hỗ trợ QLDA"
    },

    // --- NEW TASKS for S1, S2, S4 columns ---
    {
        id: "T-001-04",
        code: "TKBVTC.COORD.001",
        name: "Phối hợp 3 bộ môn ARC-STR-MEP",
        projectId: "P-001",
        assignee: { id: "NV011", name: "Kim Thu Huyền", avatar: "https://ui-avatars.com/api/?name=Kim+Thu+Huyền&background=random", role: "Coordinator" },
        reviewer: "NV006",
        status: TaskStatus.S1, // S1 - Phối hợp
        priority: TaskPriority.HIGH,
        startDate: "2025-03-10",
        dueDate: "2025-03-25",
        progress: 50,
        tags: ["Coordination", "Navisworks"],
        phase: "Triển khai Hỗ trợ QLDA"
    },
    {
        id: "T-001-05",
        code: "TKBVTC.QC.001",
        name: "Kiểm tra chéo mô hình Kiến trúc",
        projectId: "P-001",
        assignee: { id: "NV009", name: "Hoàng Thị Thùy", avatar: "https://ui-avatars.com/api/?name=Hoàng+Thị+Thùy&background=random", role: "QC" },
        reviewer: "NV006",
        status: TaskStatus.S2, // S2 - Kiểm tra chéo
        priority: TaskPriority.HIGH,
        startDate: "2025-03-18",
        dueDate: "2025-03-22",
        progress: 80,
        tags: ["QC", "Review"],
        phase: "Triển khai Hỗ trợ QLDA"
    },
    {
        id: "T-001-06",
        code: "TKBVTC.CLASH.001",
        name: "Báo cáo Clash Detection",
        projectId: "P-001",
        assignee: { id: "NV011", name: "Kim Thu Huyền", avatar: "https://ui-avatars.com/api/?name=Kim+Thu+Huyền&background=random", role: "Coordinator" },
        reviewer: "NV006",
        status: TaskStatus.S4, // S4 - Lãnh đạo duyệt
        priority: TaskPriority.CRITICAL,
        startDate: "2025-03-21",
        dueDate: "2025-03-25",
        progress: 95,
        tags: ["Report", "Navisworks", "Clash"],
        phase: "Triển khai Hỗ trợ QLDA"
    },

    // =============================================
    // P-002: Khu Công nghiệp Trấn Yên (Hạ tầng kỹ thuật)
    // =============================================
    // =============================================
    // P-002: Khu Công nghiệp Trấn Yên (Hạ tầng kỹ thuật)
    // =============================================

    // --- Phase 1: Xúc tiến Dự án ---
    {
        id: "T-002-P1-01",
        code: "SALE.DEMO.01",
        name: "Demo năng lực BIM Hạ tầng cho CĐT",
        projectId: "P-002",
        assignee: { id: "NV007", name: "Nguyễn Văn Dũng", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Văn+Dũng&background=random", role: "BIM Manager" },
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        startDate: "2024-12-01",
        dueDate: "2024-12-05",
        progress: 100,
        phase: "Xúc tiến Dự án"
    },
    {
        id: "T-002-P1-02",
        code: "SALE.REQ.01",
        name: "Khảo sát yêu cầu dự án & Scope",
        projectId: "P-002",
        assignee: { id: "NV007", name: "Nguyễn Văn Dũng", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Văn+Dũng&background=random", role: "BIM Manager" },
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        startDate: "2024-12-06",
        dueDate: "2024-12-10",
        progress: 100,
        phase: "Xúc tiến Dự án"
    },

    // --- Phase 2: Báo giá ---
    {
        id: "T-002-P2-01",
        code: "COST.EST.01",
        name: "Phân tích khối lượng & Lập dự toán",
        projectId: "P-002",
        assignee: { id: "NV007", name: "Nguyễn Văn Dũng", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Văn+Dũng&background=random", role: "BIM Manager" },
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        startDate: "2024-12-15",
        dueDate: "2024-12-20",
        progress: 100,
        phase: "Báo giá"
    },
    {
        id: "T-002-P2-02",
        code: "COST.NEG.01",
        name: "Thuyết trình & Đàm phán HĐ",
        projectId: "P-002",
        assignee: { id: "NV007", name: "Nguyễn Văn Dũng", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Văn+Dũng&background=random", role: "BIM Manager" },
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        startDate: "2024-12-21",
        dueDate: "2024-12-25",
        progress: 100,
        phase: "Báo giá"
    },

    // --- Phase 3: Chuẩn bị Triển khai ---
    {
        id: "T-002-P3-01",
        code: "PREP.BEP.01",
        name: "Lập BIM Execution Plan (BEP)",
        projectId: "P-002",
        assignee: { id: "NV007", name: "Nguyễn Văn Dũng", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Văn+Dũng&background=random", role: "BIM Manager" },
        status: TaskStatus.S5,
        priority: TaskPriority.CRITICAL,
        startDate: "2025-01-02",
        dueDate: "2025-01-10",
        progress: 100,
        phase: "Chuẩn bị Triển khai"
    },
    {
        id: "T-002-P3-02",
        code: "PREP.CDE.01",
        name: "Thiết lập môi trường CDE & Folder",
        projectId: "P-002",
        assignee: { id: "NV020", name: "Trần Đức Hoàng", avatar: "https://ui-avatars.com/api/?name=Trần+Đức+Hoàng&background=random", role: "Surveyor" },
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        startDate: "2025-01-05",
        dueDate: "2025-01-08",
        progress: 100,
        phase: "Chuẩn bị Triển khai"
    },

    // --- Phase 4: Triển khai Trình thẩm định ---
    {
        id: "T-002-01",
        code: "KS.CLOUD.001",
        name: "Xử lý dữ liệu khảo sát Point Cloud",
        projectId: "P-002",
        assignee: { id: "NV020", name: "Trần Đức Hoàng", avatar: "https://ui-avatars.com/api/?name=Trần+Đức+Hoàng&background=random", role: "Surveyor" },
        reviewer: "NV007",
        status: TaskStatus.S5,
        priority: TaskPriority.HIGH,
        startDate: "2025-01-15",
        dueDate: "2025-02-15",
        progress: 100,
        tags: ["Point Cloud", "Survey", "ReCap"],
        phase: "Triển khai Trình thẩm định"
    },
    {
        id: "T-002-02",
        code: "TKCS.ALIGN.001",
        name: "Dựng tuyến Alignment khu công nghiệp",
        projectId: "P-002",
        assignee: { id: "NV015", name: "Vũ Văn Hòa", avatar: "https://ui-avatars.com/api/?name=Vũ+Văn+Hòa&background=random", role: "Modeler (Civil)" },
        reviewer: "NV007",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-02-16",
        dueDate: "2025-03-10",
        progress: 70,
        tags: ["Civil 3D", "Alignment", "Infrastructure"],
        phase: "Triển khai Trình thẩm định",
        subtasks: [
            { id: "ST-002-02-1", title: "Dựng tuyến chính Main Road 1", completed: false },
            { id: "ST-002-02-2", title: "Dựng tuyến nhánh Road 2,3,4", completed: false },
            { id: "ST-002-02-3", title: "Xử lý nút giao cắt", completed: false }
        ]
    },
    {
        id: "T-002-03",
        code: "TKCS.CORRIDOR.001",
        name: "Dựng bề mặt Corridor & Taluy",
        projectId: "P-002",
        assignee: { id: "NV015", name: "Vũ Văn Hòa", avatar: "https://ui-avatars.com/api/?name=Vũ+Văn+Hòa&background=random", role: "Modeler (Civil)" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-11",
        dueDate: "2025-04-15",
        progress: 35,
        tags: ["Civil 3D", "Corridor", "Grading"],
        phase: "Triển khai Trình thẩm định",
        subtasks: [
            { id: "ST-002-03-1", title: "Áp khuôn đường Assembly Type 1", completed: false },
            { id: "ST-002-03-2", title: "Chạy Corridor tuyến chính", completed: false },
            { id: "ST-002-03-3", title: "Vuốt nối nút giao", completed: false },
            { id: "ST-002-03-4", title: "Tính khối lượng đào đắp sơ bộ", completed: false }
        ]
    },

    // --- Phase 5: Triển khai Hỗ trợ QLDA ---
    {
        id: "T-002-04",
        code: "TKKT.CONG.001",
        name: "Mô hình chi tiết cống thoát nước",
        projectId: "P-002",

        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler (STR)" },
        reviewer: "NV007",
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-04-16",
        dueDate: "2025-06-01",
        progress: 5,
        tags: ["Revit", "Structure", "Culvert"],
        subtasks: [
            { id: "ST-002-04-1", title: "Dựng family cống hộp 2x2m", completed: false },
            { id: "ST-002-04-2", title: "Dựng family hố ga thu nước mưa", completed: false },
            { id: "ST-002-04-3", title: "Đặt tuyến cống D1000", completed: false }
        ]
    },
    {
        id: "T-002-05",
        code: "TKKT.KHOILUONG.001",
        name: "Tính toán khối lượng đào đắp",
        projectId: "P-002",
        assignee: { id: "NV011", name: "Kim Thu Huyền", avatar: "https://ui-avatars.com/api/?name=Kim+Thu+Huyền&background=random", role: "BIM Manager" },
        reviewer: "NV006",
        status: TaskStatus.OPEN,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-06-02",
        dueDate: "2025-06-30",
        progress: 0,
        tags: ["Civil 3D", "Quantity", "Report"]
    },

    // =============================================
    // P-003: Xây dựng mới TT chuyên sâu BV Nhi đồng 1
    // =============================================
    {
        id: "T-003-01",
        code: "BEP.001",
        name: "Lập BIM Execution Plan (BEP)",
        projectId: "P-003",
        assignee: { id: "NV006", name: "Trần Hữu Hải", avatar: "https://ui-avatars.com/api/?name=Trần+Hữu+Hải&background=random", role: "BIM Manager" },
        reviewer: "NV005",
        status: TaskStatus.S6,
        priority: TaskPriority.CRITICAL,
        startDate: "2025-01-05",
        dueDate: "2025-01-15",
        progress: 100,
        tags: ["BEP", "Planning", "ISO19650"]
    },
    {
        id: "T-003-02",
        code: "TKCS.ARC.001",
        name: "Dựng hình Kiến trúc LOD 200",
        projectId: "P-003",
        assignee: { id: "NV019", name: "Vũ Ngọc Thủy", avatar: "https://ui-avatars.com/api/?name=Vũ+Ngọc+Thủy&background=random", role: "Modeler (ARC)" },
        reviewer: "NV006",
        status: TaskStatus.S5,
        priority: TaskPriority.HIGH,
        startDate: "2025-01-16",
        dueDate: "2025-02-10",
        progress: 100,
        tags: ["Revit", "Architecture", "LOD200"]
    },
    {
        id: "T-003-03",
        code: "TKCS.STR.001",
        name: "Dựng hình Kết cấu LOD 200",
        projectId: "P-003",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler (STR)" },
        reviewer: "NV007",
        status: TaskStatus.S5,
        priority: TaskPriority.HIGH,
        startDate: "2025-02-01",
        dueDate: "2025-02-25",
        progress: 100,
        tags: ["Revit", "Structure", "LOD200"]
    },
    {
        id: "T-003-04",
        code: "TKCS.CLASH.001",
        name: "Kiểm tra va chạm sơ bộ (Phase TKCS)",
        projectId: "P-003",
        assignee: { id: "NV011", name: "Kim Thu Huyền", avatar: "https://ui-avatars.com/api/?name=Kim+Thu+Huyền&background=random", role: "Coordinator" },
        reviewer: "NV006",
        status: TaskStatus.S5,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-02-26",
        dueDate: "2025-03-05",
        progress: 100,
        tags: ["Navisworks", "Clash Detection", "TKCS"]
    },
    {
        id: "T-003-05",
        code: "TKKT.ARC.001",
        name: "Mô hình chi tiết Kiến trúc LOD 350",
        projectId: "P-003",
        assignee: { id: "NV009", name: "Hoàng Thị Thùy", avatar: "https://ui-avatars.com/api/?name=Hoàng+Thị+Thùy&background=random", role: "Modeler (ARC)" },
        reviewer: "NV006",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-06",
        dueDate: "2025-04-20",
        progress: 65,
        tags: ["Revit", "Architecture", "LOD350"]
    },
    {
        id: "T-003-06",
        code: "TKKT.STR.001",
        name: "Mô hình chi tiết Kết cấu LOD 350",
        projectId: "P-003",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler (STR)" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-20",
        dueDate: "2025-05-10",
        progress: 45,
        tags: ["Revit", "Structure", "LOD350"]
    },
    {
        id: "T-003-07",
        code: "TKKT.MEP.001",
        name: "Mô hình MEP LOD 350 (có Phòng sạch)",
        projectId: "P-003",
        assignee: { id: "NV018", name: "Nguyễn Bá Nhiệm", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Bá+Nhiệm&background=random", role: "Modeler (MEP)" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-04-01",
        dueDate: "2025-06-15",
        progress: 30,
        tags: ["Revit", "MEP", "Clean Room", "Hospital"]
    },
    {
        id: "T-003-08",
        code: "TKKT.CLASH.002",
        name: "Phối hợp Clash Detection đa bộ môn",
        projectId: "P-003",
        assignee: { id: "NV011", name: "Kim Thu Huyền", avatar: "https://ui-avatars.com/api/?name=Kim+Thu+Huyền&background=random", role: "Coordinator" },
        reviewer: "NV006",
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        startDate: "2025-05-15",
        dueDate: "2025-06-30",
        progress: 5,
        tags: ["Navisworks", "Clash Detection", "Coordination"]
    },
    {
        id: "T-003-09",
        code: "BVTC.EXPORT.001",
        name: "Xuất hồ sơ bản vẽ thi công",
        projectId: "P-003",
        assignee: { id: "NV006", name: "Trần Hữu Hải", avatar: "https://ui-avatars.com/api/?name=Trần+Hữu+Hải&background=random", role: "BIM Manager" },
        reviewer: "NV005",
        status: TaskStatus.OPEN,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-07-01",
        dueDate: "2025-07-31",
        progress: 0,
        tags: ["PDF", "DWG", "Deliverables"]
    },

    // =============================================
    // P-005: Đầu tư XD BV Đa khoa tỉnh Thái Bình
    // =============================================
    {
        id: "T-005-01",
        code: "BEP.002",
        name: "Lập BIM Execution Plan",
        projectId: "P-005",
        assignee: { id: "NV006", name: "Trần Hữu Hải", avatar: "https://ui-avatars.com/api/?name=Trần+Hữu+Hải&background=random", role: "BIM Manager" },
        reviewer: "NV005",
        status: TaskStatus.S6,
        priority: TaskPriority.CRITICAL,
        startDate: "2025-02-01",
        dueDate: "2025-02-10",
        progress: 100,
        tags: ["BEP", "Planning"]
    },
    {
        id: "T-005-02",
        code: "TKCS.ARC.002",
        name: "Dựng mô hình Kiến trúc LOD 200",
        projectId: "P-005",
        assignee: { id: "NV010", name: "Bùi Đức Lương", avatar: "https://ui-avatars.com/api/?name=Bùi+Đức+Lương&background=random", role: "Modeler (ARC)" },
        reviewer: "NV006",
        status: TaskStatus.S5,
        priority: TaskPriority.HIGH,
        startDate: "2025-02-11",
        dueDate: "2025-03-15",
        progress: 100,
        tags: ["Revit", "Architecture", "Hospital"]
    },
    {
        id: "T-005-03",
        code: "TKKT.ARC.002",
        name: "Mô hình chi tiết Kiến trúc LOD 350",
        projectId: "P-005",
        assignee: { id: "NV010", name: "Bùi Đức Lương", avatar: "https://ui-avatars.com/api/?name=Bùi+Đức+Lương&background=random", role: "Modeler (ARC)" },
        reviewer: "NV006",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-16",
        dueDate: "2025-05-10",
        progress: 60,
        tags: ["Revit", "Architecture", "LOD350"]
    },
    {
        id: "T-005-04",
        code: "TKKT.STR.002",
        name: "Mô hình Kết cấu LOD 350",
        projectId: "P-005",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler (STR)" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-04-01",
        dueDate: "2025-06-30",
        progress: 35,
        tags: ["Revit", "Structure"]
    },
    {
        id: "T-005-05",
        code: "TKKT.MEP.002",
        name: "Mô hình MEP LOD 350",
        projectId: "P-005",
        assignee: { id: "NV012", name: "Phạm Việt Anh", avatar: "https://ui-avatars.com/api/?name=Phạm+Việt+Anh&background=random", role: "Modeler (MEP)" },
        reviewer: "NV007",
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-05-01",
        dueDate: "2025-08-31",
        progress: 10,
        tags: ["Revit", "MEP", "Hospital"]
    },
    {
        id: "T-005-06",
        code: "TKKT.COORD.001",
        name: "Phối hợp & Clash Detection",
        projectId: "P-005",
        assignee: { id: "NV011", name: "Kim Thu Huyền", avatar: "https://ui-avatars.com/api/?name=Kim+Thu+Huyền&background=random", role: "Coordinator" },
        reviewer: "NV006",
        status: TaskStatus.OPEN,
        priority: TaskPriority.HIGH,
        startDate: "2025-06-15",
        dueDate: "2025-09-15",
        progress: 0,
        tags: ["Navisworks", "Coordination"]
    },

    // =============================================
    // P-006: Nhà máy gạch Granite Porcelain Premier
    // =============================================
    {
        id: "T-006-01",
        code: "BEP.003",
        name: "Lập BIM Execution Plan",
        projectId: "P-006",
        assignee: { id: "NV006", name: "Trần Hữu Hải", avatar: "https://ui-avatars.com/api/?name=Trần+Hữu+Hải&background=random", role: "BIM Manager" },
        reviewer: "NV005",
        status: TaskStatus.S6,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-01",
        dueDate: "2025-03-07",
        progress: 100,
        tags: ["BEP", "Planning", "Industrial"]
    },
    {
        id: "T-006-02",
        code: "TKCS.ALL.001",
        name: "Dựng mô hình tổng thể nhà máy",
        projectId: "P-006",
        assignee: { id: "NV013", name: "Nguyễn Hữu Hùng", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Hữu+Hùng&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-08",
        dueDate: "2025-04-15",
        progress: 70,
        tags: ["Revit", "Industrial", "Factory"]
    },
    {
        id: "T-006-03",
        code: "TKKT.STR.003",
        name: "Mô hình Kết cấu thép nhà xưởng",
        projectId: "P-006",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler (STR)" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-04-01",
        dueDate: "2025-05-15",
        progress: 50,
        tags: ["Revit", "Tekla", "Steel Structure"]
    },
    {
        id: "T-006-04",
        code: "TKKT.MEP.003",
        name: "Mô hình MEP công nghiệp",
        projectId: "P-006",
        assignee: { id: "NV018", name: "Nguyễn Bá Nhiệm", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Bá+Nhiệm&background=random", role: "Modeler (MEP)" },
        reviewer: "NV007",
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-04-20",
        dueDate: "2025-05-25",
        progress: 15,
        tags: ["Revit", "MEP", "Industrial"]
    },

    // P-004: Bệnh viện Đa khoa Cà Mau

    {
        id: "T-004-01",
        code: "TKBVTC.ARC.002",
        name: "Mô hình Kiến trúc Bệnh viện - Block A",
        projectId: "P-004",
        assignee: { id: "NV019", name: "Vũ Ngọc Thủy", avatar: "https://ui-avatars.com/api/?name=Vũ+Ngọc+Thủy&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S5,
        priority: TaskPriority.CRITICAL,
        startDate: "2025-01-15",
        dueDate: "2025-04-15",
        progress: 100,
        tags: ["Revit", "Hospital", "Block A"]
    },
    {
        id: "T-004-02",
        code: "TKBVTC.ARC.003",
        name: "Mô hình Kiến trúc Bệnh viện - Block B",
        projectId: "P-004",
        assignee: { id: "NV009", name: "Hoàng Thị Thùy", avatar: "https://ui-avatars.com/api/?name=Hoàng+Thị+Thùy&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-02-01",
        dueDate: "2025-05-01",
        progress: 70,
        tags: ["Revit", "Hospital", "Block B"]
    },
    {
        id: "T-004-03",
        code: "TKBVTC.STR.002",
        name: "Mô hình Kết cấu Bệnh viện",
        projectId: "P-004",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-01",
        dueDate: "2025-06-30",
        progress: 45,
        tags: ["Revit", "Structure", "Hospital"]
    },
    {
        id: "T-004-04",
        code: "TKBVTC.MEP.002",
        name: "Mô hình M&E Bệnh viện",
        projectId: "P-004",
        assignee: { id: "NV018", name: "Nguyễn Bá Nhiệm", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Bá+Nhiệm&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-04-01",
        dueDate: "2025-08-31",
        progress: 30,
        tags: ["Revit", "MEP", "Hospital"]
    },
    {
        id: "T-004-05",
        code: "TKBVTC.COORD.001",
        name: "Phối hợp và kiểm tra va chạm",
        projectId: "P-004",
        assignee: { id: "NV011", name: "Kim Thu Huyền", avatar: "https://ui-avatars.com/api/?name=Kim+Thu+Huyền&background=random", role: "Coordinator" },
        reviewer: "NV006",
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        startDate: "2025-05-01",
        dueDate: "2025-09-30",
        progress: 0,
        tags: ["Navisworks", "Clash Detection"]
    },

    // P-010: Cung thiếu nhi TP. Hà Nội
    {
        id: "T-010-01",
        code: "TKBVTC.ARC.004",
        name: "Mô hình Kiến trúc Cung thiếu nhi",
        projectId: "P-010",
        assignee: { id: "NV019", name: "Vũ Ngọc Thủy", avatar: "https://ui-avatars.com/api/?name=Vũ+Ngọc+Thủy&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-10",
        dueDate: "2025-06-10",
        progress: 65,
        tags: ["Revit", "Architecture", "Public"]
    },
    {
        id: "T-010-02",
        code: "TKBVTC.STR.003",
        name: "Mô hình Kết cấu Cung thiếu nhi",
        projectId: "P-010",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-04-01",
        dueDate: "2025-07-31",
        progress: 35,
        tags: ["Revit", "Structure"]
    },
    {
        id: "T-010-03",
        code: "TKBVTC.MEP.003",
        name: "Mô hình M&E Cung thiếu nhi",
        projectId: "P-010",
        assignee: { id: "NV012", name: "Phạm Việt Anh", avatar: "https://ui-avatars.com/api/?name=Phạm+Việt+Anh&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-05-01",
        dueDate: "2025-09-30",
        progress: 5,
        tags: ["Revit", "MEP"]
    },
    {
        id: "T-010-04",
        code: "TKBVTC.VIDEO.001",
        name: "Video diễn họa 3D",
        projectId: "P-010",
        assignee: { id: "NV013", name: "Nguyễn Hữu Hùng", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Hữu+Hùng&background=random", role: "Modeler" },
        reviewer: "NV008",
        status: TaskStatus.OPEN,
        priority: TaskPriority.LOW,
        startDate: "2025-08-01",
        dueDate: "2025-10-31",
        progress: 0,
        tags: ["Lumion", "Visualization"]
    },

    // P-019: Eco Smart City Plot 2-1
    {
        id: "T-019-01",
        code: "TKBVTC.ARC.005",
        name: "Mô hình Kiến trúc Eco Smart City 2-1",
        projectId: "P-019",
        assignee: { id: "NV009", name: "Hoàng Thị Thùy", avatar: "https://ui-avatars.com/api/?name=Hoàng+Thị+Thùy&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-02-20",
        dueDate: "2025-05-20",
        progress: 70,
        tags: ["Revit", "Residential"]
    },
    {
        id: "T-019-02",
        code: "TKBVTC.STR.004",
        name: "Mô hình Kết cấu Eco Smart City 2-1",
        projectId: "P-019",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-15",
        dueDate: "2025-06-15",
        progress: 40,
        tags: ["Revit", "Structure"]
    },
    {
        id: "T-019-03",
        code: "TKBVTC.MEP.004",
        name: "Mô hình M&E Eco Smart City 2-1",
        projectId: "P-019",
        assignee: { id: "NV018", name: "Nguyễn Bá Nhiệm", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Bá+Nhiệm&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-04-01",
        dueDate: "2025-08-31",
        progress: 10,
        tags: ["Revit", "MEP"]
    },

    // P-020: Eco Smart City Plot 2-2
    {
        id: "T-020-01",
        code: "TKBVTC.ARC.006",
        name: "Mô hình Kiến trúc Eco Smart City 2-2 - Tower A",
        projectId: "P-020",
        assignee: { id: "NV010", name: "Bùi Đức Lương", avatar: "https://ui-avatars.com/api/?name=Bùi+Đức+Lương&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-02-20",
        dueDate: "2025-06-20",
        progress: 50,
        tags: ["Revit", "Residential", "Tower A"]
    },
    {
        id: "T-020-02",
        code: "TKBVTC.ARC.007",
        name: "Mô hình Kiến trúc Eco Smart City 2-2 - Tower B",
        projectId: "P-020",
        assignee: { id: "NV016", name: "Nhữ Thị Thu Hiền", avatar: "https://ui-avatars.com/api/?name=Nhữ+Thị+Thu+Hiền&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-01",
        dueDate: "2025-07-01",
        progress: 35,
        tags: ["Revit", "Residential", "Tower B"]
    },
    {
        id: "T-020-03",
        code: "TKBVTC.STR.005",
        name: "Mô hình Kết cấu Eco Smart City 2-2",
        projectId: "P-020",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        startDate: "2025-04-01",
        dueDate: "2025-08-31",
        progress: 5,
        tags: ["Revit", "Structure"]
    },

    // P-026: Khu nhà ở 486 Ngọc Hồi
    {
        id: "T-026-01",
        code: "TKBVTC.ARC.008",
        name: "Mô hình Kiến trúc Block 1",
        projectId: "P-026",
        assignee: { id: "NV019", name: "Vũ Ngọc Thủy", avatar: "https://ui-avatars.com/api/?name=Vũ+Ngọc+Thủy&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-04-10",
        dueDate: "2025-08-10",
        progress: 30,
        tags: ["Revit", "Residential"]
    },
    {
        id: "T-026-02",
        code: "TKBVTC.ARC.009",
        name: "Mô hình Kiến trúc Block 2",
        projectId: "P-026",
        assignee: { id: "NV009", name: "Hoàng Thị Thùy", avatar: "https://ui-avatars.com/api/?name=Hoàng+Thị+Thùy&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        startDate: "2025-05-01",
        dueDate: "2025-09-01",
        progress: 15,
        tags: ["Revit", "Residential"]
    },
    {
        id: "T-026-03",
        code: "TKBVTC.ARC.010",
        name: "Mô hình Kiến trúc Block 3",
        projectId: "P-026",
        assignee: { id: "NV010", name: "Bùi Đức Lương", avatar: "https://ui-avatars.com/api/?name=Bùi+Đức+Lương&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.OPEN,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-06-01",
        dueDate: "2025-10-01",
        progress: 0,
        tags: ["Revit", "Residential"]
    },

    // P-027: Nhà văn hóa Thanh niên
    {
        id: "T-027-01",
        code: "TKBVTC.ARC.011",
        name: "Mô hình Kiến trúc Nhà văn hóa",
        projectId: "P-027",
        assignee: { id: "NV019", name: "Vũ Ngọc Thủy", avatar: "https://ui-avatars.com/api/?name=Vũ+Ngọc+Thủy&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-20",
        dueDate: "2025-06-20",
        progress: 60,
        tags: ["Revit", "Cultural"]
    },
    {
        id: "T-027-02",
        code: "TKBVTC.STR.006",
        name: "Mô hình Kết cấu Nhà văn hóa",
        projectId: "P-027",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-04-15",
        dueDate: "2025-07-31",
        progress: 35,
        tags: ["Revit", "Structure"]
    },
    {
        id: "T-027-03",
        code: "TKBVTC.MEP.005",
        name: "Mô hình M&E Nhà văn hóa",
        projectId: "P-027",
        assignee: { id: "NV012", name: "Phạm Việt Anh", avatar: "https://ui-avatars.com/api/?name=Phạm+Việt+Anh&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-05-01",
        dueDate: "2025-09-30",
        progress: 10,
        tags: ["Revit", "MEP"]
    },

    // P-029: Bảo tàng Điêu khắc Chăm
    {
        id: "T-029-01",
        code: "TKBVTC.ARC.012",
        name: "Mô hình Kiến trúc Bảo tàng Chăm",
        projectId: "P-029",
        assignee: { id: "NV013", name: "Nguyễn Hữu Hùng", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Hữu+Hùng&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S5,
        priority: TaskPriority.HIGH,
        startDate: "2025-02-01",
        dueDate: "2025-05-01",
        progress: 90,
        tags: ["Revit", "Museum"]
    },
    {
        id: "T-029-02",
        code: "TKBVTC.STR.007",
        name: "Mô hình Kết cấu Bảo tàng Chăm",
        projectId: "P-029",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-01",
        dueDate: "2025-06-01",
        progress: 75,
        tags: ["Revit", "Structure"]
    },
    {
        id: "T-029-03",
        code: "TKBVTC.COORD.002",
        name: "Phối hợp và Clash Detection - Bảo tàng",
        projectId: "P-029",
        assignee: { id: "NV011", name: "Kim Thu Huyền", avatar: "https://ui-avatars.com/api/?name=Kim+Thu+Huyền&background=random", role: "Coordinator" },
        reviewer: "NV006",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-05-15",
        dueDate: "2025-07-15",
        progress: 40,
        tags: ["Navisworks", "Clash Detection"]
    },

    // P-030: BV Sản nhi Quảng Ninh
    {
        id: "T-030-01",
        code: "TKBVTC.ARC.013",
        name: "Mô hình Kiến trúc BV Sản nhi QN",
        projectId: "P-030",
        assignee: { id: "NV009", name: "Hoàng Thị Thùy", avatar: "https://ui-avatars.com/api/?name=Hoàng+Thị+Thùy&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-03-25",
        dueDate: "2025-06-25",
        progress: 65,
        tags: ["Revit", "Hospital"]
    },
    {
        id: "T-030-02",
        code: "TKBVTC.STR.008",
        name: "Mô hình Kết cấu BV Sản nhi QN",
        projectId: "P-030",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-04-15",
        dueDate: "2025-08-15",
        progress: 35,
        tags: ["Revit", "Structure"]
    },
    {
        id: "T-030-03",
        code: "TKBVTC.MEP.006",
        name: "Mô hình M&E BV Sản nhi QN",
        projectId: "P-030",
        assignee: { id: "NV018", name: "Nguyễn Bá Nhiệm", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Bá+Nhiệm&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-06-01",
        dueDate: "2025-10-31",
        progress: 10,
        tags: ["Revit", "MEP", "Hospital"]
    },

    // P-034: BV Y học cổ truyền Hà Nội
    {
        id: "T-034-01",
        code: "TKBVTC.ARC.014",
        name: "Mô hình Kiến trúc BV YHCT",
        projectId: "P-034",
        assignee: { id: "NV010", name: "Bùi Đức Lương", avatar: "https://ui-avatars.com/api/?name=Bùi+Đức+Lương&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-04-15",
        dueDate: "2025-07-15",
        progress: 45,
        tags: ["Revit", "Hospital"]
    },
    {
        id: "T-034-02",
        code: "TKBVTC.STR.009",
        name: "Mô hình Kết cấu BV YHCT",
        projectId: "P-034",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        startDate: "2025-05-15",
        dueDate: "2025-09-15",
        progress: 15,
        tags: ["Revit", "Structure"]
    },
    {
        id: "T-034-03",
        code: "TKBVTC.MEP.007",
        name: "Mô hình M&E BV YHCT",
        projectId: "P-034",
        assignee: { id: "NV012", name: "Phạm Việt Anh", avatar: "https://ui-avatars.com/api/?name=Phạm+Việt+Anh&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.OPEN,
        priority: TaskPriority.MEDIUM,
        startDate: "2025-07-01",
        dueDate: "2025-11-30",
        progress: 0,
        tags: ["Revit", "MEP"]
    },

    // P-036: BV Nhi đồng 2 - Khối nhiệt đới
    {
        id: "T-036-01",
        code: "TKBVTC.ARC.015",
        name: "Mô hình Kiến trúc Khối nhiệt đới",
        projectId: "P-036",
        assignee: { id: "NV016", name: "Nhữ Thị Thu Hiền", avatar: "https://ui-avatars.com/api/?name=Nhữ+Thị+Thu+Hiền&background=random", role: "Modeler" },
        reviewer: "NV006",
        status: TaskStatus.S3,
        priority: TaskPriority.HIGH,
        startDate: "2025-04-20",
        dueDate: "2025-07-20",
        progress: 55,
        tags: ["Revit", "Hospital"]
    },
    {
        id: "T-036-02",
        code: "TKBVTC.STR.010",
        name: "Mô hình Kết cấu Khối nhiệt đới",
        projectId: "P-036",
        assignee: { id: "NV021", name: "Nguyễn Đức Thành", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.S0,
        priority: TaskPriority.HIGH,
        startDate: "2025-05-20",
        dueDate: "2025-09-20",
        progress: 25,
        tags: ["Revit", "Structure"]
    },
    {
        id: "T-036-03",
        code: "TKBVTC.MEP.008",
        name: "Mô hình M&E Khối nhiệt đới (có phòng sạch)",
        projectId: "P-036",
        assignee: { id: "NV018", name: "Nguyễn Bá Nhiệm", avatar: "https://ui-avatars.com/api/?name=Nguyễn+Bá+Nhiệm&background=random", role: "Modeler" },
        reviewer: "NV007",
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        startDate: "2025-07-01",
        dueDate: "2025-12-31",
        progress: 5,
        tags: ["Revit", "MEP", "Clean Room"]
    }
];
