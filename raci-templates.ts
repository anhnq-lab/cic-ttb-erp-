/**
 * RACI Templates theo Quy chế 25.10 (Vốn Ngân Sách) và 25.20 (Vốn ngoài NS)
 * Cập nhật: 2026-01-01
 * 
 * R = Responsible (Bắt buộc - Thực hiện)
 * A = Accountable (Phê duyệt)
 * C = Consulted (Tham vấn)
 * I = Informed (Được thông báo)
 * 
 * Roles:
 * - GĐTT: Giám đốc Trung tâm
 * - PGĐTT: Phó Giám đốc Trung tâm
 * - TBP ADMIN: Trưởng bộ phận Admin
 * - TBP QA/QC: Trưởng bộ phận Quản lý chất lượng
 * - TBM: Trưởng bộ môn
 * - TVBM: Thành viên bộ môn
 * - TBP XTDA: Trưởng bộ phận Xúc tiến Dự án
 * - TBP R&D: Trưởng bộ phận R&D
 * - QLDA: Quản lý Dự án
 * - QL BIM: Quản lý BIM
 * - ĐPBM: Điều phối bộ môn
 * - TNDH: Trưởng nhóm dựng hình
 * - NDH: Người dựng hình
 */

export const RACI_TEMPLATES = {
    StateBudget: [
        {
            phase: '1. Xúc tiến Dự án',
            tasks: [
                {
                    code: '1.1',
                    name: 'Thuyết trình khách hàng',
                    roles: {
                        'GĐTT': 'I/C',
                        'PGĐTT': 'C',
                        'TBP ADMIN': 'I',
                        'TBP QA/QC': 'C',
                        'TBM': 'C',
                        'TVBM': 'C',
                        'TBP XTDA': 'R'
                    }
                },
                {
                    code: '1.2',
                    name: 'Liên hệ khách hàng nắm bắt thông tin định kỳ',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP XTDA': 'R'
                    }
                },
                {
                    code: '1.3',
                    name: 'Cập nhật danh mục khách hàng',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'I',
                        'TBP QA/QC': 'I',
                        'TBM': 'I',
                        'TVBM': 'I',
                        'TBP XTDA': 'R'
                    }
                },
                {
                    code: '1.4',
                    name: 'Thu thập dữ liệu đầu vào của dự án phục vụ báo giá',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'I',
                        'TBP QA/QC': 'I',
                        'TVBM': 'I',
                        'TBP XTDA': 'R'
                    }
                }
            ]
        },
        {
            phase: '2. Báo giá',
            tasks: [
                {
                    code: '2.1',
                    name: 'Tạo thư mục Dự án tiềm năng (bao gồm mã dự án)',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'I',
                        'TBP QA/QC': 'I',
                        'TVBM': 'I',
                        'TBP XTDA': 'R'
                    }
                },
                {
                    code: '2.2',
                    name: 'Chốt khối lượng phục vụ báo giá',
                    roles: {
                        'GĐTT': 'A',
                        'TBM': 'R'
                    }
                },
                {
                    code: '2.3',
                    name: 'Xem xét sự khả thi về kỹ thuật (bao gồm cả tiến độ)',
                    roles: {
                        'GĐTT': 'R',
                        'TBP XTDA': 'C'
                    }
                },
                {
                    code: '2.4',
                    name: 'Pre-Bep',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'A',
                        'TBM': 'R',
                        'TBP XTDA': 'C'
                    }
                },
                {
                    code: '2.5',
                    name: 'Lập báo giá',
                    roles: {
                        'GĐTT': 'A',
                        'PGĐTT': 'C',
                        'TBM': 'C',
                        'TBP XTDA': 'R'
                    }
                },
                {
                    code: '2.6',
                    name: 'Thu thập hồ sơ năng lực đấu thầu liên quan',
                    roles: {
                        'GĐTT': 'C',
                        'PGĐTT': 'C',
                        'TBP ADMIN': 'R',
                        'TBP QA/QC': 'C',
                        'TBM': 'C',
                        'TBP XTDA': 'A'
                    }
                },
                {
                    code: '2.7',
                    name: 'Theo dõi tình trạng báo giá',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP XTDA': 'R'
                    }
                }
            ]
        },
        {
            phase: '3. Chuẩn bị',
            tasks: [
                {
                    code: '3.1',
                    name: 'Bổ nhiệm QLDA/QLB cho Dự án',
                    roles: {
                        'GĐTT': 'R',
                        'PGĐTT': 'C',
                        'TBP ADMIN': 'I',
                        'QLDA': 'I'
                    }
                },
                {
                    code: '3.2',
                    name: 'Bổ nhiệm thành viên dự án',
                    roles: {
                        'GĐTT': 'R',
                        'PGĐTT': 'C',
                        'TBP ADMIN': 'I',
                        'TBP QA/QC': 'C',
                        'TBM': 'C',
                        'TVBM': 'I',
                        'TBP XTDA': 'C',
                        'QLDA': 'I',
                        'QL BIM': 'I',
                        'ĐPBM': 'I'
                    }
                },
                {
                    code: '3.3',
                    name: 'Tạo lập Folder Dự án',
                    roles: {
                        'GĐTT': 'R',
                        'QLDA': 'I',
                        'QL BIM': 'I',
                        'ĐPBM': 'I',
                        'TNDH': 'I'
                    }
                },
                {
                    code: '3.4',
                    name: 'Tạo lập Dự án trên Bimcollab',
                    roles: {
                        'GĐTT': 'R',
                        'QLDA': 'I',
                        'QL BIM': 'I',
                        'ĐPBM': 'I',
                        'TNDH': 'I'
                    }
                },
                {
                    code: '3.5',
                    name: 'Thiết lập CDE dự án (Autodesk Docs / Bimcollab Twins / Trimble Connect / G Drive)',
                    roles: {
                        'GĐTT': 'R',
                        'QL BIM': 'R',
                        'ĐPBM': 'C',
                        'TNDH': 'C',
                        'NDH': 'C'
                    }
                },
                {
                    code: '3.6',
                    name: 'Tạo Template dự án',
                    roles: {
                        'GĐTT': 'A',
                        'QL BIM': 'R',
                        'ĐPBM': 'C',
                        'TNDH': 'C',
                        'NDH': 'C'
                    }
                },
                {
                    code: '3.7',
                    name: 'Tạo lập nhóm trao đổi nội bộ dự án',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBM': 'I',
                        'TBP XTDA': 'I',
                        'QLDA': 'R',
                        'QL BIM': 'I',
                        'ĐPBM': 'I',
                        'TNDH': 'I'
                    }
                },
                {
                    code: '3.8',
                    name: 'Tạo lập nhóm trao đổi với khách hàng',
                    roles: {
                        'TBP ADMIN': 'I',
                        'TBP XTDA': 'R',
                        'QLDA': 'I',
                        'QL BIM': 'I'
                    }
                }
            ]
        },
        {
            phase: '4. Triển khai trình thẩm định',
            tasks: [
                {
                    code: '4.1',
                    name: 'Dựng mô hình phục vụ trình thẩm định',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP QA/QC': 'A',
                        'TBM': 'C',
                        'TBP XTDA': 'I',
                        'QLDA': 'A',
                        'QL BIM': 'A',
                        'ĐPBM': 'A',
                        'TNDH': 'R'
                    }
                },
                {
                    code: '4.2',
                    name: 'Xuất bản vẽ phục vụ thẩm định',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP QA/QC': 'A',
                        'TBM': 'C',
                        'TBP XTDA': 'I',
                        'QLDA': 'A',
                        'QL BIM': 'A',
                        'ĐPBM': 'A',
                        'TNDH': 'R'
                    }
                },
                {
                    code: '4.3',
                    name: 'Xuất khối lượng phục vụ thẩm định',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP QA/QC': 'A',
                        'TBM': 'C',
                        'TBP XTDA': 'I',
                        'QLDA': 'A',
                        'QL BIM': 'A',
                        'ĐPBM': 'A',
                        'TNDH': 'R'
                    }
                },
                {
                    code: '4.4',
                    name: 'Tập hợp hồ sơ trình thẩm định',
                    roles: {
                        'GĐTT': 'A',
                        'PGĐTT': 'I',
                        'QLDA': 'R',
                        'QL BIM': 'C'
                    }
                },
                {
                    code: '4.5',
                    name: 'Thu thập ý kiến thẩm định',
                    roles: {
                        'GĐTT': 'I',
                        'QLDA': 'R',
                        'QL BIM': 'I',
                        'ĐPBM': 'I',
                        'TNDH': 'I',
                        'NDH': 'I'
                    }
                },
                {
                    code: '4.6',
                    name: 'Cập nhật hồ sơ BIM trình thẩm định',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP QA/QC': 'A',
                        'TBM': 'C',
                        'TBP XTDA': 'I',
                        'QLDA': 'A',
                        'QL BIM': 'A',
                        'ĐPBM': 'A',
                        'TNDH': 'R'
                    }
                },
                {
                    code: '4.7',
                    name: 'Quản lý File trên CDE Nội bộ',
                    roles: {
                        'GĐTT': 'I',
                        'QL BIM': 'R',
                        'ĐPBM': 'C',
                        'TNDH': 'C',
                        'NDH': 'C'
                    }
                },
                {
                    code: '4.8',
                    name: 'Đồng bộ File từ CDE nội bộ lên CDE Dự án',
                    roles: {
                        'GĐTT': 'I',
                        'QL BIM': 'R',
                        'ĐPBM': 'C',
                        'TNDH': 'C',
                        'NDH': 'C'
                    }
                }
            ]
        },
        {
            phase: '5. Triển khai Hỗ trợ QLDA',
            tasks: [
                {
                    code: '5.1',
                    name: 'Dựng mô hình hoàn thiện phục vụ QLDA',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP QA/QC': 'A',
                        'TBM': 'C',
                        'TBP XTDA': 'I',
                        'QLDA': 'A',
                        'QL BIM': 'A',
                        'ĐPBM': 'A',
                        'TNDH': 'R'
                    }
                },
                {
                    code: '5.2',
                    name: 'Triển khai các ứng dụng BIM theo yêu cầu của CĐT dự án',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP QA/QC': 'A',
                        'TBM': 'C',
                        'TBP R&D': 'C',
                        'QLDA': 'A',
                        'QL BIM': 'A',
                        'ĐPBM': 'A',
                        'TNDH': 'R'
                    }
                },
                {
                    code: '5.3',
                    name: 'Quản lý File trên CDE Nội bộ',
                    roles: {
                        'GĐTT': 'I',
                        'QL BIM': 'R',
                        'ĐPBM': 'C',
                        'TNDH': 'C',
                        'NDH': 'C'
                    }
                },
                {
                    code: '5.4',
                    name: 'Đồng bộ File từ CDE nội bộ lên CDE Dự án',
                    roles: {
                        'GĐTT': 'I',
                        'QL BIM': 'R',
                        'ĐPBM': 'C',
                        'TNDH': 'C',
                        'NDH': 'C'
                    }
                },
                {
                    code: '5.5',
                    name: 'Bàn giao dữ liệu Dự án cho khách hàng',
                    roles: {
                        'GĐTT': 'A',
                        'PGĐTT': 'I',
                        'QLDA': 'R',
                        'QL BIM': 'C'
                    }
                }
            ]
        },
        {
            phase: '6. Thanh quyết toán',
            tasks: [
                {
                    code: '6.1',
                    name: 'Lập hồ sơ thanh toán từng giai đoạn',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'R',
                        'TBP XTDA': 'C',
                        'QLDA': 'C'
                    }
                },
                {
                    code: '6.2',
                    name: 'Lập hồ sơ quyết toán hoàn thành dự án',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'R',
                        'TBP XTDA': 'C',
                        'QLDA': 'C'
                    }
                },
                {
                    code: '6.3',
                    name: 'Theo dõi tình trạng thanh toán',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'R',
                        'TBP XTDA': 'C',
                        'QLDA': 'I'
                    }
                }
            ]
        },
        {
            phase: '7. Lưu trữ rút KN',
            tasks: [
                {
                    code: '7.1',
                    name: 'Lưu trữ dữ liệu Dự án từ CDE dự án về hệ thống lưu trữ của TT',
                    roles: {
                        'QL BIM': 'R'
                    }
                },
                {
                    code: '7.2',
                    name: 'Rút kinh nghiệm, cải tiến quy trình',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP R&D': 'R',
                        'QLDA': 'C',
                        'QL BIM': 'C',
                        'ĐPBM': 'C',
                        'TNDH': 'C'
                    }
                }
            ]
        }
    ],

    NonStateBudget: [
        {
            phase: '1. Xúc tiến Dự án',
            tasks: [
                {
                    code: '1.1',
                    name: 'Thuyết trình khách hàng',
                    roles: {
                        'GĐTT': 'I/C',
                        'PGĐTT': 'C',
                        'TBP ADMIN': 'I',
                        'TBP QA/QC': 'C',
                        'TBM': 'C',
                        'TVBM': 'C',
                        'TBP XTDA': 'R'
                    }
                },
                {
                    code: '1.2',
                    name: 'Liên hệ khách hàng nắm bắt thông tin định kỳ',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP XTDA': 'R'
                    }
                },
                {
                    code: '1.3',
                    name: 'Cập nhật danh mục khách hàng',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'I',
                        'TBP QA/QC': 'I',
                        'TBM': 'I',
                        'TVBM': 'I',
                        'TBP XTDA': 'R'
                    }
                },
                {
                    code: '1.4',
                    name: 'Thu thập dữ liệu đầu vào của dự án phục vụ báo giá',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'I',
                        'TBP QA/QC': 'I',
                        'TVBM': 'I',
                        'TBP XTDA': 'R'
                    }
                }
            ]
        },
        {
            phase: '2. Báo giá',
            tasks: [
                {
                    code: '2.1',
                    name: 'Tạo thư mục Dự án tiềm năng (bao gồm mã dự án)',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'I',
                        'TBP QA/QC': 'I',
                        'TVBM': 'I',
                        'TBP XTDA': 'R'
                    }
                },
                {
                    code: '2.2',
                    name: 'Chốt khối lượng phục vụ báo giá',
                    roles: {
                        'GĐTT': 'A',
                        'TBM': 'R'
                    }
                },
                {
                    code: '2.3',
                    name: 'Xem xét sự khả thi về kỹ thuật (bao gồm cả tiến độ)',
                    roles: {
                        'GĐTT': 'R',
                        'TBP XTDA': 'C'
                    }
                },
                {
                    code: '2.4',
                    name: 'Pre-Bep',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'A',
                        'TBM': 'R',
                        'TBP XTDA': 'C'
                    }
                },
                {
                    code: '2.5',
                    name: 'Lập báo giá',
                    roles: {
                        'GĐTT': 'A',
                        'PGĐTT': 'C',
                        'TBM': 'C',
                        'TBP XTDA': 'R'
                    }
                },
                {
                    code: '2.6',
                    name: 'Thu thập hồ sơ năng lực đấu thầu liên quan',
                    roles: {
                        'GĐTT': 'C',
                        'PGĐTT': 'C',
                        'TBP ADMIN': 'R',
                        'TBP QA/QC': 'C',
                        'TBM': 'C',
                        'TBP XTDA': 'A'
                    }
                },
                {
                    code: '2.7',
                    name: 'Theo dõi tình trạng báo giá',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP XTDA': 'R'
                    }
                }
            ]
        },
        {
            phase: '3. Chuẩn bị',
            tasks: [
                {
                    code: '3.1',
                    name: 'Bổ nhiệm QLDA/QLB cho Dự án',
                    roles: {
                        'GĐTT': 'R',
                        'PGĐTT': 'C',
                        'TBP ADMIN': 'I',
                        'QLDA': 'I'
                    }
                },
                {
                    code: '3.2',
                    name: 'Bổ nhiệm thành viên dự án',
                    roles: {
                        'GĐTT': 'R',
                        'PGĐTT': 'C',
                        'TBP ADMIN': 'I',
                        'TBP QA/QC': 'C',
                        'TBM': 'C',
                        'TVBM': 'I',
                        'TBP XTDA': 'C',
                        'QLDA': 'I',
                        'QL BIM': 'I',
                        'ĐPBM': 'I'
                    }
                },
                {
                    code: '3.3',
                    name: 'Tạo lập Folder Dự án',
                    roles: {
                        'GĐTT': 'R',
                        'QLDA': 'I',
                        'QL BIM': 'I',
                        'ĐPBM': 'I',
                        'TNDH': 'I'
                    }
                },
                {
                    code: '3.4',
                    name: 'Tạo lập Dự án trên Bimcollab',
                    roles: {
                        'GĐTT': 'R',
                        'QLDA': 'I',
                        'QL BIM': 'I',
                        'ĐPBM': 'I',
                        'TNDH': 'I'
                    }
                },
                {
                    code: '3.5',
                    name: 'Thiết lập CDE dự án (Autodesk Docs / Bimcollab Twins / Trimble Connect / G Drive)',
                    roles: {
                        'GĐTT': 'R',
                        'QL BIM': 'R',
                        'ĐPBM': 'C',
                        'TNDH': 'C',
                        'NDH': 'C'
                    }
                },
                {
                    code: '3.6',
                    name: 'Tạo Template dự án',
                    roles: {
                        'GĐTT': 'A',
                        'QL BIM': 'R',
                        'ĐPBM': 'C',
                        'TNDH': 'C',
                        'NDH': 'C'
                    }
                },
                {
                    code: '3.7',
                    name: 'Tạo lập nhóm trao đổi nội bộ dự án',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBM': 'I',
                        'TBP XTDA': 'I',
                        'QLDA': 'R',
                        'QL BIM': 'I',
                        'ĐPBM': 'I',
                        'TNDH': 'I'
                    }
                },
                {
                    code: '3.8',
                    name: 'Tạo lập nhóm trao đổi với khách hàng',
                    roles: {
                        'TBP ADMIN': 'I',
                        'TBP XTDA': 'R',
                        'QLDA': 'I',
                        'QL BIM': 'I'
                    }
                }
            ]
        },
        {
            phase: '4. Triển khai Hỗ trợ QLDA',
            tasks: [
                {
                    code: '4.1',
                    name: 'Dựng mô hình hoàn thiện phục vụ QLDA',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP QA/QC': 'A',
                        'TBM': 'C',
                        'TBP XTDA': 'I',
                        'QLDA': 'A',
                        'QL BIM': 'A',
                        'ĐPBM': 'A',
                        'TNDH': 'R'
                    }
                },
                {
                    code: '4.2',
                    name: 'Triển khai các ứng dụng BIM theo yêu cầu của CĐT dự án',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP QA/QC': 'A',
                        'TBM': 'C',
                        'TBP R&D': 'C',
                        'QLDA': 'A',
                        'QL BIM': 'A',
                        'ĐPBM': 'A',
                        'TNDH': 'R'
                    }
                },
                {
                    code: '4.3',
                    name: 'Quản lý File trên CDE Nội bộ',
                    roles: {
                        'GĐTT': 'I',
                        'QL BIM': 'R',
                        'ĐPBM': 'C',
                        'TNDH': 'C',
                        'NDH': 'C'
                    }
                },
                {
                    code: '4.4',
                    name: 'Đồng bộ File từ CDE nội bộ lên CDE Dự án',
                    roles: {
                        'GĐTT': 'I',
                        'QL BIM': 'R',
                        'ĐPBM': 'C',
                        'TNDH': 'C',
                        'NDH': 'C'
                    }
                },
                {
                    code: '4.5',
                    name: 'Bàn giao dữ liệu Dự án cho khách hàng',
                    roles: {
                        'GĐTT': 'A',
                        'PGĐTT': 'I',
                        'QLDA': 'R',
                        'QL BIM': 'C'
                    }
                }
            ]
        },
        {
            phase: '5. Thanh quyết toán',
            tasks: [
                {
                    code: '5.1',
                    name: 'Lập hồ sơ thanh toán từng giai đoạn',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'R',
                        'TBP XTDA': 'C',
                        'QLDA': 'C'
                    }
                },
                {
                    code: '5.2',
                    name: 'Lập hồ sơ quyết toán hoàn thành dự án',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'R',
                        'TBP XTDA': 'C',
                        'QLDA': 'C'
                    }
                },
                {
                    code: '5.3',
                    name: 'Theo dõi tình trạng thanh toán',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP ADMIN': 'R',
                        'TBP XTDA': 'C',
                        'QLDA': 'I'
                    }
                }
            ]
        },
        {
            phase: '6. Lưu trữ rút KN',
            tasks: [
                {
                    code: '6.1',
                    name: 'Lưu trữ dữ liệu Dự án từ CDE dự án về hệ thống lưu trữ của TT',
                    roles: {
                        'QL BIM': 'R'
                    }
                },
                {
                    code: '6.2',
                    name: 'Rút kinh nghiệm, cải tiến quy trình',
                    roles: {
                        'GĐTT': 'I',
                        'PGĐTT': 'I',
                        'TBP R&D': 'R',
                        'QLDA': 'C',
                        'QL BIM': 'C',
                        'ĐPBM': 'C',
                        'TNDH': 'C'
                    }
                }
            ]
        }
    ]
};
