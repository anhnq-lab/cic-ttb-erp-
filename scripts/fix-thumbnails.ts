
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''; // Fallback to Anon Key if Service Role is missing
console.log('Connecting to:', supabaseUrl);
if (!supabaseKey) { console.error('Missing Supabase Key!'); process.exit(1); }
const supabase = createClient(supabaseUrl, supabaseKey);

const VALID_IMAGES = [
    'project_civil_modern_1766929574474.png',
    'project_hospital_modern_1766930858966.png',
    'project_industrial_factory_1766929653515.png',
    'project_infrastructure_bridge_1766929675106.png',
    'project_metro_station_1766930883334.png',
    'project_office_tower_1766930901756.png',
    'tech_bridge_digital_1766931473244.png',
    'tech_factory_interior_1766931318436.png',
    'tech_hospital_eco_1766931492950.png',
    'tech_office_night_1766931294739.png',
    'tech_smart_city_planning_1766931513676.png'
];

async function fixThumbnails() {
    console.log('Checking project thumbnails...');
    const { data: projects, error } = await supabase.from('projects').select('id, name, thumbnail, constructionType');

    if (error) {
        console.error('Error fetching projects:', error);
        return;
    }

    let fixCount = 0;

    for (const p of projects) {
        // If thumbnail is missing, null, or not in valid list (and not a URL)
        let needsFix = !p.thumbnail;
        if (p.thumbnail && !p.thumbnail.startsWith('http') && !VALID_IMAGES.includes(p.thumbnail)) {
            needsFix = true;
            console.log(`Project "${p.name}" has invalid local thumbnail: ${p.thumbnail}`);
        }

        if (needsFix) {
            let newThumb = 'tech_office_night_1766931294739.png'; // Default
            const name = p.name ? p.name.toLowerCase() : '';
            const type = p.constructionType || '';

            if (name.includes('bệnh viện') || name.includes('y tế')) newThumb = 'tech_hospital_eco_1766931492950.png';
            else if (name.includes('metro') || name.includes('ga ') || name.includes('cầu')) newThumb = 'tech_bridge_digital_1766931473244.png';
            else if (name.includes('nhà máy') || type.includes('Công nghiệp')) newThumb = 'tech_factory_interior_1766931318436.png';
            else if (name.includes('khu đô thị') || name.includes('quy hoạch')) newThumb = 'tech_smart_city_planning_1766931513676.png';

            console.log(`Fixing project "${p.name}" (${p.id}) -> ${newThumb}`);

            await supabase.from('projects').update({ thumbnail: newThumb }).eq('id', p.id);
            fixCount++;
        }
    }

    console.log(`Fixed ${fixCount} projects.`);
}

fixThumbnails();
