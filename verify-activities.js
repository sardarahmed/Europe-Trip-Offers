const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tblkmpzdzptwnyqfcboj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZMUne72FC_KU4SdMikuPUQ_fxFNRzUz';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyActivities() {
    console.log('Fetching activities...');
    const { data, error } = await supabase
        .from('activities')
        .select('*, cities(name)')
        .limit(2);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success! Found', data.length, 'activities.');
        data.forEach(a => {
            console.log('--- Activity ---');
            console.log('Title:', a.title);
            console.log('Image URL:', a.image_url); // Checking snake_case
            console.log('ImageUrl:', a.imageUrl);   // Checking camelCase
        });
    }
}

verifyActivities();
