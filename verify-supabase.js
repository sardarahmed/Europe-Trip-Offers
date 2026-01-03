const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tblkmpzdzptwnyqfcboj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZMUne72FC_KU4SdMikuPUQ_fxFNRzUz';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyConnection() {
    console.log('Testing connection to Supabase...');
    console.log('URL:', SUPABASE_URL);

    try {
        // Try to fetch something simple. If tables exist, this should work.
        // If tables don't exist, we might get an error, but connection is still "verified" if we get a structured response.
        const { data, error } = await supabase.from('cities').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Connection Error:', error.message);
            if (error.code === 'PGRST301') {
                console.log('Hint: Check RLS policies or Table existence.');
            }
            process.exit(1);
        }

        console.log('Connection Successful!');
        console.log('Cities count:', data); // Might be null for head:true, but error being null is key.

        // Let's try to list categories to be sure
        const { data: categories, error: catError } = await supabase.from('categories').select('name').limit(3);
        if (!catError) {
            console.log('Categories found:', categories);
        } else {
            console.log('Categories fetch error (might be empty or RLS):', catError.message);
        }

    } catch (err) {
        console.error('Unexpected Error:', err);
        process.exit(1);
    }
}

verifyConnection();
