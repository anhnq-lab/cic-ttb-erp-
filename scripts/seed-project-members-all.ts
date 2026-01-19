import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Available employees
const EMPLOYEES = ['NV001', 'NV002', 'NV003', 'NV004', 'NV005', 'NV006', 'NV015'];

// Role templates with RACI
const ROLE_TEMPLATES = [
    { role: 'GĐTT', raci: 'A' },
    { role: 'QL BIM', raci: 'A' },
    { role: 'ĐPBM Kiến trúc', raci: 'R' },
    { role: 'ĐPBM MEP', raci: 'R' },
    { role: 'TNDH', raci: 'R' },
    { role: 'TVBM', raci: 'C' },
    { role: 'TBP XTDA', raci: 'C' },
    { role: 'TBP ADMIN', raci: 'I' }
];

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

async function seedProjectMembers() {
    console.log('🚀 Seeding project members...\n');

    // 1. Get all projects
    const { data: projects, error: prjError } = await supabase
        .from('projects')
        .select('id, code, name');

    if (prjError) {
        console.error('❌ Error fetching projects:', prjError);
        return;
    }

    console.log(`📊 Found ${projects.length} projects\n`);

    let totalMembers = 0;

    // 2. For each project, assign 3-5 random members
    for (const project of projects) {
        const numMembers = 3 + Math.floor(Math.random() * 3); // 3-5 members
        const shuffledEmployees = shuffleArray(EMPLOYEES);
        const shuffledRoles = shuffleArray(ROLE_TEMPLATES);

        const members = [];
        for (let i = 0; i < numMembers && i < shuffledEmployees.length; i++) {
            members.push({
                project_id: project.id,
                employee_id: shuffledEmployees[i],
                role: shuffledRoles[i].role,
                raci: shuffledRoles[i].raci
            });
        }

        // Insert members
        const { error: memberError } = await supabase
            .from('project_members')
            .upsert(members, { onConflict: 'project_id,employee_id' });

        if (memberError) {
            console.error(`❌ Error seeding members for ${project.code}:`, memberError.message);
        } else {
            console.log(`✅ [${project.code}] ${project.name}: ${members.length} members`);
            totalMembers += members.length;
        }
    }

    console.log(`\n🎉 Seeded ${totalMembers} project members for ${projects.length} projects!`);
}

seedProjectMembers();
