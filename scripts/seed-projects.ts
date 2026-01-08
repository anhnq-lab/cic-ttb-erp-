
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Raw Data parsed from User Input
const RAW_PROJECTS = [
    { code: 'K8HH1', serviceType: 'Tư vấn BIM', manager: 'NV006', statusDetail: '', name: 'Tây Hồ Tây Lô K8HH1', client: 'ID029', constructionType: 'Dân dụng', constructionLevel: 'I', status: 'Đang thực hiện' },
    { code: 'K8CT1', serviceType: 'Tư vấn BIM', manager: 'NV006', statusDetail: 'Chờ bản vẽ cập nhật', name: 'Tây Hồ Tây Lô K8CT1', client: 'ID029', constructionType: 'Dân dụng', constructionLevel: 'I', budget: 156368, scope: '1/ Mô hình BIM giai đoạn TKCS (Nộp hồ sơ BIM thẩm định)\n2/ Video diễn họa\n3/ Báo cáo va chạm và các vấn đề trong giai đoạn TKCS\n4/ Khối lượng trích xuất từ mô hình\n5/ Mô hình BIM giai đoạn TKKT\n6/ Video diễn họa TKKT\n7/ Báo cáo va chạm và các vấn đề trong giai đoạn TKKT\n8/ Khối lượng trích xuất từ mô hình TKKT\n9/ Mô hình BIM giai đoạn TKTC\n10/ Báo cáo va chạm và các vấn đề trong giai đoạn TKTC\n11/ Khối lượng trích xuất từ mô hình TKTC', status: 'Đang thực hiện', completedAt: '27/10/2025' },
    { code: 'K2CT1', serviceType: 'Tư vấn BIM', manager: 'NV006', statusDetail: 'Chờ bản vẽ cập nhật', name: 'Tây Hồ Tây Lô K2CT1', client: 'ID029', constructionType: 'Dân dụng', constructionLevel: 'I', budget: 194206, scope: '1/ Mô hình BIM giai đoạn NCKT (Mô hình, Khối lượng, bản vẽ) 09/04/2025\n2/ Báo cáo va chạm và các vấn đề trong giai đoạn NCKT\n3/ Video diễn họa \n4/ Trích xuất Khối lượng chính\n5/ Mô hình BIM giai đoạn TKTC\n6/ Báo cáo va chạm và các vấn đề trong giai đoạn TKTC\n7/ Trích xuất khối lượng chính', status: 'Đang thực hiện', completedAt: '27/10/2025' },
    { code: 'H1HH1', serviceType: 'Tư vấn BIM', manager: 'NV006', statusDetail: 'Chờ bản vẽ cập nhật', name: 'Tây Hồ Tây Lô H1HH1', client: 'ID029', constructionType: 'Dân dụng', constructionLevel: 'I', budget: 108117, scope: '1/ Mô hình BIM giai đoạn TKKT\n2/ Báo cáo va chạm và các vấn đề trong giai đoạn TKKT\n3/ Video diễn họa \n4/ Trích xuất Khối lượng chính\n5/ Mô hình BIM giai đoạn TKTC\n6/ Báo cáo va chạm và các vấn đề trong giai đoạn TKTC\n7/ Video diễn họa \n8/ Trích xuất Khối lượng chính', status: 'Đang thực hiện', completedAt: '27/10/2025' },
    { code: 'B1CC4', serviceType: 'Tư vấn BIM', manager: 'NV006', statusDetail: 'Tạo lập BEP\nTạo báo cáo va chạm lần 2', name: 'Tây Hồ Tây Lô B1CC4', client: 'ID029', constructionType: 'Dân dụng', constructionLevel: 'I', scope: '1/ Mô hình BIM giai đoạn TKKT\n2/ Báo cáo va chạm và các vấn đề trong giai đoạn TKKT\n3/ Video diễn họa \n4/ Trích xuất Khối lượng chính\n5/ Mô hình BIM giai đoạn TKTC\n6/ Báo cáo va chạm và các vấn đề trong giai đoạn TKTC\n7/ Video diễn họa \n8/ Trích xuất Khối lượng chính', status: 'Đang thực hiện', completedAt: '27/10/2025' },
    { code: 'LOTT-PL26', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Eco Smart City Plot 2-6', client: 'ID104', constructionType: 'Dân dụng', constructionLevel: 'I', status: 'Đang thực hiện' },
    { code: 'LOTT-PL24', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Eco Smart City Plot 2-4', client: 'ID104', constructionType: 'Dân dụng', constructionLevel: 'I', status: 'Đang thực hiện' },
    { code: 'LOTT-PL22', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Eco Smart City Plot 2-2', client: 'ID104', constructionType: 'Dân dụng', constructionLevel: 'I', status: 'Đang thực hiện' },
    { code: 'LOTT-PL21', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Eco Smart City Plot 2-1', client: 'ID104', constructionType: 'Dân dụng', constructionLevel: 'I', status: 'Đang thực hiện' },
    { code: 'LOTT-PL23', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Eco Smart City Plot 2-3', client: 'ID104', constructionType: 'Dân dụng', constructionLevel: 'I', status: 'Đang thực hiện' },
    { code: 'LOTT-PL25', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Eco Smart City Plot 2-5', client: 'ID104', constructionType: 'Dân dụng', constructionLevel: 'I', status: 'Đang thực hiện' },
    { code: '24014-BVTIM_BDDHN', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Xây dựng Bệnh viện Tim Hà Nội cơ sở 2', client: 'ID069', constructionType: 'Dân dụng', constructionLevel: 'I', status: 'Đang thực hiện', completedAt: '04/08/2025' },
    { code: '24011-TTPY_BDDHN', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Xây dựng Trung tâm Pháp y Hà Nội', client: 'ID069', constructionType: 'Dân dụng', constructionLevel: 'II', status: 'Đang thực hiện' },
    { code: '24023-CTN_BDDHCM', serviceType: 'Tư vấn BIM', manager: 'NV004', statusDetail: 'Gửi bổ sung báo cáo va chạm', name: 'Xây dựng cung thiếu nhi thành phố', client: 'ID095', constructionType: 'Dân dụng', constructionLevel: 'I', budget: 40289, phase: 'Thiết kế bản vẽ thi công', scope: '1/ Giai đoạn thiết kế BVTC\n+ Xây dựng mô hình BIM GĐ TKBV TC\n+ Kiểm tra, báo cáo va chạm & Phối hợp vs TVTK xử lý va chạm chính\n+ Cập nhật mô hình BIM theo nội dung phối hợp với TVTK\n+ Trích xuất KL phục vụ thẩm định\n+ Trích xuất một số bản vẽ chính từ mô hình BIM\n+ Video diễn họa mô hình BIM\n+ Mô phỏng tiến độ 4D\n+ Mô phỏng BPTC\n2/ Giai đoạn thi công\n+ Báo cáo chất lượng mô hình BIM', status: 'Đang thực hiện', folderUrl: 'https://drive.google.com/drive/folders/0APEaGvP5S7NAUk9PVA', completedAt: '27/10/2025' },
    { code: '25014-BVND_BDDHCM', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Xây dựng mới Trung tâm chuyên sâu bệnh viện nhiệt đới (Khối 4B) Bệnh viện Nhi đồng 1', client: 'ID095', constructionType: 'Dân dụng', constructionLevel: 'II', status: 'Đang thực hiện' },
    { code: '24034-KLT_BDDDN', serviceType: 'Tư vấn BIM', manager: 'NV015', statusDetail: 'Đã nộp lại mô hình thẩm tra, chờ ý kiến phản hồi', name: 'Khu lưu trữ hiện hành Trung tâm hành chính thành phố', client: 'ID089', constructionType: 'Dân dụng', constructionLevel: 'II', scope: '- Mô hình MOC đệ trình thẩm định\n- Báo cáo va chạm\n- Video diễn họa\n- Cập nhật mô hình BIM', status: 'Đang thực hiện', folderUrl: 'https://drive.google.com/open?id=18ApzaiR-jte2ROSYUbPNurjqgNvtZs8X&usp=drive_fs', completedAt: '27/10/2025' },
    { code: '25030-BTC_BDDD', serviceType: 'Tư vấn BIM', manager: 'NV015', statusDetail: 'Thanh toán', name: 'Bảo tàng Chăm', client: 'ID089', constructionType: 'Dân dụng', constructionLevel: 'II', scope: 'Mô hình MOC đệ trình thẩm định\n1/ Mô hình Revit\n2/ Mô hình IFC\n3/ Bản vẽ\n4/ Khối lượng', status: 'Lập kế hoạch', completedAt: '27/10/2025' },
    { code: '25002-BVBC_BDDQN', serviceType: 'Tư vấn BIM', manager: 'NV012', statusDetail: 'Mô hình còn cập nhật kết cấu bể ngầm\nxúc tiến thủ tục thanh toán', name: 'Bệnh viện Bãi Cháy', client: 'ID075', constructionType: 'Dân dụng', constructionLevel: 'II', budget: 9530, scope: '1. Lập kế hoạch triển khai BEP\n2. Xây dựng tiêu chuẩn quy định phục vụ phối hợp 3D\n3. Đào tạo CDE và phần mềm phối hợp BIM\n4. Dựng mô hình TKBVTC\n5. Trích xuất khối lượng chính từ mô hình phục vụ kiểm soát khối lượng\n6. Trích xuất một số bản vẽ từ mô hình BIM phục vụ thẩm định\n7. Báo cáo va chạm & phối hợp xử lý va chạm', status: 'Đang thực hiện', completedAt: '27/10/2025' },
    { code: '24003-KCNTT_VIGLACERA', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Khu Công nghiệp Thuận Thành', client: 'ID103', constructionType: 'Công nghiệp', constructionLevel: 'II', status: 'Đang thực hiện' },
    { code: '25010-KCNTY_VIGLACERA', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Khu Công nghiệp Trấn Yên', client: 'ID103', constructionType: 'Công nghiệp', constructionLevel: 'II', status: 'Đang thực hiện' },
    { code: '25020-KCNSC_VIG', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Khu Công nghiệp Sông Công', client: 'ID103', constructionType: 'Công nghiệp', constructionLevel: 'II', status: 'Đang thực hiện' },
    { code: '24031-STD_DIC', serviceType: 'Tư vấn đào tạo BIM', manager: 'NV005', name: 'Viết tiêu chuẩn BIM cho DIC', client: 'ID109', status: 'Đang thực hiện' },
    { code: '23007-STD_HUD', serviceType: 'Tư vấn đào tạo BIM', manager: 'NV005', name: 'Viết tiêu chuẩn BIM cho HUD', client: 'ID107', status: 'Đang thực hiện' },
    { code: '240030-STD_DAK', serviceType: 'Tư vấn đào tạo BIM', manager: 'NV005', name: 'Viết tiêu chuẩn BIM cho DAK', client: 'ID110', status: 'Đang thực hiện' },
    { code: '25008-SATB_VCC', serviceType: 'Tư vấn BIM', manager: 'NV005', name: 'Suất ăn tàu bay', client: 'ID105', constructionType: 'Dân dụng', constructionLevel: 'I', status: 'Đang thực hiện' },
    { code: '24018-NOXH_TTTV2', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Nhà ở Xã Hội Hạ Đình', constructionType: 'Dân dụng', constructionLevel: 'II', status: 'Đang thực hiện' },
    { code: '25026-GC2_CIC', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Genco2', client: 'ID108', constructionType: 'Dân dụng', constructionLevel: 'II', status: 'Đang thực hiện' },
    { code: '24008-BVCM_319', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Bệnh viện Cà Mau', client: 'ID101', constructionType: 'Dân dụng', constructionLevel: 'II', status: 'Đang thực hiện', folderUrl: 'https://drive.google.com/open?id=1yNLbem0HTcV_F-jvn5rglFRW9IHN26TN&usp=drive_fs', completedAt: '25/08/2025' },
    { code: 'b9bb8d9d', serviceType: 'Tư vấn BIM', manager: 'NV004', name: 'Nhà máy sản xuất giấy Xuân Phương', constructionType: 'Công nghiệp', constructionLevel: 'II', budget: 8687, status: 'Lập kế hoạch', phase: 'Thi công và vận hành', folderUrl: 'https://drive.google.com/drive/folders/1ESrIdtjd12m12GSuj9cwmCp_uEgc4njx?usp=drive_link' },
    { code: '39d7c5de', serviceType: 'Tư vấn BIM', manager: 'NV006', name: 'Dự án số 10 - Công ty TNHH MTV Phát triển Công nghiệp và hậu cần BW Tân Uyên', location: 'Số 2, VSIP II-A, Đường số 10, phường Vĩnh Tân, Huyện Tân Uyên, tỉnh Bình Dương', constructionType: 'Hạ tầng khu công nghiệp', constructionLevel: 'II', budget: 14564, scope: '- Dựng mô hình \n- Phối hợp mô hình, kiểm tra va chạm\n- Tạo lập mô hình hoàn công\n- Nhập thông tin tài sản', status: 'Hoàn thành', thumbnail: 'DuAn_Images/39d7c5de.Image.072454.jpg', completedAt: '20/08/2025' }
];

// Helper to convert DD/MM/YYYY to YYYY-MM-DD
function parseDate(dateStr?: string) {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return null; // or original if already ISO
}

const PROJECT_IMAGES: Record<string, string> = {
    'Dân dụng': 'tech_office_night_1766931294739.png',
    'Công nghiệp': 'tech_factory_interior_1766931318436.png',
    'Hạ tầng': 'tech_bridge_digital_1766931473244.png',
    'Giao thông': 'tech_smart_city_planning_1766931513676.png',
    // Specifics
    'Hospital': 'tech_hospital_eco_1766931492950.png',
    'Metro': 'tech_bridge_digital_1766931473244.png', // Re-use bridge or maybe smart city for metro if suitable, or keep previous. Let's use Bridge as it's infra.
    'Office': 'tech_office_night_1766931294739.png'
};

async function seedProjects() {
    console.log(`Starting seed of ${RAW_PROJECTS.length} projects...`);

    let successCount = 0;
    let failCount = 0;

    for (const proj of RAW_PROJECTS) {
        try {
            // Check if project with this CODE already exists
            const { data: existing } = await supabase
                .from('projects')
                .select('id')
                .eq('code', proj.code)
                .single();

            // Determine thumbnail
            let thumbnail = proj.thumbnail;

            // Logic to assign specific images
            if (!thumbnail || thumbnail.startsWith('http')) { // Override existing generic placeholders if any
                const name = proj.name ? proj.name.toLowerCase() : '';
                const type = proj.constructionType || 'Dân dụng';

                if (name.includes('bệnh viện') || name.includes('y tế') || name.includes('nhi đồng')) {
                    thumbnail = PROJECT_IMAGES['Hospital'];
                } else if (name.includes('metro') || name.includes('đường sắt') || name.includes('ga ')) {
                    thumbnail = PROJECT_IMAGES['Metro'];
                } else if (name.includes('tower') || name.includes('building') || name.includes('cao ốc') || name.includes('văn phòng') || name.includes('plaza')) {
                    thumbnail = PROJECT_IMAGES['Office'];
                } else if (type.includes('Công nghiệp') || name.includes('nhà máy') || name.includes('khu công nghiệp')) {
                    thumbnail = PROJECT_IMAGES['Công nghiệp'];
                } else if (type.includes('Hạ tầng') || type.includes('Giao thông') || name.includes('cầu') || name.includes('đường')) {
                    thumbnail = PROJECT_IMAGES['Hạ tầng'];
                } else {
                    thumbnail = PROJECT_IMAGES['Dân dụng'];
                }
            }

            const projectData = {
                ...proj,
                // Ensure required defaults
                progress: proj.status === 'Hoàn thành' ? 100 : (proj.status === 'Lập kế hoạch' ? 0 : 30),
                completedAt: parseDate(proj.completedAt),
                thumbnail: thumbnail
            };

            let error;
            if (existing) {
                // Update
                const result = await supabase.from('projects').update(projectData).eq('id', existing.id);
                error = result.error;
            } else {
                // Insert
                const result = await supabase.from('projects').insert(projectData);
                error = result.error;
            }

            if (error) {
                console.error(`Error upserting project ${proj.code}:`, error.message);
                failCount++;
            } else {
                console.log(`Successfully upserted project ${proj.code}`);
                successCount++;
            }
        } catch (e) {
            console.error(`Exception processing project ${proj.code}:`, e);
            failCount++;
        }
    }

    console.log(`Seeding complete. Success: ${successCount}, Failed: ${failCount}`);
}

seedProjects();
