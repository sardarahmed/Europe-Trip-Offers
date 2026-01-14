require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStore() {
    const { data, error } = await supabase
        .from('stores')
        .select('id, name, slug, website_url')
        .eq('slug', 'Expedia'); // Matching the case found in previous run

    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Expedia Store Record:', data);
}

checkStore();
