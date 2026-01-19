import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function resetPassword() {
    const email = 'admin@cic.com.vn';
    const newPassword = 'admin123';

    console.log(`Resetting password for ${email}...`);

    // Get user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.log(`User ${email} not found. Creating...`);
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password: newPassword,
            email_confirm: true,
            user_metadata: { full_name: 'Administrator', role: 'Admin' }
        });

        if (createError) {
            console.error('Error creating user:', createError);
        } else {
            console.log('User created successfully:', newUser);
        }
    } else {
        const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: newPassword }
        );

        if (updateError) {
            console.error('Error updating password:', updateError);
        } else {
            console.log('Password updated successfully for user:', updatedUser.user?.email);
        }
    }
}

resetPassword();
